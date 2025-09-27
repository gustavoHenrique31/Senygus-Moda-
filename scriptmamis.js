// ===== VARIÁVEIS GLOBAIS =====
let cart = JSON.parse(localStorage.getItem('eleganceCart')) || [];
let user = JSON.parse(localStorage.getItem('eleganceUser')) || null;
let selectedPaymentMethod = null;
let shippingCost = 0;
let userState = '';
let userCity = '';
let userAddress = '';

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Inicializando Elegance Store...");
    
    // Abre modal de cadastro após 2 segundos
    setTimeout(() => {
        if (!user) {
            openRegisterModal();
        }
    }, 2000);
    
    // Inicializa componentes
    initializeProducts();
    updateCart();
    setupEventListeners();
    setupRealTimeValidation();
    
    // Se usuário já está cadastrado, calcula frete
    if (user) {
        calculateShipping(user.state);
    }
    
    console.log("✅ Sistema inicializado com sucesso!");
});

// ===== PRODUTOS =====
function initializeProducts() {
    const products = [
        { id: 1, name: "Vestido Floral Verão", price: 89.90, category: "vestidos" },
        { id: 2, name: "Blusa Básica Algodão", price: 39.90, category: "blusas" },
        { id: 3, name: "Calça Jeans Skinny", price: 119.90, category: "calcas" },
        { id: 4, name: "Saia Midi Plissada", price: 69.90, category: "saias" },
        { id: 5, name: "Vestido Midi Elegante", price: 129.90, category: "vestidos" },
        { id: 6, name: "Blusa Tricot Inverno", price: 79.90, category: "blusas" },
        { id: 7, name: "Calça Wide Leg", price: 99.90, category: "calcas" },
        { id: 8, name: "Saia Curta Jeans", price: 59.90, category: "saias" }
    ];
    
    const productsGrid = document.getElementById('productsGrid');
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
                <button class="add-to-cart" data-id="${product.id}">Adicionar ao Carrinho</button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
    
    // Adiciona eventos aos botões
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            const product = products.find(p => p.id === productId);
            addToCart(product);
        });
    });
}

// ===== CARRINHO =====
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

function updateCart() {
    const cartCount = document.querySelector('.cart-count');
    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    // Atualiza contador
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
    
    // Atualiza lista de itens
    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; padding: 40px; color: #777;">Seu carrinho está vazio.</p>';
        checkoutBtn.disabled = true;
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
        
        // Adiciona eventos aos botões de quantidade
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
        
        checkoutBtn.disabled = false;
        cartTotal.textContent = `R$ ${total.toFixed(2)}`;
    }
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

// ===== MODAIS =====
function openRegisterModal() {
    document.getElementById('registerModal').classList.add('active');
}

function closeRegisterModal() {
    document.getElementById('registerModal').classList.remove('active');
}

function openPaymentModal() {
    if (!user) {
        openRegisterModal();
        return;
    }
    
    if (cart.length === 0) {
        showNotification('❌ Seu carrinho está vazio!');
        return;
    }
    
    // Atualiza resumo do pedido
    const orderItems = document.getElementById('orderItems');
    const orderTotal = document.getElementById('orderTotal');
    
    let itemsHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        itemsHTML += `
            <div class="order-item">
                ${item.name} - R$ ${item.price.toFixed(2)} x${item.quantity} = R$ ${itemTotal.toFixed(2)}
            </div>
        `;
    });
    
    // Adiciona frete ao total
    total += shippingCost;
    
    orderItems.innerHTML = itemsHTML;
    orderTotal.textContent = `R$ ${total.toFixed(2)}`;
    
    document.getElementById('paymentModal').classList.add('active');
}

function closePaymentModal() {
    document.getElementById('paymentModal').classList.remove('active');
    selectedPaymentMethod = null;
    document.querySelectorAll('.payment-option').forEach(option => {
        option.classList.remove('active');
    });
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

// ===== EVENT LISTENERS =====
function setupEventListeners() {
    // Modal de cadastro
    document.querySelector('#registerModal .close-modal').addEventListener('click', closeRegisterModal);
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        handleRegistration();
    });
    
    // Modal de pagamento
    document.querySelector('#paymentModal .close-modal').addEventListener('click', closePaymentModal);
    document.querySelectorAll('.payment-option').forEach(option => {
        option.addEventListener('click', function() {
            selectedPaymentMethod = this.getAttribute('data-method');
            document.querySelectorAll('.payment-option').forEach(opt => {
                opt.classList.remove('active');
            });
            this.classList.add('active');
        });
    });
    
    document.getElementById('confirmPayment').addEventListener('click', sendWhatsAppOrder);
    
    // Carrinho
    document.getElementById('cartToggle').addEventListener('click', toggleCart);
    document.getElementById('closeCart').addEventListener('click', toggleCart);
    document.getElementById('overlay').addEventListener('click', toggleCart);
    document.getElementById('checkoutBtn').addEventListener('click', openPaymentModal);
    
    // Fecha modais com ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeRegisterModal();
            closePaymentModal();
            toggleCart();
        }
    });
}

// ===== VALIDAÇÃO DE CEP E ENDEREÇO =====
function setupRealTimeValidation() {
    console.log("🔍 Configurando validações...");
    
    const cepInput = document.getElementById('cep');
    if (cepInput) {
        cepInput.addEventListener('input', formatCEP);
        cepInput.addEventListener('blur', function() {
            if (this.value.length === 9) {
                validateCEP(this.value);
            } else if (this.value.length > 0) {
                showInputError('cep', 'CEP incompleto');
            }
        });
        
        // Limpa campos de endereço se CEP for apagado
        cepInput.addEventListener('input', function() {
            if (this.value.length === 0) {
                clearAddressFields();
                clearInputError('cep');
            }
        });
    }
    
    // Validação em tempo real para outros campos
    document.getElementById('name').addEventListener('input', function() {
        if (this.value.length >= 3) {
            clearInputError('name');
        }
    });
    
    document.getElementById('email').addEventListener('input', function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (emailRegex.test(this.value)) {
            clearInputError('email');
        }
    });
    
    document.getElementById('phone').addEventListener('input', function() {
        const phone = this.value.replace(/\D/g, '');
        if (phone.length >= 10 && phone.length <= 11) {
            clearInputError('phone');
        }
    });
    
    document.getElementById('numero').addEventListener('input', function() {
        if (this.value.trim().length > 0) {
            clearInputError('numero');
        }
    });
}

function formatCEP(e) {
    let cep = e.target.value.replace(/\D/g, '');
    cep = cep.substring(0, 8);
    
    if (cep.length > 5) {
        cep = cep.substring(0, 5) + '-' + cep.substring(5);
    }
    
    e.target.value = cep;
}

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
        
        // PREENCHE TODOS OS CAMPOS AUTOMATICAMENTE
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
    // Preenche os campos do formulário
    document.getElementById('rua').value = data.logradouro || '';
    document.getElementById('bairro').value = data.bairro || '';
    document.getElementById('cidade').value = data.localidade || '';
    document.getElementById('estado').value = data.uf || '';
    
    // Foca automaticamente no campo número (único que o usuário precisa preencher)
    setTimeout(() => {
        document.getElementById('numero').focus();
    }, 500);
    
    // Atualiza variáveis globais
    userState = data.uf;
    userCity = data.localidade;
    userAddress = `${data.logradouro || ''}, [NÚMERO] - ${data.bairro || ''}`;
    
    // Mostra confirmação visual
    const cepGroup = document.getElementById('cep').closest('.form-group');
    let locationInfo = cepGroup.querySelector('.location-info');
    
    if (!locationInfo) {
        locationInfo = document.createElement('div');
        locationInfo.className = 'location-info';
        cepGroup.appendChild(locationInfo);
    }
    
    locationInfo.innerHTML = `✅ Endereço encontrado! Complete com o número.`;
    locationInfo.style.cssText = 'color: #27ae60; font-size: 0.9rem; margin-top: 5px; font-weight: 500;';
    locationInfo.style.display = 'block';
    
    // CALCULA FRETE AUTOMATICAMENTE
    calculateShipping(data.uf);
    console.log("📍 Endereço preenchido:", data.localidade + "/" + data.uf);
}

function showCEPLoading(show) {
    const cepLoading = document.getElementById('cepLoading');
    if (cepLoading) {
        cepLoading.style.display = show ? 'block' : 'none';
    }
}

function clearAddressFields() {
    document.getElementById('rua').value = '';
    document.getElementById('numero').value = '';
    document.getElementById('bairro').value = '';
    document.getElementById('cidade').value = '';
    document.getElementById('estado').value = '';
    
    const locationInfo = document.getElementById('locationInfo');
    if (locationInfo) {
        locationInfo.style.display = 'none';
    }
    
    const shippingInfo = document.getElementById('shippingInfo');
    if (shippingInfo) {
        shippingInfo.style.display = 'none';
    }
}

function showInputError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.textContent = message;
    }
    
    const inputElement = document.getElementById(fieldId);
    if (inputElement) {
        inputElement.style.borderColor = '#e74c3c';
    }
}

function clearInputError(fieldId) {
    const errorElement = document.getElementById(fieldId + 'Error');
    if (errorElement) {
        errorElement.textContent = '';
    }
    
    const inputElement = document.getElementById(fieldId);
    if (inputElement) {
        inputElement.style.borderColor = '#ddd';
    }
}

// ===== SISTEMA DE FRETE INTELIGENTE =====
function calculateShipping(state) {
    // Tabela de fretes por estado
    const shippingRates = {
        'SP': 15.00,
        'RJ': 18.00,
        'MG': 20.00,
        'RS': 25.00,
        'PR': 22.00,
        'SC': 24.00,
        'DF': 30.00,
        'GO': 28.00,
        'BA': 32.00,
        'PE': 35.00,
        'CE': 36.00,
        'default': 40.00
    };
    
    // Calcula frete baseado no estado
    shippingCost = shippingRates[state] || shippingRates.default;
    
    // Atualiza interface
    const shippingInfo = document.getElementById('shippingInfo');
    const shippingCostElement = document.getElementById('shippingCost');
    
    if (shippingInfo && shippingCostElement) {
        shippingCostElement.textContent = `R$ ${shippingCost.toFixed(2)}`;
        shippingInfo.style.display = 'block';
        
        // Mostra notificação automática
        showNotification(`🚚 Frete para ${state}: R$ ${shippingCost.toFixed(2)}`);
    }
    
    console.log(`📦 Frete calculado para ${state}: R$ ${shippingCost.toFixed(2)}`);
}

// ===== VALIDAÇÃO DO FORMULÁRIO ATUALIZADA =====
function validateForm() {
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const cep = document.getElementById('cep').value.replace(/\D/g, '');
    const phone = document.getElementById('phone').value.replace(/\D/g, '');
    const rua = document.getElementById('rua').value.trim();
    const numero = document.getElementById('numero').value.trim();
    const bairro = document.getElementById('bairro').value.trim();
    const cidade = document.getElementById('cidade').value.trim();
    const estado = document.getElementById('estado').value.trim();
    
    let isValid = true;
    
    // Validações básicas
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
    
    // Validações de endereço
    if (!rua) {
        showInputError('rua', 'CEP inválido ou não encontrado');
        isValid = false;
    }
    
    if (!numero) {
        showInputError('numero', 'Número é obrigatório');
        isValid = false;
    }
    
    if (!bairro) {
        showInputError('bairro', 'CEP inválido ou não encontrado');
        isValid = false;
    }
    
    if (!cidade) {
        showInputError('cidade', 'CEP inválido ou não encontrado');
        isValid = false;
    }
    
    if (estado.length !== 2) {
        showInputError('estado', 'CEP inválido ou não encontrado');
        isValid = false;
    }
    
    return isValid;
}

// ===== CADASTRO ATUALIZADO COM ENDEREÇO COMPLETO =====
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
        state: formData.get('estado'),
        city: formData.get('cidade'),
        address: `${formData.get('rua')}, ${formData.get('numero')} - ${formData.get('bairro')}`
    };
    
    // Já calcula frete pelo estado
    calculateShipping(user.state);
    
    localStorage.setItem('eleganceUser', JSON.stringify(user));
    closeRegisterModal();
    showNotification('✅ Cadastro realizado com sucesso!');
    console.log("👤 Usuário cadastrado:", user.name, "- Endereço:", user.address);
}

// ===== WHATSAPP ATUALIZADO COM ENDEREÇO COMPLETO =====
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
    message += `*Endereço de Entrega:*%0A`;
    message += `${user.address}%0A`;
    message += `${user.city} - ${user.state}%0A`;
    message += `CEP: ${user.cep}%0A%0A`;
    message += `*Itens do Pedido:*%0A`;
    
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
    
    // Limpa carrinho após pedido
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
    return methods[method] || 'Método não especificado';
}

// ===== NOTIFICAÇÕES =====
function showNotification(message) {
    const notification = document.getElementById('notification');
    if (notification) {
        notification.textContent = message;
        notification.classList.add('active');
        
        setTimeout(() => {
            notification.classList.remove('active');
        }, 3000);
    }
}
