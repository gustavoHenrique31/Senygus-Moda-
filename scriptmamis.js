// ===== DADOS DOS PRODUTOS =====
const products = [
    {
        id: 1,
        name: "Vestido Floral Midi",
        category: "vestidos",
        price: 129.90,
        oldPrice: 159.90,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Vestido floral midi perfeito para o verão"
    },
    {
        id: 2,
        name: "Blusa de Seda Branca",
        category: "blusas",
        price: 89.90,
        oldPrice: 119.90,
        image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Blusa de seda branca elegante e confortável"
    },
    {
        id: 3,
        name: "Calça Jeans Skinny",
        category: "calcas",
        price: 149.90,
        oldPrice: null,
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Calça jeans skinny modelo clássico"
    },
    {
        id: 4,
        name: "Saia Plissada Preta",
        category: "saias",
        price: 79.90,
        oldPrice: 99.90,
        image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Saia plissada preta para looks elegantes"
    },
    {
        id: 5,
        name: "Bolsa de Couro Marrom",
        category: "acessorios",
        price: 199.90,
        oldPrice: 249.90,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Bolsa de couro legítimo marrom"
    },
    {
        id: 6,
        name: "Vestido Vermelho Elegante",
        category: "vestidos",
        price: 179.90,
        oldPrice: null,
        image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Vestido vermelho para ocasiões especiais"
    }
];

// ===== VARIÁVEIS GLOBAIS =====
let cart = [];
let user = null;
let selectedPaymentMethod = null;

// Elementos do DOM
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
const orderItems = document.getElementById('orderItems');
const orderTotal = document.getElementById('orderTotal');
const userInfoBtn = document.getElementById('userInfo');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    console.log("Site carregado! Sistema de carrinho funcionando.");
    
    // Verifica se há usuário salvo
    const savedUser = localStorage.getItem('eleganceUser');
    if (savedUser) {
        user = JSON.parse(savedUser);
        console.log("Usuário carregado:", user.name);
    } else {
        // Mostra modal de cadastro após 1 segundo
        setTimeout(() => {
            registerModal.classList.add('active');
            console.log("Modal de cadastro aberto - usuário necessário");
        }, 1000);
    }
    
    // Carrega carrinho salvo
    const savedCart = localStorage.getItem('eleganceCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        console.log("Carrinho carregado com", cart.length, "itens");
        updateCart();
    }
    
    renderProducts();
    setupEventListeners();
});

// ===== RENDERIZAÇÃO DOS PRODUTOS =====
function renderProducts() {
    console.log("Renderizando", products.length, "produtos...");
    
    productsGrid.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                ${product.oldPrice ? '<span class="product-badge">Oferta</span>' : ''}
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">
                    R$ ${product.price.toFixed(2)}
                    ${product.oldPrice ? `<span class="product-old-price">R$ ${product.oldPrice.toFixed(2)}</span>` : ''}
                </div>
                <button class="add-to-cart" data-id="${product.id}">
                    <i class="fas fa-shopping-bag"></i> Adicionar ao Carrinho
                </button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
    
    // Adiciona event listeners aos botões de adicionar ao carrinho
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            console.log("Adicionando produto ID:", productId);
            addToCart(productId);
        });
    });
    
    console.log("Produtos renderizados com sucesso!");
}

// ===== SISTEMA DE CARRINHO =====
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
        console.log("Quantidade aumentada para:", existingItem.quantity);
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
        console.log("Novo produto adicionado:", product.name);
    }
    
    updateCart();
    showNotification('✅ Produto adicionado ao carrinho!');
}

function removeFromCart(productId) {
    const productName = cart.find(item => item.id === productId)?.name;
    cart = cart.filter(item => item.id !== productId);
    console.log("Produto removido:", productName);
    updateCart();
    showNotification('🗑️ Produto removido do carrinho');
}

function updateCartQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        console.log("Quantidade atualizada:", item.name, "->", newQuantity);
        updateCart();
    }
}

function updateCart() {
    // Salva carrinho no localStorage
    localStorage.setItem('eleganceCart', JSON.stringify(cart));
    
    // Atualiza a contagem do carrinho
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    console.log("Itens no carrinho:", totalItems);
    
    // Atualiza os itens do carrinho no modal
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 40px; color: #777;">Seu carrinho está vazio.</p>';
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
                    <button class="remove-item" data-id="${item.id}" title="Remover item">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });
    
    cartTotal.textContent = `R$ ${totalPrice.toFixed(2)}`;
    console.log("Total do carrinho: R$", totalPrice.toFixed(2));
    
    // Adiciona event listeners aos controles de quantidade
    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', function
