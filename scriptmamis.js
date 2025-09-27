let cart = JSON.parse(localStorage.getItem('eleganceCart')) || [];
let user = null;
let selectedPaymentMethod = null;
let shippingCost = 0;
let userState = '';
let userCity = '';
let userAddress = '';

// ===== LISTA DE PRODUTOS =====
const products = [
    { 
        id: 1, 
        name: "Vestido Floral Verão", 
        price: 89.90, 
        category: "vestidos",
        description: "Vestido leve e fluido com estampa floral, ideal para os dias quentes de verão. Confeccionado em viscose de alta qualidade, proporciona conforto e elegância.",
        details: ["Tecido: Viscose", "Composição: 100% Viscose", "Comprimento: Midi", "Lavagem: Lavagem à mão"]
    },
    { 
        id: 2, 
        name: "Blusa Básica Algodão", 
        price: 39.90, 
        category: "blusas",
        description: "Blusa básica em algodão, versátil e confortável. Perfeita para compor looks casuais ou mais elaborados.",
        details: ["Tecido: Algodão", "Composição: 100% Algodão", "Modelagem: Reta", "Lavagem: Máquina"]
    },
    { 
        id: 3, 
        name: "Calça Jeans Skinny", 
        price: 119.90, 
        category: "calcas",
        description: "Calça jeans modelo skinny, ajustada ao corpo. Confortável e moderna, ideal para o dia a dia.",
        details: ["Tecido: Jeans", "Composição: 98% Algodão, 2% Elastano", "Modelo: Skinny", "Lavagem: Máquina"]
    },
    { 
        id: 4, 
        name: "Saia Midi Plissada", 
        price: 69.90, 
        category: "saias",
        description: "Saia midi com detalhes plissados, elegante e feminina. Perfeita para ocasiões especiais ou para o dia a dia.",
        details: ["Tecido: Poliéster", "Composição: 100% Poliéster", "Comprimento: Midi", "Lavagem: Lavagem à mão"]
    },
    { 
        id: 5, 
        name: "Vestido Midi Elegante", 
        price: 129.90, 
        category: "vestidos",
        description: "Vestido midi elegante com corte impecável. Ideal para eventos formais ou jantares especiais.",
        details: ["Tecido: Cetim", "Composição: 100% Poliéster", "Comprimento: Midi", "Lavagem: Lavagem à mão"]
    },
    { 
        id: 6, 
        name: "Blusa Tricot Inverno", 
        price: 79.90, 
        category: "blusas",
        description: "Blusa tricot aconchegante, perfeita para os dias mais frios. Confortável e estilosa.",
        details: ["Tecido: Tricot", "Composição: 70% Algodão, 30% Acrílico", "Modelagem: Amplo", "Lavagem: Lavagem à mão"]
    },
    { 
        id: 7, 
        name: "Calça Wide Leg", 
        price: 99.90, 
        category: "calcas",
        description: "Calça wide leg com caimento perfeito. Tendência fashion que combina conforto e estilo.",
        details: ["Tecido: Linho", "Composição: 100% Linho", "Modelo: Wide Leg", "Lavagem: Máquina"]
    },
    { 
        id: 8, 
        name: "Saia Curta Jeans", 
        price: 59.90, 
        category: "saias",
        description: "Saia curta em jeans, despojada e jovem. Ideal para looks casuais e divertidos.",
        details: ["Tecido: Jeans", "Composição: 98% Algodão, 2% Elastano", "Comprimento: Curto", "Lavagem: Máquina"]
    }
];

// ===== INICIALIZAÇÃO CORRIGIDA =====
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Inicializando Elegance Store...");
    
    // Verifica se os elementos existem antes de inicializar
    if (document.getElementById('productsGrid')) {
        initializeProducts();
    }
    
    if (document.getElementById('cartItems')) {
        updateCart();
    }
    
    setupEventListeners();
    setupRealTimeValidation();
    
    console.log("✅ Sistema inicializado com sucesso!");
});

// ===== PRODUTOS CORRIGIDO =====
function initializeProducts() {
    const productsGrid = document.getElementById('productsGrid');
    
    if (!productsGrid) {
        console.error("❌ Elemento productsGrid não encontrado!");
        return;
    }
    
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <i class="fas fa-tshirt"></i>
            </div>
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-price">R$ ${product.price.toFixed(2)}</div>
                <div class="product-actions">
                    <button class="view-details-btn" data-id="${product.id}">Ver Detalhes</button>
                    <button class="add-to-cart" data-id="${product.id}">Adicionar ao Carrinho</button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
    
    // Adiciona eventos aos botões - CORRIGIDO
    setTimeout(() => {
        document.querySelectorAll('.add-to-cart').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                const product = products.find(p => p.id === productId);
                if (product) {
                    addToCart(product);
                }
            });
        });
        
        document.querySelectorAll('.view-details-btn').forEach(button => {
            button.addEventListener('click', function() {
                const productId = parseInt(this.getAttribute('data-id'));
                const product = products.find(p => p.id === productId);
                if (product) {
                    showProductDetails(product);
                }
            });
        });
    }, 100);
}

// ===== CARRINHO CORRIGIDO =====
function updateCart() {
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (!cartItems || !cartTotal) {
        console.error("❌ Elementos do carrinho não encontrados!");
        return;
    }
    
    // Atualiza contador
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    if (cartCount) {
        cartCount.textContent = totalItems;
    }
    
    // Atualiza lista de itens
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 40px; color: #777;">Seu carrinho está vazio.</p>';
        if (checkoutBtn) checkoutBtn.disabled = true;
        cartTotal.textContent = 'R$ 0,00';
    } else {
        cartItems.innerHTML = '';
        let total = 0;
        
        cart.forEach(item => {
            const itemTotal = item.price * item.quantity;
            total += itemTotal;
            
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <i class="fas fa-tshirt"></i>
                </div>
                <div class="cart-item-details">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">R$ ${item.price.toFixed(2)}</div>
                    <div class="cart-item-quantity">
                        <button class="quantity-btn minus" data-id="${item.id}">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn plus" data-id="${item.id}">+</button>
                    </div>
                </div>
            `;
            cartItems.appendChild(cartItem);
        });
        
        // Adiciona eventos aos botões de quantidade - CORRIGIDO
        setTimeout(() => {
            document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = parseInt(this.getAttribute('data-id'));
                    updateQuantity(id, -1);
                });
            });
            
            document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
                btn.addEventListener('click', function() {
                    const id = parseInt(this.getAttribute('data-id'));
                    updateQuantity(id, 1);
                });
            });
        }, 100);
        
        if (checkoutBtn) checkoutBtn.disabled = false;
        cartTotal.textContent = `R$ ${total.toFixed(2)}`;
    }
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }
    
    localStorage.setItem('eleganceCart', JSON.stringify(cart));
    updateCart();
    showNotification('✅ Produto adicionado ao carrinho!');
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    
    if (item) {
        item.quantity += change;
        
        if (item.quantity <= 0) {
            cart = cart.filter(item => item.id !== productId);
        }
        
        localStorage.setItem('eleganceCart', JSON.stringify(cart));
        updateCart();
    }
}

// ===== MODAL DE DETALHES DO PRODUTO =====
function showProductDetails(product) {
    const productModal = document.getElementById('productModal');
    const productDetails = document.getElementById('productDetails');
    
    if (!productModal || !productDetails) {
        console.error("❌ Modal de detalhes não encontrado!");
        return;
    }
    
    productDetails.innerHTML = `
        <div class="product-detail-image">
            <i class="fas fa-tshirt"></i>
        </div>
        <div class="product-detail-info">
            <h2>${product.name}</h2>
            <div class="product-detail-price">R$ ${product.price.toFixed(2)}</div>
            <div class="product-detail-description">
                <h3>Descrição</h3>
                <p>${product.description}</p>
            </div>
            <div class="product-detail-specs">
                <h3>Detalhes do Produto</h3>
                <ul>
                    ${product.details.map(detail => `<li>${detail}</li>`).join('')}
                </ul>
            </div>
            <div class="product-detail-actions">
                <button class="add-to-cart-from-detail" data-id="${product.id}">Adicionar ao Carrinho</button>
            </div>
        </div>
    `;
    
    // Adiciona evento ao botão de adicionar ao carrinho no modal
    setTimeout(() => {
        const addButton = productDetails.querySelector('.add-to-cart-from-detail');
        if (addButton) {
            addButton.addEventListener('click', function() {
                addToCart(product);
                closeProductModal();
            });
        }
    }, 100);
    
    productModal.classList.add('active');
}

function closeProductModal() {
    const productModal = document.getElementById('productModal');
    if (productModal) {
        productModal.classList.remove('active');
    }
}

// ===== NOTIFICAÇÕES =====
function showNotification(message) {
    // Remove notificação anterior se existir
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
    `;
    
    document.body.appendChild(notification);
    
    // Remove após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// ===== RESTANTE DO CÓDIGO PERMANECE IGUAL =====
// ... (o restante do código das funções de modais, validação, CEP, etc.)

// ===== EVENT LISTENERS CORRIGIDO =====
function setupEventListeners() {
    // Modal de cadastro
    const registerClose = document.querySelector('#registerModal .close-modal');
    if (registerClose) {
        registerClose.addEventListener('click', closeRegisterModal);
    }
    
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegistration();
        });
    }
    
    // Modal de pagamento
    const paymentClose = document.querySelector('#paymentModal .close-modal');
    if (paymentClose) {
        paymentClose.addEventListener('click', closePaymentModal);
    }
    
    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', function() {
            selectedPaymentMethod = this.getAttribute('data-method');
            document.querySelectorAll('.payment-option').forEach(opt => {
                opt.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    const confirmPayment = document.getElementById('confirmPayment');
    if (confirmPayment) {
        confirmPayment.addEventListener('click', sendWhatsAppOrder);
    }
    
    // Modal de produto
    const productClose = document.querySelector('#productModal .close-modal');
    if (productClose) {
        productClose.addEventListener('click', closeProductModal);
    }
    
    // Carrinho
    const cartToggle = document.getElementById('cartToggle');
    if (cartToggle) {
        cartToggle.addEventListener('click', toggleCart);
    }
    
    const closeCart = document.getElementById('closeCart');
    if (closeCart) {
        closeCart.addEventListener('click', toggleCart);
    }
    
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.addEventListener('click', function() {
            toggleCart();
            closeProductModal();
        });
    }
    
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', openPaymentModal);
    }
    
    // Fecha modais com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeRegisterModal();
            closePaymentModal();
            closeProductModal();
            const cartModal = document.getElementById('cartModal');
            if (cartModal && cartModal.classList.contains('active')) {
                toggleCart();
            }
        }
    });
}

// ===== FUNÇÃO TOGGLE CART =====
function toggleCart() {
    const cartModal = document.getElementById('cartModal');
    const overlay = document.getElementById('overlay');
    
    if (cartModal && overlay) {
        if (cartModal.classList.contains('active')) {
            cartModal.classList.remove('active');
            overlay.classList.remove('active');
        } else {
            cartModal.classList.add('active');
            overlay.classList.add('active');
        }
    }
}

// ... (mantenha o restante das funções como estava)
