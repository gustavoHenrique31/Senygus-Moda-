<?php
// ===== CONEXÃO COM BANCO DE DADOS MYSQL =====
class Database {
    private $host = DB_HOST;
    private $dbname = DB_NAME;
    private $username = DB_USER;
    private $password = DB_PASS;
    private $charset = DB_CHARSET;
    
    private $pdo;
    private $error;
    
    public function __construct() {
        $dsn = "mysql:host={$this->host};dbname={$this->dbname};charset={$this->charset}";
        
        $options = [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
            PDO::ATTR_PERSISTENT => true
        ];
        
        try {
            $this->pdo = new PDO($dsn, $this->username, $this->password, $options);
        } catch (PDOException $e) {
            $this->error = $e->getMessage();
            error_log("Database Connection Error: " . $this->error);
            
            // Em produção, mostrar mensagem genérica
            if (defined('DEVELOPMENT_MODE') && DEVELOPMENT_MODE) {
                die("Database Connection Failed: " . $this->error);
            } else {
                die("Database connection error. Please try again later.");
            }
        }
    }
    
    // Preparar statement
    public function prepare($sql) {
        return $this->pdo->prepare($sql);
    }
    
    // Executar query
    public function execute($sql, $params = []) {
        try {
            $stmt = $this->pdo->prepare($sql);
            $stmt->execute($params);
            return $stmt;
        } catch (PDOException $e) {
            $this->error = $e->getMessage();
            error_log("Database Query Error: " . $this->error . " - SQL: " . $sql);
            return false;
        }
    }
    
    // Buscar um único registro
    public function fetch($sql, $params = []) {
        $stmt = $this->execute($sql, $params);
        return $stmt ? $stmt->fetch() : false;
    }
    
    // Buscar todos os registros
    public function fetchAll($sql, $params = []) {
        $stmt = $this->execute($sql, $params);
        return $stmt ? $stmt->fetchAll() : false;
    }
    
    // Inserir registro e retornar ID
    public function insert($table, $data) {
        $columns = implode(', ', array_keys($data));
        $placeholders = ':' . implode(', :', array_keys($data));
        
        $sql = "INSERT INTO {$table} ({$columns}) VALUES ({$placeholders})";
        
        $stmt = $this->execute($sql, $data);
        return $stmt ? $this->pdo->lastInsertId() : false;
    }
    
    // Atualizar registro
    public function update($table, $data, $where, $whereParams = []) {
        $set = '';
        foreach (array_keys($data) as $column) {
            $set .= "{$column} = :{$column}, ";
        }
        $set = rtrim($set, ', ');
        
        $sql = "UPDATE {$table} SET {$set} WHERE {$where}";
        $params = array_merge($data, $whereParams);
        
        $stmt = $this->execute($sql, $params);
        return $stmt ? $stmt->rowCount() : false;
    }
    
    // Deletar registro
    public function delete($table, $where, $params = []) {
        $sql = "DELETE FROM {$table} WHERE {$where}";
        $stmt = $this->execute($sql, $params);
        return $stmt ? $stmt->rowCount() : false;
    }
    
    // Contar registros
    public function count($table, $where = '1', $params = []) {
        $sql = "SELECT COUNT(*) as count FROM {$table} WHERE {$where}";
        $result = $this->fetch($sql, $params);
        return $result ? $result['count'] : 0;
    }
    
    // Iniciar transação
    public function beginTransaction() {
        return $this->pdo->beginTransaction();
    }
    
    // Confirmar transação
    public function commit() {
        return $this->pdo->commit();
    }
    
    // Reverter transação
    public function rollBack() {
        return $this->pdo->rollBack();
    }
    
    // Obter último erro
    public function getError() {
        return $this->error;
    }
    
    // Verificar se tabela existe
    public function tableExists($table) {
        $sql = "SHOW TABLES LIKE ?";
        $stmt = $this->execute($sql, [$table]);
        return $stmt && $stmt->rowCount() > 0;
    }
}

// ===== FUNÇÕES ESPECÍFICAS DO E-COMMERCE =====
function getProductsFromDB($category = null, $featured = null, $limit = null, $offset = 0) {
    global $db;
    
    $sql = "SELECT * FROM products WHERE active = 1";
    $params = [];
    
    if ($category) {
        $sql .= " AND category = ?";
        $params[] = $category;
    }
    
    if ($featured !== null) {
        $sql .= " AND featured = ?";
        $params[] = $featured ? 1 : 0;
    }
    
    $sql .= " ORDER BY created_at DESC";
    
    if ($limit) {
        $sql .= " LIMIT ? OFFSET ?";
        $params[] = $limit;
        $params[] = $offset;
    }
    
    return $db->fetchAll($sql, $params);
}

function getProductByIdFromDB($id) {
    global $db;
    
    $sql = "SELECT * FROM products WHERE id = ? AND active = 1";
    return $db->fetch($sql, [$id]);
}

function searchProducts($query, $category = null, $minPrice = null, $maxPrice = null, $sort = 'name') {
    global $db;
    
    $sql = "SELECT * FROM products WHERE active = 1 AND (name LIKE ? OR description LIKE ?)";
    $params = ["%$query%", "%$query%"];
    
    if ($category) {
        $sql .= " AND category = ?";
        $params[] = $category;
    }
    
    if ($minPrice !== null) {
        $sql .= " AND price >= ?";
        $params[] = $minPrice;
    }
    
    if ($maxPrice !== null) {
        $sql .= " AND price <= ?";
        $params[] = $maxPrice;
    }
    
    // Ordenação
    $sortOptions = [
        'name' => 'name ASC',
        'price_asc' => 'price ASC',
        'price_desc' => 'price DESC',
        'newest' => 'created_at DESC',
        'featured' => 'featured DESC, created_at DESC'
    ];
    
    $sql .= " ORDER BY " . ($sortOptions[$sort] ?? 'name ASC');
    
    return $db->fetchAll($sql, $params);
}

function createOrder($orderData) {
    global $db;
    
    try {
        $db->beginTransaction();
        
        // Inserir pedido
        $orderId = $db->insert('orders', [
            'customer_name' => $orderData['name'],
            'customer_email' => $orderData['email'],
            'customer_phone' => $orderData['phone'],
            'customer_address' => $orderData['address'],
            'total_amount' => $orderData['total'],
            'status' => 'pending',
            'payment_method' => $orderData['payment_method']
        ]);
        
        if (!$orderId) {
            throw new Exception('Failed to create order');
        }
        
        // Inserir itens do pedido
        foreach ($orderData['items'] as $item) {
            $success = $db->insert('order_items', [
                'order_id' => $orderId,
                'product_id' => $item['id'],
                'quantity' => $item['quantity'],
                'unit_price' => $item['price']
            ]);
            
            if (!$success) {
                throw new Exception('Failed to add order items');
            }
        }
        
        $db->commit();
        return $orderId;
        
    } catch (Exception $e) {
        $db->rollBack();
        error_log("Order Creation Error: " . $e->getMessage());
        return false;
    }
}

function getOrder($orderId) {
    global $db;
    
    $order = $db->fetch("SELECT * FROM orders WHERE id = ?", [$orderId]);
    
    if ($order) {
        $order['items'] = $db->fetchAll("
            SELECT oi.*, p.name, p.images 
            FROM order_items oi 
            JOIN products p ON oi.product_id = p.id 
            WHERE oi.order_id = ?
        ", [$orderId]);
    }
    
    return $order;
}

// ===== INICIALIZAÇÃO DO BANCO DE DADOS =====
try {
    $db = new Database();
} catch (Exception $e) {
    // Em caso de falha na conexão, usar sistema baseado em arrays
    $db = null;
    
    if (defined('DEVELOPMENT_MODE') && DEVELOPMENT_MODE) {
        error_log("Database not available, using array-based system: " . $e->getMessage());
    }
}

// ===== FUNÇÃO PARA CRIAR TABELAS (Executar uma vez) =====
function createTables() {
    global $db;
    
    if (!$db) {
        return false;
    }
    
    $tables = [
        'products' => "
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                description TEXT,
                price DECIMAL(10,2) NOT NULL,
                old_price DECIMAL(10,2),
                category VARCHAR(100),
                size VARCHAR(50),
                colors JSON,
                images JSON,
                video VARCHAR(500),
                featured BOOLEAN DEFAULT FALSE,
                active BOOLEAN DEFAULT TRUE,
                rating DECIMAL(3,2) DEFAULT 0,
                review_count INT DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_category (category),
                INDEX idx_featured (featured),
                INDEX idx_active (active)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ",
        
        'orders' => "
            CREATE TABLE IF NOT EXISTS orders (
                id INT AUTO_INCREMENT PRIMARY KEY,
                customer_name VARCHAR(255) NOT NULL,
                customer_email VARCHAR(255) NOT NULL,
                customer_phone VARCHAR(20),
                customer_address TEXT NOT NULL,
                total_amount DECIMAL(10,2) NOT NULL,
                status ENUM('pending', 'confirmed', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
                payment_method VARCHAR(50),
                notes TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
                INDEX idx_status (status),
                INDEX idx_email (customer_email)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ",
        
        'order_items' => "
            CREATE TABLE IF NOT EXISTS order_items (
                id INT AUTO_INCREMENT PRIMARY KEY,
                order_id INT NOT NULL,
                product_id INT NOT NULL,
                quantity INT NOT NULL,
                unit_price DECIMAL(10,2) NOT NULL,
                FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
                FOREIGN KEY (product_id) REFERENCES products(id),
                INDEX idx_order_id (order_id)
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        ",
        
        'customers' => "
            CREATE TABLE IF NOT EXISTS customers (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                phone VARCHAR(20),
                address TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
            ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
        "
    ];
    
    foreach ($tables as $tableName => $sql) {
        if (!$db->tableExists($tableName)) {
            $db->execute($sql);
        }
    }
    
    return true;
}

// Criar tabelas se não existirem (executar manualmente uma vez)
// createTables();
?>