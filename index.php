<?php
require_once 'includes/config.php';
require_once 'includes/functions.php';

$category = isset($_GET['category']) ? $_GET['category'] : null;
$products = getProducts($category);
$categories = getCategories();
?>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo SITE_NAME; ?> - Moda Feminina</title>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <link rel="stylesheet" href="assets/css/style.css">
</head>
<body>
    <!-- Header -->
    <header>
        <div class="container header-container">
            <a href="index.php" class="logo">ELEG<span>ANCE</span></a>
            
            <button class="hamburger">
                <i class="fas fa-bars"></i>
            </button>
            
            <nav>
                <ul class="nav-menu">
                    <li><a href="index.php">Novidades</a></li>
                    <li><a href="index.php?category=vestidos">Vestidos</a></li>
                    <li><a href="index.php?category=blusas">Blusas</a></li>
                    <li><a href="index.php?category=calcas">Calças</a></li>
                    <li><a href="index.php?category=saias">Saias</a></li>
                    <li><a href="index.php?category=acessorios">Acessórios</a></li>
                    <li><a href="#">Promoções</a></li>
                </ul>
            </nav>
            
            <div class="header-actions">
                <button class="search-btn">
                    <i class="fas fa-search"></i>
                </button>
                <button class="user-btn">
                    <i class="fas fa-user"></i>
                </button>
                <button class="cart-btn" id="cartToggle">
                    <i class="fas fa-shopping-bag"></i>
                    <span class="cart-count"><?php echo getCartItemsCount(); ?></span>
                </button>
            </div>
        </div>
    </header>

    <!-- Hero Banner / Carousel -->
    <section class="hero">
        <div class="carousel">
            <div class="carousel-slides">
                <div class="carousel-slide" style="background-image: url('https://images.unsplash.com/photo-1490481651871-ab68de25d43d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80');">
                    <div class="slide-content">
                        <h2>Nova Coleção Verão</h2>
                        <p>Descubra as últimas tendências da temporada</p>
                        <a href="#products" class="btn">Comprar Agora</a>
                    </div>
                </div>
                <div class="carousel-slide" style="background-image: url('https://images.unsplash.com/photo-1445205170230-053b83016050?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80');">
                    <div class="slide-content">
                        <h2>Até 50% Off</h2>
                        <p>Aproveite nossos descontos especiais</p>
                        <a href="#products" class="btn">Ver Ofertas</a>
                    </div>
                </div>
                <div class="carousel-slide" style="background-image: url('https://images.unsplash.com/photo-1558769132-cb1aea458c5e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80');">
                    <div class="slide-content">
                        <h2>Moda Sustentável</h2>
                        <p>Conheça nossa linha eco-friendly</p>
                        <a href="#products" class="btn">Saiba Mais</a>
                    </div>
                </div>
            </div>
            <div class="carousel-controls">
                <span class="carousel-dot active" data-slide="0"></span>
                <span class="carousel-dot" data-slide="1"></span>
                <span class="carousel-dot" data-slide="2"></span>
            </div>
        </div>
    </section>

    <!-- Filters -->
    <section class="filters">
        <div class="container filter-container">
            <div class="search-box">
                <i class="fas fa-search"></i>
                <input type="text" id="searchInput" placeholder="Buscar produtos...">
            </div>
            <div class="filter-options">
                <select class="filter-select" id="categoryFilter">
                    <option value="all">Todas as Categorias</option>
                    <option value="vestidos">Vestidos</option>
                    <option value="blazers">Blazers</option>
                    <option value="blusas">Blusas</option>
                    <option value="calcas">Calças</option>
                    <option value="saias">Saias</option>
                    <option value="acessorios">Acessórios</option>
                </select>
                <select class="filter-select" id="priceFilter">
                    <option value="all">Todos os Preços</option>
                    <option value="0-50">Até R$ 50</option>
                    <option value="50-100">R$ 50 - R$ 100</option>
                    <option value="100-200">R$ 100 - R$ 200</option>
                    <option value="200+">Acima de R$ 200</option>
                </select>
                <select class="filter-select" id="sortBy">
                    <option value="default">Ordenar por</option>
                    <option value="price-asc">Preço: Menor para Maior</option>
                    <option value="price-desc">Preço: Maior para Menor</option>
                    <option value="name">Nome A-Z</option>
                </select>
            </div>
        </div>
    </section>

    <!-- Products Grid -->
    <section class="section" id="products">
        <div class="container">
            <h2 class="section-title">Nossos Produtos</h2>
            <div class="products-grid" id="productsGrid">
                <?php if (empty($products)): ?>
                    <p class="no-products">Nenhum produto encontrado.</p>
                <?php else: ?>
                    <?php foreach ($products as $product): ?>
                        <div class="product-card" data-category="<?php echo htmlspecialchars($product['category']); ?>">
                            <div class="product-image">
                                <?php if (!empty($product['images'])): ?>
                                    <img src="<?php echo $product['images'][0]; ?>" 
                                         alt="<?php echo htmlspecialchars($product['name']); ?>"
                                         loading="lazy"
                                         onerror="this.src='assets/images/placeholder.jpg'">
                                <?php else: ?>
                                    <div class="no-image">
                                        <i class="fas fa-tshirt"></i>
                                    </div>
                                <?php endif; ?>
                                <?php if (isset($product['oldPrice']) && $product['oldPrice']): ?>
                                    <span class="product-badge">Oferta</span>
                                <?php endif; ?>
                                <div class="product-actions">
                                    <button class="product-action-btn quick-view" data-id="<?php echo $product['id']; ?>">
                                        <i class="fas fa-eye"></i>
                                    </button>
                                    <button class="product-action-btn add-to-cart" data-id="<?php echo $product['id']; ?>">
                                        <i class="fas fa-shopping-bag"></i>
                                    </button>
                                </div>
                                <?php if (count($product['colors']) > 1): ?>
                                    <div class="color-variants">
                                        <?php foreach ($product['colors'] as $color): ?>
                                            <span class="color-dot" style="background-color: <?php echo getColorCode($color); ?>" title="<?php echo $color; ?>"></span>
                                        <?php endforeach; ?>
                                    </div>
                                <?php endif; ?>
                            </div>
                            <div class="product-info">
                                <h3 class="product-name"><?php echo htmlspecialchars($product['name']); ?></h3>
                                <div class="product-size">Tamanho: <?php echo $product['size']; ?></div>
                                <div class="product-price">
                                    R$ <?php echo number_format($product['price'], 2, ',', '.'); ?>
                                    <?php if (isset($product['oldPrice']) && $product['oldPrice']): ?>
                                        <span class="product-old-price">R$ <?php echo number_format($product['oldPrice'], 2, ',', '.'); ?></span>
                                    <?php endif; ?>
                                </div>
                                <div class="product-colors">
                                    <?php foreach ($product['colors'] as $color): ?>
                                        <span class="color-tag"><?php echo $color; ?></span>
                                    <?php endforeach; ?>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                <?php endif; ?>
            </div>
        </div>
    </section>

    <!-- Featured Carousel -->
    <section class="section" style="background-color: var(--light-color);">
        <div class="container">
            <h2 class="section-title">Destaques da Semana</h2>
            <div class="featured-carousel">
                <div class="featured-slides" id="featuredSlides">
                    <!-- Slides serão inseridos via JavaScript -->
                </div>
                <div class="featured-controls">
                    <button class="carousel-btn prev-featured">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <button class="carousel-btn next-featured">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer>
        <div class="container">
            <div class="footer-content">
                <div class="footer-column">
                    <h3>Elegance Store</h3>
                    <p>Moda feminina com elegância e sofisticação.</p>
                    <div class="social-links">
                        <a href="#"><i class="fab fa-instagram"></i></a>
                        <a href="#"><i class="fab fa-whatsapp"></i></a>
                        <a href="#"><i class="fab fa-tiktok"></i></a>
                    </div>
                </div>
                <div class="footer-column">
                    <h3>Links Rápidos</h3>
                    <ul class="footer-links">
                        <li><a href="index.php">Home</a></li>
                        <li><a href="#">Sobre Nós</a></li>
                        <li><a href="#">Contato</a></li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h3>Atendimento</h3>
                    <ul class="footer-links">
                        <li><i class="fab fa-whatsapp"></i> (11) 99691-2230</li>
                        <li><i class="fas fa-envelope"></i> contato@elegance.com</li>
                        <li><i class="fas fa-map-marker-alt"></i> São Paulo, SP</li>
                    </ul>
                </div>
                <div class="footer-column">
                    <h3>Newsletter</h3>
                    <p>Inscreva-se para receber nossas novidades e promoções.</p>
                    <form class="newsletter-form">
                        <input type="email" placeholder="Seu e-mail">
                        <button type="submit">Inscrever</button>
                    </form>
                </div>
            </div>
            <div class="footer-bottom">
                <p>&copy; 2024 Elegance Store. Todos os direitos reservados.</p>
            </div>
        </div>
    </footer>

    <!-- Cart Modal -->
    <div class="overlay" id="overlay"></div>
    <div class="cart-modal" id="cartModal">
        <div class="cart-header">
            <h3>Seu Carrinho</h3>
            <button class="close-cart" id="closeCart">
                <i class="fas fa-times"></i>
            </button>
        </div>
        <div class="cart-items" id="cartItems">
            <?php
            $cart = getCart();
            if (empty($cart)): ?>
                <p style="text-align: center; padding: 40px; color: #777;">Seu carrinho está vazio.</p>
            <?php else: ?>
                <?php foreach ($cart as $productId => $quantity): 
                    $product = getProductById($productId);
                    if ($product): ?>
                        <div class="cart-item">
                            <div class="cart-item-image">
                                <?php if (!empty($product['images'])): ?>
                                    <img src="<?php echo $product['images'][0]; ?>" 
                                         alt="<?php echo htmlspecialchars($product['name']); ?>"
                                         onerror="this.src='assets/images/placeholder.jpg'">
                                <?php else: ?>
                                    <i class="fas fa-tshirt"></i>
                                <?php endif; ?>
                            </div>
                            <div class="cart-item-details">
                                <h4 class="cart-item-name"><?php echo htmlspecialchars($product['name']); ?></h4>
                                <div class="cart-item-price">R$ <?php echo number_format($product['price'], 2, ',', '.'); ?></div>
                                <div class="cart-item-quantity">
                                    <button class="quantity-btn decrease" data-id="<?php echo $product['id']; ?>">-</button>
                                    <input type="number" class="quantity-input" value="<?php echo $quantity; ?>" min="1" data-id="<?php echo $product['id']; ?>">
                                    <button class="quantity-btn increase" data-id="<?php echo $product['id']; ?>">+</button>
                                    <button class="remove-item" data-id="<?php echo $product['id']; ?>">
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    <?php endif; ?>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
        <div class="cart-footer">
            <div class="cart-total">
                <span>Total:</span>
                <span id="cartTotal">R$ <?php echo number_format(getCartTotal(), 2, ',', '.'); ?></span>
            </div>
            <button class="checkout-btn" id="checkoutBtn" <?php echo empty($cart) ? 'disabled' : ''; ?>>Finalizar Pedido</button>
        </div>
    </div>

    <script src="assets/js/main.js"></script>
    <script>
        // ===== DADOS DOS PRODUTOS =====
        const productsData = [
            {
                id: 1,
                name: "BLAZER PRETO",
                category: "blazers",
                price: 189.90,
                oldPrice: 229.90,
                image: "assets/images/products/blazer-preto-1.jpg",
                featured: true,
                size: "A DEFINIR",
                colors: ["Preto"]
            },
            {
                id: 2,
                name: "Vestido Canelado com Detalhe na Manga",
                category: "vestidos",
                price: 129.90,
                oldPrice: 159.90,
                image: "assets/images/products/vestido-detalhe-manga-1.jpg",
                featured: true,
                size: "GG ao G2",
                colors: ["Preto", "Bordo", "Fuscia"]
            },
            {
                id: 3,
                name: "VESTIDO MIDI GOLA ALTA MODELADOR",
                category: "vestidos",
                price: 149.90,
                oldPrice: 189.90,
                image: "assets/images/products/vestido-canelado-gola-alta-12.jpg",
                featured: true,
                size: "Único (PP ao G)",
                colors: ["Preto", "Fuscia", "Bordo"]
            },
            {
                id: 4,
                name: "Vestido Tomara Que Caia Canelado com Fenda na Barra",
                category: "vestidos",
                price: 159.90,
                oldPrice: 199.90,
                image: "assets/images/products/vestido-tomara-que-caia-1.jpg",
                featured: true,
                size: "Único (PP ao G)",
                colors: ["Preto", "Bordo", "Fuscia"]
            }
        ];

        // ===== VARIÁVEIS GLOBAIS =====
        let currentSlide = 0;
        let currentFeaturedSlide = 0;
        const carouselSlides = document.querySelector('.carousel-slides');
        const carouselDots = document.querySelectorAll('.carousel-dot');
        const featuredSlides = document.getElementById('featuredSlides');
        const productsGrid = document.getElementById('productsGrid');
        const cartModal = document.getElementById('cartModal');
        const overlay = document.getElementById('overlay');
        const cartToggle = document.getElementById('cartToggle');
        const closeCart = document.getElementById('closeCart');
        const cartItems = document.getElementById('cartItems');
        const cartTotal = document.getElementById('cartTotal');
        const cartCount = document.querySelector('.cart-count');
        const checkoutBtn = document.getElementById('checkoutBtn');
        const searchInput = document.getElementById('searchInput');
        const categoryFilter = document.getElementById('categoryFilter');
        const priceFilter = document.getElementById('priceFilter');
        const sortBy = document.getElementById('sortBy');
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');

        // ===== INICIALIZAÇÃO =====
        document.addEventListener('DOMContentLoaded', function() {
            renderFeaturedProducts();
            startCarousel();
            setupEventListeners();
        });

        // ===== RENDERIZAÇÃO DOS PRODUTOS EM DESTAQUE =====
        function renderFeaturedProducts() {
            const featuredProducts = productsData.filter(product => product.featured);
            const slidesCount = Math.ceil(featuredProducts.length / 3);
            
            featuredSlides.innerHTML = '';
            
            for (let i = 0; i < slidesCount; i++) {
                const slide = document.createElement('div');
                slide.className = 'featured-slide';
                
                const productsInSlide = featuredProducts.slice(i * 3, (i + 1) * 3);
                
                productsInSlide.forEach(product => {
                    const productCard = document.createElement('div');
                    productCard.className = 'product-card';
                    productCard.innerHTML = `
                        <div class="product-image">
                            <img src="${product.image}" alt="${product.name}" onerror="this.src='assets/images/placeholder.jpg'">
                            ${product.oldPrice ? '<span class="product-badge">Oferta</span>' : ''}
                            <div class="product-actions">
                                <button class="product-action-btn quick-view" data-id="${product.id}">
                                    <i class="fas fa-eye"></i>
                                </button>
                                <button class="product-action-btn add-to-cart" data-id="${product.id}">
                                    <i class="fas fa-shopping-bag"></i>
                                </button>
                            </div>
                        </div>
                        <div class="product-info">
                            <h3 class="product-name">${product.name}</h3>
                            <div class="product-price">
                                R$ ${product.price.toFixed(2)}
                                ${product.oldPrice ? `<span class="product-old-price">R$ ${product.oldPrice.toFixed(2)}</span>` : ''}
                            </div>
                        </div>
                    `;
                    slide.appendChild(productCard);
                });
                
                featuredSlides.appendChild(slide);
            }
            
            // Adiciona event listeners aos botões de adicionar ao carrinho nos produtos em destaque
            document.querySelectorAll('.featured-slides .add-to-cart').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = parseInt(this.getAttribute('data-id'));
                    addToCart(productId);
                });
            });
        }

        // ===== FILTROS E BUSCA =====
        function filterProducts() {
            const searchTerm = searchInput.value.toLowerCase();
            const category = categoryFilter.value;
            const priceRange = priceFilter.value;
            const sort = sortBy.value;
            
            let filteredProducts = productsData.filter(product => {
                // Filtro por busca
                const matchesSearch = product.name.toLowerCase().includes(searchTerm);
                
                // Filtro por categoria
                const matchesCategory = category === 'all' || product.category === category;
                
                // Filtro por preço
                let matchesPrice = true;
                if (priceRange !== 'all') {
                    if (priceRange === '0-50') {
                        matchesPrice = product.price <= 50;
                    } else if (priceRange === '50-100') {
                        matchesPrice = product.price > 50 && product.price <= 100;
                    } else if (priceRange === '100-200') {
                        matchesPrice = product.price > 100 && product.price <= 200;
                    } else if (priceRange === '200+') {
                        matchesPrice = product.price > 200;
                    }
                }
                
                return matchesSearch && matchesCategory && matchesPrice;
            });
            
            // Ordenação
            if (sort === 'price-asc') {
                filteredProducts.sort((a, b) => a.price - b.price);
            } else if (sort === 'price-desc') {
                filteredProducts.sort((a, b) => b.price - a.price);
            } else if (sort === 'name') {
                filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            }
            
            renderFilteredProducts(filteredProducts);
        }

        function renderFilteredProducts(filteredProducts) {
            productsGrid.innerHTML = '';
            
            if (filteredProducts.length === 0) {
                productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">Nenhum produto encontrado.</p>';
                return;
            }
            
            filteredProducts.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}" onerror="this.src='assets/images/placeholder.jpg'">
                        ${product.oldPrice ? '<span class="product-badge">Oferta</span>' : ''}
                        <div class="product-actions">
                            <button class="product-action-btn quick-view" data-id="${product.id}">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="product-action-btn add-to-cart" data-id="${product.id}">
                                <i class="fas fa-shopping-bag"></i>
                            </button>
                        </div>
                    </div>
                    <div class="product-info">
                        <h3 class="product-name">${product.name}</h3>
                        <div class="product-price">
                            R$ ${product.price.toFixed(2)}
                            ${product.oldPrice ? `<span class="product-old-price">R$ ${product.oldPrice.toFixed(2)}</span>` : ''}
                        </div>
                    </div>
                `;
                productsGrid.appendChild(productCard);
            });
            
            // Adiciona event listeners aos botões de adicionar ao carrinho
            document.querySelectorAll('.add-to-cart').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = parseInt(this.getAttribute('data-id'));
                    addToCart(productId);
                });
            });
        }

        // ===== FUNCIONALIDADE DO CARRINHO =====
        function addToCart(productId) {
            fetch('includes/add_to_cart.php?product_id=' + productId)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        updateCartDisplay();
                        showNotification('Produto adicionado ao carrinho!');
                    }
                });
        }

        function removeFromCart(productId) {
            fetch('includes/remove_from_cart.php?product_id=' + productId)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        updateCartDisplay();
                    }
                });
        }

        function updateCartQuantity(productId, newQuantity) {
            fetch('includes/update_cart.php?product_id=' + productId + '&quantity=' + newQuantity)
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        updateCartDisplay();
                    }
                });
        }

        function updateCartDisplay() {
            // Recarregar a página para atualizar o carrinho
            location.reload();
        }

        // ===== CARROSSEL PRINCIPAL =====
        function startCarousel() {
            setInterval(() => {
                currentSlide = (currentSlide + 1) % 3;
                updateCarousel();
            }, 5000);
        }

        function updateCarousel() {
            if (carouselSlides) {
                carouselSlides.style.transform = `translateX(-${currentSlide * 100}%)`;
                
                carouselDots.forEach((dot, index) => {
                    dot.classList.toggle('active', index === currentSlide);
                });
            }
        }

        // Event listeners para os dots do carrossel
        carouselDots.forEach(dot => {
            dot.addEventListener('click', function() {
                currentSlide = parseInt(this.getAttribute('data-slide'));
                updateCarousel();
            });
        });

        // ===== CARROSSEL DE DESTAQUES =====
        function nextFeaturedSlide() {
            const slideCount = document.querySelectorAll('.featured-slide').length;
            currentFeaturedSlide = (currentFeaturedSlide + 1) % slideCount;
            if (featuredSlides) {
                featuredSlides.style.transform = `translateX(-${currentFeaturedSlide * 100}%)`;
            }
        }

        function prevFeaturedSlide() {
            const slideCount = document.querySelectorAll('.featured-slide').length;
            currentFeaturedSlide = (currentFeaturedSlide - 1 + slideCount) % slideCount;
            if (featuredSlides) {
                featuredSlides.style.transform = `translateX(-${currentFeaturedSlide * 100}%)`;
            }
        }

        // ===== FINALIZAÇÃO DO PEDIDO VIA WHATSAPP =====
        function checkout() {
            if (document.querySelectorAll('.cart-item').length === 0) {
                alert('Seu carrinho está vazio!');
                return;
            }
            
            // Número do WhatsApp da loja
            const phoneNumber = '5511996912230';
            
            // Monta a mensagem com os itens do carrinho
            let message = 'Olá! Gostaria de fazer um pedido:%0A%0A';
            
            document.querySelectorAll('.cart-item').forEach((item, index) => {
                const name = item.querySelector('.cart-item-name').textContent;
                const price = item.querySelector('.cart-item-price').textContent;
                const quantity = item.querySelector('.quantity-input').value;
                message += `${index + 1}. ${name} - ${price} x ${quantity}%0A`;
            });
            
            const total = document.getElementById('cartTotal').textContent;
            message += `%0ATotal: ${total}`;
            
            // Abre o WhatsApp
            window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
        }

        // ===== NOTIFICAÇÕES =====
        function showNotification(message) {
            // Cria elemento de notificação
            const notification = document.createElement('div');
            notification.style.cssText = `
                position: fixed;
                top: 100px;
                right: 20px;
                background-color: var(--accent-color);
                color: white;
                padding: 15px 20px;
                border-radius: 5px;
                box-shadow: var(--shadow);
                z-index: 2000;
                transform: translateX(150%);
                transition: transform 0.3s ease;
            `;
            notification.textContent = message;
            
            document.body.appendChild(notification);
            
            // Animação de entrada
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);
            
            // Remove após 3 segundos
            setTimeout(() => {
                notification.style.transform = 'translateX(150%)';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
        }

        // ===== CONFIGURAÇÃO DOS EVENT LISTENERS =====
        function setupEventListeners() {
            // Menu hamburger
            if (hamburger) {
                hamburger.addEventListener('click', function() {
                    navMenu.classList.toggle('active');
                });
            }
            
            // Abrir/fechar carrinho
            if (cartToggle) {
                cartToggle.addEventListener('click', function() {
                    cartModal.classList.add('active');
                    overlay.classList.add('active');
                    document.body.style.overflow = 'hidden';
                });
            }
            
            if (closeCart) {
                closeCart.addEventListener('click', closeCartModal);
            }
            
            if (overlay) {
                overlay.addEventListener('click', closeCartModal);
            }
            
            function closeCartModal() {
                cartModal.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
            
            // Finalizar pedido
            if (checkoutBtn) {
                checkoutBtn.addEventListener('click', checkout);
            }
            
            // Filtros
            if (searchInput) {
                searchInput.addEventListener('input', filterProducts);
            }
            
            if (categoryFilter) {
                categoryFilter.addEventListener('change', filterProducts);
            }
            
            if (priceFilter) {
                priceFilter.addEventListener('change', filterProducts);
            }
            
            if (sortBy) {
                sortBy.addEventListener('change', filterProducts);
            }
            
            // Controles do carrossel de destaques
            const nextFeatured = document.querySelector('.next-featured');
            const prevFeatured = document.querySelector('.prev-featured');
            
            if (nextFeatured) {
                nextFeatured.addEventListener('click', nextFeaturedSlide);
            }
            
            if (prevFeatured) {
                prevFeatured.addEventListener('click', prevFeaturedSlide);
            }
            
            // Fechar menu ao clicar em um link
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.addEventListener('click', function() {
                    navMenu.classList.remove('active');
                });
            });

            // Event listeners para os controles de quantidade no carrinho
            document.addEventListener('click', function(e) {
                if (e.target.classList.contains('decrease')) {
                    const productId = parseInt(e.target.getAttribute('data-id'));
                    const input = e.target.parentNode.querySelector('.quantity-input');
                    const newQuantity = parseInt(input.value) - 1;
                    updateCartQuantity(productId, newQuantity);
                }
                
                if (e.target.classList.contains('increase')) {
                    const productId = parseInt(e.target.getAttribute('data-id'));
                    const input = e.target.parentNode.querySelector('.quantity-input');
                    const newQuantity = parseInt(input.value) + 1;
                    updateCartQuantity(productId, newQuantity);
                }
                
                if (e.target.classList.contains('remove-item')) {
                    const productId = parseInt(e.target.getAttribute('data-id'));
                    removeFromCart(productId);
                }
            });

            // Event listener para inputs de quantidade
            document.addEventListener('change', function(e) {
                if (e.target.classList.contains('quantity-input')) {
                    const productId = parseInt(e.target.getAttribute('data-id'));
                    const newQuantity = parseInt(e.target.value);
                    updateCartQuantity(productId, newQuantity);
                }
            });
        }
    </script>
</body>
</html>