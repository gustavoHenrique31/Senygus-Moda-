let cart = JSON.parse(localStorage.getItem('eleganceCart')) || [];
let user = null;
let selectedPaymentMethod = null;
let shippingCost = 0;
let currentPage = 'catalog'; // 'catlet cart = JSON.parse(localStorage.getItem('eleganceCart')) || [];
let user = null;
let selectedPaymentMethod = null;
let shippingCost = 0;
let currentPage = 'catalog';

// ===== LISTA DE PRODUTOS =====
const products = [
    { 
        id: 1, 
        name: "Vestido Floral Verão", 
        price: 89.90, 
        category: "vestidos",
        description: "Vestido leve e fluido com estampa floral, ideal para os dias quentes de verão. Confeccionado em viscose de alta qualidade, proporciona conforto e elegância.",
        details: ["Tecido: Viscose", "Composição: 100% Viscose", "Comprimento: Midi", "Lavagem: Lavagem à mão"],
        images: ["🌺", "🌸", "💐"]
    },
    { 
        id: 2, 
        name: "Blusa Básica Algodão", 
        price: 39.90, 
        category: "blusas",
        description: "Blusa básica em algodão, versátil e confortável. Perfeita para compor looks casuais ou mais elaborados.",
        details: ["Tecido: Algodão", "Composição: 100% Algodão", "Modelagem: Reta", "Lavagem: Máquina"],
        images: ["👚", "⭐", "🔹"]
    },
    { 
        id: 3, 
        name: "Calça Jeans Skinny", 
        price: 119.90, 
        category: "calcas",
        description: "Calça jeans modelo skinny, ajustada ao corpo. Confortável e moderna, ideal para o dia a dia.",
        details: ["Tecido: Jeans", "Composição: 98% Algodão, 2% Elastano", "Modelo: Skinny", "Lavagem: Máquina"],
        images: ["👖", "🔵", "⭐"]
    },
    { 
        id: 4, 
        name: "Saia Midi Plissada", 
        price: 69.90, 
        category: "saias",
        description: "Saia midi com detalhes plissados, elegante e feminina. Perfeita para ocasiões especiais ou para o dia a dia.",
        details: ["Tecido: Poliéster", "Composição: 100% Poliéster", "Comprimento: Midi", "Lavagem: Lavagem à mão"],
        images: ["👗", "✨", "🎀"]
    }
];

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Inicializando Elegance Store...");
    showCatalogPage();
    setupEventListeners();
    setupRealTimeValidation();
    updateCart();
});

// ===== SISTEMA DE PÁGINAS =====
function showCatalogPage() {
    currentPage = 'catalog';
    document.querySelector('header').style.display = 'block';
    document.querySelector('.hero').style.display = 'block';
    document.querySelector('#products').style.display = 'block';
    document.querySelector('footer').style.display = 'block';
    
    const productPage = document.getElementById('productPage');
    if (productPage) productPage.remove();
    
    initializeProducts();
}

function showProductPage(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    currentPage = 'product';
    document.querySelector('.hero').style.display = 'none';
    document.querySelector('#products').style.display = 'none';
    document.querySelector('footer').style.display = 'none';
    
    const existingPage = document.getElementById('productPage');
    if (existingPage) existingPage.remove();
    
    createProductPage(product);
}

function createProductPage(product) {
    const productPage = document.createElement('div');
    productPage.id = 'productPage';
    productPage.className = 'product-page';
    productPage.innerHTML = `
        <div class="product-gallery">
            <div class="carousel">
                ${product.images[0]}
            </div>
            <div class="carousel-nav">
                ${product.images.map((_, index) => `
                    <button class="carousel-dot ${index === 0 ? 'active' : ''}"></button>
                `).join('')}
            </div>
        </div>
        
        <div class="product-info">
            <h1>${product.name}</h1>
            <div class="product-price">R$ ${product.price.toFixed(2)}</div>
            
            <div class="product-description">
                <p>${product.description}</p>
            </div>
            
            <div class="product-specs">
                <h3>Detalhes do Produto</h3>
                <ul>
                    ${product.details.map(detail => `<li>${detail}</li>`).join('')}
                </ul>
            </div>
            
            <div class="product-actions">
                <button class="btn-add-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-bag"></i> Adicionar ao Carrinho
                </button>
                <button class="btn-back" onclick="showCatalogPage()">
                    <i class="fas fa-arrow-left"></i> Voltar ao Catálogo
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(productPage);
}

// ===== CATÁLOGO =====
function initializeProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" onclick="showProductPage(${product.id})">
            <div class="product-image">
                ${product.images[0]}
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">R$ ${product.price.toFixed(2)}</div>
                <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">
                    <i class="fas fa-shopping-bag"></i> Adicionar ao Carrinho
                </button>
            </div>
        </div>
    `).join('');
}

// ===== CARRINHO FUNCIONAL =====
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.images[0]
        });
    }
    
    localStorage.setItem('eleganceCart', JSON.stringify(cart));
    updateCart();
    showNotification('✅ Produto adicionado ao carrinho!');
}

function updateCart() {
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (!cartItems || !cartTotal) return;

    // Atualiza contador
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;

    // Atualiza lista de itens
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 40px; color: #777;">Seu carrinho está vazio.</p>';
        if (checkoutBtn) checkoutBtn.disabled = true;
        cartTotal.textContent = 'R$ 0,00';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    ${item.image}
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">R$ ${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn plus" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (checkoutBtn) checkoutBtn.disabled = false;
        cartTotal.textContent = `R$ ${total.toFixed(2)}`;
    }
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;
    
    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
    }
    
    localStorage.setItem('eleganceCart', JSON.stringify(cart));
    updateCart();
}

function toggleCart() {
    const cartModal = document.getElementById('cartModal');
    const overlay = document.getElementById('overlay');
    
    if (cartModal.classList.contains('active')) {
        cartModal.classList.remove('active');
        overlay.classList.remove('active');
    } else {
        cartModal.classList.add('active');
        overlay.classList.add('active');
    }
}

// ===== SISTEMA DE COMPRAS =====
function openPaymentModal() {
    if (cart.length === 0) {
        showNotification('❌ Seu carrinho está vazio!');
        return;
    }
    
    // Abre modal de cadastro primeiro
    openRegisterModal();
}

function openRegisterModal() {
    document.getElementById('registerModal').classList.add('active');
}

function closeRegisterModal() {
    document.getElementById('registerModal').classList.remove('active');
}

function handleRegistration() {
    if (!validateForm()) {
        showNotification('❌ Preencha todos os campos corretamente!');
        return;
    }
    
    const formData = new FormData(document.getElementById('registerForm'));
    
    user = {
        name: formData.get('name'),
        email: formData.get('email'),
        cep: formData.get('cep'),
        phone: formData.get('phone'),
        address: `${formData.get('rua')}, ${formData.get('numero')} - ${formData.get('bairro')}`,
        city: formData.get('cidade'),
        state: formData.get('estado')
    };
    
    closeRegisterModal();
    openFinalPaymentModal();
    showNotification('✅ Cadastro realizado! Finalize seu pedido.');
}

function openFinalPaymentModal() {
    // Atualiza resumo do pedido
    const orderItems = document.getElementById('orderItems');
    const orderTotal = document.getElementById('orderTotal');
    
    let itemsHTML = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        itemsHTML += `
            <div class="order-item">
                ${item.name} - R$ ${item.price.toFixed(2)} x ${item.quantity} = R$ ${itemTotal.toFixed(2)}
            </div>
        `;
    });
    
    const total = subtotal + shippingCost;
    orderItems.innerHTML = itemsHTML;
    orderTotal.textContent = `R$ ${total.toFixed(2)}`;
    
    document.getElementById('paymentModal').classList.add('active');
}

function closePaymentModal() {
    document.getElementById('paymentModal').classList.remove('active');
}

function sendWhatsAppOrder() {
    if (!selectedPaymentMethod) {
        showNotification('❌ Selecione uma forma de pagamento!');
        return;
    }
    
    if (!user) {
        showNotification('❌ Complete seu cadastro primeiro!');
        openRegisterModal();
        return;
    }
    
    let message = `🛍️ *PEDIDO - ELEGANCE STORE* 🛍️\n\n`;
    message += `👤 *Cliente:* ${user.name}\n`;
    message += `📧 *E-mail:* ${user.email}\n`;
    message += `📞 *Telefone:* ${user.phone}\n`;
    message += `📍 *Endereço:* ${user.address}\n`;
    message += `🏙️ *Cidade:* ${user.city}/${user.state}\n\n`;
    message += `📦 *ITENS DO PEDIDO:*\n`;
    
    let total = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        message += `• ${item.name} - R$ ${item.price.toFixed(2)} x ${item.quantity} = R$ ${itemTotal.toFixed(2)}\n`;
    });
    
    message += `\n🚚 *Frete:* R$ ${shippingCost.toFixed(2)}`;
    message += `\n💰 *Total:* R$ ${(total + shippingCost).toFixed(2)}`;
    message += `\n💳 *Pagamento:* ${getPaymentMethod(selectedPaymentMethod)}`;
    message += `\n\n⏰ *Pedido realizado em:* ${new Date().toLocaleString('pt-BR')}`;
    
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/5511999999999?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');
    
    // Limpa carrinho
    cart = [];
    localStorage.setItemalog' ou 'product'

// ===== LISTA DE PRODUTOS COM IMAGENS =====
const products = [
    { 
        id: 1, 
        name: "Vestido Floral Verão", 
        price: 89.90, 
        category: "vestidos",
        description: "Vestido leve e fluido com estampa floral, ideal para os dias quentes de verão. Confeccionado em viscose de alta qualidade, proporciona conforto e elegância.",
        details: ["Tecido: Viscose", "Composição: 100% Viscose", "Comprimento: Midi", "Lavagem: Lavagem à mão"],
        images: ["🌺", "🌸", "💐"]
    },
    { 
        id: 2, 
        name: "Blusa Básica Algodão", 
        price: 39.90, 
        category: "blusas",
        description: "Blusa básica em algodão, versátil e confortável. Perfeita para compor looks casuais ou mais elaborados.",
        details: ["Tecido: Algodão", "Composição: 100% Algodão", "Modelagem: Reta", "Lavagem: Máquina"],
        images: ["👚", "⭐", "🔹"]
    },
    { 
        id: 3, 
        name: "Calça Jeans Skinny", 
        price: 119.90, 
        category: "calcas",
        description: "Calça jeans modelo skinny, ajustada ao corpo. Confortável e moderna, ideal para o dia a dia.",
        details: ["Tecido: Jeans", "Composição: 98% Algodão, 2% Elastano", "Modelo: Skinny", "Lavagem: Máquina"],
        images: ["👖", "🔵", "⭐"]
    },
    { 
        id: 4, 
        name: "Saia Midi Plissada", 
        price: 69.90, 
        category: "saias",
        description: "Saia midi com detalhes plissados, elegante e feminina. Perfeita para ocasiões especiais ou para o dia a dia.",
        details: ["Tecido: Poliéster", "Composição: 100% Poliéster", "Comprimento: Midi", "Lavagem: Lavagem à mão"],
        images: ["👗", "✨", "🎀"]
    },
    { 
        id: 5, 
        name: "Vestido Midi Elegante", 
        price: 129.90, 
        category: "vestidos",
        description: "Vestido midi elegante com corte impecável. Ideal para eventos formais ou jantares especiais.",
        details: ["Tecido: Cetim", "Composição: 100% Poliéster", "Comprimento: Midi", "Lavagem: Lavagem à mão"],
        images: ["💃", "🌟", "🎭"]
    },
    { 
        id: 6, 
        name: "Blusa Tricot Inverno", 
        price: 79.90, 
        category: "blusas",
        description: "Blusa tricot aconchegante, perfeita para os dias mais frios. Confortável e estilosa.",
        details: ["Tecido: Tricot", "Composição: 70% Algodão, 30% Acrílico", "Modelagem: Amplo", "Lavagem: Lavagem à mão"],
        images: ["🧶", "❄️", "🔥"]
    },
    { 
        id: 7, 
        name: "Calça Wide Leg", 
        price: 99.90, 
        category: "calcas",
        description: "Calça wide leg com caimento perfeito. Tendência fashion que combina conforto e estilo.",
        details: ["Tecido: Linho", "Composição: 100% Linho", "Modelo: Wide Leg", "Lavagem: Máquina"],
        images: ["👖", "🌊", "💫"]
    },
    { 
        id: 8, 
        name: "Saia Curta Jeans", 
        price: 59.90, 
        category: "saias",
        description: "Saia curta em jeans, despojada e jovem. Ideal para looks casuais e divertidos.",
        details: ["Tecido: Jeans", "Composição: 98% Algodão, 2% Elastano", "Comprimento: Curto", "Lavagem: Máquina"],
        images: ["👗", "⭐", "🎸"]
    }
];

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Inicializando Elegance Store...");
    showCatalogPage();
    setupEventListeners();
    setupRealTimeValidation();
});

// ===== SISTEMA DE PÁGINAS =====
function showCatalogPage() {
    currentPage = 'catalog';
    document.body.className = 'catalog-page';
    document.querySelector('header').style.display = 'block';
    document.querySelector('.hero').style.display = 'block';
    document.querySelector('#products').style.display = 'block';
    document.querySelector('footer').style.display = 'block';
    
    // Esconde página de produto se existir
    const productPage = document.getElementById('productPage');
    if (productPage) productPage.remove();
    
    initializeProducts();
    updateCart();
}

function showProductPage(product) {
    currentPage = 'product';
    document.body.className = 'product-page-view';
    document.querySelector('header').style.display = 'block';
    document.querySelector('.hero').style.display = 'none';
    document.querySelector('#products').style.display = 'none';
    document.querySelector('footer').style.display = 'none';
    
    // Remove página anterior se existir
    const existingPage = document.getElementById('productPage');
    if (existingPage) existingPage.remove();
    
    createProductPage(product);
    updateCart();
}

function createProductPage(product) {
    const productPage = document.createElement('div');
    productPage.id = 'productPage';
    productPage.className = 'product-page';
    productPage.innerHTML = `
        <div class="product-gallery">
            <div class="carousel">
                <div class="carousel-track" id="carouselTrack">
                    ${product.images.map((img, index) => `
                        <div class="carousel-slide" data-index="${index}">
                            <div style="font-size: 200px; text-align: center; padding: 50px; background: #f5f5f5; border-radius: 10px;">
                                ${img}
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="carousel-nav">
                    <button class="carousel-btn prev">‹</button>
                    <button class="carousel-btn next">›</button>
                </div>
                <div class="carousel-dots" id="carouselDots">
                    ${product.images.map((_, index) => `
                        <button class="carousel-dot ${index === 0 ? 'active' : ''}" data-index="${index}"></button>
                    `).join('')}
                </div>
            </div>
        </div>
        
        <div class="product-info">
            <h1>${product.name}</h1>
            <div class="product-price">R$ ${product.price.toFixed(2)}</div>
            
            <div class="product-description">
                <h3>Descrição</h3>
                <p>${product.description}</p>
            </div>
            
            <div class="product-specs">
                <h3>Detalhes do Produto</h3>
                <ul>
                    ${product.details.map(detail => `<li>${detail}</li>`).join('')}
                </ul>
            </div>
            
            <div class="product-actions">
                <button class="btn-add-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-shopping-bag"></i> Adicionar ao Carrinho
                </button>
                <button class="btn-back" onclick="showCatalogPage()">
                    <i class="fas fa-arrow-left"></i> Voltar
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(productPage);
    initCarousel();
}

function initCarousel() {
    let currentSlide = 0;
    const track = document.getElementById('carouselTrack');
    const dots = document.querySelectorAll('.carousel-dot');
    const slides = document.querySelectorAll('.carousel-slide');
    const totalSlides = slides.length;

    function updateCarousel() {
        track.style.transform = `translateX(-${currentSlide * 100}%)`;
        dots.forEach(dot => dot.classList.remove('active'));
        dots[currentSlide].classList.add('active');
    }

    // Eventos dos botões
    document.querySelector('.carousel-btn.next').addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    });

    document.querySelector('.carousel-btn.prev').addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    });

    // Eventos dos dots
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            currentSlide = parseInt(dot.getAttribute('data-index'));
            updateCarousel();
        });
    });
}

// ===== CATÁLOGO DE PRODUTOS =====
function initializeProducts() {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    productsGrid.innerHTML = products.map(product => `
        <div class="product-card" onclick="showProductPage(${product.id})">
            <div class="product-image">
                <div style="font-size: 120px; color: #666;">${product.images[0]}</div>
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-category">${product.category}</div>
                <div class="product-price">R$ ${product.price.toFixed(2)}</div>
                <button class="add-to-cart" onclick="event.stopPropagation(); addToCart(${product.id})">
                    Adicionar ao Carrinho
                </button>
            </div>
        </div>
    `).join('');
}

// ===== SISTEMA DE CARRINHO CORRIGIDO =====
function addToCart(productId) {
    const product = typeof productId === 'number' 
        ? products.find(p => p.id === productId)
        : productId;

    if (!product) {
        console.error('Produto não encontrado:', productId);
        return;
    }

    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1,
            image: product.images[0]
        });
    }
    
    localStorage.setItem('eleganceCart', JSON.stringify(cart));
    updateCart();
    showNotification('✅ Produto adicionado ao carrinho!');
}

function updateCart() {
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');

    if (!cartItems || !cartTotal) return;

    // Atualiza contador
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) cartCount.textContent = totalItems;

    // Atualiza lista de itens
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 40px; color: #777;">Seu carrinho está vazio.</p>';
        if (checkoutBtn) checkoutBtn.disabled = true;
        cartTotal.textContent = 'R$ 0,00';
    } else {
        cartItems.innerHTML = cart.map(item => `
            <div class="cart-item">
                <div class="cart-item-image">
                    <div style="font-size: 40px;">${item.image}</div>
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">R$ ${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn plus" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
            </div>
        `).join('');

        const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        if (checkoutBtn) checkoutBtn.disabled = false;
        cartTotal.textContent = `R$ ${total.toFixed(2)}`;
    }
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;
    
    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
    }
    
    localStorage.setItem('eleganceCart', JSON.stringify(cart));
    updateCart();
}

// ===== FUNÇÕES DO CARRINHO =====
function toggleCart() {
    const cartModal = document.getElementById('cartModal');
    const overlay = document.getElementById('overlay');
    
    if (cartModal.classList.contains('active')) {
        cartModal.classList.remove('active');
        overlay.classList.remove('active');
    } else {
        cartModal.classList.add('active');
        overlay.classList.add('active');
    }
}

// ===== RESTANTE DAS FUNÇÕES (mantenha as existentes) =====
function showNotification(message) {
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) existingNotification.remove();

    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed; top: 20px; right: 20px; background: #27ae60; color: white;
        padding: 15px 20px; border-radius: 5px; z-index: 10000; font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15); animation: slideIn 0.3s ease;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ... (mantenha as funções de modal, validação CEP, pagamento, etc. que você já tinha)

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Carrinho
    document.getElementById('cartToggle')?.addEventListener('click', toggleCart);
    document.getElementById('closeCart')?.addEventListener('click', toggleCart);
    document.getElementById('overlay')?.addEventListener('click', toggleCart);
    document.getElementById('checkoutBtn')?.addEventListener('click', openPaymentModal);

    // Tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            if (currentPage === 'product') {
                showCatalogPage();
            } else {
                toggleCart();
            }
        }
    });
}

// Funções auxiliares para buscar produto
function showProductPage(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        createProductPage(product);
    }
}

