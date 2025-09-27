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
let userCity = '';

// ===== INICIALIZAÇÃO PRINCIPAL =====
document.addEventListener('DOMContentLoaded', function() {
    console.log("=== ELEGANCE - SISTEMA INICIADO ===");
    
    // 1. Primeiro: Carrega dados salvos
    loadSavedData();
    
    // 2. Segundo: Renderiza produtos IMEDIATAMENTE
    renderProducts();
    
    // 3. Terceiro: Configura validações
    setupRealTimeValidation();
    
    // 4. Quarto: Configura todos os event listeners
    setupAllEventListeners();
    
    console.log("✅ Sistema totalmente carregado e funcionando!");
});

// ===== CARREGAMENTO DE DADOS SALVOS =====
function loadSavedData() {
    console.log("📂 Carregando dados salvos...");
    
    // Carrega usuário
    const savedUser = localStorage.getItem('eleganceUser');
    if (savedUser) {
        user = JSON.parse(savedUser);
        console.log("👤 Usuário carregado:", user.name);
        userState = user.state || '';
        userCity = user.city || '';
    } else {
        console.log("📝 Nenhum usuário encontrado, modal será aberto em 2 segundos");
        // Abre modal após 2 segundos
        setTimeout(openRegisterModal, 2000);
    }
    
    // Carrega carrinho
    const savedCart = localStorage.getItem('eleganceCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        console.log("🛒 Carrinho carregado com", cart.length, "itens");
        updateCart();
    }
}

// ===== RENDERIZAÇÃO DE PRODUTOS =====
function renderProducts() {
    console.log("🎨 Renderizando produtos...");
    
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
}

// ===== SISTEMA DE CADASTRO COM API DE CEP =====
function setupRealTimeValidation() {
    console.log("🔍 Configurando validações em tempo real...");
    
    const cepInput = document.getElementById('cep');
    const phoneInput = document.getElementById('phone');
    
    // Validação de CEP em tempo real
    if (cepInput) {
        cepInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Formata CEP (XXXXX-XXX)
            if (value.length > 5) {
                value = value.substring(0, 5) + '-' + value.substring(5, 8);
            }
            
            e.target.value = value;
            
            // Quando CEP estiver completo, consulta API
            if (value.length === 9) {
                console.log("🔎 Consultando CEP:", value);
                validateCEP(value);
            }
        });
        
        // Busca automática ao perder o foco (se CEP estiver completo)
        cepInput.addEventListener('blur', function() {
            if (this.value.length === 9) {
                validateCEP(this.value);
            }
        });
    }
    
    // Validação de telefone em tempo real
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            
            // Formata telefone (XX) XXXXX-XXXX
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
    
    // Validação de e-mail em tempo real
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', function() {
            validateEmail(this.value);
        });
    }
    
    // Validação de nome em tempo real
    const nameInput = document.getElementById('name');
    if (nameInput) {
        nameInput.addEventListener('blur', function() {
            validateName(this.value);
        });
    }
}

// ===== VALIDAÇÃO DE CEP COM API VIA CEP =====
async function validateCEP(cep) {
    const cepClean = cep.replace(/\D/g, '');
    
    if (cepClean.length !== 8) {
        showInputError('cep', 'CEP deve ter 8 dígitos');
        return false;
    }
    
    // Mostra loading
    showCEPLoading(true);
    
    try {
        console.log("🌐 Consultando API ViaCEP...");
        const response = await fetch(`https://viacep.com.br/ws/${cepClean}/json/`);
        const data = await response.json();
        
        if (data.erro) {
            showInputError('cep', 'CEP não encontrado');
            showCEPLoading(false);
            return false;
        }
        
        // Preenche automaticamente os dados da localização
        fillAddressData(data);
        clearInputError('cep');
        showCEPLoading(false);
        
        console.log(`📍 Localização detectada: ${data.localidade}/${data.uf}`);
        return true;
        
    } catch (error) {
        console.error("Erro na consulta do CEP:", error);
        showInputError('cep', 'Erro ao consultar CEP. Tente novamente.');
        showCEPLoading(false);
        return false;
    }
}

function fillAddressData(addressData) {
    userState = addressData.uf;
    userCity = addressData.localidade;
    
    // Atualiza interface para mostrar a localização detectada
    const cepGroup = document.getElementById('cep').closest('.form-group');
    let locationInfo = cepGroup.querySelector('.location-info');
    
    if (!locationInfo) {
        locationInfo = document.createElement('div');
        locationInfo.className = 'location-info';
        locationInfo.style.cssText = 'color: #27ae60; font-size: 0.9rem; margin-top: 5px;';
        cepGroup.appendChild(locationInfo);
    }
    
    locationInfo.innerHTML = `📍 Localização detectada: ${addressData.localidade} - ${addressData.uf}`;
    
    // Calcula frete automaticamente
    calculateShipping(addressData.uf);
}

function showCEPLoading(show) {
    const cepInput = document.getElementById('cep');
    const cepGroup = cepInput.closest('.form-group');
    let loadingElement = cepGroup.querySelector('.cep-loading');
    
    if (show) {
        if (!loadingElement) {
            loadingElement = document.createElement('div');
            loadingElement.className = 'cep-loading';
            loadingElement.style.cssText = 'color: #3498db; font-size: 0.8rem; margin-top: 5px;';
            cepGroup.appendChild(loadingElement);
        }
        loadingElement.innerHTML = '🔍 Consultando CEP...';
    } else if (loadingElement) {
        loadingElement.remove();
    }
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showInputError('email', 'E-mail inválido');
        return false;
    }
    clearInputError('email');
    return true;
}

function validateName(name) {
    if (name.length < 3) {
        showInputError('name', 'Nome deve ter pelo menos 3 caracteres');
        return false;
    }
    clearInputError('name');
    return true;
}

function validatePhone(phone) {
    const phoneClean = phone.replace(/\D/g, '');
    if (phoneClean.length < 10 || phoneClean.length > 11) {
        showInputError('phone', 'Telefone deve ter 10 ou 11 dígitos');
        return false;
    }
    clearInputError('phone');
    return true;
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
    
    if (!validateName(name)) isValid = false;
    if (!validateEmail(email)) isValid = false;
    if (cep.length !== 8) {
        showInputError('cep', 'CEP deve ter 8 dígitos');
        isValid = false;
    }
    if (!validatePhone(phone)) isValid = false;
    
    return isValid;
}

// ===== CÁLCULO DE FRETE =====
function calculateShipping(state) {
    const stateRegion = getRegionByState(state);
    shippingCost = storeConfig.freightRates[stateRegion] || storeConfig.freightRates.sudeste;
    
    console.log(`🚚 Frete calculado para ${state}: R$ ${shippingCost.toFixed(2)}`);
    
    // Atualiza interface se o carrinho estiver aberto
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

// ===== SISTEMA DE CARRINHO =====
function addToCart(productId) {
    console.log(`➕ Adicionando produto ${productId} ao carrinho...`);
    
    if (!user) {
        console.log("⚠️ Usuário não cadastrado, abrindo modal...");
        alert('Por favor, faça seu cadastro antes de adicionar produtos ao carrinho.');
        openRegisterModal();
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
    localStorage.setItem('eleganceCart', JSON.stringify(cart));
    
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.querySelector('.cart-count');
    
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
    
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
    cart.forEach(item => {
        subtotal += item.price * item.quantity;
    });
    
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
                    <button class="remove-item" data-id="${item.id}">
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
            <span>Frete para ${userCity || userState || 'seu estado'}:</span>
            <span>R$ ${shippingCost.toFixed(2)}</span>
        </div>
    `;
    cartItems.appendChild(shippingInfo);
    
    if (cartTotalElement) {
        cartTotalElement.textContent = `R$ ${total.toFixed(2)}`;
    }
    
    setupCartEventListeners();
}

function setupCartEventListeners() {
    document.querySelectorAll('.decrease').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const item = cart.find(item => item.id === productId);
            if (item) updateCartQuantity(productId, item.quantity - 1);
        });
    });
    
    document.querySelectorAll('.increase').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const item = cart.find(item => item.id === productId);
            if (item) updateCartQuantity(productId, item.quantity + 1);
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

// ===== SISTEMA DE EVENTOS =====
function setupAllEventListeners() {
    console.log("🔗 Configurando todos os event listeners...");
    
    // 1. Formulário de cadastro
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleRegistration();
        });
    }
    
    // 2. Botões de adicionar ao carrinho (event delegation)
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
            const button = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
            const productId = parseInt(button.getAttribute('data-id'));
            addToCart(productId);
        }
    });
    
    // 3. Carrinho
    const cartToggle = document.getElementById('cartToggle');
    if (cartToggle) {
        cartToggle.addEventListener('click', openCartModal);
    }
    
    // 4. Fechar carrinho
    document.getElementById('closeCart')?.addEventListener('click', closeCartModal);
    document.getElementById('overlay')?.addEventListener('click', closeCartModal);
    
    // 5. Finalizar compra
    document.getElementById('checkoutBtn')?.addEventListener('click', function() {
        if (cart.length === 0) {
            alert('Seu carrinho está vazio!');
            return;
        }
        closeCartModal();
        openPaymentModal();
    });
    
    // 6. Pagamento
    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', function() {
            document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            selectedPaymentMethod = this.getAttribute('data-method');
            document.getElementById('confirmPayment').disabled = false;
        });
    });
    
    // 7. Confirmar pedido
    document.getElementById('confirmPayment')?.addEventListener('click', sendWhatsAppOrder);
    
    // 8. Fechar modais
    document.querySelectorAll('.close-modal').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            this.closest('.modal').classList.remove('active');
        });
    });
    
    console.log("✅ Todos os event listeners configurados!");
}

function handleRegistration() {
    if (!validateForm()) {
        showNotification('❌ Por favor, corrija os erros no formulário');
        return;
    }
    
    const formData = new FormData(document.getElementById('registerForm'));
    user = {
        name: formData.get('name'),
        email: formData.get('email'),
        cep: formData.get('cep').replace(/\D/g, ''),
        phone: formData.get('phone').replace(/\D/g, ''),
        state: userState,
        city: userCity
    };
    
    // Valida CEP antes de salvar
    validateCEP(formData.get('cep')).then(isValid => {
        if (isValid) {
            localStorage.setItem('eleganceUser', JSON.stringify(user));
            closeRegisterModal();
            showNotification('✅ Cadastro realizado com sucesso!');
            console.log("👤 Novo usuário cadastrado:", user.name);
        }
    });
}

function openRegisterModal() {
    const registerModal = document.getElementById('registerModal');
    if (registerModal) {
        registerModal.classList.add('active');
        console.log("📝 Modal de cadastro aberto");
    }
}

function closeRegisterModal() {
    const registerModal = document.getElementById('registerModal');
    if (registerModal) {
        registerModal.classList.remove('active');
    }
}

function openCartModal() {
    if (!user) {
        alert('Por favor, faça seu cadastro antes de visualizar o carrinho.');
        openRegisterModal();
        return;
    }
    
    const cartModal = document.getElementById('cartModal');
    const overlay = document.getElementById('overlay');
    if (cartModal) cartModal.classList.add('active');
    if (overlay) overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
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
        itemsHTML += `<div class="order-item"><span>${item.name} x${item.quantity}</span><span>R$ ${itemTotal.toFixed(2)}</span></div>`;
    });
    
    const total = subtotal + shippingCost;
    itemsHTML += `<div class="order-item"><span>Frete</span><span>R$ ${shippingCost.toFixed(2)}</span></div>`;
    
    orderItems.innerHTML = itemsHTML;
    orderTotal.textContent = `R$ ${total.toFixed(2)}`;
    
    document.querySelectorAll('.payment-option').forEach(opt => opt.classList.remove('active'));
    document.getElementById('confirmPayment').disabled = true;
    selectedPaymentMethod = null;
    
    paymentModal.classList.add('active');
}

function sendWhatsAppOrder() {
    if (!user || cart.length === 0 || !selectedPaymentMethod) {
        alert('Por favor, complete todas as informações do pedido.');
        return;
    }
    
    const phoneNumber = '5511999999999'; // SUBSTITUA pelo seu número
    
    let message = `*NOVO PEDIDO - ELEGANCE*%0A%0A*Cliente:* ${user.name}%0A*E-mail:* ${user.email}%0A*Telefone:* ${user.phone}%0A*CEP:* ${user.cep}%0A*Cidade/Estado:* ${userCity}/${userState}%0A%0A*Itens do Pedido:*%0A`;
    
    let subtotal = 0;
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        message += `• ${item.name} - R$ ${item.price.toFixed(2)} x ${item.quantity} = R$ ${itemTotal.toFixed(2)}%0A`;
    });
    
    const total = subtotal + shippingCost;
    message += `%0A*Subtotal:* R$ ${subtotal.toFixed(2)}%0A*Frete:* R$ ${shippingCost.toFixed(2)}%0A*Total:* R$ ${total.toFixed(2)}%0A*Pagamento:* ${getPaymentMethodName(selectedPaymentMethod)}%0A%0A*Data:* ${new Date().toLocaleDateString('pt-BR')}`;
    
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    
    // Limpa carrinho
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
    
    setTimeout(() => notification.style.transform = 'translateX(0)', 100);
    setTimeout(() => {
        notification.style.transform = 'translateX(150%)';
        setTimeout(() => {
            if (notification.parentNode) document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// ===== CSS DINÂMICO PARA VALIDAÇÕES =====
const style = document.createElement('style');
style.textContent = `
    .location-info { color: #27ae60; font-size: 0.9rem; margin-top: 5px; }
    .cep-loading { color: #3498db; font-size: 0.8rem; margin-top: 5px; }
    .error-message { color: #e74c3c; font-size: 0.8rem; margin-top: 5px; display: block; }
`;
document.head.appendChild(style);

// ===== FALLBACK =====
setTimeout(() => {
    const productsGrid = document.getElementById('productsGrid');
    if (productsGrid && productsGrid.innerHTML.trim() === '') {
        console.log("🔄 Fallback: Renderizando produtos...");
        renderProducts();
    }
}, 500);
