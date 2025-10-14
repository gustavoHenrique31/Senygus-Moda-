<?php
session_start();
require_once 'config.php';
require_once 'functions.php';

header('Content-Type: application/json');

// Verificar se é uma requisição POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Método não permitido', 405);
}

// Validar parâmetros
if (!isset($_REQUEST['product_id'])) {
    jsonError('ID do produto não especificado');
}

$productId = intval($_REQUEST['product_id']);
$quantity = isset($_REQUEST['quantity']) ? intval($_REQUEST['quantity']) : 1;
$user = isset($_SESSION['user_id']) ? 'user_' . $_SESSION['user_id'] : 'guest';
$ip = $_SERVER['REMOTE_ADDR'];

// Validar quantidade
if ($quantity < 1 || $quantity > 100) {
    jsonError('Quantidade inválida');
}

// Verificar se o produto existe
$product = getProductById($productId);
if (!$product) {
    jsonError('Produto não encontrado');
}

// Verificar se o produto está ativo
if (!$product['active']) {
    jsonError('Produto indisponível');
}

// Adicionar ao carrinho
$result = addToCart($productId, $quantity);

if ($result['success']) {
    // LOG: Produto adicionado ao carrinho
    logActivity('INFO', 'CART_ADD', "Product ID: $productId, Quantity: $quantity, IP: $ip", $user);
    
    jsonSuccess([
        'cart_count' => $result['cart_count'],
        'cart_total' => formatPrice(getCartTotal()),
        'product' => [
            'id' => $product['id'],
            'name' => $product['name'],
            'price' => formatPrice($product['price'])
        ]
    ], 'Produto adicionado ao carrinho!');
} else {
    // LOG: Falha ao adicionar ao carrinho
    logActivity('ERROR', 'CART_ADD_FAILED', "Product ID: $productId, Error: " . $result['message'], $user);
    jsonError($result['message']);
}
?>