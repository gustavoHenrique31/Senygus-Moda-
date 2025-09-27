// ===== DADOS DOS PRODUTOS FEMININOS =====
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
        name: "Vestido Vermelho Elegante",
        category: "vestidos",
        price: 179.90,
        oldPrice: null,
        image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Vestido vermelho para ocasiões especiais"
    },
    {
        id: 6,
        name: "Blusa Listrada Marinho",
        category: "blusas",
        price: 69.90,
        oldPrice: 89.90,
        image: "https://images.unsplash.com/photo-1525171254930-643fc8b95d0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Blusa listrada estilo marinho"
    },
    {
        id: 7,
        name: "Calça Alfaiataria Bege",
        category: "calcas",
        price: 159.90,
        oldPrice: 189.90,
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Calça alfaiataria bege profissional"
    },
    {
        id: 8,
        name: "Saia Midi Evasê",
        category: "saias",
        price: 99.90,
        oldPrice: 129.90,
        image: "https://images.unsplash.com/photo-1506629905607-47d30b8c4c3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Saia midi evasê fluída e confortável"
    },
    {
        id: 9,
        name: "Vestido Preto Casual",
        category: "vestidos",
        price: 139.90,
        oldPrice: 169.90,
        image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Vestido preto básico para o dia a dia"
    },
    {
        id: 10,
        name: "Blusa Manga Longa Rosa",
        category: "blusas",
        price: 79.90,
        oldPrice: null,
        image: "https://images.unsplash.com/photo-1485231183945-fffde5e37a04?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Blusa manga longa cor rosa pastel"
    },
    {
        id: 11,
        name: "Calça Wide Leg Preta",
        category: "calcas",
        price: 189.90,
        oldPrice: 219.90,
        image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Calça wide leg estilo anos 90"
    },
    {
        id: 12,
        name: "Saia Jeans Desbotada",
        category: "saias",
        price: 89.90,
        oldPrice: 109.90,
        image: "https://images.unsplash.com/photo-1506629905607-47d30b8c4c3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Saia jeans desbotada casual"
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

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Site Elegance carregado!");
    
    // Verifica se há usuário salvo
    const savedUser = localStorage.getItem('eleganceUser');
    if (savedUser) {
        user = JSON.parse(savedUser);
        console.log("👤 Usuário carregado:", user.name);
    } else {
        // Mostra modal de cadastro
        setTimeout(() => {
            registerModal.classList.add('active');
            console.log("📝 Modal de cadastro aberto");
        }, 1500);
    }
    
    // Carrega carrinho salvo
    const savedCart = localStorage.getItem('eleganceCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        console.log("🛒 Carrinho carregado com", cart.length, "itens");
        updateCart();
    }
    
    renderProducts();
    setupEventListeners();
});

// ===== RENDERIZAÇÃO DOS PRODUTOS =====
function renderProducts() {
    console.log("🎨 Renderizando", products.length, "produtos femininos...");
    
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
                <p class="product-category">${product.category}</p>
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
    
    // Event listeners para os botões de adicionar ao carrinho
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            console.log("➕ Adicionando produto ID:", productId);
            addToCart(productId);
        });
    });
    
    console.log("✅ Produtos renderizados com sucesso!");
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
        console.log("📦 Quantidade aumentada:", existingItem.name, "->", existingItem.quantity);
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
        console.log("🆕 Novo produto adicionado:", product.name);
    }
    
    updateCart();
    showNotification('✅ ' + product.name + ' adicionado ao carrinho!');
}

function removeFromCart(productId) {
    const productName = cart.find(item => item.id === productId)?.name;
    cart = cart.filter(item => item.id !== productId);
    console.log("🗑️ Produto removido:", productName);
    updateCart();
    showNotification('🗑️ ' + productName + ' removido
