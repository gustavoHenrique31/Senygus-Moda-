// ===== API DE CEP - PREENCHIMENTO AUTOMÁTICO COMPLETO =====
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
    
    // CALCULA FRETE AUTOMATICAMENTE
    calculateShipping(data.uf);
    console.log("📍 Endereço preenchido:", data.localidade + "/" + data.uf);
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

// ===== NOVA FUNÇÃO PARA LIMPAR CAMPOS DE ENDEREÇO =====
function clearAddressFields() {
    document.getElementById('rua').value = '';
    document.getElementById('numero').value = '';
    document.getElementById('bairro').value = '';
    document.getElementById('cidade').value = '';
    document.getElementById('estado').value = '';
}

// Atualize a função setupRealTimeValidation para incluir:
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
    
    // ... resto das validações permanece
}
