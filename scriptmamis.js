// ===== DADOS DOS PRODUTOS FEMININOS =====
const products = [
    {
        id: 1,
        name: "Vestido Floral Midi",
        category: "vestidos",
        price: 129.90,
        oldPrice: 159.90,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Vestido floral midi perfeito para o verão",
        weight: 0.3
    },
    {
        id: 2,
        name: "Blusa de Seda Branca",
        category: "blusas",
        price: 89.90,
        oldPrice: 119.90,
        image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Blusa de seda branca elegante e confortável",
        weight: 0.2
    },
    {
        id: 3,
        name: "Calça Jeans Skinny",
        category: "calcas",
        price: 149.90,
        oldPrice: null,
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Calça jeans skinny modelo clássico",
        weight: 0.5
    },
    {
        id: 4,
        name: "Saia Plissada Preta",
        category: "saias",
        price: 79.90,
        oldPrice: 99.90,
        image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Saia plissada preta para looks elegantes",
        weight: 0.25
    },
    {
        id: 5,
        name: "Vestido Vermelho Elegante",
        category: "vestidos",
        price: 179.90,
        oldPrice: null,
        image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Vestido vermelho para ocasiões especiais",
        weight: 0.4
    },
    {
        id: 6,
        name: "Blusa Listrada Azul",
        category: "blusas",
        price: 69.90,
        oldPrice: 89.90,
        image: "https://images.unsplash.com/photo-1525171254930-643fc8b95d0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Blusa listrada azul marinho",
        weight: 0.2
    },
    {
        id: 7,
        name: "Calça Alfaiataria Bege",
        category: "calcas",
        price: 159.90,
        oldPrice: 189.90,
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Calça alfaiataria bege profissional",
        weight: 0.6
    },
    {
        id: 8,
        name: "Saia Midi Evasê",
        category: "saias",
        price: 99.90,
        oldPrice: 129.90,
        image: "https://images.unsplash.com/photo-1506629905607-47d30b8c4c3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        description: "Saia midi evasê fluída e confortável",
        weight: 0.3
    }
];

// ===== CONFIGURAÇÕES DA LOJA =====
const storeConfig = {
    cep: "13214203",
    phone: "(11) 99999-9999",
    freightRates: {
        sp: 15.00,
        sul: 25.00,
        sudeste: 20.00,
        centro: 30.00,
        nordeste: 35.00,
        norte: 45.00
    }
};

// ===== VARIÁVEIS GLOBAIS =====
let cart = [];
let user = null;
let selectedPaymentMethod = null;
let shippingCost = 0;
let userState = '';

// ===== INICIALIZAÇÃO PRINCIPAL =====
document.addEventListener('DOMContentLoaded', function() {
    console.log("=== ELEGANCE - SISTEMA INICIADO ===");
    
    // 1. Primeiro: Renderiza os produtos IMEDIATAMENTE
    renderProducts();
    
    // 2. Configura validações
    setupRealTimeValidation();
    
    // 3. Carrega dados salvos
    loadSavedData();
    
    // 4. Configura event listeners
    setupEventListeners();
    
    console.log("✅ Sistema totalmente carregado e funcionando!");
});

// ===== FUNÇÃO PRINCIPAL DE RENDERIZAÇÃO DE PRODUTOS =====
function renderProducts() {
    console.log("🔄 Renderizando produtos...");
    
    const productsGrid = document.getElementById('productsGrid');
    
    if (!productsGrid) {
        console.error("❌ ERRO: Elemento productsGrid não encontrado!");
        return;
    }
    
    // Limpa o grid
    productsGrid.innerHTML = '';
    
    // Verifica se há produtos
    if (products.length === 0) {
        productsGrid.innerHTML = '<p style="text-align: center; padding: 40px; color: #777;">Nenhum produto disponível no momento.</p>';
        return;
    }
    
    // Cria os cards de produtos
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
                <p class="product-category">${product.category.toUpperCase()}</p>
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
    
    console.log(`✅ ${products.length} produtos renderizados com sucesso!`);
    
    // Configura os botões de adicionar ao carrinho
    setupAddToCartButtons();
}

function setupAddToCartButtons() {
    const buttons = document.querySelectorAll('.add-to-cart');
    console.log(`🔘 Configurando ${buttons.length} botões de carrinho...`);
    
    buttons.forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            console.log(`🛒 Clicou no produto ID: ${productId}`);
            addToCart(productId);
        });
    });
}

// ===== SISTEMA DE CARRINHO =====
function addToCart(productId) {
    console.log(`➕ Tentando adicionar produto ${productId} ao carrinho...`);
    
    if (!user) {
        console.log("⚠️ Usuário não cadastrado, abrindo modal...");
        alert('Por favor, faça seu cadastro antes de adicionar produtos ao carrinho.');
        document.getElementById('registerModal').classList.add('active');
        return;
    }
    
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        console.error("❌ Produto não encontrado!");
        return;
    }
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
        console.log(`📦 Aumentada quantidade de ${product.name}: ${existingItem.quantity}`);
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
            weight: product.weight
        });
        console.log(`🆕 Novo produto adicionado: ${product.name}`);
    }
    
    updateCart();
    showNotification('✅ ' + product.name + ' adicionado ao carrinho!');
}

function updateCart() {
    // Salva no localStorage
    localStorage.setItem('eleganceCart', JSON.stringify(cart));
    
    // Atualiza contador
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.querySelector('.cart-count');
    
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
    
    // Atualiza modal do carrinho
    updateCartModal();
    
    console.log(`🛒 Carrinho atualizado: ${totalItems} itens`);
}

function updateCartModal() {
    const cartItems = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (!cartItems) return;
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 40px; color: #777;">Seu carrinho está vazio.</p>';
        if (cartTotalElement) cartTotalElement.textContent = 'R$ 0,00';
        if (checkoutBtn) checkoutBtn.disabled = true;
        return;
    }
    
    if (checkoutBtn) checkoutBtn.disabled = false;
    
    let subtotal = 0;
    let totalWeight = 0;
    
    // Calcula totais
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        totalWeight += item.weight * item.quantity;
    });
    
    // Atualiza frete se necessário
    if (userState && shippingCost === 0) {
        calculateShipping(userState);
    }
    
    const total = subtotal + shippingCost;
    
    // Adiciona itens ao carrinho
    cart.forEach(item => {
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
    
    // Adiciona informações de frete
    const shippingInfo = document.createElement('div');
    shippingInfo.className = 'shipping-info';
    shippingInfo.innerHTML = `
        <div class="cart-subtotal">
            <span>Subtotal:</span>
            <span>R$ ${subtotal.toFixed(2)}</span>
        </div>
        <div class="cart-shipping">
            <span>Frete para ${userState || 'seu estado'}:</span>
            <span>R$ ${shippingCost.toFixed(2)}</span>
        </div>
    `;
    cartItems.appendChild(shippingInfo);
    
    if (cartTotalElement) {
        cartTotalElement.textContent = `R$ ${total.toFixed(2)}`;
    }
    
    // Configura eventos dos botões do carrinho
    setupCartEventListeners();
}

function setupCartEventListeners() {
    // Botão diminuir quantidade
    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const item = cart.find(item => item.id === productId);
            if (item) {
                updateCartQuantity(productId, item.quantity - 1);
            }
        });
    });
    
    // Botão aumentar quantidade
    document.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const item = cart.find(item => item.id === productId);
            if (item) {
                updateCartQuantity(productId, item.quantity + 1);
            }
        });
    });
    
    // Input de quantidade
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const newQuantity = parseInt(this.value);
            if (!isNaN(newQuantity)) {
                updateCartQuantity(productId, newQuantity);
            }
        });
    });
    
    // Botão remover item
    document.querySelectorAll('.remove-item').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
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

function removeFromCart(productId) {
    const productName = cart.find(item => item.id === productId)?.name || 'Produto';
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showNotification('🗑️ ' + productName + ' removido do carrinho');
}

// ===== VALIDAÇÕES E FRETE =====
function setupRealTimeValidation() {
    const cepInput = document.getElementById('cep');
    const phoneInput = document.getElementById('phone');
    
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 5) {
                value = value.substring(0, 5) + '-' + value.substring(5, 8);
            }
            e.target.value = value;
            if (value.length === 9) {
                validateCEP(value);
            }
        });
    }
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length > 0) {
                if (value.length <= 2) {
                    value = '(' + value;
                } else if (value.length <= 7) {
                    value = '(' + value.substring(0, 2) + ') ' + value.substring(2);
                } else {
                    value = '(' + value.substring(0, 2) + ') ' + value.substring(2, 7) + '-' + value.substring(7, 11);
                }
            }
            e.target.value = value;
        });
    }
}

async function validateCEP(cep) {
    const cepClean = cep.replace(/\D/g, '');
    
    if (cepClean.length !== 8) {
        showInputError('cep', 'CEP deve ter 8 dígitos');
        return false;
    }
    
    try {
        const response = await fetch(`https://viacep.com.br/ws/${cepClean}/json/`);
        const data = await response.json();
        
        if (data.erro) {
            showInputError('cep', 'CEP não encontrado');
            return false;
        }
        
        clearInputError('cep');
        calculateShipping(data.uf);
        userState = data.uf;
        
        console.log(`📍 Localização detectada: ${data.localidade}/${data.uf}`);
        return true;
        
    } catch (error) {
        showInputError('cep', 'Erro ao consultar CEP');
        return false;
    }
}

function calculateShipping(state) {
    const stateRegion = getRegionByState(state);
    shippingCost = storeConfig.freightRates[stateRegion] || storeConfig.freightRates.sudeste;
    
    console.log(`🚚 Frete calculado para ${state}: R$ ${shippingCost.toFixed(2)}`);
    
    if (cart.length > 0) {
        updateCart();
    }
}

function getRegionByState(state) {
    const regions = {
        'SP': 'sp', 'RJ': 'sudeste', 'MG': 'sudeste', 'ES': 'sudeste',
        'RS': 'sul', 'SC': 'sul', 'PR': 'sul',
        'DF': 'centro', 'GO': 'centro', 'MT': 'centro', 'MS': 'centro',
        'BA': 'nordeste', 'SE': 'nordeste', 'AL': 'nordeste', 'PE': 'nordeste',
        'PB': 'nordeste', 'RN': 'nordeste', 'CE': 'nordeste', 'PI': 'nordeste',
        'MA': 'nordeste', 'AM': 'norte', 'RR': 'norte', 'AP': 'norte',
        'PA': 'norte', 'TO': 'norte', 'RO': 'norte', 'AC': 'norte'
    };
    
    return regions[state] || 'sudeste';
}

function showInputError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    const formGroup = field.closest('.form-group');
    clearInputError(fieldId);
    
    field.style.borderColor = '#e74c3c';
    const errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    errorElement.style.cssText = 'color: #e74c3c; font-size: 0.8rem; margin-top: 5px; display: block;';
    errorElement.textContent = message;
    formGroup.appendChild(errorElement);
}

function clearInputError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    const formGroup = field.closest('.form-group');
    const errorElement = formGroup.querySelector('.error-message');
    field.style.borderColor = '';
    if (errorElement) errorElement.remove();
}

function validateForm() {
    const name = document.getElementById('name')?.value.trim() || '';
    const email = document.getElementById('email')?.value.trim() || '';
    const cep = document.getElementById('cep')?.value.replace(/\D/g, '') || '';
    const phone = document.getElementById('phone')?.value.replace(/\D/g, '') || '';
    
    let isValid = true;
    
    if (name.length < 3) {
        showInputError('name', 'Nome deve ter pelo menos 3 caracteres');
        isValid = false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showInputError('email', 'E-mail inválido');
        isValid = false;
    }
    
    if (cep.length !== 8) {
        showInputError('cep', 'CEP deve ter 8 dígitos');
        isValid = false;
    }
    
    if (phone.length < 10 || phone.length > 11) {
        showInputError('phone', 'Telefone deve ter 10 ou 11 dígitos');
        isValid = false;
    }
    
    return isValid;
}

// ===== CARREGAMENTO DE DADOS SALVOS =====
function loadSavedData() {
    // Carrega usuário
    const savedUser = localStorage.getItem('eleganceUser');
    if (savedUser) {
        user = JSON.parse(savedUser);
        console.log("👤 Usuário carregado:", user.name);
    } else {
        setTimeout(() => {
            const registerModal = document.getElementById('registerModal');
            if (registerModal) {
                registerModal.classList.add('active');
                console.log("📝 Modal de cadastro aberto");
            }
        }, 1000);
    }
    
    // Carrega carrinho
    const savedCart = localStorage.getItem('eleganceCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        console.log("🛒 Carrinho carregado com", cart.length, "itens");
        updateCart();
    }
}

// ===== SISTEMA DE EVENTOS =====
function setupEventListeners() {
    console.log("🔗 Configurando event listeners...");
    
    // Formulário de cadastro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            if (!validateForm()) {
                showNotification('❌ Por favor, corrija os erros no formulário');
                return;
            }
            
            const formData = new FormData(this);
            user = {
                name: formData.get('name'),
                email: formData.get('email'),
                cep: formData.get('cep').replace(/\D/g, ''),
                phone: formData.get('phone').replace(/\D/g, '')
            };
            
            validateCEP(formData.get('cep')).then(isValid => {
                if (isValid) {
                    localStorage.setItem('eleganceUser', JSON.stringify(user));
                    const registerModal = document.getElementById('registerModal');
                    if (registerModal) registerModal.classList.remove('active');
                    showNotification('✅ Cadastro realizado com sucesso!');
                }
            });
        });
    }
    
    // Carrinho
    const cartToggle = document.getElementById('cartToggle');
    if (cartToggle) {
        cartToggle.addEventListener('click', function() {
            if (!user) {
                alert('Por favor, faça seu cadastro antes de visualizar o carrinho.');
                const registerModal = document.getElementById('registerModal');
                if (registerModal) registerModal.classList.add('active');
                return;
            }
            
            const cartModal = document.getElementById('cartModal');
            const overlay = document.getElementById('overlay');
            if (cartModal) cartModal.classList.add('active');
            if (overlay) overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    // Fechar carrinho
    const closeCart = document.getElementById('closeCart');
    const overlay = document.getElementById('overlay');
    
    if (closeCart) {
        closeCart.addEventListener('click', closeCartModal);
    }
    
    if (overlay) {
        overlay.addEventListener('click', closeCartModal);
    }
    
    // Finalizar compra
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', function() {
            if (cart.length === 0) {
                alert('Seu carrinho está vazio!');
                return;
            }
            closeCartModal();
            openPaymentModal();
        });
    }
    
    // Pagamento
    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            selectedPaymentMethod = this.getAttribute('data-method');
            const confirmBtn = document.getElementById('confirmPayment');
            if (confirmBtn) confirmBtn.disabled = false;
        });
    });
    
    const confirmPayment = document.getElementById('confirmPayment');
    if (confirmPayment) {
        confirmPayment.addEventListener('click', function() {
            if (!selectedPaymentMethod) {
                alert('Por favor, selecione uma forma de pagamento.');
                return;
            }
            sendWhatsAppOrder();
        });
    }
    
    // Fechar modais
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
        });
    });
    
    console.log("✅ Event listeners configurados com sucesso!");
}

function closeCartModal() {
    const cartModal = document.getElementById('cartModal');
    const overlay = document.getElementById('overlay');
    
    if (cartModal) cartModal.classList.remove('active');
    if (overlay) overlay.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function openPaymentModal() {
    const orderItems = document.getElementById('orderItems');
    const orderTotal = document.getElementById('orderTotal');
    const paymentModal = document.getElementById('paymentModal');
    
    if (!orderItems || !orderTotal || !paymentModal) return;
    
    let itemsHTML = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        itemsHTML += `
            <div class="order-item">
                <span>${item.name} x${item.quantity}</span>
                <span>R$ ${itemTotal.toFixed(2)}</span>
            </div>
        `;
    });
    
    const total = subtotal + shippingCost;
    itemsHTML += `
        <div class="order-item">
            <span>Frete</span>
            <span>R$ ${shippingCost.toFixed(2)}</span>
        </div>
    `;
    
    orderItems.innerHTML = itemsHTML;
    orderTotal.textContent = `R$ ${total.toFixed(2)}`;
    
    document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('active'));
    const confirmBtn = document.getElementById('confirmPayment');
    if (confirmBtn) confirmBtn.disabled = true;
    selectedPaymentMethod = null;
    
    paymentModal.classList.add('active');
}

function sendWhatsAppOrder() {
    if (!user || cart.length === 0 || !selectedPaymentMethod) return;
    
    // SUBSTITUA pelo seu número real (apenas dígitos, com código do país)
    const phoneNumber = '5511999999999';
    
    let message = `*NOVO PEDIDO - ELEGANCE*%0A%0A`;
    message += `*Cliente:* ${user.name}%0A`;
    message += `*E-mail:* ${user.email}%0A`;
    message += `*Telefone:* ${user.phone}%0A`;
    message += `*CEP:* ${user.cep}%0A`;
    message += `*Estado:* ${userState}%0A%0A`;
    message += `*Itens do Pedido:*%0A`;
    
    let subtotal = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        message += `• ${item.name} - R$ ${item.price.toFixed(2)} x ${item.quantity} = R$ ${itemTotal.toFixed(2)}%0A`;
    });
    
    const total = subtotal + shippingCost;
    message += `%0A*Subtotal:* R$ ${subtotal.toFixed(2)}%0A`;
    message += `*Frete:* R$ ${shippingCost.toFixed(2)}%0A`;
    message += `*Total:* R$ ${total.toFixed(2)}%0A`;
    message += `*Pagamento:* ${getPaymentMethodName(selectedPaymentMethod)}%0A%0A`;
    message += `*Data:* ${new Date().toLocaleDateString('pt-BR')}`;
    
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappURL, '_blank');
    
    // Limpa carrinho após pedido
    cart = [];
    localStorage.removeItem('eleganceCart');
    updateCart();
    
    const paymentModal = document.getElementById('paymentModal');
    if (paymentModal) paymentModal.classList.remove('active');
    
    showNotification('✅ Pedido enviado para WhatsApp!');
}

function getPaymentMethodName(method) {
    const methods = {
        'credit': 'Cartão de Crédito',
        'debit': 'Cartão de Débito',
        'pix': 'PIX'
    };
    return methods[method] || method;
}

// ===== NOTIFICAÇÕES =====
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
            if (notification.parentNode) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// ===== INICIALIZAÇÃO DE FALLBACK =====
// Garante que os produtos sejam renderizados mesmo se houver erro
setTimeout(() => {
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid && productsGrid.innerHTML.trim() === '') {
        console.log("🔄 Fallback: Renderizando produtos novamente...");
        renderProducts();
    }
}, 500);
