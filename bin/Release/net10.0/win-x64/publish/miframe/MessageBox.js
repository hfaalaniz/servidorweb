// ============================================
// MESSAGEBOX.JS - SISTEMA DE MENSAJES GLOBAL
// ============================================

class MessageBox {
    constructor() {
        this.container = null;
        this.queue = [];
        this.isShowing = false;
        this.init();
    }

    init() {
        // Crear contenedor si no existe
        if (!this.container) {
            this.createContainer();
        }
    }

    createContainer() {
        // Estilos CSS
        const style = document.createElement('style');
        style.textContent = `
            .msgbox-overlay {
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
                z-index: 9999;
                opacity: 0;
                transition: opacity 0.3s ease;
                pointer-events: none;
            }

            .msgbox-overlay.show {
                opacity: 1;
                pointer-events: all;
            }

            .msgbox-container {
                background: rgba(255, 255, 255, 0.05);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 20px;
                padding: 2rem;
                min-width: 320px;
                max-width: 500px;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
                transform: scale(0.9) translateY(20px);
                transition: all 0.3s ease;
            }

            .msgbox-overlay.show .msgbox-container {
                transform: scale(1) translateY(0);
            }

            .msgbox-icon {
                width: 60px;
                height: 60px;
                margin: 0 auto 1.5rem;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: 2rem;
            }

            .msgbox-icon.success {
                background: rgba(0, 184, 148, 0.2);
                color: #00B894;
            }

            .msgbox-icon.error {
                background: rgba(255, 118, 117, 0.2);
                color: #FF7675;
            }

            .msgbox-icon.warning {
                background: rgba(253, 203, 110, 0.2);
                color: #FDCB6E;
            }

            .msgbox-icon.info {
                background: rgba(108, 92, 231, 0.2);
                color: #6C5CE7;
            }

            .msgbox-icon.question {
                background: rgba(0, 212, 170, 0.2);
                color: #00D4AA;
            }

            .msgbox-title {
                font-family: 'Syne', sans-serif;
                font-size: 1.5rem;
                font-weight: 700;
                color: #fff;
                text-align: center;
                margin-bottom: 0.5rem;
            }

            .msgbox-message {
                font-family: 'DM Sans', sans-serif;
                font-size: 0.95rem;
                color: #B2BEC3;
                text-align: center;
                line-height: 1.6;
                margin-bottom: 1.5rem;
            }

            .msgbox-buttons {
                display: flex;
                gap: 0.75rem;
                justify-content: center;
            }

            .msgbox-btn {
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

            .msgbox-btn:hover {
                transform: translateY(-2px);
            }

            .msgbox-btn.primary {
                background: linear-gradient(135deg, #00D4AA 0%, #00B894 100%);
                color: #fff;
                box-shadow: 0 4px 12px rgba(0, 212, 170, 0.3);
            }

            .msgbox-btn.primary:hover {
                box-shadow: 0 6px 16px rgba(0, 212, 170, 0.4);
            }

            .msgbox-btn.secondary {
                background: rgba(255, 255, 255, 0.1);
                color: #fff;
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            .msgbox-btn.secondary:hover {
                background: rgba(255, 255, 255, 0.15);
            }

            .msgbox-btn.danger {
                background: linear-gradient(135deg, #FF7675 0%, #D63031 100%);
                color: #fff;
                box-shadow: 0 4px 12px rgba(255, 118, 117, 0.3);
            }

            .msgbox-btn.danger:hover {
                box-shadow: 0 6px 16px rgba(255, 118, 117, 0.4);
            }

            .msgbox-input {
                width: 100%;
                padding: 0.75rem 1rem;
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                color: #fff;
                font-family: 'DM Sans', sans-serif;
                font-size: 0.95rem;
                margin-bottom: 1rem;
                transition: all 0.3s ease;
            }

            .msgbox-input:focus {
                outline: none;
                border-color: #00D4AA;
                box-shadow: 0 0 0 3px rgba(0, 212, 170, 0.1);
            }

            .msgbox-input::placeholder {
                color: #636E72;
            }
        `;
        document.head.appendChild(style);

        // Crear overlay
        this.container = document.createElement('div');
        this.container.className = 'msgbox-overlay';
        document.body.appendChild(this.container);
    }

    show(options) {
        const {
            type = 'info',
            title = '',
            message = '',
            buttons = null,
            input = false,
            inputPlaceholder = '',
            onConfirm = null,
            onCancel = null,
            autoClose = 0
        } = options;

        return new Promise((resolve) => {
            const icons = {
                success: '✓',
                error: '✕',
                warning: '⚠',
                info: 'ℹ',
                question: '?'
            };

            let buttonsHTML = '';
            if (buttons) {
                buttonsHTML = buttons.map(btn => 
                    `<button class="msgbox-btn ${btn.type || 'secondary'}" data-action="${btn.action}">${btn.text}</button>`
                ).join('');
            } else {
                buttonsHTML = `<button class="msgbox-btn primary" data-action="ok">Aceptar</button>`;
            }

            const inputHTML = input ? 
                `<input type="text" class="msgbox-input" placeholder="${inputPlaceholder}" id="msgbox-input-field">` : '';

            this.container.innerHTML = `
                <div class="msgbox-container">
                    <div class="msgbox-icon ${type}">
                        ${icons[type] || icons.info}
                    </div>
                    ${title ? `<div class="msgbox-title">${title}</div>` : ''}
                    <div class="msgbox-message">${message}</div>
                    ${inputHTML}
                    <div class="msgbox-buttons">
                        ${buttonsHTML}
                    </div>
                </div>
            `;

            // Mostrar
            setTimeout(() => this.container.classList.add('show'), 10);

            // Event listeners para botones
            const btnElements = this.container.querySelectorAll('.msgbox-btn');
            btnElements.forEach(btn => {
                btn.addEventListener('click', () => {
                    const action = btn.dataset.action;
                    let result = action;

                    if (input) {
                        const inputField = document.getElementById('msgbox-input-field');
                        result = { action, value: inputField?.value || '' };
                    }

                    if (action === 'ok' || action === 'confirm') {
                        onConfirm?.(result);
                    } else if (action === 'cancel') {
                        onCancel?.();
                    }

                    this.hide();
                    resolve(result);
                });
            });

            // Auto-close
            if (autoClose > 0) {
                setTimeout(() => {
                    this.hide();
                    resolve('timeout');
                }, autoClose);
            }

            // Enter key para input
            if (input) {
                const inputField = document.getElementById('msgbox-input-field');
                inputField?.focus();
                inputField?.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        const confirmBtn = this.container.querySelector('[data-action="confirm"]') || 
                                          this.container.querySelector('[data-action="ok"]');
                        confirmBtn?.click();
                    }
                });
            }
        });
    }

    hide() {
        this.container.classList.remove('show');
        setTimeout(() => {
            this.container.innerHTML = '';
        }, 300);
    }

    // Métodos auxiliares
    success(message, title = '¡Éxito!', autoClose = 3000) {
        return this.show({ type: 'success', title, message, autoClose });
    }

    error(message, title = 'Error', autoClose = 0) {
        return this.show({ type: 'error', title, message, autoClose });
    }

    warning(message, title = 'Advertencia', autoClose = 0) {
        return this.show({ type: 'warning', title, message, autoClose });
    }

    info(message, title = 'Información', autoClose = 0) {
        return this.show({ type: 'info', title, message, autoClose });
    }

    confirm(message, title = '¿Confirmar?', onConfirm, onCancel) {
        return this.show({
            type: 'question',
            title,
            message,
            buttons: [
                { text: 'Cancelar', action: 'cancel', type: 'secondary' },
                { text: 'Confirmar', action: 'confirm', type: 'primary' }
            ],
            onConfirm,
            onCancel
        });
    }

    prompt(message, title = 'Ingrese valor', placeholder = '', onConfirm) {
        return this.show({
            type: 'question',
            title,
            message,
            input: true,
            inputPlaceholder: placeholder,
            buttons: [
                { text: 'Cancelar', action: 'cancel', type: 'secondary' },
                { text: 'Aceptar', action: 'confirm', type: 'primary' }
            ],
            onConfirm
        });
    }

    delete(message, title = '¿Eliminar?', onConfirm, onCancel) {
        return this.show({
            type: 'warning',
            title,
            message,
            buttons: [
                { text: 'Cancelar', action: 'cancel', type: 'secondary' },
                { text: 'Eliminar', action: 'delete', type: 'danger' }
            ],
            onConfirm,
            onCancel
        });
    }
}

// Crear instancia global
const msgBox = new MessageBox();

// Exportar para uso en módulos (opcional)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MessageBox;
}