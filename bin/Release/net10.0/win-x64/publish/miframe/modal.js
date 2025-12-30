// ============================================
// MODAL.JS - SISTEMA DE MODALES
// ============================================

class Modal {
    constructor() {
        this.modals = [];
        this.init();
    }

    init() {
        this.injectStyles();
        this.attachKeyboardEvents();
    }

    injectStyles() {
        if (document.getElementById('modal-styles')) return;

        const style = document.createElement('style');
        style.id = 'modal-styles';
        style.textContent = `
            /* ==========================================
               MODAL OVERLAY
               ========================================== */
            
            .modal-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                backdrop-filter: blur(5px);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: var(--z-index-modal);
                opacity: 0;
                transition: opacity var(--duration-base) var(--ease-out);
                pointer-events: none;
                padding: var(--space-4);
            }

            .modal-overlay.show {
                opacity: 1;
                pointer-events: all;
            }

            /* ==========================================
               MODAL CONTAINER
               ========================================== */

            .modal {
                background: var(--glass-bg);
                backdrop-filter: var(--glass-blur);
                border: 1px solid var(--glass-border);
                border-radius: var(--radius-2xl);
                width: 100%;
                max-height: 90vh;
                box-shadow: var(--shadow-2xl);
                display: flex;
                flex-direction: column;
                transform: scale(0.9) translateY(20px);
                transition: transform var(--duration-base) var(--ease-out);
                overflow: hidden;
            }

            .modal-overlay.show .modal {
                transform: scale(1) translateY(0);
            }

            /* ==========================================
               TAMAÑOS
               ========================================== */

            .modal-sm {
                max-width: 400px;
            }

            .modal-md {
                max-width: 600px;
            }

            .modal-lg {
                max-width: 800px;
            }

            .modal-xl {
                max-width: 1200px;
            }

            .modal-fullscreen {
                max-width: 100%;
                max-height: 100%;
                height: 100%;
                border-radius: 0;
            }

            /* ==========================================
               MODAL HEADER
               ========================================== */

            .modal-header {
                padding: var(--space-6);
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                align-items: center;
                justify-content: space-between;
                flex-shrink: 0;
            }

            .modal-title {
                font-family: var(--font-heading);
                font-size: var(--font-size-2xl);
                font-weight: var(--font-weight-bold);
                color: var(--color-white);
                margin: 0;
                display: flex;
                align-items: center;
                gap: var(--space-2);
            }

            .modal-subtitle {
                font-size: var(--font-size-sm);
                color: var(--color-gray-600);
                margin-top: var(--space-1);
            }

            .modal-close {
                width: 36px;
                height: 36px;
                background: rgba(255, 255, 255, 0.1);
                border: none;
                border-radius: var(--radius-full);
                color: var(--color-gray-400);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: var(--font-size-lg);
                transition: var(--transition-base);
                flex-shrink: 0;
            }

            .modal-close:hover {
                background: rgba(255, 255, 255, 0.2);
                color: var(--color-white);
            }

            /* ==========================================
               MODAL BODY
               ========================================== */

            .modal-body {
                padding: var(--space-6);
                overflow-y: auto;
                flex: 1;
                color: var(--color-gray-300);
                line-height: var(--line-height-relaxed);
            }

            .modal-body::-webkit-scrollbar {
                width: 8px;
            }

            .modal-body::-webkit-scrollbar-track {
                background: rgba(255, 255, 255, 0.05);
                border-radius: var(--radius-lg);
            }

            .modal-body::-webkit-scrollbar-thumb {
                background: rgba(0, 212, 170, 0.5);
                border-radius: var(--radius-lg);
            }

            .modal-body::-webkit-scrollbar-thumb:hover {
                background: rgba(0, 212, 170, 0.7);
            }

            /* ==========================================
               MODAL FOOTER
               ========================================== */

            .modal-footer {
                padding: var(--space-6);
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                align-items: center;
                justify-content: flex-end;
                gap: var(--space-3);
                flex-shrink: 0;
            }

            .modal-footer.space-between {
                justify-content: space-between;
            }

            /* ==========================================
               VARIANTES DE COLOR
               ========================================== */

            .modal-primary .modal-header {
                background: rgba(0, 212, 170, 0.1);
                border-bottom-color: rgba(0, 212, 170, 0.3);
            }

            .modal-primary .modal-title {
                color: var(--color-primary);
            }

            .modal-secondary .modal-header {
                background: rgba(108, 92, 231, 0.1);
                border-bottom-color: rgba(108, 92, 231, 0.3);
            }

            .modal-secondary .modal-title {
                color: var(--color-secondary);
            }

            .modal-success .modal-header {
                background: var(--color-success-bg);
                border-bottom-color: var(--color-success-border);
            }

            .modal-success .modal-title {
                color: var(--color-success);
            }

            .modal-error .modal-header {
                background: var(--color-error-bg);
                border-bottom-color: var(--color-error-border);
            }

            .modal-error .modal-title {
                color: var(--color-error);
            }

            .modal-warning .modal-header {
                background: var(--color-warning-bg);
                border-bottom-color: var(--color-warning-border);
            }

            .modal-warning .modal-title {
                color: var(--color-warning);
            }

            /* ==========================================
               MODAL SIN HEADER
               ========================================== */

            .modal-no-header .modal-body {
                padding-top: var(--space-8);
            }

            .modal-no-header .modal-close {
                position: absolute;
                top: var(--space-4);
                right: var(--space-4);
                z-index: 1;
            }

            /* ==========================================
               MODAL CENTRADO
               ========================================== */

            .modal-centered .modal-body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
            }

            /* ==========================================
               MODAL CON IMAGEN
               ========================================== */

            .modal-image {
                width: 100%;
                max-height: 300px;
                object-fit: cover;
            }

            /* ==========================================
               LOADING MODAL
               ========================================== */

            .modal-loading {
                pointer-events: none;
            }

            .modal-loading .modal-body::after {
                content: '';
                position: absolute;
                top: 50%;
                left: 50%;
                width: 40px;
                height: 40px;
                margin: -20px 0 0 -20px;
                border: 3px solid rgba(0, 212, 170, 0.3);
                border-top-color: var(--color-primary);
                border-radius: 50%;
                animation: modal-spin 0.8s linear infinite;
            }

            @keyframes modal-spin {
                to { transform: rotate(360deg); }
            }

            /* ==========================================
               STEPS MODAL (WIZARD)
               ========================================== */

            .modal-steps {
                display: flex;
                gap: var(--space-2);
                margin-bottom: var(--space-6);
                padding: var(--space-4);
                background: rgba(255, 255, 255, 0.03);
                border-radius: var(--radius-xl);
            }

            .modal-step {
                flex: 1;
                height: 4px;
                background: rgba(255, 255, 255, 0.1);
                border-radius: var(--radius-full);
                transition: var(--transition-base);
            }

            .modal-step.active {
                background: var(--color-primary);
            }

            .modal-step.completed {
                background: var(--color-success);
            }

            /* ==========================================
               RESPONSIVE
               ========================================== */

            @media (max-width: 640px) {
                .modal-overlay {
                    padding: 0;
                }

                .modal {
                    max-width: 100%;
                    max-height: 100%;
                    height: 100%;
                    border-radius: 0;
                }

                .modal-header,
                .modal-body,
                .modal-footer {
                    padding: var(--space-4);
                }
            }

            /* ==========================================
               ANIMACIONES ALTERNATIVAS
               ========================================== */

            .modal-fade .modal {
                transform: scale(1);
                opacity: 0;
            }

            .modal-overlay.show .modal-fade .modal {
                opacity: 1;
            }

            .modal-slide-up .modal {
                transform: translateY(100%);
            }

            .modal-overlay.show .modal-slide-up .modal {
                transform: translateY(0);
            }
        `;

        document.head.appendChild(style);
    }

    attachKeyboardEvents() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modals.length > 0) {
                const lastModal = this.modals[this.modals.length - 1];
                if (lastModal.options.closeOnEscape) {
                    this.close(lastModal.element);
                }
            }
        });
    }

    open(options) {
        const {
            title = null,
            subtitle = null,
            body = '',
            footer = null,
            size = 'md',
            variant = null,
            centered = false,
            closeButton = true,
            closeOnEscape = true,
            closeOnBackdrop = true,
            animation = 'default',
            image = null,
            icon = null,
            steps = null,
            currentStep = 0,
            onOpen = null,
            onClose = null,
            className = ''
        } = options;

        // Crear overlay
        const overlay = document.createElement('div');
        overlay.className = 'modal-overlay';

        // Crear modal
        const modal = document.createElement('div');
        modal.className = `modal modal-${size}`;
        if (variant) modal.classList.add(`modal-${variant}`);
        if (centered) modal.classList.add('modal-centered');
        if (!title) modal.classList.add('modal-no-header');
        if (animation !== 'default') modal.classList.add(`modal-${animation}`);
        if (className) modal.className += ` ${className}`;

        // Header
        if (title || closeButton) {
            const header = document.createElement('div');
            header.className = 'modal-header';

            if (title) {
                const titleContainer = document.createElement('div');
                
                const titleEl = document.createElement('h2');
                titleEl.className = 'modal-title';
                if (icon) {
                    titleEl.innerHTML = `<i class="${icon}"></i> ${title}`;
                } else {
                    titleEl.textContent = title;
                }
                titleContainer.appendChild(titleEl);

                if (subtitle) {
                    const subtitleEl = document.createElement('div');
                    subtitleEl.className = 'modal-subtitle';
                    subtitleEl.textContent = subtitle;
                    titleContainer.appendChild(subtitleEl);
                }

                header.appendChild(titleContainer);
            }

            if (closeButton) {
                const closeBtn = document.createElement('button');
                closeBtn.className = 'modal-close';
                closeBtn.innerHTML = '<i class="fas fa-times"></i>';
                closeBtn.onclick = () => this.close(overlay);
                header.appendChild(closeBtn);
            }

            modal.appendChild(header);
        }

        // Body
        const bodyEl = document.createElement('div');
        bodyEl.className = 'modal-body';

        // Imagen
        if (image) {
            const img = document.createElement('img');
            img.className = 'modal-image';
            img.src = image;
            img.alt = title || 'Modal image';
            bodyEl.appendChild(img);
        }

        // Steps
        if (steps && steps.length > 0) {
            const stepsEl = document.createElement('div');
            stepsEl.className = 'modal-steps';
            
            steps.forEach((_, index) => {
                const step = document.createElement('div');
                step.className = 'modal-step';
                if (index < currentStep) step.classList.add('completed');
                if (index === currentStep) step.classList.add('active');
                stepsEl.appendChild(step);
            });
            
            bodyEl.appendChild(stepsEl);
        }

        // Content
        if (typeof body === 'string') {
            bodyEl.innerHTML += body;
        } else if (body instanceof HTMLElement) {
            bodyEl.appendChild(body);
        }

        modal.appendChild(bodyEl);

        // Footer
        if (footer) {
            const footerEl = document.createElement('div');
            footerEl.className = 'modal-footer';
            
            if (typeof footer === 'string') {
                footerEl.innerHTML = footer;
            } else if (footer instanceof HTMLElement) {
                footerEl.appendChild(footer);
            } else if (Array.isArray(footer)) {
                footer.forEach(btn => footerEl.appendChild(btn));
            }
            
            modal.appendChild(footerEl);
        }

        overlay.appendChild(modal);
        document.body.appendChild(overlay);

        // Store modal reference
        this.modals.push({
            element: overlay,
            options: { closeOnEscape, closeOnBackdrop, onClose }
        });

        // Show modal
        setTimeout(() => {
            overlay.classList.add('show');
            onOpen?.();
        }, 10);

        // Close on backdrop
        if (closeOnBackdrop) {
            overlay.addEventListener('click', (e) => {
                if (e.target === overlay) {
                    this.close(overlay);
                }
            });
        }

        // Prevent body scroll
        document.body.style.overflow = 'hidden';

        return overlay;
    }

    close(overlay, callback) {
        const modalData = this.modals.find(m => m.element === overlay);
        
        overlay.classList.remove('show');

        setTimeout(() => {
            if (overlay.parentElement) {
                overlay.parentElement.removeChild(overlay);
            }

            const index = this.modals.indexOf(modalData);
            if (index > -1) {
                this.modals.splice(index, 1);
            }

            // Restore body scroll if no more modals
            if (this.modals.length === 0) {
                document.body.style.overflow = '';
            }

            modalData?.options.onClose?.();
            callback?.();
        }, 300);
    }

    closeAll() {
        this.modals.forEach(modal => {
            this.close(modal.element);
        });
    }

    // Modal de confirmación
    confirm(options) {
        const {
            title = '¿Confirmar?',
            message = '',
            confirmText = 'Confirmar',
            cancelText = 'Cancelar',
            variant = 'warning',
            onConfirm = null,
            onCancel = null
        } = options;

        const cancelBtn = document.createElement('button');
        cancelBtn.className = 'btn btn-outline-light btn-md';
        cancelBtn.textContent = cancelText;

        const confirmBtn = document.createElement('button');
        confirmBtn.className = `btn btn-${variant || 'primary'} btn-md`;
        confirmBtn.textContent = confirmText;

        const overlay = this.open({
            title,
            body: `<p style="font-size: 1rem; line-height: 1.6;">${message}</p>`,
            footer: [cancelBtn, confirmBtn],
            size: 'sm',
            variant,
            centered: true,
            icon: 'fas fa-question-circle'
        });

        cancelBtn.onclick = () => {
            this.close(overlay);
            onCancel?.();
        };

        confirmBtn.onclick = () => {
            this.close(overlay);
            onConfirm?.();
        };

        return overlay;
    }

    // Modal de alerta
    alert(options) {
        const {
            title = 'Alerta',
            message = '',
            variant = 'info',
            buttonText = 'Entendido',
            onClose = null
        } = options;

        const button = document.createElement('button');
        button.className = `btn btn-${variant} btn-md`;
        button.textContent = buttonText;

        const overlay = this.open({
            title,
            body: `<p style="font-size: 1rem; line-height: 1.6;">${message}</p>`,
            footer: [button],
            size: 'sm',
            variant,
            centered: true
        });

        button.onclick = () => {
            this.close(overlay);
            onClose?.();
        };

        return overlay;
    }

    // Modal loading
    loading(message = 'Cargando...') {
        return this.open({
            body: `
                <div style="text-align: center; padding: 2rem;">
                    <div style="font-size: 3rem; color: var(--color-primary); margin-bottom: 1rem;">
                        <i class="fas fa-spinner fa-spin"></i>
                    </div>
                    <p style="font-size: 1.1rem; color: var(--color-gray-400);">${message}</p>
                </div>
            `,
            size: 'sm',
            closeButton: false,
            closeOnEscape: false,
            closeOnBackdrop: false,
            centered: true,
            className: 'modal-loading'
        });
    }
}

// Crear instancia global
const modal = new Modal();

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Modal;
}