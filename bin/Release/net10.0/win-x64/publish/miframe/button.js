// ============================================
// BUTTON.JS - COMPONENTE DE BOTONES
// ============================================

class Button {
    constructor() {
        this.init();
    }

    init() {
        this.injectStyles();
        this.attachEvents();
    }

    injectStyles() {
        if (document.getElementById('button-styles')) return;

        const style = document.createElement('style');
        style.id = 'button-styles';
        style.textContent = `
            /* ==========================================
               BOTÓN BASE
               ========================================== */
            
            .btn {
                /* Layout */
                display: inline-flex;
                align-items: center;
                justify-content: center;
                gap: var(--space-2);
                
                /* Tamaño por defecto (medium) */
                height: var(--btn-height-md);
                padding: 0 var(--btn-padding-x-md);
                
                /* Tipografía */
                font-family: var(--font-primary);
                font-size: var(--font-size-sm);
                font-weight: var(--font-weight-semibold);
                text-decoration: none;
                white-space: nowrap;
                
                /* Bordes y forma */
                border: var(--border-width-1) solid transparent;
                border-radius: var(--radius-lg);
                
                /* Comportamiento */
                cursor: pointer;
                user-select: none;
                transition: var(--transition-base);
                
                /* Posición relativa para loading */
                position: relative;
                overflow: hidden;
            }

            .btn:focus {
                outline: none;
            }

            .btn:focus-visible {
                outline: 2px solid var(--color-primary);
                outline-offset: 2px;
            }

            .btn:active {
                transform: translateY(1px);
            }

            .btn:disabled,
            .btn.disabled {
                opacity: 0.5;
                cursor: not-allowed;
                transform: none !important;
            }

            /* ==========================================
               TAMAÑOS
               ========================================== */

            .btn-sm {
                height: var(--btn-height-sm);
                padding: 0 var(--btn-padding-x-sm);
                font-size: var(--font-size-xs);
                border-radius: var(--radius-md);
            }

            .btn-md {
                height: var(--btn-height-md);
                padding: 0 var(--btn-padding-x-md);
                font-size: var(--font-size-sm);
            }

            .btn-lg {
                height: var(--btn-height-lg);
                padding: 0 var(--btn-padding-x-lg);
                font-size: var(--font-size-base);
                border-radius: var(--radius-xl);
            }

            .btn-xl {
                height: var(--btn-height-xl);
                padding: 0 var(--btn-padding-x-xl);
                font-size: var(--font-size-lg);
                border-radius: var(--radius-2xl);
            }

            /* ==========================================
               ESTILO SOLID (por defecto)
               ========================================== */

            .btn-primary {
                background: var(--gradient-primary);
                color: var(--color-white);
                box-shadow: var(--shadow-primary);
            }

            .btn-primary:hover:not(:disabled) {
                box-shadow: var(--shadow-primary-lg);
                transform: translateY(-2px);
            }

            .btn-secondary {
                background: var(--gradient-secondary);
                color: var(--color-white);
                box-shadow: var(--shadow-secondary);
            }

            .btn-secondary:hover:not(:disabled) {
                box-shadow: var(--shadow-secondary-lg);
                transform: translateY(-2px);
            }

            .btn-success {
                background: var(--gradient-success);
                color: var(--color-white);
                box-shadow: var(--shadow-success);
            }

            .btn-success:hover:not(:disabled) {
                box-shadow: 0 6px 16px rgba(0, 184, 148, 0.4);
                transform: translateY(-2px);
            }

            .btn-error {
                background: var(--gradient-error);
                color: var(--color-white);
                box-shadow: var(--shadow-error);
            }

            .btn-error:hover:not(:disabled) {
                box-shadow: 0 6px 16px rgba(255, 118, 117, 0.4);
                transform: translateY(-2px);
            }

            .btn-warning {
                background: var(--gradient-warning);
                color: var(--color-white);
                box-shadow: var(--shadow-warning);
            }

            .btn-warning:hover:not(:disabled) {
                box-shadow: 0 6px 16px rgba(253, 203, 110, 0.4);
                transform: translateY(-2px);
            }

            .btn-info {
                background: var(--gradient-info);
                color: var(--color-white);
                box-shadow: 0 4px 12px rgba(108, 92, 231, 0.3);
            }

            .btn-info:hover:not(:disabled) {
                box-shadow: 0 6px 16px rgba(108, 92, 231, 0.4);
                transform: translateY(-2px);
            }

            .btn-dark {
                background: var(--gradient-dark);
                color: var(--color-white);
                box-shadow: var(--shadow-md);
            }

            .btn-dark:hover:not(:disabled) {
                box-shadow: var(--shadow-lg);
                transform: translateY(-2px);
            }

            .btn-light {
                background: var(--color-gray-100);
                color: var(--color-dark);
                box-shadow: var(--shadow-sm);
            }

            .btn-light:hover:not(:disabled) {
                background: var(--color-gray-200);
                box-shadow: var(--shadow-md);
                transform: translateY(-2px);
            }

            /* ==========================================
               ESTILO OUTLINE
               ========================================== */

            .btn-outline-primary {
                background: transparent;
                color: var(--color-primary);
                border-color: var(--color-primary);
            }

            .btn-outline-primary:hover:not(:disabled) {
                background: var(--color-primary);
                color: var(--color-white);
                box-shadow: var(--shadow-primary);
            }

            .btn-outline-secondary {
                background: transparent;
                color: var(--color-secondary);
                border-color: var(--color-secondary);
            }

            .btn-outline-secondary:hover:not(:disabled) {
                background: var(--color-secondary);
                color: var(--color-white);
                box-shadow: var(--shadow-secondary);
            }

            .btn-outline-success {
                background: transparent;
                color: var(--color-success);
                border-color: var(--color-success);
            }

            .btn-outline-success:hover:not(:disabled) {
                background: var(--color-success);
                color: var(--color-white);
            }

            .btn-outline-error {
                background: transparent;
                color: var(--color-error);
                border-color: var(--color-error);
            }

            .btn-outline-error:hover:not(:disabled) {
                background: var(--color-error);
                color: var(--color-white);
            }

            .btn-outline-warning {
                background: transparent;
                color: var(--color-warning);
                border-color: var(--color-warning);
            }

            .btn-outline-warning:hover:not(:disabled) {
                background: var(--color-warning);
                color: var(--color-white);
            }

            .btn-outline-info {
                background: transparent;
                color: var(--color-info);
                border-color: var(--color-info);
            }

            .btn-outline-info:hover:not(:disabled) {
                background: var(--color-info);
                color: var(--color-white);
            }

            .btn-outline-light {
                background: transparent;
                color: var(--color-white);
                border-color: rgba(255, 255, 255, 0.2);
            }

            .btn-outline-light:hover:not(:disabled) {
                background: rgba(255, 255, 255, 0.1);
                border-color: rgba(255, 255, 255, 0.3);
            }

            /* ==========================================
               ESTILO GHOST (sin borde)
               ========================================== */

            .btn-ghost-primary {
                background: transparent;
                color: var(--color-primary);
                border: none;
            }

            .btn-ghost-primary:hover:not(:disabled) {
                background: rgba(0, 212, 170, 0.1);
            }

            .btn-ghost-secondary {
                background: transparent;
                color: var(--color-secondary);
                border: none;
            }

            .btn-ghost-secondary:hover:not(:disabled) {
                background: rgba(108, 92, 231, 0.1);
            }

            .btn-ghost-success {
                background: transparent;
                color: var(--color-success);
                border: none;
            }

            .btn-ghost-success:hover:not(:disabled) {
                background: rgba(0, 184, 148, 0.1);
            }

            .btn-ghost-error {
                background: transparent;
                color: var(--color-error);
                border: none;
            }

            .btn-ghost-error:hover:not(:disabled) {
                background: rgba(255, 118, 117, 0.1);
            }

            .btn-ghost-light {
                background: transparent;
                color: var(--color-white);
                border: none;
            }

            .btn-ghost-light:hover:not(:disabled) {
                background: rgba(255, 255, 255, 0.1);
            }

            /* ==========================================
               ESTILO GLASS (glassmorphism)
               ========================================== */

            .btn-glass {
                background: var(--glass-bg);
                backdrop-filter: var(--glass-blur);
                border: var(--border-width-1) solid var(--glass-border);
                color: var(--color-white);
            }

            .btn-glass:hover:not(:disabled) {
                background: var(--glass-bg-light);
                border-color: var(--glass-border-light);
                box-shadow: var(--shadow-md);
            }

            .btn-glass-primary {
                background: rgba(0, 212, 170, 0.1);
                backdrop-filter: var(--glass-blur);
                border: var(--border-width-1) solid rgba(0, 212, 170, 0.3);
                color: var(--color-primary);
            }

            .btn-glass-primary:hover:not(:disabled) {
                background: rgba(0, 212, 170, 0.2);
                border-color: rgba(0, 212, 170, 0.5);
                box-shadow: var(--shadow-primary);
            }

            /* ==========================================
               BOTÓN CON ICONOS
               ========================================== */

            .btn i {
                font-size: 1em;
            }

            .btn-icon-only {
                width: var(--btn-height-md);
                padding: 0;
            }

            .btn-icon-only.btn-sm {
                width: var(--btn-height-sm);
            }

            .btn-icon-only.btn-lg {
                width: var(--btn-height-lg);
            }

            .btn-icon-only.btn-xl {
                width: var(--btn-height-xl);
            }

            /* ==========================================
               BOTÓN FULL WIDTH
               ========================================== */

            .btn-block {
                width: 100%;
                display: flex;
            }

            /* ==========================================
               BOTÓN LOADING
               ========================================== */

            .btn.loading {
                color: transparent;
                pointer-events: none;
            }

            .btn.loading::after {
                content: '';
                position: absolute;
                width: 16px;
                height: 16px;
                top: 50%;
                left: 50%;
                margin-left: -8px;
                margin-top: -8px;
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-top-color: white;
                border-radius: 50%;
                animation: btn-spin 0.6s linear infinite;
            }

            @keyframes btn-spin {
                to { transform: rotate(360deg); }
            }

            /* ==========================================
               GRUPO DE BOTONES
               ========================================== */

            .btn-group {
                display: inline-flex;
                gap: var(--space-2);
            }

            .btn-group-vertical {
                display: flex;
                flex-direction: column;
                gap: var(--space-2);
            }

            .btn-group-connected {
                display: inline-flex;
                gap: 0;
            }

            .btn-group-connected .btn:not(:first-child) {
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
                margin-left: -1px;
            }

            .btn-group-connected .btn:not(:last-child) {
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
            }

            /* ==========================================
               FLOATING ACTION BUTTON
               ========================================== */

            .btn-fab {
                position: fixed;
                bottom: var(--space-8);
                right: var(--space-8);
                width: 56px;
                height: 56px;
                border-radius: var(--radius-full);
                box-shadow: var(--shadow-xl);
                z-index: var(--z-index-fixed);
                padding: 0;
            }

            .btn-fab:hover {
                box-shadow: var(--shadow-2xl);
            }

            /* ==========================================
               UTILIDADES
               ========================================== */

            .btn-rounded {
                border-radius: var(--radius-full);
            }

            .btn-square {
                border-radius: var(--radius-base);
            }
        `;

        document.head.appendChild(style);
    }

    attachEvents() {
        // Auto-inicializar botones con atributo data-loading
        document.addEventListener('click', (e) => {
            const btn = e.target.closest('.btn[data-loading]');
            if (btn && !btn.classList.contains('loading')) {
                this.setLoading(btn, true);
            }
        });
    }

    // Métodos públicos
    setLoading(button, isLoading) {
        if (typeof button === 'string') {
            button = document.querySelector(button);
        }

        if (!button) return;

        if (isLoading) {
            button.classList.add('loading');
            button.disabled = true;
        } else {
            button.classList.remove('loading');
            button.disabled = false;
        }
    }

    create(options) {
        const {
            text = '',
            icon = null,
            iconPosition = 'left',
            variant = 'primary',
            size = 'md',
            type = 'solid',
            block = false,
            rounded = false,
            disabled = false,
            loading = false,
            onClick = null,
            className = ''
        } = options;

        const button = document.createElement('button');
        
        // Clases base
        button.className = 'btn';
        
        // Tipo de botón (solid, outline, ghost, glass)
        if (type === 'outline') {
            button.classList.add(`btn-outline-${variant}`);
        } else if (type === 'ghost') {
            button.classList.add(`btn-ghost-${variant}`);
        } else if (type === 'glass') {
            button.classList.add(variant === 'default' ? 'btn-glass' : `btn-glass-${variant}`);
        } else {
            button.classList.add(`btn-${variant}`);
        }
        
        // Tamaño
        button.classList.add(`btn-${size}`);
        
        // Modificadores
        if (block) button.classList.add('btn-block');
        if (rounded) button.classList.add('btn-rounded');
        if (loading) button.classList.add('loading');
        if (disabled) button.disabled = true;
        if (className) button.className += ` ${className}`;
        
        // Contenido
        if (icon && iconPosition === 'left') {
            button.innerHTML = `<i class="${icon}"></i>`;
        }
        
        if (text) {
            button.innerHTML += `<span>${text}</span>`;
        }
        
        if (icon && iconPosition === 'right') {
            button.innerHTML += `<i class="${icon}"></i>`;
        }
        
        // Solo icono
        if (icon && !text) {
            button.classList.add('btn-icon-only');
        }
        
        // Evento click
        if (onClick) {
            button.addEventListener('click', onClick);
        }
        
        return button;
    }
}

// Crear instancia global
const btnComponent = new Button();

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Button;
}