<script>
        // ===== DADOS DOS PRODUTOS =====
        const products = [
            {
                id: 1,
                name: "Vestido Floral Midi",
                category: "vestidos",
                price: 129.90,
                oldPrice: 159.90,
                image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                featured: true
            },
            {
                id: 2,
                name: "Blusa de Seda Branca",
                category: "blusas",
                price: 89.90,
                oldPrice: 119.90,
                image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                featured: true
            },
            {
                id: 3,
                name: "Calça Jeans Skinny",
                category: "calcas",
                price: 149.90,
                oldPrice: null,
                image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                featured: false
            },
            {
                id: 4,
                name: "Saia Plissada Preta",
                category: "saias",
                price: 79.90,
                oldPrice: 99.90,
                image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                featured: true
            },
            {
                id: 5,
                name: "Bolsa de Couro Marrom",
                category: "acessorios",
                price: 199.90,
                oldPrice: 249.90,
                image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                featured: false
            },
            {
                id: 6,
                name: "Vestido Vermelho Elegante",
                category: "vestidos",
                price: 179.90,
                oldPrice: null,
                image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                featured: true
            },
            {
                id: 7,
                name: "Blusa Listrada Azul",
                category: "blusas",
                price: 69.90,
                oldPrice: 89.90,
                image: "https://images.unsplash.com/photo-1525171254930-643fc8b95d0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                featured: false
            },
            {
                id: 8,
                name: "Calça Alfaiataria Bege",
                category: "calcas",
                price: 159.90,
                oldPrice: 189.90,
                image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                featured: false
            },
            {
                id: 9,
                name: "Saia Jeans Desbotada",
                category: "saias",
                price: 99.90,
                oldPrice: null,
                image: "https://images.unsplash.com/photo-1506629905607-47d30b8c4c3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                featured: false
            },
            {
                id: 10,
                name: "Cinto de Couro Preto",
                category: "acessorios",
                price: 49.90,
                oldPrice: 69.90,
                image: "https://images.unsplash.com/photo-1601924582970-9238bcb495d9?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                featured: true
            },
            {
                id: 11,
                name: "Vestido Preto Casual",
                category: "vestidos",
                price: 139.90,
                oldPrice: 169.90,
                image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                featured: false
            },
            {
                id: 12,
                name: "Blusa Manga Longa Rosa",
                category: "blusas",
                price: 79.90,
                oldPrice: null,
                image: "https://images.unsplash.com/photo-1485231183945-fffde5e37a04?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
                featured: false
            }
        ];

        // ===== VARIÁVEIS GLOBAIS =====
        let cart = [];
        let currentSlide = 0;
        let currentFeaturedSlide = 0;
        const carouselSlides = document.querySelector('.carousel-slides');
        const carouselDots = document.querySelectorAll('.carousel-dot');
        const featuredSlides = document.querySelector('.featured-slides');
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
            renderProducts(products);
            renderFeaturedProducts();
            startCarousel();
            setupEventListeners();
        });

        // ===== RENDERIZAÇÃO DOS PRODUTOS =====
        function renderProducts(productsToRender) {
            productsGrid.innerHTML = '';
            
            if (productsToRender.length === 0) {
                productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; padding: 40px;">Nenhum produto encontrado.</p>';
                return;
            }
            
            productsToRender.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'product-card';
                productCard.innerHTML = `
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}">
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

        // ===== RENDERIZAÇÃO DOS PRODUTOS EM DESTAQUE =====
        function renderFeaturedProducts() {
            const featuredProducts = products.filter(product => product.featured);
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
                            <img src="${product.image}" alt="${product.name}">
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

        // ===== FUNCIONALIDADE DO CARRINHO =====
        function addToCart(productId) {
            const product = products.find(p => p.id === productId);
            const existingItem = cart.find(item => item.id === productId);
            
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                });
            }
            
            updateCart();
            showNotification('Produto adicionado ao carrinho!');
        }

        function removeFromCart(productId) {
            cart = cart.filter(item => item.id !== productId);
            updateCart();
        }

        function updateCartQuantity(productId, newQuantity) {
            if (newQuantity < 1) {
                removeFromCart(productId);
                return;
            }
            
            const item = cart.find(item => item.id === productId);
            if (item) {
                item.quantity = newQuantity;
                updateCart();
            }
        }

        function updateCart() {
            // Atualiza a contagem do carrinho
            const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
            
            // Atualiza os itens do carrinho no modal
            cartItems.innerHTML = '';
            
            if (cart.length === 0) {
                cartItems.innerHTML = '<p style="text-align: center; padding: 40px;">Seu carrinho está vazio.</p>';
                cartTotal.textContent = 'R$ 0,00';
                return;
            }
            
            let totalPrice = 0;
            
            cart.forEach(item => {
                const itemTotal = item.price * item.quantity;
                totalPrice += itemTotal;
                
                const cartItem = document.createElement('div');
                cartItem.className = 'cart-item';
                cartItem.innerHTML = `
                    <div class="cart-item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="cart-item-details">
                        <h4 class="cart-item-name">${item.name}</h4>
                        <div class="cart-item-price">R$ ${item.price.toFixed(2)}</div>
                        <div class="cart-item-quantity">
                            <button class="quantity-btn decrease" data-id="${item.id}">-</button>
                            <input type="number" class="quantity-input" value="${item.quantity}" min="1" data-id="${item.id}">
                            <button class="quantity-btn increase" data-id="${item.id}">+</button>
                            <button class="remove-item" data-id="${item.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                `;
                cartItems.appendChild(cartItem);
            });
            
            cartTotal.textContent = `R$ ${totalPrice.toFixed(2)}`;
            
            // Adiciona event listeners aos controles de quantidade
            document.querySelectorAll('.decrease').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = parseInt(this.getAttribute('data-id'));
                    const item = cart.find(item => item.id === productId);
                    if (item) {
                        updateCartQuantity(productId, item.quantity - 1);
                    }
                });
            });
            
            document.querySelectorAll('.increase').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = parseInt(this.getAttribute('data-id'));
                    const item = cart.find(item => item.id === productId);
                    if (item) {
                        updateCartQuantity(productId, item.quantity + 1);
                    }
                });
            });
            
            document.querySelectorAll('.quantity-input').forEach(input => {
                input.addEventListener('change', function() {
                    const productId = parseInt(this.getAttribute('data-id'));
                    updateCartQuantity(productId, parseInt(this.value));
                });
            });
            
            document.querySelectorAll('.remove-item').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = parseInt(this.getAttribute('data-id'));
                    removeFromCart(productId);
                });
            });
        }

        // ===== FILTROS E BUSCA =====
        function filterProducts() {
            const searchTerm = searchInput.value.toLowerCase();
            const category = categoryFilter.value;
            const priceRange = priceFilter.value;
            const sort = sortBy.value;
            
            let filteredProducts = products.filter(product => {
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
            
            renderProducts(filteredProducts);
        }

        // ===== CARROSSEL PRINCIPAL =====
        function startCarousel() {
            setInterval(() => {
                currentSlide = (currentSlide + 1) % 3;
                updateCarousel();
            }, 5000);
        }

        function updateCarousel() {
            carouselSlides.style.transform = `translateX(-${currentSlide * 100}%)`;
            
            carouselDots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentSlide);
            });
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
            featuredSlides.style.transform = `translateX(-${currentFeaturedSlide * 100}%)`;
        }

        function prevFeaturedSlide() {
            const slideCount = document.querySelectorAll('.featured-slide').length;
            currentFeaturedSlide = (currentFeaturedSlide - 1 + slideCount) % slideCount;
            featuredSlides.style.transform = `translateX(-${currentFeaturedSlide * 100}%)`;
        }

        // ===== FINALIZAÇÃO DO PEDIDO VIA WHATSAPP =====
        function checkout() {
            if (cart.length === 0) {
                alert('Seu carrinho está vazio!');
                return;
            }
            
            // Número do WhatsApp da loja (substitua pelo número real)
            const phoneNumber = '5511999999999';
            
            // Monta a mensagem com os itens do carrinho
            let message = 'Olá! Gostaria de fazer um pedido:%0A%0A';
            
            cart.forEach((item, index) => {
                message += `${index + 1}. ${item.name} - R$ ${item.price.toFixed(2)} x ${item.quantity}%0A`;
            });
            
            const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            message += `%0ATotal: R$ ${total.toFixed(2)}`;
            
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
            hamburger.addEventListener('click', function() {
                navMenu.classList.toggle('active');
            });
            
            // Abrir/fechar carrinho
            cartToggle.addEventListener('click', function() {
                cartModal.classList.add('active');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            });
            
            closeCart.addEventListener('click', closeCartModal);
            overlay.addEventListener('click', closeCartModal);
            
            function closeCartModal() {
                cartModal.classList.remove('active');
                overlay.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
            
            // Finalizar pedido
            checkoutBtn.addEventListener('click', checkout);
            
            // Filtros
            searchInput.addEventListener('input', filterProducts);
            categoryFilter.addEventListener('change', filterProducts);
            priceFilter.addEventListener('change', filterProducts);
            sortBy.addEventListener('change', filterProducts);
            
            // Controles do carrossel de destaques
            document.querySelector('.next-featured').addEventListener('click', nextFeaturedSlide);
            document.querySelector('.prev-featured').addEventListener('click', prevFeaturedSlide);
            
            // Fechar menu ao clicar em um link
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.addEventListener('click', function() {
                    navMenu.classList.remove('active');
                });
            });
        }
    </script>