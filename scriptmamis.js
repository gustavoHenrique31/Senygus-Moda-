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
    }
];

// ===== VARIÁVEIS GLOBAIS =====
let cart = [];
let user = null;
let selectedPaymentMethod = null;

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
            document.getElementById('registerModal').classList.add('active');
            console.log("📝 Modal de cadastro aberto");
        }, 1000);
    }
    
    // Carrega carrinho salvo
    const savedCart = localStorage.getItem('eleganceCart');
    if (savedCart) {
        cart = JSON.parse(savedCadivert);
        console.log("🛒 Carrinho carregado com", cart.length, "itens");
        updateCart();
    }
    
    renderProducts();
    setupEventListeners();
});

// ===== RENDERIZAÇÃO DOS PRODUTOS =====
function renderProducts() {
    console.log("🎨 Renderizando", products.length, "produtos femininos...");
    
    const productsGrid = document.getElementById('productsGrid');
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
        document.getElementById('registerModal').classList.add('active');
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
    showNotification('🗑️ ' + productName + ' removido do carrinho');
}

function updateCartQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity = newQuantity;
        console.log("🔢 Quantidade atualizada:", item.name, "->", newQuantity);
        updateCart();
    }
}

function updateCart() {
    // Salva carrinho no localStorage
    localStorage.setItem('eleganceCart', JSON.stringify(cart));
    
    // Atualiza a contagem do carrinho
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.querySelector('.cart-count').textContent = totalItems;
    console.log("🛒 Itens no carrinho:", totalItems);
    
    // Atualiza os itens do carrinho no modal
    const cartItems = document.getElementById('cartItems');
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 40px; color: #777;">Seu carrinho está vazio.</p>';
        document.getElementById('cartTotal').textContent = 'R$ 0,00';
        document.getElementById('checkoutBtn').disabled = true;
        return;
    }
    
    document.getElementById('checkoutBtn').disabled = false;
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
    
    document.getElementById('cartTotal').textContent = `R$ ${totalPrice.toFixed(2)}`;
    console.log("💰 Total do carrinho: R$", totalPrice.toFixed(2));
    
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
function setupEventListeners() {
    // Formulário de cadastro
    document.getElementById('registerForm').addEventListener('submit', function(e) {
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
        
        document.getElementById('registerModal').classList.remove('active');
        showNotification('✅ Cadastro realizado com sucesso!');
        console.log("👤 Novo usuário cadastrado:", user.name);
    });

    // Carrinho - Abrir/Fechar
    document.getElementById('cartToggle').addEventListener('click', function() {
        if (!user) {
            alert('Por favor, faça seu cadastro antes de visualizar o carrinho.');
            document.getElementById('registerModal').classList.add('active');
            return;
        }
        
        document.getElementById('cartModal').classList.add('active');
        document.getElementById('overlay').classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    document.getElementById('closeCart').addEventListener('click', closeCartModal);
    document.getElementById('overlay').addEventListener('click', closeCartModal);

    // Finalizar compra
    document.getElementById('checkoutBtn').addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }
        
        closeCartModal();
        openPaymentModal();
    });

    // Opções de pagamento
    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', function() {
            // Remove classe active de todas as opções
            document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('active'));
            // Adiciona classe active à opção selecionada
            this.classList.add('active');
            
            selectedPaymentMethod = this.getAttribute('data-method');
            document.getElementById('confirmPayment').disabled = false;
            
            console.log("💳 Método de pagamento selecionado:", selectedPaymentMethod);
        });
    });

    // Confirmar pedido
    document.getElementById('confirmPayment').addEventListener('click', function() {
        if (!selectedPaymentMethod) {
            alert('Por favor, selecione uma forma de pagamento.');
            return;
        }
        
        sendWhatsAppOrder();
    });

    // Fechar modais
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
        });
    });
}

function closeCartModal() {
    document.getElementById('cartModal').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function openPaymentModal() {
    // Atualiza resumo do pedido
    const orderItems = document.getElementById('orderItems');
    const orderTotal = document.getElementById('orderTotal');
    
    let itemsHTML = '';
    let totalPrice = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        itemsHTML += `
            <div class="order-item">
                <span>${item.name} x${item.quantity}</span>
                <span>R$ ${itemTotal.toFixed(2)}</span>
            </div>
        `;
    });
    
    orderItems.innerHTML = itemsHTML;
    orderTotal.textContent = `R$ ${totalPrice.toFixed(2)}`;
    
    // Reseta seleção de pagamento
    document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('active'));
    document.getElementById('confirmPayment').disabled = true;
    selectedPaymentMethod = null;
    
    document.getElementById('paymentModal').classList.add('active');
}

function sendWhatsAppOrder() {
    if (!user || cart.length === 0 || !selectedPaymentMethod) {
        alert('Erro ao processar pedido. Verifique seus dados.');
        return;
    }
    
    // Número do WhatsApp da loja (substitua pelo número real)
    const phoneNumber = '5511999999999';
    
    // Monta a mensagem
    let message = `*NOVO PEDIDO - ELEGANCE*%0A%0A`;
    message += `*Cliente:* ${user.name}%0A`;
    message += `*E-mail:* ${user.email}%0A`;
    message += `*Telefone:* ${user.phone}%0A`;
    message += `*CEP:* ${user.cep}%0A%0A`;
    message += `*Itens do Pedido:*%0A`;
    
    let totalPrice = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        totalPrice += itemTotal;
        message += `• ${item.name} - R$ ${item.price.toFixed(2)} x ${item.quantity} = R$ ${itemTotal.toFixed(2)}%0A`;
    });
    
    message += `%0A*Total:* R$ ${totalPrice.toFixed(2)}%0A`;
    message += `*Pagamento:* ${getPaymentMethodName(selectedPaymentMethod)}%0A%0A`;
    message += `*Data:* ${new Date().toLocaleDateString('pt-BR')}`;
    
    // Abre o WhatsApp
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappURL, '_blank');
    
    // Limpa carrinho após pedido
    cart = [];
    localStorage.removeItem('eleganceCart');
    updateCart();
    
    document.getElementById('paymentModal').classList.remove('active');
    showNotification('✅ Pedido enviado para WhatsApp!');
    
    console.log("📱 Pedido enviado via WhatsApp");
}

function getPaymentMethodName(method) {
    const methods = {
        'credit': 'Cartão de Crédito',
        'debit': 'Cartão de Débito',
        'pix': 'PIX'
    };
    return methods[method] || method;
}

function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: #000;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        z-index: 2000;
        transform: translateX(150%);
        transition: transform 0.3s ease;
        font-weight: 500;
    `;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}
