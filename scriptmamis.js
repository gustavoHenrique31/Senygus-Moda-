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
    `;
    
    document.body.appendChild(notification);
    
    // Adiciona animação
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Remove após 3 segundos
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===== ENVIO VIA WHATSAPP MELHORADO =====
function sendWhatsAppOrder() {
    if (!selectedPaymentMethod) {
        showNotification('❌ Selecione uma forma de pagamento');
        return;
    }
    
    if (!user) {
        showNotification('❌ Complete seu cadastro primeiro');
        openRegisterModal();
        return;
    }
    
    // Calcula totais
    let subtotal = 0;
    let itemsText = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        itemsText += `• ${item.name} - R$ ${item.price.toFixed(2)} x ${item.quantity} = R$ ${itemTotal.toFixed(2)}\n`;
    });
    
    const total = subtotal + shippingCost;
    
    // Formata mensagem
    const message = `🛍️ *PEDIDO - ELEGANCE STORE*

👤 *Cliente:* ${user.name}
📧 *E-mail:* ${user.email}
📞 *Telefone:* ${user.phone}
📍 *Endereço:* ${user.address}
🏙️ *Cidade:* ${user.city}/${user.state}

📦 *ITENS DO PEDIDO:*
${itemsText}

💳 *FORMA DE PAGAMENTO:* ${getPaymentMethodText(selectedPaymentMethod)}
🚚 *FRETE:* R$ ${shippingCost.toFixed(2)}
💰 *TOTAL:* R$ ${total.toFixed(2)}

*Pedido realizado em:* ${new Date().toLocaleString('pt-BR')}`;

    // Codifica mensagem para URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappURL = `https://wa.me/5511999999999?text=${encodedMessage}`;
    
    // Abre WhatsApp
    window.open(whatsappURL, '_blank');
    
    // Limpa carrinho e fecha modais
    cart = [];
    localStorage.setItem('eleganceCart', JSON.stringify(cart));
    user = null; // Reseta usuário para próximo pedido
    
    closePaymentModal();
    updateCart();
    
    showNotification('✅ Pedido enviado via WhatsApp!');
}

function getPaymentMethodText(method) {
    const methods = {
        'pix': 'PIX',
        'credit': 'Cartão de Crédito',
        'debit': 'Cartão de Débito',
        'cash': 'Dinheiro'
    };
    return methods[method] || method;
}

// ===== MELHORIAS NA VALIDAÇÃO =====
function validatePhone(phone) {
    const cleanPhone = phone.replace(/\D/g, '');
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ===== PREVENÇÃO DE ENVIO DE FORMULÁRIO =====
document.addEventListener('DOMContentLoaded', function() {
    // Previne envio de formulários com Enter
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
        }
    });
});

// ===== DETECÇÃO DE SAÍDA DA PÁGINA =====
window.addEventListener('beforeunload', function(e) {
    if (cart.length > 0) {
        e.preventDefault();
        e.returnValue = 'Você tem itens no carrinho. Tem certeza que deseja sair?';
    }
});

// ===== CARREGAMENTO DE DADOS SALVOS =====
function loadSavedData() {
    // Apenas carrega carrinho, usuário não é mais salvo
    const savedCart = localStorage.getItem('eleganceCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCart();
    }
}

// Atualiza a inicialização para carregar dados salvos
document.addEventListener('DOMContentLoaded', function() {
    console.log("🚀 Inicializando Elegance Store...");
    
    loadSavedData();
    initializeProducts();
    setupEventListeners();
    setupRealTimeValidation();
    
    console.log("✅ Sistema inicializado com sucesso!");
});

// ===== MENSAGEM DE BOAS-VINDAS =====
function showWelcomeMessage() {
    setTimeout(() => {
        showNotification('👋 Bem-vindo(a) à Elegance Store!');
    }, 1000);
}

// Chama a mensagem de boas-vindas
showWelcomeMessage();
