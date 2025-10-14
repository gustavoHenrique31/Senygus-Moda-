<?php
// ===== CONFIGURAÇÕES DO SITE =====
define('SITE_NAME', 'Elegance Store');
define('SITE_URL', 'http://localhost/elegance-store');
define('SITE_EMAIL', 'contato@elegance.com');
define('SITE_PHONE', '(11) 99691-2230');

// ===== CONFIGURAÇÕES DO BANCO DE DADOS =====
define('DB_HOST', 'localhost');
define('DB_NAME', 'elegance_store');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_CHARSET', 'utf8mb4');

// ===== CONFIGURAÇÕES DE UPLOAD =====
define('UPLOAD_MAX_SIZE', 5 * 1024 * 1024); // 5MB
define('UPLOAD_ALLOWED_TYPES', ['image/jpeg', 'image/png', 'image/webp']);
define('UPLOAD_DIR', 'assets/images/products/');

// ===== CONFIGURAÇÕES DO CARRINHO =====
define('CART_EXPIRY', 24 * 60 * 60); // 24 horas em segundos

// ===== CONFIGURAÇÕES DE PAGAMENTO =====
define('WHATSAPP_NUMBER', '5511996912230');
define('CURRENCY', 'BRL');
define('CURRENCY_SYMBOL', 'R$');

// ===== CONFIGURAÇÕES DE SEO =====
define('META_DESCRIPTION', 'Elegance Store - Moda feminina com elegância e sofisticação. Encontre os melhores vestidos, blusas, calças e acessórios.');
define('META_KEYWORDS', 'moda feminina, vestidos, blusas, calças, saias, elegance, moda, roupas');

// ===== INICIAR SESSÃO =====
if (session_status() === PHP_SESSION_NONE) {
    session_set_cookie_params([
        'lifetime' => 0,
        'path' => '/',
        'domain' => '',
        'secure' => isset($_SERVER['HTTPS']),
        'httponly' => true,
        'samesite' => 'Lax'
    ]);
    session_start();
}

// ===== PROTEÇÃO CONTRA XSS =====
function clean_input($data) {
    if (is_array($data)) {
        return array_map('clean_input', $data);
    }
    return htmlspecialchars(trim($data), ENT_QUOTES, 'UTF-8');
}

// ===== PRODUTOS EM ARRAY (Para desenvolvimento - depois migrar para banco) =====
$products = [
    [
        'id' => 1,
        'name' => 'BLAZER PRETO',
        'price' => 189.90,
        'oldPrice' => 229.90,
        'category' => 'blazers',
        'size' => 'A DEFINIR',
        'description' => 'Blazer preto: peça clássica, versátil e elegante, geralmente de corte reto ou acinturado, com lapela e botões frontais. Pode ser usado em looks formais ou casuais, combinando com calça social, jeans ou vestidos. Ideal para ambientes de trabalho, eventos ou composições modernas e sofisticadas.',
        'details' => [
            'Tecido: Alta qualidade',
            'Composição: 100% Poliéster',
            'Modelo: Clássico',
            'Lavagem: Lavagem à mão'
        ],
        'colors' => ['Preto'],
        'images' => [
            'assets/images/products/blazer-preto-1.jpg',
            'assets/images/products/blazer-preto-2.jpg'
        ],
        'video' => 'assets/videos/blazer-preto-video.mp4',
        'featured' => true,
        'active' => true,
        'rating' => 4.8,
        'review_count' => 15,
        'created_at' => '2024-01-15 10:00:00'
    ],
    [
        'id' => 2,
        'name' => 'Vestido Canelado com Detalhe na Manga',
        'price' => 129.90,
        'oldPrice' => 159.90,
        'category' => 'vestidos',
        'size' => 'GG ao G2',
        'description' => 'Esse vestido em malha canelada foi pensado para valorizar o corpo com conforto e elegância. O detalhe na manga adiciona um toque moderno e diferenciado à peça, perfeita para diversas ocasiões. O tecido é leve, maleável e se ajusta bem às curvas, garantindo ótimo caimento. Disponível do GG ao G2, ele é ideal para quem busca estilo, praticidade e versatilidade em um só look.',
        'details' => [
            'Tecido: Malha Canelada',
            'Composição: 95% Algodão, 5% Elastano',
            'Modelagem: Ajustada',
            'Lavagem: Lavagem à mão',
            'Detalhe especial na manga'
        ],
        'colors' => ['Preto', 'Bordo', 'Fuscia'],
        'images' => [
            'assets/images/products/vestido-detalhe-manga-1.jpg',
            'assets/images/products/vestido-detalhe-manga-2.jpg',
            'assets/images/products/vestido-detalhe-manga-3.jpg',
            'assets/images/products/vestido-detalhe-manga-4.jpg',
            'assets/images/products/vestido-detalhe-manga-5.jpg'
        ],
        'featured' => true,
        'active' => true,
        'rating' => 4.6,
        'review_count' => 23,
        'created_at' => '2024-01-10 14:30:00'
    ],
    [
        'id' => 3,
        'name' => 'VESTIDO MIDI GOLA ALTA MODELADOR',
        'price' => 149.90,
        'oldPrice' => 189.90,
        'category' => 'vestidos',
        'size' => 'Único (PP ao G)',
        'description' => 'Este vestido de malha canelada midi com gola alta é a combinação perfeita entre conforto e elegância. Confeccionado em tecido canelado de alta elasticidade, ele se ajusta perfeitamente ao corpo, valorizando a silhueta de forma sofisticada. O comprimento midi garante um visual moderno e versátil, ideal para diversas ocasiões — desde o dia a dia até eventos casuais ou jantares. A gola alta adiciona um toque de estilo e sofisticação, enquanto o tecido leve e macio proporciona conforto durante todo o uso. Combine com tênis para um look despojado ou com salto para uma produção mais elegante.',
        'details' => [
            'Tecido: Malha Canelada',
            'Composição: 92% Algodão, 8% Elastano',
            'Modelagem: Modelador',
            'Comprimento: Midi',
            'Gola: Alta',
            'Lavagem: Lavagem à mão'
        ],
        'colors' => ['Preto', 'Fuscia', 'Bordo'],
        'images' => [
            'assets/images/products/vestido-canelado-gola-alta-12.jpg',
            'assets/images/products/vestido-canelado-gola-alta-13.jpg',
            'assets/images/products/vestido-canelado-gola-alta-14.jpg',
            'assets/images/products/vestido-canelado-gola-alta-15.jpg'
        ],
        'featured' => true,
        'active' => true,
        'rating' => 4.9,
        'review_count' => 18,
        'created_at' => '2024-01-08 09:15:00'
    ],
    [
        'id' => 4,
        'name' => 'Vestido Tomara Que Caia Canelado com Fenda na Barra',
        'price' => 159.90,
        'oldPrice' => 199.90,
        'category' => 'vestidos',
        'size' => 'Único (PP ao G)',
        'description' => 'O vestido tomara que caia canelado com fenda na barra é a escolha perfeita para quem busca elegância e conforto. Confeccionado em tecido canelado de alta elasticidade, ele se ajusta ao corpo, valorizando a silhueta. O decote sem alças destaca os ombros e traz um toque moderno e sofisticado. A fenda na barra adiciona um charme sensual, garantindo liberdade de movimento. Ideal para eventos, jantares ou ocasiões especiais, é uma peça versátil e cheia de estilo.',
        'details' => [
            'Tecido: Malha Canelada',
            'Composição: 90% Algodão, 10% Elastano',
            'Modelo: Tomara Que Caia',
            'Detalhe: Fenda na barra',
            'Lavagem: Lavagem à mão'
        ],
        'colors' => ['Preto', 'Bordo', 'Fuscia'],
        'images' => [
            'assets/images/products/vestido-tomara-que-caia-1.jpg'
        ],
        'featured' => true,
        'active' => true,
        'rating' => 4.7,
        'review_count' => 11,
        'created_at' => '2024-01-12 16:45:00'
    ]
];

// ===== FUNÇÕES DE CARREGAMENTO DE PRODUTOS =====
function getProducts($category = null, $featured = null, $limit = null) {
    global $products;
    
    $filteredProducts = $products;
    
    // Filtro por categoria
    if ($category) {
        $filteredProducts = array_filter($filteredProducts, function($product) use ($category) {
            return $product['category'] === $category;
        });
    }
    
    // Filtro por destaque
    if ($featured !== null) {
        $filteredProducts = array_filter($filteredProducts, function($product) use ($featured) {
            return $product['featured'] === $featured;
        });
    }
    
    // Filtro por produtos ativos
    $filteredProducts = array_filter($filteredProducts, function($product) {
        return $product['active'] === true;
    });
    
    // Limite de resultados
    if ($limit) {
        $filteredProducts = array_slice($filteredProducts, 0, $limit);
    }
    
    return array_values($filteredProducts);
}

function getProductById($id) {
    global $products;
    
    foreach ($products as $product) {
        if ($product['id'] == $id && $product['active']) {
            return $product;
        }
    }
    
    return null;
}

function getCategories() {
    global $products;
    
    $categories = [];
    foreach ($products as $product) {
        if ($product['active'] && !in_array($product['category'], $categories)) {
            $categories[] = $product['category'];
        }
    }
    
    sort($categories);
    return $categories;
}

function getFeaturedProducts($limit = 6) {
    return getProducts(null, true, $limit);
}

// ===== TRATAMENTO DE ERROS =====
function handleError($errorNumber, $errorString, $errorFile, $errorLine) {
    if (!(error_reporting() & $errorNumber)) {
        return false;
    }
    
    $errorTypes = [
        E_ERROR => 'Error',
        E_WARNING => 'Warning',
        E_PARSE => 'Parse Error',
        E_NOTICE => 'Notice',
        E_USER_ERROR => 'User Error',
        E_USER_WARNING => 'User Warning',
        E_USER_NOTICE => 'User Notice',
    ];
    
    $errorType = $errorTypes[$errorNumber] ?? 'Unknown Error';
    
    error_log("[$errorType] $errorString in $errorFile on line $errorLine");
    
    if (defined('DEVELOPMENT_MODE') && DEVELOPMENT_MODE) {
        echo "<div style='background: #f8d7da; color: #721c24; padding: 15px; margin: 10px; border: 1px solid #f5c6cb; border-radius: 5px;'>
                <strong>$errorType:</strong> $errorString<br>
                <small>File: $errorFile (Line: $errorLine)</small>
              </div>";
    }
    
    return true;
}

set_error_handler('handleError');

// ===== PROTEÇÃO CONTRA CSRF =====
function generateCSRFToken() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

function validateCSRFToken($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

// ===== REDIRECIONAMENTO SEGURO =====
function redirect($url) {
    if (!headers_sent()) {
        header('Location: ' . $url);
        exit;
    } else {
        echo '<script>window.location.href="' . $url . '";</script>';
        exit;
    }
}

// ===== VALIDAÇÃO DE EMAIL =====
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

// ===== FORMATAÇÃO DE DADOS =====
function formatPrice($price) {
    return CURRENCY_SYMBOL . ' ' . number_format($price, 2, ',', '.');
}

function formatDate($date, $format = 'd/m/Y H:i') {
    $timestamp = is_numeric($date) ? $date : strtotime($date);
    return date($format, $timestamp);
}

// Gerar token CSRF na inicialização
generateCSRFToken();
?>