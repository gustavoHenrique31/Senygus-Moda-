<?php
session_start();
require_once 'includes/config.php';
require_once 'includes/functions.php';

// Verificar se o usuário está logado
if (!isset($_SESSION['admin_logged_in']) || $_SESSION['admin_logged_in'] !== true) {
    header('Location: admin_login.php');
    exit;
}

// LOG: Acesso ao painel administrativo
$username = $_SESSION['admin_username'];
logActivity('INFO', 'ADMIN_ACCESS', "Painel administrativo acessado", $username);

// Estatísticas para o dashboard
$totalProducts = count($products);
$totalOrders = 0;
$totalRevenue = array_sum(array_column($products, 'price'));
$lowStockProducts = 0;

// Processar ações do formulário
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if (isset($_POST['add_product'])) {
        $newProduct = [
            'id' => count($products) + 1,
            'name' => $_POST['name'],
            'price' => floatval($_POST['price']),
            'oldPrice' => !empty($_POST['old_price']) ? floatval($_POST['old_price']) : null,
            'category' => $_POST['category'],
            'size' => $_POST['size'],
            'description' => $_POST['description'],
            'details' => array_filter($_POST['details']),
            'colors' => explode(',', $_POST['colors']),
            'images' => [],
            'featured' => isset($_POST['featured']),
            'active' => true
        ];
        
        $products[] = $newProduct;
        
        // LOG: Produto adicionado
        logActivity('INFO', 'PRODUCT_ADDED', "Product ID: {$newProduct['id']}, Name: {$newProduct['name']}", $username);
        
        $_SESSION['success_message'] = 'Produto adicionado com sucesso!';
    }
    
    if (isset($_POST['update_product'])) {
        $productId = intval($_POST['product_id']);
        foreach ($products as &$product) {
            if ($product['id'] === $productId) {
                $oldName = $product['name'];
                $product['name'] = $_POST['name'];
                $product['price'] = floatval($_POST['price']);
                $product['oldPrice'] = !empty($_POST['old_price']) ? floatval($_POST['old_price']) : null;
                $product['category'] = $_POST['category'];
                $product['size'] = $_POST['size'];
                $product['description'] = $_POST['description'];
                $product['details'] = array_filter($_POST['details']);
                $product['colors'] = explode(',', $_POST['colors']);
                $product['featured'] = isset($_POST['featured']);
                
                // LOG: Produto atualizado
                logActivity('INFO', 'PRODUCT_UPDATED', "Product ID: $productId, Name: {$product['name']} (was: $oldName)", $username);
                break;
            }
        }
        $_SESSION['success_message'] = 'Produto atualizado com sucesso!';
    }
    
    if (isset($_POST['delete_product'])) {
        $productId = intval($_POST['product_id']);
        $deletedProduct = null;
        
        foreach ($products as $key => $product) {
            if ($product['id'] === $productId) {
                $deletedProduct = $product;
                unset($products[$key]);
                break;
            }
        }
        
        if ($deletedProduct) {
            // LOG: Produto excluído
            logActivity('WARNING', 'PRODUCT_DELETED', "Product ID: $productId, Name: {$deletedProduct['name']}", $username);
        }
        
        $_SESSION['success_message'] = 'Produto excluído com sucesso!';
    }
    
    // Recarregar a página para ver as mudanças
    header('Location: admin.php');
    exit;
}
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Painel Administrativo - <?php echo SITE_NAME; ?></title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="assets/css/style.css">
    <style>
        .admin-container {
            max-width: 1400px;
            margin: 0 auto;
            padding: 100px 20px 50px;
            min-height: 100vh;
        }
        
        .admin-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 2px solid var(--border-color);
        }
        
        .admin-nav {
            background: var(--light-color);
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
        }
        
        .admin-nav ul {
            display: flex;
            gap: 20px;
            list-style: none;
            margin: 0;
            padding: 0;
        }
        
        .admin-nav a {
            text-decoration: none;
            color: var(--text-color);
            font-weight: 600;
            padding: 10px 20px;
            border-radius: 5px;
            transition: var(--transition);
        }
        
        .admin-nav a.active,
        .admin-nav a:hover {
            background: var(--primary-color);
            color: white;
        }
        
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 20px;
            margin-bottom: 40px;
        }
        
        .stat-card {
            background: white;
            padding: 25px;
            border-radius: 10px;
            box-shadow: var(--shadow);
            text-align: center;
        }
        
        .stat-icon {
            font-size: 2.5rem;
            color: var(--primary-color);
            margin-bottom: 15px;
        }
        
        .stat-number {
            font-size: 2rem;
            font-weight: 700;
            color: var(--dark-color);
            margin-bottom: 5px;
        }
        
        .stat-label {
            color: var(--text-light);
            font-size: 0.9rem;
        }
        
        .admin-section {
            background: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: var(--shadow);
            margin-bottom: 30px;
        }
        
        .products-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        
        .products-table th,
        .products-table td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid var(--border-color);
        }
        
        .products-table th {
            background: var(--light-color);
            font-weight: 600;
        }
        
        .product-image-small {
            width: 50px;
            height: 50px;
            object-fit: cover;
            border-radius: 5px;
        }
        
        .btn {
            padding: 8px 16px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            font-weight: 600;
            transition: var(--transition);
            text-decoration: none;
            display: inline-block;
            text-align: center;
        }
        
        .btn-primary {
            background: var(--primary-color);
            color: white;
        }
        
        .btn-danger {
            background: #dc3545;
            color: white;
        }
        
        .btn-sm {
            padding: 6px 12px;
            font-size: 0.8rem;
        }
        
        .form-group {
            margin-bottom: 20px;
        }
        
        .form-group label {
            display: block;
            margin-bottom: 5px;
            font-weight: 600;
            color: var(--dark-color);
        }
        
        .form-control {
            width: 100%;
            padding: 10px;
            border: 2px solid var(--border-color);
            border-radius: 5px;
            font-size: 1rem;
            transition: var(--transition);
        }
        
        .form-control:focus {
            outline: none;
            border-color: var(--primary-color);
        }
        
        .form-row {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
        }
        
        .checkbox-group {
            display: flex;
            align-items: center;
            gap: 10px;
        }
        
        .checkbox-group input {
            width: auto;
        }
        
        .message {
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
        }
        
        .message.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        
        .message.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        
        .action-buttons {
            display: flex;
            gap: 8px;
        }
        
        .logout-btn {
            background: #6c757d;
            color: white;
            padding: 10px 20px;
            border: none;
            border-radius: 5px;
            cursor: pointer;
            text-decoration: none;
        }
        
        @media (max-width: 768px) {
            .form-row {
                grid-template-columns: 1fr;
            }
            
            .admin-nav ul {
                flex-direction: column;
                gap: 10px;
            }
            
            .products-table {
                font-size: 0.9rem;
            }
            
            .action-buttons {
                flex-direction: column;
            }
        }
    </style>
</head>
<body>
    <header>
        <div class="container header-container">
            <a href="admin.php" class="logo">ELEG<span>ANCE</span> Admin</a>
            <div>
                <span>Bem-vindo, Administrador</span>
                <a href="admin_logout.php" class="logout-btn" style="margin-left: 15px;">
                    <i class="fas fa-sign-out-alt"></i> Sair
                </a>
            </div>
        </div>
    </header>

    <div class="admin-container">
        <?php if (isset($_SESSION['success_message'])): ?>
            <div class="message success">
                <?php echo $_SESSION['success_message']; unset($_SESSION['success_message']); ?>
            </div>
        <?php endif; ?>
        
        <div class="admin-header">
            <h1>Painel Administrativo</h1>
            <div class="admin-info">
                <small>Último acesso: <?php echo date('d/m/Y H:i'); ?></small>
            </div>
        </div>
        
        <nav class="admin-nav">
            <ul>
                <li><a href="#dashboard" class="active">Dashboard</a></li>
                <li><a href="#products">Produtos</a></li>
                <li><a href="#orders">Pedidos</a></li>
                <li><a href="#customers">Clientes</a></li>
                <li><a href="#settings">Configurações</a></li>
            </ul>
        </nav>
        
        <!-- Dashboard Stats -->
        <div id="dashboard">
            <div class="stats-grid">
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-tshirt"></i>
                    </div>
                    <div class="stat-number"><?php echo $totalProducts; ?></div>
                    <div class="stat-label">Total de Produtos</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-shopping-cart"></i>
                    </div>
                    <div class="stat-number"><?php echo $totalOrders; ?></div>
                    <div class="stat-label">Pedidos Hoje</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-dollar-sign"></i>
                    </div>
                    <div class="stat-number">R$ <?php echo number_format($totalRevenue, 2, ',', '.'); ?></div>
                    <div class="stat-label">Receita Total</div>
                </div>
                
                <div class="stat-card">
                    <div class="stat-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="stat-number"><?php echo $lowStockProducts; ?></div>
                    <div class="stat-label">Produtos com Estoque Baixo</div>
                </div>
            </div>
        </div>
        
        <!-- Gerenciamento de Produtos -->
        <div id="products" class="admin-section">
            <h2>Gerenciar Produtos</h2>
            
            <!-- Formulário de Adicionar/Editar Produto -->
            <div class="product-form" style="margin-bottom: 30px;">
                <h3><?php echo isset($_GET['edit']) ? 'Editar Produto' : 'Adicionar Novo Produto'; ?></h3>
                <form method="POST" enctype="multipart/form-data">
                    <?php
                    $editingProduct = null;
                    if (isset($_GET['edit'])) {
                        $editId = intval($_GET['edit']);
                        foreach ($products as $product) {
                            if ($product['id'] === $editId) {
                                $editingProduct = $product;
                                break;
                            }
                        }
                    }
                    ?>
                    
                    <?php if ($editingProduct): ?>
                        <input type="hidden" name="product_id" value="<?php echo $editingProduct['id']; ?>">
                    <?php endif; ?>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="name">Nome do Produto *</label>
                            <input type="text" id="name" name="name" class="form-control" 
                                   value="<?php echo $editingProduct ? htmlspecialchars($editingProduct['name']) : ''; ?>" 
                                   required>
                        </div>
                        
                        <div class="form-group">
                            <label for="category">Categoria *</label>
                            <select id="category" name="category" class="form-control" required>
                                <option value="">Selecione uma categoria</option>
                                <option value="vestidos" <?php echo ($editingProduct && $editingProduct['category'] === 'vestidos') ? 'selected' : ''; ?>>Vestidos</option>
                                <option value="blazers" <?php echo ($editingProduct && $editingProduct['category'] === 'blazers') ? 'selected' : ''; ?>>Blazers</option>
                                <option value="blusas" <?php echo ($editingProduct && $editingProduct['category'] === 'blusas') ? 'selected' : ''; ?>>Blusas</option>
                                <option value="calcas" <?php echo ($editingProduct && $editingProduct['category'] === 'calcas') ? 'selected' : ''; ?>>Calças</option>
                                <option value="saias" <?php echo ($editingProduct && $editingProduct['category'] === 'saias') ? 'selected' : ''; ?>>Saias</option>
                                <option value="acessorios" <?php echo ($editingProduct && $editingProduct['category'] === 'acessorios') ? 'selected' : ''; ?>>Acessórios</option>
                            </select>
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="price">Preço (R$) *</label>
                            <input type="number" id="price" name="price" step="0.01" class="form-control" 
                                   value="<?php echo $editingProduct ? $editingProduct['price'] : ''; ?>" 
                                   required>
                        </div>
                        
                        <div class="form-group">
                            <label for="old_price">Preço Antigo (R$)</label>
                            <input type="number" id="old_price" name="old_price" step="0.01" class="form-control" 
                                   value="<?php echo $editingProduct && $editingProduct['oldPrice'] ? $editingProduct['oldPrice'] : ''; ?>">
                        </div>
                    </div>
                    
                    <div class="form-row">
                        <div class="form-group">
                            <label for="size">Tamanho *</label>
                            <input type="text" id="size" name="size" class="form-control" 
                                   value="<?php echo $editingProduct ? $editingProduct['size'] : ''; ?>" 
                                   required>
                        </div>
                        
                        <div class="form-group">
                            <label for="colors">Cores (separadas por vírgula) *</label>
                            <input type="text" id="colors" name="colors" class="form-control" 
                                   value="<?php echo $editingProduct ? implode(',', $editingProduct['colors']) : ''; ?>" 
                                   required>
                        </div>
                    </div>
                    
                    <div class="form-group">
                        <label for="description">Descrição *</label>
                        <textarea id="description" name="description" class="form-control" rows="4" required><?php echo $editingProduct ? htmlspecialchars($editingProduct['description']) : ''; ?></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label>Detalhes do Produto</label>
                        <div id="details-container">
                            <?php if ($editingProduct && !empty($editingProduct['details'])): ?>
                                <?php foreach ($editingProduct['details'] as $detail): ?>
                                    <input type="text" name="details[]" class="form-control" value="<?php echo htmlspecialchars($detail); ?>" style="margin-bottom: 5px;">
                                <?php endforeach; ?>
                            <?php else: ?>
                                <input type="text" name="details[]" class="form-control" placeholder="Ex: Tecido: Algodão" style="margin-bottom: 5px;">
                            <?php endif; ?>
                        </div>
                        <button type="button" onclick="addDetailField()" class="btn btn-primary btn-sm" style="margin-top: 5px;">
                            <i class="fas fa-plus"></i> Adicionar Detalhe
                        </button>
                    </div>
                    
                    <div class="form-group">
                        <label for="images">Imagens do Produto</label>
                        <input type="file" id="images" name="images[]" multiple accept="image/*" class="form-control">
                        <small>Selecione múltiplas imagens (JPEG, PNG, WebP - máx. 5MB cada)</small>
                    </div>
                    
                    <div class="form-group checkbox-group">
                        <input type="checkbox" id="featured" name="featured" <?php echo ($editingProduct && $editingProduct['featured']) ? 'checked' : ''; ?>>
                        <label for="featured">Produto em Destaque</label>
                    </div>
                    
                    <div class="form-group">
                        <?php if ($editingProduct): ?>
                            <button type="submit" name="update_product" class="btn btn-primary">
                                <i class="fas fa-save"></i> Atualizar Produto
                            </button>
                            <a href="admin.php" class="btn" style="background: #6c757d; color: white;">
                                <i class="fas fa-times"></i> Cancelar
                            </a>
                        <?php else: ?>
                            <button type="submit" name="add_product" class="btn btn-primary">
                                <i class="fas fa-plus"></i> Adicionar Produto
                            </button>
                        <?php endif; ?>
                    </div>
                </form>
            </div>
            
            <!-- Lista de Produtos -->
            <h3>Produtos Cadastrados</h3>
            <div class="table-responsive">
                <table class="products-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Imagem</th>
                            <th>Nome</th>
                            <th>Preço</th>
                            <th>Categoria</th>
                            <th>Destaque</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <?php foreach ($products as $product): ?>
                            <tr>
                                <td><?php echo $product['id']; ?></td>
                                <td>
                                    <?php if (!empty($product['images'])): ?>
                                        <img src="<?php echo $product['images'][0]; ?>" 
                                             alt="<?php echo htmlspecialchars($product['name']); ?>" 
                                             class="product-image-small"
                                             onerror="this.src='assets/images/placeholder.jpg'">
                                    <?php else: ?>
                                        <div style="width: 50px; height: 50px; background: #f5f5f5; display: flex; align-items: center; justify-content: center; border-radius: 5px;">
                                            <i class="fas fa-tshirt" style="color: #666;"></i>
                                        </div>
                                    <?php endif; ?>
                                </td>
                                <td><?php echo htmlspecialchars($product['name']); ?></td>
                                <td>R$ <?php echo number_format($product['price'], 2, ',', '.'); ?></td>
                                <td><?php echo ucfirst($product['category']); ?></td>
                                <td>
                                    <?php if ($product['featured']): ?>
                                        <i class="fas fa-star" style="color: #ffc107;"></i>
                                    <?php else: ?>
                                        <i class="far fa-star" style="color: #6c757d;"></i>
                                    <?php endif; ?>
                                </td>
                                <td>
                                    <div class="action-buttons">
                                        <a href="admin.php?edit=<?php echo $product['id']; ?>" class="btn btn-primary btn-sm">
                                            <i class="fas fa-edit"></i> Editar
                                        </a>
                                        <form method="POST" style="display: inline;">
                                            <input type="hidden" name="product_id" value="<?php echo $product['id']; ?>">
                                            <button type="submit" name="delete_product" class="btn btn-danger btn-sm" 
                                                    onclick="return confirm('Tem certeza que deseja excluir este produto?')">
                                                <i class="fas fa-trash"></i> Excluir
                                            </button>
                                        </form>
                                        <a href="product.php?id=<?php echo $product['id']; ?>" target="_blank" class="btn btn-sm" style="background: #17a2b8; color: white;">
                                            <i class="fas fa-eye"></i> Ver
                                        </a>
                                    </div>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <script>
        function addDetailField() {
            const container = document.getElementById('details-container');
            const input = document.createElement('input');
            input.type = 'text';
            input.name = 'details[]';
            input.className = 'form-control';
            input.placeholder = 'Ex: Composição: 100% Algodão';
            input.style.marginBottom = '5px';
            container.appendChild(input);
        }
        
        // Navegação suave entre seções
        document.querySelectorAll('.admin-nav a').forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('href').substring(1);
                
                // Atualizar navegação ativa
                document.querySelectorAll('.admin-nav a').forEach(a => a.classList.remove('active'));
                this.classList.add('active');
                
                // Mostrar seção correspondente
                document.querySelectorAll('.admin-section').forEach(section => {
                    section.style.display = 'none';
                });
                
                if (targetId === 'dashboard') {
                    document.getElementById('dashboard').style.display = 'block';
                } else {
                    document.getElementById(targetId).style.display = 'block';
                }
            });
        });
        
        // Mostrar dashboard por padrão
        document.addEventListener('DOMContentLoaded', function() {
            document.getElementById('dashboard').style.display = 'block';
        });
    </script>
</body>
</html>