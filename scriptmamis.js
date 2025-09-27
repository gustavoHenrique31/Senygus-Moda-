// ===== DADOS DOS PRODUTOS FEMININOS =====
const products = [
    {
        id: 1,
        name: "Vestido Floral Midi",
        category: "vestidos",
        price: 129.90,
        oldPrice: 159.90,
        image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        weight: 0.3
    },
    {
        id: 2,
        name: "Blusa de Seda Branca",
        category: "blusas",
        price: 89.90,
        oldPrice: 119.90,
        image: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        weight: 0.2
    },
    {
        id: 3,
        name: "Calça Jeans Skinny",
        category: "calcas",
        price: 149.90,
        oldPrice: null,
        image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        weight: 0.5
    },
    {
        id: 4,
        name: "Saia Plissada Preta",
        category: "saias",
        price: 79.90,
        oldPrice: 99.90,
        image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
        weight: 0.25
    }
];

// ===== CONFIGURAÇÕES DA LOJA =====
const storeConfig = {
    cep: "13214203",
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
let userCity = '';
let userAddress = '';

// ===== INICIALIZAÇÃO PRINCIPAL =====
document.addEventListener('DOMContentLoaded', function() {
    console.log("=== ELEGANCE - INICIANDO SISTEMA ===");
    
    // 1. Primeiro: Carrega dados salvos
    loadSavedData();
    
    // 2. Segundo: Renderiza produtos IMEDIATAMENTE
    renderProducts();
    
    // 3. Terceiro: Configura validações
    setupRealTimeValidation();
    
    // 4. Quarto: Configura event listeners
    setupAllEventListeners();
    
    console.log("✅ Sistema pronto para uso!");
});

// ===== CARREGAMENTO DE DADOS SALVOS =====
function loadSavedData() {
    console.log("📂 Carregando dados salvos...");
    
    // CORREÇÃO: Chave correta sem espaço extra
    const savedUser = localStorage.getItem('eleganceUser');
    if (savedUser) {
        try {
            user = JSON.parse(savedUser);
            userState = user.state || '';
            userCity = user.city || '';
            userAddress = user.address || '';
            console.log("👤 Usuário carregado:", user.name);
        } catch (e) {
            console.error("Erro ao carregar usuário:", e);
            user = null;
        }
    }
    
    // Carrega carrinho
    const savedCart = localStorage.getItem('eleganceCart');
    if (savedCart) {
        try {
            cart = JSON.parse(savedCart);
            console.log("🛒 Carrinho carregado:", cart.length, "itens");
            updateCart();
        } catch (e) {
            console.error("Erro ao carregar carrinho:", e);
            cart = [];
        }
    }
    
    // Se não tem usuário, abre modal após 2 segundos
    if (!user) {
        console.log("📝 Abrindo modal de cadastro em 2 segundos...");
        setTimeout(() => {
            openRegisterModal();
        }, 2000);
    }
}

// ===== RENDERIZAÇÃO DE PRODUTOS =====
function renderProducts() {
    console.log("🎨 Renderizando produtos...");
    
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
                <img src="${product.image}" alt="${product.name}">
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
    
    console.log(`✅ ${products.length} produtos renderizados!`);
}

// ===== SISTEMA DE CADASTRO COM API DE CEP =====
function setupRealTimeValidation() {
    console.log("🔍 Configurando validações...");
    
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', formatCEP);
        cepInput.addEventListener('blur', function() {
            if (this.value.length === 9) validateCEP(this.value);
        });
    }
    
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', formatPhone);
    }

    // Validação em tempo real para nome e email
    const nameInput = document.getElementById('name');
    if (nameInput) {
        nameInput.addEventListener('input', function() {
            if (this.value.trim().length < 3) {
                showInputError('name', 'Nome deve ter pelo menos 3 caracteres');
            } else {
                clearInputError('name');
            }
        });
    }

    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('input', function() {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(this.value.trim())) {
                showInputError('email', 'E-mail inválido');
            } else {
                clearInputError('email');
            }
        });
    }

    const phoneInputRealTime = document.getElementById('phone');
    if (phoneInputRealTime) {
        phoneInputRealTime.addEventListener('input', function() {
            const digits = this.value.replace(/\D/g, '');
            if (digits.length < 10 || digits.length > 11) {
                showInputError('phone', 'Telefone deve ter 10 ou 11 dígitos');
            } else {
                clearInputError('phone');
            }
        });
    }
}

function fillAddressData(data) {
  document.getElementById('rua').value = data.logradouro || '';
  document.getElementById('bairro').value = data.bairro || '';
  document.getElementById('cidade').value = data.localidade || '';
  document.getElementById('estado').value = data.uf || '';
}

// dentro de handleRegistration():
user = {
  name: formData.get('name'),
  email: formData.get('email'),
  cep: formData.get('cep').replace(/\D/g, ''),
  phone: formData.get('phone').replace(/\D/g, ''),
  state: formData.get('estado'),
  city: formData.get('cidade'),
  address: `${formData.get('rua')}, ${formData.get('numero')} - ${formData.get('bairro')}`
};
calculateShipping(user.state); // já calcula frete pelo estado

}

function formatPhone(e) {
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
}

// ===== API DE CEP - FUNCIONANDO COM ENDEREÇO ESPECÍFICO =====
async function validateCEP(cep) {
    const cepClean = cep.replace(/\D/g, '');
    
    if (cepClean.length !== 8) {
        showInputError('cep', 'CEP deve ter 8 dígitos');
        return false;
    }
    
    showCEPLoading(true);
    
    try {
        console.log("🌐 Consultando CEP:", cepClean);
        const response = await fetch(`https://viacep.com.br/ws/${cepClean}/json/`);
        
        if (!response.ok) throw new Error('Erro na API');
        
        const data = await response.json();
        
        if (data.erro) {
            showInputError('cep', 'CEP não encontrado');
            showCEPLoading(false);
            return false;
        }
        
        // PREENCHE OS DADOS AUTOMATICAMENTE
        fillAddressData(data);
        showCEPLoading(false);
        return true;
        
    } catch (error) {
        console.error("Erro na API:", error);
        showInputError('cep', 'Erro ao consultar CEP');
        showCEPLoading(false);
        return false;
    }
}

function fillAddressData(data) {
    userState = data.uf;
    userCity = data.localidade;
    userAddress = `${data.logradouro || 'Rua'} - ${data.bairro || 'Bairro'} - ${data.localidade} - ${data.uf}`;
    
    // Atualiza interface com endereço específico
    const cepGroup = document.getElementById('cep').closest('.form-group');
    let locationInfo = cepGroup.querySelector('.location-info');
    
    if (!locationInfo) {
        locationInfo = document.createElement('div');
        locationInfo.className = 'location-info';
        cepGroup.appendChild(locationInfo);
    }
    
    locationInfo.innerHTML = `📍 ${userAddress}`;
    locationInfo.style.cssText = 'color: #27ae60; font-size: 0.9rem; margin-top: 5px; font-weight: 500;';
    
    // CALCULA FRETE AUTOMATICAMENTE
    calculateShipping(data.uf);
    console.log("🚚 Frete calculado para:", data.uf, "- Endereço:", userAddress);
}

function showCEPLoading(show) {
    const cepInput = document.getElementById('cep');
    const cepGroup = cepInput.closest('.form-group');
    let loadingElement = cepGroup.querySelector('.cep-loading');
    
    if (show) {
        if (!loadingElement) {
            loadingElement = document.createElement('div');
            loadingElement.className = 'cep-loading';
            cepGroup.appendChild(loadingElement);
        }
        loadingElement.innerHTML = '⏳ Consultando CEP...';
        loadingElement.style.cssText = 'color: #3498db; font-size: 0.8rem; margin-top: 5px;';
    } else if (loadingElement) {
        loadingElement.remove();
    }
}

// ===== CÁLCULO DE FRETE INTELIGENTE =====
function calculateShipping(state) {
    const region = getRegionByState(state);
    shippingCost = storeConfig.freightRates[region] || storeConfig.freightRates.sudeste;
    
    console.log(`💰 Frete calculado: ${state} (${region}) -> R$ ${shippingCost.toFixed(2)}`);
    
    // Atualiza carrinho se tiver itens
    if (cart.length > 0) {
        updateCart();
    }
    
    // Mostra notificação de frete calculado
    showNotification(`🚚 Frete calculado: R$ ${shippingCost.toFixed(2)} (${getRegionName(region)})`);
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

function getRegionName(region) {
    const names = {
        'sp': 'SP',
        'sul': 'Sul',
        'sudeste': 'Sudeste',
        'centro': 'Centro-Oeste',
        'nordeste': 'Nordeste',
        'norte': 'Norte'
    };
    return names[region] || region;
}

// ===== VALIDAÇÕES =====
function validateForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const cep = document.getElementById('cep').value.replace(/\D/g, '');
    const phone = document.getElementById('phone').value.replace(/\D/g, '');
    
    let isValid = true;
    
    // Valida nome
    if (name.length < 3) {
        showInputError('name', 'Nome deve ter pelo menos 3 caracteres');
        isValid = false;
    }
    
    // Valida email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showInputError('email', 'E-mail inválido');
        isValid = false;
    }
    
    // Valida CEP
    if (cep.length !== 8) {
        showInputError('cep', 'CEP deve ter 8 dígitos');
        isValid = false;
    }
    
    // Valida telefone
    if (phone.length < 10 || phone.length > 11) {
        showInputError('phone', 'Telefone deve ter 10 ou 11 dígitos');
        isValid = false;
    }
    
    return isValid;
}

function showInputError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    clearInputError(fieldId);
    
    field.style.borderColor = '#e74c3c';
    const errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.cssText = 'color: #e74c3c; font-size: 0.8rem; margin-top: 5px; display: block;';
    field.closest('.form-group').appendChild(errorElement);
}

function clearInputError(fieldId) {
    const field = document.getElementById(fieldId);
    if (!field) return;
    
    field.style.borderColor = '';
    const errorElement = field.closest('.form-group').querySelector('.error-message');
    if (errorElement) errorElement.remove();
}

// ===== SISTEMA DE CARRINHO =====
function addToCart(productId) {
    if (!user) {
        alert('⚠️ Faça seu cadastro antes de adicionar itens ao carrinho!');
        openRegisterModal();
        return;
    }
    
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
            weight: product.weight
        });
    }
    
    updateCart();
    showNotification('✅ ' + product.name + ' adicionado!');
}

function updateCart() {
    localStorage.setItem('eleganceCart', JSON.stringify(cart));
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.querySelector('.cart-count');
    if (cartCountEl) cartCountEl.textContent = totalItems;
    
    updateCartModal();
}

function updateCartModal() {
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (!cartItems) return;
    
    cartItems.innerHTML = '';
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 40px; color: #777;">Carrinho vazio</p>';
        if (cartTotal) cartTotal.textContent = 'R$ 0,00';
        if (checkoutBtn) checkoutBtn.disabled = true;
        return;
    }
    
    if (checkoutBtn) checkoutBtn.disabled = false;
    
    let subtotal = 0;
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
        
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
    
    const total = subtotal + shippingCost;
    
    const shippingInfo = document.createElement('div');
    shippingInfo.className = 'shipping-info';
    shippingInfo.innerHTML = `
        <div class="cart-subtotal">
            <span>Subtotal:</span>
            <span>R$ ${subtotal.toFixed(2)}</span>
        </div>
        <div class="cart-shipping">
            <span>Frete para ${userCity || userState || 'seu estado'}:</span>
            <span>R$ ${shippingCost.toFixed(2)}</span>
        </div>
    `;
    cartItems.appendChild(shippingInfo);
    
    if (cartTotal) cartTotal.textContent = `R$ ${total.toFixed(2)}`;
    
    setupCartEventListeners();
}

function setupCartEventListeners() {
    document.querySelectorAll('.decrease').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const item = cart.find(item => item.id === productId);
            if (item) updateCartQuantity(productId, item.quantity - 1);
        });
    });
    
    document.querySelectorAll('.increase').forEach(btn => {
        btn.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const item = cart.find(item => item.id === productId);
            if (item) updateCartQuantity(productId, item.quantity + 1);
        });
    });
    
    document.querySelectorAll('.remove-item').forEach(btn => {
        btn.addEventListener('click', function() {
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
    const productName = cart.find(item => item.id === productId)?.name;
    cart = cart.filter(item => item.id !== productId);
    updateCart();
    showNotification('🗑️ ' + productName + ' removido');
}

// ===== SISTEMA DE EVENTOS =====
function setupAllEventListeners() {
    console.log("🔗 Configurando eventos...");
    
    // Cadastro
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleRegistration();
    });
    
    // Botões de compra
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
            const button = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
            const productId = parseInt(button.getAttribute('data-id'));
            addToCart(productId);
        }
    });
    
    // Carrinho
    document.getElementById('cartToggle').addEventListener('click', openCartModal);
    document.getElementById('closeCart').addEventListener('click', closeCartModal);
    document.getElementById('overlay').addEventListener('click', closeCartModal);
    
    // Checkout
    document.getElementById('checkoutBtn').addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Carrinho vazio!');
            return;
        }
        closeCartModal();
        openPaymentModal();
    });
    
    // Pagamento
    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            selectedPaymentMethod = this.getAttribute('data-method');
            document.getElementById('confirmPayment').disabled = false;
        });
    });
    
    // Finalizar
    document.getElementById('confirmPayment').addEventListener('click', sendWhatsAppOrder);
    
    // Fechar modais
    document.querySelectorAll('.close-modal').forEach(btn => {
        btn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
        });
    });
}

function handleRegistration() {
    if (!validateForm()) {
        showNotification('❌ Corrija os erros no formulário');
        return;
    }
    
    const formData = new FormData(document.getElementById('registerForm'));
    user = {
        name: formData.get('name'),
        email: formData.get('email'),
        cep: formData.get('cep').replace(/\D/g, ''),
        phone: formData.get('phone').replace(/\D/g, ''),
        state: userState,
        city: userCity,
        address: userAddress
    };
    
    // CORREÇÃO: Chave correta sem espaço
    localStorage.setItem('eleganceUser', JSON.stringify(user));
    closeRegisterModal();
    showNotification('✅ Cadastro realizado com sucesso!');
}

function openRegisterModal() {
    document.getElementById('registerModal').classList.add('active');
}

function closeRegisterModal() {
    document.getElementById('registerModal').classList.remove('active');
}

function openCartModal() {
    if (!user) {
        alert('⚠️ Faça cadastro primeiro!');
        openRegisterModal();
        return;
    }
    document.getElementById('cartModal').classList.add('active');
    document.getElementById('overlay').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeCartModal() {
    document.getElementById('cartModal').classList.remove('active');
    document.getElementById('overlay').classList.remove('active');
    document.body.style.overflow = 'auto';
}

function openPaymentModal() {
    const orderItems = document.getElementById('orderItems');
    const orderTotal = document.getElementById('orderTotal');
    
    let html = '';
    let subtotal = 0;
    
    cart.forEach(item => {
        const total = item.price * item.quantity;
        subtotal += total;
        html += `<div class="order-item"><span>${item.name} x${item.quantity}</span><span>R$ ${total.toFixed(2)}</span></div>`;
    });
    
    const total = subtotal + shippingCost;
    html += `<div class="order-item"><span>Frete</span><span>R$ ${shippingCost.toFixed(2)}</span></div>`;
    
    orderItems.innerHTML = html;
    orderTotal.textContent = `R$ ${total.toFixed(2)}`;
    
    document.getElementById('paymentModal').classList.add('active');
}

function sendWhatsAppOrder() {
    if (!user || cart.length === 0 || !selectedPaymentMethod) {
        alert('Complete todas as informações!');
        return;
    }
    
    const phone = '5511999999999'; // ALTERE PARA SEU NÚMERO
    
    let message = `*PEDIDO - ELEGANCE*%0A%0A`;
    message += `*Cliente:* ${user.name}%0A`;
    message += `*Email:* ${user.email}%0A`;
    message += `*Telefone:* ${user.phone}%0A`;
    message += `*Endereço:* ${userAddress}%0A`;
    message += `*CEP:* ${user.cep}%0A%0A`;
    message += `*Itens:*%0A`;
    
    let subtotal = 0;
    cart.forEach(item => {
        const total = item.price * item.quantity;
        subtotal += total;
        message += `• ${item.name} - R$ ${item.price.toFixed(2)} x${item.quantity} = R$ ${total.toFixed(2)}%0A`;
    });
    
    const total = subtotal + shippingCost;
    message += `%0A*Subtotal:* R$ ${subtotal.toFixed(2)}%0A`;
    message += `*Frete:* R$ ${shippingCost.toFixed(2)}%0A`;
    message += `*Total:* R$ ${total.toFixed(2)}%0A`;
    message += `*Pagamento:* ${getPaymentMethodName(selectedPaymentMethod)}%0A`;
    message += `*Data:* ${new Date().toLocaleDateString('pt-BR')}`;
    
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
    
    // Limpa tudo
    cart = [];
    localStorage.removeItem('eleganceCart');
    updateCart();
    document.getElementById('paymentModal').classList.remove('active');
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
        background: #000;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 2000;
        transform: translateX(400px);
        transition: transform 0.3s;
        font-weight: 500;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => document.body.removeChild(notification), 300);
    }, 3000);
}

// ===== CSS DINÂMICO =====
const style = document.createElement('style');
style.textContent = `
    .location-info, .cep-loading, .error-message {
        display: block;
        margin-top: 5px;
        font-size: 0.8rem;
    }
    .location-info { color: #27ae60; font-weight: 500; }
    .cep-loading { color: #3498db; }
    .error-message { color: #e74c3c; }
`;
document.head.appendChild(style);

