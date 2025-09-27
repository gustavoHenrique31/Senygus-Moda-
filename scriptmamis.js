// ===== DADOS DOS PRODUTOS =====
const products = [
    {
        id: 1,
        name: "Vestido Floral Midi",
        category: "vestidos",
        price: 129.90,
        oldPrice: 159.90,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 2,
        name: "Blusa de Seda Branca",
        category: "blusas",
        price: 89.90,
        oldPrice: 119.90,
        image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 3,
        name: "Calça Jeans Skinny",
        category: "calcas",
        price: 149.90,
        oldPrice: null,
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 4,
        name: "Saia Plissada Preta",
        category: "saias",
        price: 79.90,
        oldPrice: 99.90,
        image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 5,
        name: "Bolsa de Couro Marrom",
        category: "acessorios",
        price: 199.90,
        oldPrice: 249.90,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 6,
        name: "Vestido Vermelho Elegante",
        category: "vestidos",
        price: 179.90,
        oldPrice: null,
        image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 7,
        name: "Blusa Listrada Azul",
        category: "blusas",
        price: 69.90,
        oldPrice: 89.90,
        image: "https://images.unsplash.com/photo-1525171254930-643fc8b95d0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 8,
        name: "Calça Alfaiataria Bege",
        category: "calcas",
        price: 159.90,
        oldPrice: 189.90,
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80"
    }
];

// ===== VARIÁVEIS GLOBAIS =====
let cart = [];
let user = null;
let selectedPaymentMethod = null;
const productsGrid = document.getElementById('productsGrid');
const cartModal = document.getElementById('cartModal');
const overlay = document.getElementById('overlay');
const cartToggle = document.getElementById('cartToggle');
const closeCart = document.getElementById('closeCart');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const cartCount = document.querySelector('.cart-count');
const checkoutBtn = document.getElementById('checkoutBtn');
const registerModal = document.getElementById('registerModal');
const registerForm = document.getElementById('registerForm');
const paymentModal = document.getElementById('paymentModal');
const paymentOptions = document.querySelectorAll('.payment-option');
const confirmPaymentBtn = document.getElementById('confirmPayment');
const closeModals = document.querySelectorAll('.close-modal');
const userInfoBtn = document.getElementById('userInfo');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    // Verifica se há usuário salvo
    const savedUser = localStorage.getItem('eleganceUser');
    if (savedUser) {
        user = JSON.parse(savedUser);
    } else {
        // Mostra modal de cadastro se não houver usuário
        setTimeout(() => {
            registerModal.classList.add('active');
        }, 1000);
    }
    
    // Carrega carrinho salvo
    const savedCart = localStorage.getItem('eleganceCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
    
    renderProducts();
    setupEventListeners();
});

// ===== RENDERIZAÇÃO DOS PRODUTOS =====
function renderProducts() {
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}">
                ${product.oldPrice ? '<span class="product-badge">Oferta</span>' : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <div class="product-price">
                    R$ ${product.price.toFixed(2)}
                    ${product.oldPrice ? `<span class="product-old-price">R$ ${product.oldPrice.toFixed(2)}</span>` : ''}
                </div>
                <button class="add-to-cart" data-id="${product.id}">Adicionar ao Carrinho</button>
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
    if (!user) {
        alert('Por favor, faça seu cadastro antes de adicionar produtos ao carrinho.');
        registerModal.classList.add('active');
        return;
    }
    
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
    // Salva carrinho no localStorage
    localStorage.setItem('eleganceCart', JSON.stringify(cart));
    
    // Atualiza a contagem do carrinho
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Atualiza os itens do carrinho no modal
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 40px;">Seu carrinho está vazio.</p>';
        cartTotal.textContent = 'R$ 0,00';
        checkoutBtn.disabled = true;
        return;
    }
    
    checkoutBtn.disabled = false;
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

// ===== CADASTRO DE USUÁRIO =====
registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    user = {
        name: formData.get('name'),
        email: formData.get('email'),
        cep: formData.get('cep'),
        phone: formData.get('phone')
    };
    
    // Salva usuário no localStorage
    localStorage.setItem('eleganceUser', JSON.stringify(user));
    
    registerModal.classList.remove('active');
    showNotification('Cadastro realizado com sucesso!');
});

// ===== SELEÇÃO DE PAGAMENTO =====
paymentOptions.forEach(option => {
    option.addEventListener('click', function() {
        // Remove classe active de todas as opções
        paymentOptions.forEach(opt => opt.classList.remove('active'));
        // Adiciona classe active à opção selecionada
        this.classList.add('active');
        
        selectedPaymentMethod = this.getAttribute('data-method');
        confirmPaymentBtn.disabled = false;
        
        // Mostra integração com gateway de pagamento
        const gateway = document.getElementById('paymentGateway');
        gateway.classList.add('active');
        gateway.innerHTML = getPaymentGatewayHTML(selectedPaymentMethod);
    });
});

function getPaymentGatewayHTML(method) {
    // Esta função simula a integração com gateways de pagamento reais
    // Em um ambiente real, você integraria com SDKs como:
    // - Mercado Pago: https://www.mercadopago.com.br/developers/pt/docs/checkout-bricks
    // - PagSeguro: https://dev.pagseguro.uol.com.br/reference/pagseguro-checkout
    // - Stripe: https://stripe.com/docs/payments/accept-a-payment
    
    let html = '<h3>Integração com Gateway de Pagamento</h3>';
    
    switch(method) {
        case 'credit':
            html += `
                <p>Para integrar com cartão de crédito, você pode usar:</p>
                <ul>
                    <li><strong>Mercado Pago:</strong> Inclua o SDK e use a função mp.checkout()</li>
                    <li><strong>PagSeguro:</strong> Use a API de pagamentos transparente</li
