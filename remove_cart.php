<?php
session_start();
require_once 'config.php';
require_once 'functions.php';

header('Content-Type: application/json');

// Verificar se é uma requisição POST ou GET
if ($_SERVER['REQUEST_METHOD'] !== 'POST' && $_SERVER['REQUEST_METHOD'] !== 'GET') {
    jsonError('Método não permitido', 405);
}

// Validar parâmetros
if (!isset($_REQUEST['product_id'])) {
    jsonError('ID do produto não especificado');
}

$productId = intval($_REQUEST['product_id']);
$user = isset($_SESSION['user_id']) ? 'user_' . $_SESSION['user_id'] : 'guest';
$ip = $_SERVER['REMOTE_ADDR'];

// Verificar se o produto existe no carrinho
$cart = getCart();
if (!isset($cart[$productId])) {
    jsonError('Produto não encontrado no carrinho');
}

// Remover do carrinho
$result = removeFromCart($productId);

if ($result['success']) {
    // LOG: Produto removido do carrinho
    logActivity('INFO', 'CART_REMOVE', "Product ID: $productId, IP: $ip", $user);
    
    jsonSuccess([
        'cart_count' => $result['cart_count'],
        'cart_total' => formatPrice(getCartTotal()),
        'product_removed' => true
    ], 'Produto removido do carrinho!');
} else {
    // LOG: Falha ao remover do carrinho
    logActivity('ERROR', 'CART_REMOVE_FAILED', "Product ID: $productId, Error: " . $result['message'], $user);
    jsonError($result['message']);
}
?>