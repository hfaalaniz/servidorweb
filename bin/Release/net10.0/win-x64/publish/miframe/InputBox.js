// ============================================
// INPUTBOX.JS - SISTEMA DE INPUT GLOBAL
// ============================================

class InputBox {
    constructor() {
        this.container = null;
        this.init();
    }

    init() {
        if (!this.container) {
            this.createContainer();
        }
    }

    createContainer() {
        // Estilos CSS
        const style = document.createElement('style');
        style.textContent = `
            .inputbox-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                backdrop-filter: blur(5px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
            }

            .inputbox-overlay.show {
                opacity: 1;
                pointer-events: all;
            }

            .inputbox-container {
                background: rgba(255, 255, 255, 0.05);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                width: 90%;
                max-width: 500px;
                max-height: 90vh;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                transform: scale(0.9) translateY(20px);
                transition: all 0.3s ease;
                display: flex;
                flex-direction: column;
                overflow: hidden;
            }

            .inputbox-overlay.show .inputbox-container {
                transform: scale(1) translateY(0);
            }

            .inputbox-header {
                padding: 2rem 2rem 1rem 2rem;
                flex-shrink: 0;
            }

            .inputbox-icon {
                width: 50px;
                height: 50px;
                margin: 0 auto 1rem;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 1.5rem;
                background: rgba(0, 212, 170, 0.2);
                color: #00D4AA;
            }

            .inputbox-title {
                font-family: 'Syne', sans-serif;
                font-size: 1.4rem;
                font-weight: 700;
                color: #fff;
                text-align: center;
                margin-bottom: 0.5rem;
            }

            .inputbox-description {
                font-family: 'DM Sans', sans-serif;
                font-size: 0.9rem;
                color: #B2BEC3;
                text-align: center;
                line-height: 1.5;
            }

            .inputbox-form {
                padding: 1rem 2rem;
                overflow-y: auto;
                overflow-x: hidden;
                flex: 1;
                scrollbar-width: thin;
                scrollbar-color: rgba(0, 212, 170, 0.5) rgba(255, 255, 255, 0.1);
            }

            .inputbox-form::-webkit-scrollbar {
                width: 8px;
            }

            .inputbox-form::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: 10px;
            }

            .inputbox-form::-webkit-scrollbar-thumb {
                background: rgba(0, 212, 170, 0.5);
                border-radius: 10px;
            }

            .inputbox-form::-webkit-scrollbar-thumb:hover {
                background: rgba(0, 212, 170, 0.7);
            }

            .inputbox-field {
                margin-bottom: 1rem;
            }

            .inputbox-label {
                display: block;
                font-family: 'DM Sans', sans-serif;
                font-size: 0.85rem;
                font-weight: 600;
                color: #F8F9FA;
                margin-bottom: 0.5rem;
            }

            .inputbox-label .required {
                color: #FF7675;
                margin-left: 0.25rem;
            }

            .inputbox-input-wrapper {
                position: relative;
            }

            .inputbox-input-wrapper i {
                position: absolute;
                left: 1rem;
                top: 50%;
                transform: translateY(-50%);
                color: #636E72;
                pointer-events: none;
            }

            .inputbox-input,
            .inputbox-textarea,
            .inputbox-select {
                width: 100%;
                padding: 0.85rem 1rem;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 12px;
                color: #fff;
                font-family: 'DM Sans', sans-serif;
                font-size: 0.95rem;
                transition: all 0.3s ease;
            }

            .inputbox-input-wrapper i ~ .inputbox-input {
                padding-left: 3rem;
            }

            .inputbox-input:focus,
            .inputbox-textarea:focus,
            .inputbox-select:focus {
                outline: none;
                border-color: #00D4AA;
                background: rgba(255, 255, 255, 0.08);
                box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
            }

            .inputbox-input::placeholder,
            .inputbox-textarea::placeholder {
                color: #636E72;
            }

            .inputbox-textarea {
                min-height: 100px;
                resize: vertical;
            }

            .inputbox-select {
                cursor: pointer;
                appearance: none;
                background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23636E72' d='M10.293 3.293L6 7.586 1.707 3.293A1 1 0 00.293 4.707l5 5a1 1 0 001.414 0l5-5a1 1 0 10-1.414-1.414z'/%3E%3C/svg%3E");
                background-repeat: no-repeat;
                background-position: right 1rem center;
                padding-right: 3rem;
            }

            .inputbox-select option {
                background: #2D3436;
                color: #fff;
            }

            .inputbox-checkbox-wrapper {
                display: flex;
                align-items: center;
                gap: 0.75rem;
            }

            .inputbox-checkbox {
                width: 20px;
                height: 20px;
                cursor: pointer;
                accent-color: #00D4AA;
            }

            .inputbox-checkbox-label {
                font-family: 'DM Sans', sans-serif;
                font-size: 0.9rem;
                color: #B2BEC3;
                cursor: pointer;
            }

            .inputbox-error {
                font-family: 'DM Sans', sans-serif;
                font-size: 0.8rem;
                color: #FF7675;
                margin-top: 0.4rem;
                display: none;
            }

            .inputbox-error.show {
                display: block;
            }

            .inputbox-buttons {
                display: flex;
                gap: 0.75rem;
                justify-content: flex-end;
                padding: 1rem 2rem 2rem 2rem;
                flex-shrink: 0;
                background: rgba(255, 255, 255, 0.03);
                border-top: 1px solid rgba(255, 255, 255, 0.1);
            }

            .inputbox-btn {
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 10px;
                font-family: 'DM Sans', sans-serif;
                font-size: 0.9rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                min-width: 100px;
            }

            .inputbox-btn:hover {
                transform: translateY(-2px);
            }

            .inputbox-btn:disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none;
            }

            .inputbox-btn.primary {
                background: linear-gradient(135deg, #00D4AA 0%, #00B894 100%);
                color: #fff;
                box-shadow: 0 4px 12px rgba(0, 212, 170, 0.3);
            }

            .inputbox-btn.primary:hover:not(:disabled) {
                box-shadow: 0 6px 16px rgba(0, 212, 170, 0.4);
            }

            .inputbox-btn.secondary {
                background: rgba(255, 255, 255, 0.1);
                color: #fff;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            .inputbox-btn.secondary:hover {
                background: rgba(255, 255, 255, 0.15);
            }

            .inputbox-loading {
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-top-color: #fff;
                border-radius: 50%;
                animation: inputbox-spin 0.6s linear infinite;
                margin-right: 0.5rem;
            }

            @keyframes inputbox-spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        // Crear overlay
        this.container = document.createElement('div');
        this.container.className = 'inputbox-overlay';
        document.body.appendChild(this.container);
    }

    show(options) {
        const {
            title = 'Ingrese datos',
            description = '',
            icon = '✎',
            fields = [],
            confirmText = 'Aceptar',
            cancelText = 'Cancelar',
            showCancel = true,
            onConfirm = null,
            onCancel = null,
            validate = null
        } = options;

        return new Promise((resolve) => {
            // Generar campos HTML
            const fieldsHTML = fields.map((field, index) => {
                const {
                    name,
                    label,
                    type = 'text',
                    placeholder = '',
                    required = false,
                    icon: fieldIcon = null,
                    options = [],
                    value = '',
                    rows = 3
                } = field;

                let inputHTML = '';

                if (type === 'textarea') {
                    inputHTML = `
                        <textarea 
                            class="inputbox-textarea" 
                            id="inputbox-field-${index}" 
                            name="${name}"
                            placeholder="${placeholder}"
                            ${required ? 'required' : ''}
                            rows="${rows}"
                        >${value}</textarea>
                    `;
                } else if (type === 'select') {
                    const optionsHTML = options.map(opt => 
                        `<option value="${opt.value}" ${opt.value === value ? 'selected' : ''}>${opt.label}</option>`
                    ).join('');
                    inputHTML = `
                        <select 
                            class="inputbox-select" 
                            id="inputbox-field-${index}" 
                            name="${name}"
                            ${required ? 'required' : ''}
                        >
                            <option value="">Seleccionar...</option>
                            ${optionsHTML}
                        </select>
                    `;
                } else if (type === 'checkbox') {
                    return `
                        <div class="inputbox-field">
                            <div class="inputbox-checkbox-wrapper">
                                <input 
                                    type="checkbox" 
                                    class="inputbox-checkbox" 
                                    id="inputbox-field-${index}" 
                                    name="${name}"
                                    ${value ? 'checked' : ''}
                                >
                                <label class="inputbox-checkbox-label" for="inputbox-field-${index}">
                                    ${label}${required ? '<span class="required">*</span>' : ''}
                                </label>
                            </div>
                        </div>
                    `;
                } else {
                    inputHTML = `
                        <input 
                            type="${type}" 
                            class="inputbox-input" 
                            id="inputbox-field-${index}" 
                            name="${name}"
                            placeholder="${placeholder}"
                            value="${value}"
                            ${required ? 'required' : ''}
                        >
                    `;
                }

                return `
                    <div class="inputbox-field">
                        <label class="inputbox-label">
                            ${label}${required ? '<span class="required">*</span>' : ''}
                        </label>
                        <div class="inputbox-input-wrapper">
                            ${fieldIcon ? `<i class="${fieldIcon}"></i>` : ''}
                            ${inputHTML}
                        </div>
                        <div class="inputbox-error" id="inputbox-error-${index}"></div>
                    </div>
                `;
            }).join('');

            this.container.innerHTML = `
                <div class="inputbox-container">
                    <div class="inputbox-header">
                        <div class="inputbox-icon">${icon}</div>
                        <div class="inputbox-title">${title}</div>
                        ${description ? `<div class="inputbox-description">${description}</div>` : ''}
                    </div>
                    
                    <form class="inputbox-form" id="inputbox-form">
                        ${fieldsHTML}
                    </form>
                    
                    <div class="inputbox-buttons">
                        ${showCancel ? `<button type="button" class="inputbox-btn secondary" id="inputbox-cancel">${cancelText}</button>` : ''}
                        <button type="button" class="inputbox-btn primary" id="inputbox-confirm">${confirmText}</button>
                    </div>
                </div>
            `;

            // Mostrar
            setTimeout(() => this.container.classList.add('show'), 10);

            // Focus primer campo
            const firstInput = this.container.querySelector('input, textarea, select');
            firstInput?.focus();

            // Función para obtener valores
            const getValues = () => {
                const values = {};
                fields.forEach((field, index) => {
                    const input = document.getElementById(`inputbox-field-${index}`);
                    if (field.type === 'checkbox') {
                        values[field.name] = input.checked;
                    } else {
                        values[field.name] = input.value;
                    }
                });
                return values;
            };

            // Función para validar
            const validateFields = () => {
                let isValid = true;
                
                fields.forEach((field, index) => {
                    const input = document.getElementById(`inputbox-field-${index}`);
                    const errorEl = document.getElementById(`inputbox-error-${index}`);
                    
                    // Limpiar error previo
                    errorEl.textContent = '';
                    errorEl.classList.remove('show');
                    input.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    
                    // Validar requeridos
                    if (field.required) {
                        if (field.type === 'checkbox' && !input.checked) {
                            errorEl.textContent = 'Este campo es requerido';
                            errorEl.classList.add('show');
                            input.style.borderColor = '#FF7675';
                            isValid = false;
                        } else if (field.type !== 'checkbox' && !input.value.trim()) {
                            errorEl.textContent = 'Este campo es requerido';
                            errorEl.classList.add('show');
                            input.style.borderColor = '#FF7675';
                            isValid = false;
                        }
                    }
                    
                    // Validación por tipo
                    if (input.value.trim()) {
                        if (field.type === 'email' && !input.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
                            errorEl.textContent = 'Email inválido';
                            errorEl.classList.add('show');
                            input.style.borderColor = '#FF7675';
                            isValid = false;
                        }
                        
                        if (field.type === 'number' && isNaN(input.value)) {
                            errorEl.textContent = 'Debe ser un número';
                            errorEl.classList.add('show');
                            input.style.borderColor = '#FF7675';
                            isValid = false;
                        }
                        
                        if (field.minLength && input.value.length < field.minLength) {
                            errorEl.textContent = `Mínimo ${field.minLength} caracteres`;
                            errorEl.classList.add('show');
                            input.style.borderColor = '#FF7675';
                            isValid = false;
                        }
                        
                        if (field.maxLength && input.value.length > field.maxLength) {
                            errorEl.textContent = `Máximo ${field.maxLength} caracteres`;
                            errorEl.classList.add('show');
                            input.style.borderColor = '#FF7675';
                            isValid = false;
                        }
                    }
                });
                
                // Validación personalizada
                if (isValid && validate) {
                    const customValidation = validate(getValues());
                    if (customValidation !== true) {
                        isValid = false;
                        // Mostrar error personalizado en el primer campo
                        const firstError = document.getElementById('inputbox-error-0');
                        firstError.textContent = customValidation;
                        firstError.classList.add('show');
                    }
                }
                
                return isValid;
            };

            // Botón confirmar
            const confirmBtn = document.getElementById('inputbox-confirm');
            confirmBtn.addEventListener('click', () => {
                if (validateFields()) {
                    const values = getValues();
                    onConfirm?.(values);
                    this.hide();
                    resolve(values);
                }
            });

            // Botón cancelar
            if (showCancel) {
                const cancelBtn = document.getElementById('inputbox-cancel');
                cancelBtn.addEventListener('click', () => {
                    onCancel?.();
                    this.hide();
                    resolve(null);
                });
            }

            // Enter para submit
            this.container.addEventListener('keypress', (e) => {
                if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
                    e.preventDefault();
                    confirmBtn.click();
                }
            });

            // Escape para cancelar
            this.container.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && showCancel) {
                    const cancelBtn = document.getElementById('inputbox-cancel');
                    cancelBtn?.click();
                }
            });
        });
    }

    hide() {
        this.container.classList.remove('show');
        setTimeout(() => {
            this.container.innerHTML = '';
        }, 300);
    }

    // Métodos auxiliares
    text(title, placeholder = '', required = true, icon = 'fas fa-pencil-alt') {
        return this.show({
            title,
            icon: '✎',
            fields: [
                { name: 'value', label: 'Valor', type: 'text', placeholder, required, icon }
            ]
        });
    }

    email(title = 'Ingrese email', required = true) {
        return this.show({
            title,
            icon: '✉',
            fields: [
                { name: 'email', label: 'Email', type: 'email', placeholder: 'usuario@ejemplo.com', required, icon: 'fas fa-envelope' }
            ]
        });
    }

    number(title, placeholder = '', required = true, icon = 'fas fa-hashtag') {
        return this.show({
            title,
            icon: '#',
            fields: [
                { name: 'value', label: 'Número', type: 'number', placeholder, required, icon }
            ]
        });
    }

    password(title = 'Ingrese contraseña', required = true) {
        return this.show({
            title,
            icon: '🔒',
            fields: [
                { name: 'password', label: 'Contraseña', type: 'password', placeholder: '••••••••', required, icon: 'fas fa-lock' }
            ]
        });
    }

    textarea(title, placeholder = '', required = true, rows = 4) {
        return this.show({
            title,
            icon: '📝',
            fields: [
                { name: 'value', label: 'Texto', type: 'textarea', placeholder, required, rows }
            ]
        });
    }
}

// Crear instancia global
const inputBox = new InputBox();

// Exportar para uso en módulos (opcional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = InputBox;
}