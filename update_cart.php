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

// Verificar se o produto existe
$product = getProductById($productId);
if (!$product) {
    jsonError('Produto não encontrado');
}

// Verificar se o produto está no carrinho
$cart = getCart();
if (!isset($cart[$productId])) {
    jsonError('Produto não encontrado no carrinho');
}

// Determinar ação (change ou quantity)
if (isset($_REQUEST['change'])) {
    // Atualizar por mudança (+1 ou -1)
    $change = intval($_REQUEST['change']);
    $action = "change_$change";
    $result = updateCartQuantity($productId, $change);
} elseif (isset($_REQUEST['quantity'])) {
    // Atualizar por quantidade específica
    $newQuantity = intval($_REQUEST['quantity']);
    $action = "set_quantity_$newQuantity";
    
    if ($newQuantity < 1) {
        $result = removeFromCart($productId);
    } else {
        $currentQuantity = $cart[$productId];
        $change = $newQuantity - $currentQuantity;
        $result = updateCartQuantity($productId, $change);
    }
} else {
    jsonError('Parâmetro de atualização não especificado');
}

if ($result['success']) {
    $cartTotal = getCartTotal();
    $itemTotal = $product['price'] * ($cart[$productId] + ($change ?? 0));
    
    // LOG: Carrinho atualizado
    logActivity('INFO', 'CART_UPDATE', "Product ID: $productId, Action: $action, New Quantity: " . ($cart[$productId] ?? 0), $user);
    
    jsonSuccess([
        'cart_count' => $result['cart_count'],
        'cart_total' => formatPrice($cartTotal),
        'item_total' => formatPrice($itemTotal),
        'product_quantity' => isset($cart[$productId]) ? $cart[$productId] : 0,
        'product_removed' => !isset($cart[$productId])
    ], 'Carrinho atualizado!');
} else {
    // LOG: Falha ao atualizar carrinho
    logActivity('ERROR', 'CART_UPDATE_FAILED', "Product ID: $productId, Error: " . $result['message'], $user);
    jsonError($result['message']);
}
?>