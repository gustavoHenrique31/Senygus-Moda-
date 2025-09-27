/* ===== VALIDAÇÕES E FRETE ===== */
.error-message {
    color: #e74c3c;
    font-size: 0.8rem;
    margin-top: 5px;
    display: block;
}

.form-group input:invalid {
    border-color: #e74c3c;
}

.shipping-info {
    margin-top: 20px;
    padding-top: 20px;
    border-top: 2px solid var(--border-color);
}

.cart-subtotal, .cart-shipping {
    display: flex;
    justify-content: space-between;
    margin-bottom: 10px;
    font-size: 0.9rem;
}

.cart-shipping {
    color: var(--accent-color);
    font-weight: 600;
}

.frete-calculator {
    background: var(--light-color);
    padding: 15px;
    border-radius: 5px;
    margin: 15px 0;
}

.frete-calculator h4 {
    margin-bottom: 10px;
    color: var(--primary-color);
}

.cep-input {
    display: flex;
    gap: 10px;
}

.cep-input input {
    flex: 1;
    padding: 10px;
    border: 1px solid var(--border-color);
    border-radius: 3px;
}

.cep-input button {
    padding: 10px 15px;
    background: var(--primary-color);
    color: white;
    border: none;
    border-radius: 3px;
    cursor: pointer;
}

.frete-result {
    margin-top: 10px;
    padding: 10px;
    background: white;
    border-radius: 3px;
    border-left: 4px solid var(--accent-color);
}
