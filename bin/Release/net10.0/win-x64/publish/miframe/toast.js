// ============================================
// TOAST.JS - SISTEMA DE NOTIFICACIONES
// ============================================

class Toast {
    constructor() {
        this.container = null;
        this.toasts = [];
        this.init();
    }

    init() {
        this.injectStyles();
        this.createContainer();
    }

    injectStyles() {
        if (document.getElementById('toast-styles')) return;

        const style = document.createElement('style');
        style.id = 'toast-styles';
        style.textContent = `
            /* ==========================================
               CONTENEDOR DE TOASTS
               ========================================== */
            
            .toast-container {
                position: fixed;
                z-index: var(--z-index-toast);
                pointer-events: none;
                display: flex;
                flex-direction: column;
                gap: var(--space-3);
            }

            .toast-container.top-right {
                top: var(--space-6);
                right: var(--space-6);
            }

            .toast-container.top-left {
                top: var(--space-6);
                left: var(--space-6);
            }

            .toast-container.top-center {
                top: var(--space-6);
                left: 50%;
                transform: translateX(-50%);
            }

            .toast-container.bottom-right {
                bottom: var(--space-6);
                right: var(--space-6);
            }

            .toast-container.bottom-left {
                bottom: var(--space-6);
                left: var(--space-6);
            }

            .toast-container.bottom-center {
                bottom: var(--space-6);
                left: 50%;
                transform: translateX(-50%);
            }

            /* ==========================================
               TOAST BASE
               ========================================== */

            .toast {
                background: var(--glass-bg);
                backdrop-filter: var(--glass-blur);
                border: 1px solid var(--glass-border);
                border-radius: var(--radius-xl);
                padding: var(--space-4);
                min-width: 300px;
                max-width: 400px;
                box-shadow: var(--shadow-xl);
                pointer-events: all;
                display: flex;
                align-items: flex-start;
                gap: var(--space-3);
                position: relative;
                overflow: hidden;
                animation: toast-slide-in 0.3s var(--ease-out);
            }

            .toast.toast-removing {
                animation: toast-slide-out 0.3s var(--ease-in) forwards;
            }

            /* ==========================================
               ANIMACIONES
               ========================================== */

            @keyframes toast-slide-in {
                from {
                    opacity: 0;
                    transform: translateX(100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            @keyframes toast-slide-out {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(100%);
                }
            }

            .toast-container.top-left .toast,
            .toast-container.bottom-left .toast {
                animation: toast-slide-in-left 0.3s var(--ease-out);
            }

            .toast-container.top-left .toast.toast-removing,
            .toast-container.bottom-left .toast.toast-removing {
                animation: toast-slide-out-left 0.3s var(--ease-in) forwards;
            }

            @keyframes toast-slide-in-left {
                from {
                    opacity: 0;
                    transform: translateX(-100%);
                }
                to {
                    opacity: 1;
                    transform: translateX(0);
                }
            }

            @keyframes toast-slide-out-left {
                from {
                    opacity: 1;
                    transform: translateX(0);
                }
                to {
                    opacity: 0;
                    transform: translateX(-100%);
                }
            }

            /* ==========================================
               TOAST ICON
               ========================================== */

            .toast-icon {
                width: 40px;
                height: 40px;
                border-radius: var(--radius-full);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: var(--font-size-lg);
                flex-shrink: 0;
            }

            /* ==========================================
               TOAST CONTENT
               ========================================== */

            .toast-content {
                flex: 1;
                min-width: 0;
            }

            .toast-title {
                font-family: var(--font-heading);
                font-size: var(--font-size-base);
                font-weight: var(--font-weight-semibold);
                color: var(--color-white);
                margin-bottom: var(--space-1);
                line-height: var(--line-height-tight);
            }

            .toast-message {
                font-size: var(--font-size-sm);
                color: var(--color-gray-400);
                line-height: var(--line-height-normal);
                word-wrap: break-word;
            }

            /* ==========================================
               TOAST CLOSE BUTTON
               ========================================== */

            .toast-close {
                width: 24px;
                height: 24px;
                background: rgba(255, 255, 255, 0.1);
                border: none;
                border-radius: var(--radius-base);
                color: var(--color-gray-400);
                cursor: pointer;
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: var(--font-size-sm);
                transition: var(--transition-base);
                flex-shrink: 0;
            }

            .toast-close:hover {
                background: rgba(255, 255, 255, 0.2);
                color: var(--color-white);
            }

            /* ==========================================
               VARIANTES DE COLOR
               ========================================== */

            .toast-success {
                border-color: var(--color-success-border);
            }

            .toast-success .toast-icon {
                background: rgba(0, 184, 148, 0.2);
                color: var(--color-success);
            }

            .toast-error {
                border-color: var(--color-error-border);
            }

            .toast-error .toast-icon {
                background: rgba(255, 118, 117, 0.2);
                color: var(--color-error);
            }

            .toast-warning {
                border-color: var(--color-warning-border);
            }

            .toast-warning .toast-icon {
                background: rgba(253, 203, 110, 0.2);
                color: var(--color-warning);
            }

            .toast-info {
                border-color: var(--color-info-border);
            }

            .toast-info .toast-icon {
                background: rgba(108, 92, 231, 0.2);
                color: var(--color-info);
            }

            /* ==========================================
               PROGRESS BAR
               ========================================== */

            .toast-progress {
                position: absolute;
                bottom: 0;
                left: 0;
                height: 3px;
                background: var(--color-primary);
                width: 100%;
                transform-origin: left;
                animation: toast-progress-shrink linear;
            }

            .toast-success .toast-progress {
                background: var(--color-success);
            }

            .toast-error .toast-progress {
                background: var(--color-error);
            }

            .toast-warning .toast-progress {
                background: var(--color-warning);
            }

            .toast-info .toast-progress {
                background: var(--color-info);
            }

            @keyframes toast-progress-shrink {
                from {
                    transform: scaleX(1);
                }
                to {
                    transform: scaleX(0);
                }
            }

            .toast:hover .toast-progress {
                animation-play-state: paused;
            }

            /* ==========================================
               TOAST CON ACCIONES
               ========================================== */

            .toast-actions {
                display: flex;
                gap: var(--space-2);
                margin-top: var(--space-3);
            }

            .toast-action-btn {
                padding: var(--space-1) var(--space-3);
                background: rgba(255, 255, 255, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                border-radius: var(--radius-md);
                color: var(--color-white);
                font-size: var(--font-size-xs);
                font-weight: var(--font-weight-semibold);
                cursor: pointer;
                transition: var(--transition-base);
            }

            .toast-action-btn:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .toast-action-btn.primary {
                background: var(--color-primary);
                border-color: var(--color-primary);
            }

            .toast-action-btn.primary:hover {
                background: var(--color-primary-dark);
            }

            /* ==========================================
               RESPONSIVE
               ========================================== */

            @media (max-width: 640px) {
                .toast-container {
                    left: var(--space-4) !important;
                    right: var(--space-4) !important;
                    transform: none !important;
                }

                .toast {
                    min-width: auto;
                    width: 100%;
                }
            }
        `;

        document.head.appendChild(style);
    }

    createContainer() {
        // Crear contenedores para cada posición
        const positions = ['top-right', 'top-left', 'top-center', 'bottom-right', 'bottom-left', 'bottom-center'];
        
        positions.forEach(position => {
            const container = document.createElement('div');
            container.className = `toast-container ${position}`;
            container.id = `toast-container-${position}`;
            document.body.appendChild(container);
        });

        // Por defecto usar top-right
        this.container = document.getElementById('toast-container-top-right');
    }

    show(options) {
        const {
            type = 'info',
            title = null,
            message = '',
            duration = 5000,
            position = 'top-right',
            showClose = true,
            showProgress = true,
            actions = [],
            onClose = null,
            icon = null
        } = options;

        // Iconos por defecto
        const defaultIcons = {
            success: 'fas fa-check-circle',
            error: 'fas fa-times-circle',
            warning: 'fas fa-exclamation-triangle',
            info: 'fas fa-info-circle'
        };

        const toastIcon = icon || defaultIcons[type];

        // Crear toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        // Icon
        const iconEl = document.createElement('div');
        iconEl.className = 'toast-icon';
        iconEl.innerHTML = `<i class="${toastIcon}"></i>`;
        toast.appendChild(iconEl);

        // Content
        const content = document.createElement('div');
        content.className = 'toast-content';

        if (title) {
            const titleEl = document.createElement('div');
            titleEl.className = 'toast-title';
            titleEl.textContent = title;
            content.appendChild(titleEl);
        }

        if (message) {
            const messageEl = document.createElement('div');
            messageEl.className = 'toast-message';
            messageEl.textContent = message;
            content.appendChild(messageEl);
        }

        // Actions
        if (actions.length > 0) {
            const actionsEl = document.createElement('div');
            actionsEl.className = 'toast-actions';
            
            actions.forEach(action => {
                const btn = document.createElement('button');
                btn.className = `toast-action-btn ${action.primary ? 'primary' : ''}`;
                btn.textContent = action.text;
                btn.onclick = () => {
                    action.onClick?.();
                    this.remove(toast);
                };
                actionsEl.appendChild(btn);
            });
            
            content.appendChild(actionsEl);
        }

        toast.appendChild(content);

        // Close button
        if (showClose) {
            const closeBtn = document.createElement('button');
            closeBtn.className = 'toast-close';
            closeBtn.innerHTML = '<i class="fas fa-times"></i>';
            closeBtn.onclick = () => this.remove(toast);
            toast.appendChild(closeBtn);
        }

        // Progress bar
        if (showProgress && duration > 0) {
            const progress = document.createElement('div');
            progress.className = 'toast-progress';
            progress.style.animationDuration = `${duration}ms`;
            toast.appendChild(progress);
        }

        // Agregar al contenedor correcto
        const container = document.getElementById(`toast-container-${position}`) || this.container;
        
        // Si es bottom, insertar al principio
        if (position.startsWith('bottom')) {
            container.insertBefore(toast, container.firstChild);
        } else {
            container.appendChild(toast);
        }

        this.toasts.push(toast);

        // Auto remove
        if (duration > 0) {
            setTimeout(() => {
                this.remove(toast, onClose);
            }, duration);
        }

        return toast;
    }

    remove(toast, callback) {
        toast.classList.add('toast-removing');
        
        setTimeout(() => {
            if (toast.parentElement) {
                toast.parentElement.removeChild(toast);
            }
            
            const index = this.toasts.indexOf(toast);
            if (index > -1) {
                this.toasts.splice(index, 1);
            }
            
            callback?.();
        }, 300);
    }

    // Métodos auxiliares
    success(message, title = '¡Éxito!', duration = 5000, options = {}) {
        return this.show({
            type: 'success',
            title,
            message,
            duration,
            ...options
        });
    }

    error(message, title = 'Error', duration = 0, options = {}) {
        return this.show({
            type: 'error',
            title,
            message,
            duration,
            ...options
        });
    }

    warning(message, title = 'Advertencia', duration = 5000, options = {}) {
        return this.show({
            type: 'warning',
            title,
            message,
            duration,
            ...options
        });
    }

    info(message, title = 'Información', duration = 5000, options = {}) {
        return this.show({
            type: 'info',
            title,
            message,
            duration,
            ...options
        });
    }

    // Toast con confirmación
    confirm(options) {
        const {
            title = '¿Confirmar?',
            message = '',
            confirmText = 'Confirmar',
            cancelText = 'Cancelar',
            onConfirm = null,
            onCancel = null
        } = options;

        return this.show({
            type: 'warning',
            title,
            message,
            duration: 0,
            actions: [
                {
                    text: cancelText,
                    onClick: onCancel
                },
                {
                    text: confirmText,
                    primary: true,
                    onClick: onConfirm
                }
            ]
        });
    }

    // Limpiar todos los toasts
    clearAll() {
        this.toasts.forEach(toast => {
            this.remove(toast);
        });
    }

    // Toast de promesa (loading -> success/error)
    promise(promise, options = {}) {
        const {
            loading = 'Cargando...',
            success = '¡Completado!',
            error = 'Error',
            position = 'top-right'
        } = options;

        // Mostrar loading
        const loadingToast = this.show({
            type: 'info',
            title: loading,
            duration: 0,
            showClose: false,
            showProgress: false,
            position,
            icon: 'fas fa-spinner fa-spin'
        });

        // Manejar promesa
        promise
            .then(() => {
                this.remove(loadingToast);
                this.success(success, null, 3000, { position });
            })
            .catch(() => {
                this.remove(loadingToast);
                this.error(error, null, 0, { position });
            });

        return promise;
    }
}

// Crear instancia global
const toast = new Toast();

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Toast;
}