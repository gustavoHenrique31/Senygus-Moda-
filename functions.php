<?php
// ===== FUNÇÕES DE LOG =====
function logActivity($level, $action, $details = '', $user = 'guest') {
    $logFile = __DIR__ . '/../logs/activity.log';
    $timestamp = date('Y-m-d H:i:s');
    $ip = $_SERVER['REMOTE_ADDR'] ?? 'unknown';
    
    // Formato melhorado do log
    $logEntry = "[$timestamp] [$level] [$ip] [$user] [$action] $details\n";
    
    // Criar diretório de logs se não existir
    $logDir = dirname($logFile);
    if (!is_dir($logDir)) {
        mkdir($logDir, 0755, true);
    }
    
    // Escrever no arquivo de log
    file_put_contents($logFile, $logEntry, FILE_APPEND | LOCK_EX);
}

// ===== FUNÇÕES DO CARRINHO =====
function getCart() {
    return isset($_SESSION['cart']) ? $_SESSION['cart'] : [];
}

function addToCart($productId, $quantity = 1) {
    if (!isset($_SESSION['cart'])) {
        $_SESSION['cart'] = [];
    }
    
    $product = getProductById($productId);
    if (!$product) {
        return ['success' => false, 'message' => 'Produto não encontrado'];
    }
    
    if (isset($_SESSION['cart'][$productId])) {
        $_SESSION['cart'][$productId] += $quantity;
    } else {
        $_SESSION['cart'][$productId] = $quantity;
    }
    
    return ['success' => true, 'cart_count' => getCartItemsCount()];
}

function updateCartQuantity($productId, $change) {
    if (!isset($_SESSION['cart'])) {
        return ['success' => false, 'message' => 'Carrinho vazio'];
    }
    
    if (isset($_SESSION['cart'][$productId])) {
        $_SESSION['cart'][$productId] += $change;
        
        if ($_SESSION['cart'][$productId] <= 0) {
            unset($_SESSION['cart'][$productId]);
        }
        
        return ['success' => true, 'cart_count' => getCartItemsCount()];
    }
    
    return ['success' => false, 'message' => 'Produto não encontrado no carrinho'];
}

function removeFromCart($productId) {
    if (isset($_SESSION['cart'][$productId])) {
        unset($_SESSION['cart'][$productId]);
        return ['success' => true, 'cart_count' => getCartItemsCount()];
    }
    
    return ['success' => false, 'message' => 'Produto não encontrado no carrinho'];
}

function getCartItemsCount() {
    $cart = getCart();
    return array_sum($cart);
}

function getCartTotal() {
    $total = 0;
    $cart = getCart();
    
    foreach ($cart as $productId => $quantity) {
        $product = getProductById($productId);
        if ($product) {
            $total += $product['price'] * $quantity;
        }
    }
    
    return $total;
}

function clearCart() {
    unset($_SESSION['cart']);
    return ['success' => true];
}

// ===== FUNÇÕES DE PRODUTO =====
function getColorCode($colorName) {
    $colors = [
        'Preto' => '#000000',
        'Bordo' => '#800000',
        'Fuscia' => '#FF00FF',
        'Branco' => '#FFFFFF',
        'Azul' => '#0000FF',
        'Vermelho' => '#FF0000',
        'Verde' => '#008000',
        'Amarelo' => '#FFFF00',
        'Laranja' => '#FFA500',
        'Rosa' => '#FFC0CB',
        'Roxo' => '#800080',
        'Marrom' => '#A52A2A',
        'Cinza' => '#808080',
        'Bege' => '#F5F5DC'
    ];
    
    return $colors[$colorName] ?? '#CCCCCC';
}

function calculateDiscount($currentPrice, $oldPrice) {
    if ($oldPrice <= 0 || $currentPrice >= $oldPrice) {
        return 0;
    }
    
    $discount = (($oldPrice - $currentPrice) / $oldPrice) * 100;
    return round($discount);
}

function getProductRating($productId) {
    $product = getProductById($productId);
    return [
        'rating' => $product['rating'] ?? 0,
        'count' => $product['review_count'] ?? 0
    ];
}

// ===== FUNÇÕES DE VALIDAÇÃO =====
function validateName($name) {
    $name = trim($name);
    if (empty($name) || strlen($name) < 2) {
        return ['valid' => false, 'message' => 'Nome deve ter pelo menos 2 caracteres'];
    }
    
    if (!preg_match('/^[a-zA-ZÀ-ÿ\s]+$/', $name)) {
        return ['valid' => false, 'message' => 'Nome deve conter apenas letras e espaços'];
    }
    
    return ['valid' => true];
}

function validateEmail($email) {
    $email = trim($email);
    if (empty($email)) {
        return ['valid' => false, 'message' => 'E-mail é obrigatório'];
    }
    
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        return ['valid' => false, 'message' => 'E-mail inválido'];
    }
    
    return ['valid' => true];
}

function validatePhone($phone) {
    $phone = preg_replace('/[^0-9]/', '', $phone);
    
    if (strlen($phone) < 10 || strlen($phone) > 11) {
        return ['valid' => false, 'message' => 'Telefone deve ter 10 ou 11 dígitos'];
    }
    
    return ['valid' => true];
}

function validateCEP($cep) {
    $cep = preg_replace('/[^0-9]/', '', $cep);
    
    if (strlen($cep) !== 8) {
        return ['valid' => false, 'message' => 'CEP deve ter 8 dígitos'];
    }
    
    return ['valid' => true];
}

// ===== FUNÇÕES DE FORMATAÇÃO =====
function formatPhone($phone) {
    $phone = preg_replace('/[^0-9]/', '', $phone);
    
    if (strlen($phone) === 11) {
        return '(' . substr($phone, 0, 2) . ') ' . substr($phone, 2, 5) . '-' . substr($phone, 7);
    } elseif (strlen($phone) === 10) {
        return '(' . substr($phone, 0, 2) . ') ' . substr($phone, 2, 4) . '-' . substr($phone, 6);
    }
    
    return $phone;
}

function formatCEP($cep) {
    $cep = preg_replace('/[^0-9]/', '', $cep);
    
    if (strlen($cep) === 8) {
        return substr($cep, 0, 5) . '-' . substr($cep, 5);
    }
    
    return $cep;
}

function truncateText($text, $length = 100) {
    if (strlen($text) <= $length) {
        return $text;
    }
    
    $text = substr($text, 0, $length);
    $text = substr($text, 0, strrpos($text, ' '));
    return $text . '...';
}

// ===== FUNÇÕES DE SEGURANÇA =====
function generateRandomString($length = 32) {
    return bin2hex(random_bytes($length / 2));
}

function sanitizeFileName($filename) {
    $filename = preg_replace('/[^a-zA-Z0-9\.\-\_]/', '_', $filename);
    $filename = preg_replace('/_{2,}/', '_', $filename);
    return $filename;
}

function validateImageUpload($file) {
    $errors = [];
    
    // Verificar se o arquivo foi enviado
    if ($file['error'] !== UPLOAD_ERR_OK) {
        $errors[] = 'Erro no upload do arquivo';
        return $errors;
    }
    
    // Verificar tamanho do arquivo
    if ($file['size'] > UPLOAD_MAX_SIZE) {
        $errors[] = 'Arquivo muito grande. Tamanho máximo: ' . (UPLOAD_MAX_SIZE / 1024 / 1024) . 'MB';
    }
    
    // Verificar tipo do arquivo
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    if (!in_array($mimeType, UPLOAD_ALLOWED_TYPES)) {
        $errors[] = 'Tipo de arquivo não permitido. Use apenas JPEG, PNG ou WebP';
    }
    
    // Verificar se é realmente uma imagem
    if (!getimagesize($file['tmp_name'])) {
        $errors[] = 'O arquivo não é uma imagem válida';
    }
    
    return $errors;
}

// ===== FUNÇÕES DE PAGINAÇÃO =====
function paginate($items, $perPage = 12, $currentPage = 1) {
    $totalItems = count($items);
    $totalPages = ceil($totalItems / $perPage);
    $currentPage = max(1, min($currentPage, $totalPages));
    $offset = ($currentPage - 1) * $perPage;
    
    $paginatedItems = array_slice($items, $offset, $perPage);
    
    return [
        'items' => $paginatedItems,
        'current_page' => $currentPage,
        'total_pages' => $totalPages,
        'total_items' => $totalItems,
        'per_page' => $perPage,
        'has_previous' => $currentPage > 1,
        'has_next' => $currentPage < $totalPages
    ];
}

// ===== FUNÇÕES DE RESPOSTA JSON =====
function jsonResponse($data, $statusCode = 200) {
    http_response_code($statusCode);
    header('Content-Type: application/json');
    echo json_encode($data, JSON_UNESCAPED_UNICODE | JSON_PRETTY_PRINT);
    exit;
}

function jsonError($message, $statusCode = 400) {
    jsonResponse([
        'success' => false,
        'error' => $message
    ], $statusCode);
}

function jsonSuccess($data = null, $message = '') {
    $response = ['success' => true];
    
    if ($message) {
        $response['message'] = $message;
    }
    
    if ($data !== null) {
        $response['data'] = $data;
    }
    
    jsonResponse($response);
}

// ===== FUNÇÕES DE ENVIO DE EMAIL (Simulação) =====
function sendOrderConfirmation($orderData) {
    // Em um sistema real, isso enviaria um email
    // Aqui apenas simulamos o log
    logActivity('INFO', 'ORDER_CONFIRMATION', 'Order ID: ' . ($orderData['id'] ?? 'unknown'));
    return true;
}

function sendContactEmail($name, $email, $message) {
    logActivity('INFO', 'CONTACT_FORM', "From: $name ($email) - Message: " . substr($message, 0, 100));
    return true;
}

// ===== FUNÇÕES DE MANIPULAÇÃO DE ARQUIVOS =====
function ensureDirectory($path) {
    if (!is_dir($path)) {
        return mkdir($path, 0755, true);
    }
    return true;
}

function deleteFile($filePath) {
    if (file_exists($filePath) && is_file($filePath)) {
        return unlink($filePath);
    }
    return false;
}

// ===== FUNÇÕES DE CACHE SIMPLES =====
function getCache($key, $expiry = 3600) {
    $cacheFile = __DIR__ . '/../cache/' . md5($key) . '.cache';
    
    if (!file_exists($cacheFile)) {
        return null;
    }
    
    if (time() - filemtime($cacheFile) > $expiry) {
        unlink($cacheFile);
        return null;
    }
    
    return unserialize(file_get_contents($cacheFile));
}

function setCache($key, $data, $expiry = 3600) {
    $cacheDir = __DIR__ . '/../cache/';
    ensureDirectory($cacheDir);
    
    $cacheFile = $cacheDir . md5($key) . '.cache';
    file_put_contents($cacheFile, serialize($data));
    
    // Limpar cache expirado ocasionalmente
    if (rand(1, 100) === 1) {
        clearExpiredCache();
    }
    
    return true;
}

function clearExpiredCache() {
    $cacheDir = __DIR__ . '/../cache/';
    $files = glob($cacheDir . '*.cache');
    
    foreach ($files as $file) {
        if (time() - filemtime($file) > 3600) {
            unlink($file);
        }
    }
}

// ===== FUNÇÕES DE DEBUG =====
function dd($data) {
    echo '<pre>';
    var_dump($data);
    echo '</pre>';
    die();
}

function dump($data) {
    echo '<pre>';
    var_dump($data);
    echo '</pre>';
}
?>