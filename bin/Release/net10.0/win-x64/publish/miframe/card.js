// ============================================
// CARD.JS - COMPONENTE DE TARJETAS
// ============================================

class Card {
    constructor() {
        this.init();
    }

    init() {
        this.injectStyles();
    }

    injectStyles() {
        if (document.getElementById('card-styles')) return;

        const style = document.createElement('style');
        style.id = 'card-styles';
        style.textContent = `
            /* ==========================================
               CARD BASE
               ========================================== */
            
            .card {
                background: var(--glass-bg);
                backdrop-filter: var(--glass-blur);
                border: 1px solid var(--glass-border);
                border-radius: var(--radius-2xl);
                overflow: hidden;
                transition: var(--transition-base);
                position: relative;
            }

            .card-body {
                padding: var(--card-padding-md);
            }

            /* ==========================================
               TAMAÑOS DE PADDING
               ========================================== */

            .card-sm .card-body {
                padding: var(--card-padding-sm);
            }

            .card-lg .card-body {
                padding: var(--card-padding-lg);
            }

            .card-xl .card-body {
                padding: var(--card-padding-xl);
            }

            /* ==========================================
               CARD HEADER
               ========================================== */

            .card-header {
                padding: var(--card-padding-md);
                border-bottom: 1px solid rgba(255, 255, 255, 0.1);
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: rgba(255, 255, 255, 0.03);
            }

            .card-title {
                font-family: var(--font-heading);
                font-size: var(--font-size-xl);
                font-weight: var(--font-weight-bold);
                color: var(--color-white);
                margin: 0;
                display: flex;
                align-items: center;
                gap: var(--space-2);
            }

            .card-subtitle {
                font-size: var(--font-size-sm);
                color: var(--color-gray-600);
                margin-top: var(--space-1);
            }

            .card-actions {
                display: flex;
                gap: var(--space-2);
            }

            /* ==========================================
               CARD FOOTER
               ========================================== */

            .card-footer {
                padding: var(--card-padding-md);
                border-top: 1px solid rgba(255, 255, 255, 0.1);
                background: rgba(255, 255, 255, 0.03);
                display: flex;
                align-items: center;
                justify-content: space-between;
            }

            /* ==========================================
               CARD CON IMAGEN
               ========================================== */

            .card-img-top {
                width: 100%;
                height: auto;
                display: block;
                object-fit: cover;
            }

            .card-img-overlay {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                padding: var(--card-padding-md);
                background: linear-gradient(to bottom, transparent 0%, rgba(0, 0, 0, 0.7) 100%);
                display: flex;
                flex-direction: column;
                justify-content: flex-end;
            }

            /* ==========================================
               VARIANTES DE COLOR
               ========================================== */

            .card-primary {
                background: rgba(0, 212, 170, 0.1);
                border-color: rgba(0, 212, 170, 0.3);
            }

            .card-primary .card-header,
            .card-primary .card-footer {
                border-color: rgba(0, 212, 170, 0.2);
            }

            .card-secondary {
                background: rgba(108, 92, 231, 0.1);
                border-color: rgba(108, 92, 231, 0.3);
            }

            .card-secondary .card-header,
            .card-secondary .card-footer {
                border-color: rgba(108, 92, 231, 0.2);
            }

            .card-success {
                background: var(--color-success-bg);
                border-color: var(--color-success-border);
            }

            .card-error {
                background: var(--color-error-bg);
                border-color: var(--color-error-border);
            }

            .card-warning {
                background: var(--color-warning-bg);
                border-color: var(--color-warning-border);
            }

            .card-info {
                background: var(--color-info-bg);
                border-color: var(--color-info-border);
            }

            /* ==========================================
               CARD CON GRADIENTE
               ========================================== */

            .card-gradient-primary {
                background: var(--gradient-primary);
                border: none;
                color: var(--color-white);
            }

            .card-gradient-secondary {
                background: var(--gradient-secondary);
                border: none;
                color: var(--color-white);
            }

            .card-gradient-success {
                background: var(--gradient-success);
                border: none;
                color: var(--color-white);
            }

            .card-gradient-error {
                background: var(--gradient-error);
                border: none;
                color: var(--color-white);
            }

            /* ==========================================
               CARD HOVER
               ========================================== */

            .card-hover {
                cursor: pointer;
            }

            .card-hover:hover {
                transform: translateY(-4px);
                box-shadow: var(--shadow-xl);
                border-color: var(--glass-border-light);
            }

            .card-hover:active {
                transform: translateY(-2px);
            }

            /* ==========================================
               CARD INTERACTIVA CON GLOW
               ========================================== */

            .card-glow:hover {
                box-shadow: 0 0 30px rgba(0, 212, 170, 0.4), var(--shadow-xl);
            }

            .card-glow-primary:hover {
                box-shadow: 0 0 30px rgba(0, 212, 170, 0.4), var(--shadow-xl);
            }

            .card-glow-secondary:hover {
                box-shadow: 0 0 30px rgba(108, 92, 231, 0.4), var(--shadow-xl);
            }

            /* ==========================================
               CARD STATS
               ========================================== */

            .card-stats {
                text-align: center;
            }

            .card-stats-value {
                font-family: var(--font-heading);
                font-size: var(--font-size-5xl);
                font-weight: var(--font-weight-extrabold);
                color: var(--color-primary);
                line-height: 1;
                margin-bottom: var(--space-2);
            }

            .card-stats-label {
                font-size: var(--font-size-sm);
                color: var(--color-gray-600);
                text-transform: uppercase;
                letter-spacing: var(--letter-spacing-wide);
            }

            .card-stats-icon {
                width: 60px;
                height: 60px;
                margin: 0 auto var(--space-4);
                background: rgba(0, 212, 170, 0.2);
                border-radius: var(--radius-full);
                display: flex;
                align-items: center;
                justify-content: center;
                font-size: var(--font-size-3xl);
                color: var(--color-primary);
            }

            /* ==========================================
               CARD PROFILE
               ========================================== */

            .card-profile {
                text-align: center;
            }

            .card-profile-avatar {
                width: 100px;
                height: 100px;
                margin: 0 auto var(--space-4);
                border-radius: var(--radius-full);
                border: 4px solid var(--glass-border-light);
                object-fit: cover;
            }

            .card-profile-name {
                font-family: var(--font-heading);
                font-size: var(--font-size-2xl);
                font-weight: var(--font-weight-bold);
                color: var(--color-white);
                margin-bottom: var(--space-1);
            }

            .card-profile-role {
                font-size: var(--font-size-sm);
                color: var(--color-primary);
                margin-bottom: var(--space-4);
            }

            .card-profile-bio {
                font-size: var(--font-size-sm);
                color: var(--color-gray-600);
                line-height: var(--line-height-relaxed);
            }

            /* ==========================================
               CARD HORIZONTAL
               ========================================== */

            .card-horizontal {
                display: flex;
                flex-direction: row;
            }

            .card-horizontal .card-img-left {
                width: 200px;
                height: 100%;
                object-fit: cover;
                flex-shrink: 0;
            }

            .card-horizontal .card-body {
                flex: 1;
            }

            /* ==========================================
               CARD LOADING
               ========================================== */

            .card-loading {
                position: relative;
                pointer-events: none;
            }

            .card-loading::after {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.5);
                backdrop-filter: blur(2px);
                display: flex;
                align-items: center;
                justify-content: center;
            }

            /* ==========================================
               CARD BADGE
               ========================================== */

            .card-badge {
                position: absolute;
                top: var(--space-4);
                right: var(--space-4);
                padding: var(--space-1) var(--space-3);
                background: var(--color-primary);
                color: var(--color-white);
                font-size: var(--font-size-xs);
                font-weight: var(--font-weight-semibold);
                border-radius: var(--radius-full);
                text-transform: uppercase;
                letter-spacing: var(--letter-spacing-wide);
            }

            .card-badge-secondary {
                background: var(--color-secondary);
            }

            .card-badge-success {
                background: var(--color-success);
            }

            .card-badge-error {
                background: var(--color-error);
            }

            /* ==========================================
               CARD RIBBON
               ========================================== */

            .card-ribbon {
                position: absolute;
                top: 15px;
                right: -5px;
                background: var(--color-primary);
                color: var(--color-white);
                padding: var(--space-1) var(--space-4);
                font-size: var(--font-size-xs);
                font-weight: var(--font-weight-semibold);
                text-transform: uppercase;
                box-shadow: var(--shadow-md);
            }

            .card-ribbon::before {
                content: '';
                position: absolute;
                bottom: -5px;
                right: 0;
                border-left: 5px solid var(--color-primary-dark);
                border-bottom: 5px solid transparent;
            }

            /* ==========================================
               CARD COLLAPSIBLE
               ========================================== */

            .card-collapsible .card-header {
                cursor: pointer;
                user-select: none;
            }

            .card-collapsible .card-header::after {
                content: '▼';
                font-size: var(--font-size-xs);
                transition: var(--transition-base);
            }

            .card-collapsible.collapsed .card-header::after {
                transform: rotate(-90deg);
            }

            .card-collapsible.collapsed .card-body {
                display: none;
            }

            /* ==========================================
               CARD GRID
               ========================================== */

            .card-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: var(--space-6);
            }

            /* ==========================================
               RESPONSIVE
               ========================================== */

            @media (max-width: 768px) {
                .card-horizontal {
                    flex-direction: column;
                }

                .card-horizontal .card-img-left {
                    width: 100%;
                    height: 200px;
                }

                .card-grid {
                    grid-template-columns: 1fr;
                }
            }
        `;

        document.head.appendChild(style);
    }

    // Método para crear card dinámicamente
    create(options) {
        const {
            title = null,
            subtitle = null,
            body = '',
            footer = null,
            image = null,
            imagePosition = 'top',
            variant = null,
            gradient = false,
            hover = false,
            glow = false,
            size = 'md',
            badge = null,
            ribbon = null,
            actions = [],
            className = '',
            onClick = null
        } = options;

        const card = document.createElement('div');
        card.className = 'card';

        // Clases adicionales
        if (size) card.classList.add(`card-${size}`);
        if (variant) {
            card.classList.add(gradient ? `card-gradient-${variant}` : `card-${variant}`);
        }
        if (hover) card.classList.add('card-hover');
        if (glow) card.classList.add(`card-glow${variant ? `-${variant}` : ''}`);
        if (className) card.className += ` ${className}`;

        // Badge
        if (badge) {
            const badgeEl = document.createElement('div');
            badgeEl.className = `card-badge${badge.variant ? ` card-badge-${badge.variant}` : ''}`;
            badgeEl.textContent = badge.text;
            card.appendChild(badgeEl);
        }

        // Ribbon
        if (ribbon) {
            const ribbonEl = document.createElement('div');
            ribbonEl.className = 'card-ribbon';
            ribbonEl.textContent = ribbon;
            card.appendChild(ribbonEl);
        }

        // Imagen
        if (image) {
            const img = document.createElement('img');
            img.className = imagePosition === 'left' ? 'card-img-left' : 'card-img-top';
            img.src = image;
            img.alt = title || 'Card image';
            card.appendChild(img);
        }

        // Header
        if (title || actions.length > 0) {
            const header = document.createElement('div');
            header.className = 'card-header';

            if (title) {
                const titleContainer = document.createElement('div');
                const titleEl = document.createElement('h3');
                titleEl.className = 'card-title';
                titleEl.innerHTML = title;
                titleContainer.appendChild(titleEl);

                if (subtitle) {
                    const subtitleEl = document.createElement('p');
                    subtitleEl.className = 'card-subtitle';
                    subtitleEl.textContent = subtitle;
                    titleContainer.appendChild(subtitleEl);
                }

                header.appendChild(titleContainer);
            }

            if (actions.length > 0) {
                const actionsEl = document.createElement('div');
                actionsEl.className = 'card-actions';
                actions.forEach(action => {
                    actionsEl.appendChild(action);
                });
                header.appendChild(actionsEl);
            }

            card.appendChild(header);
        }

        // Body
        const bodyEl = document.createElement('div');
        bodyEl.className = 'card-body';
        if (typeof body === 'string') {
            bodyEl.innerHTML = body;
        } else {
            bodyEl.appendChild(body);
        }
        card.appendChild(bodyEl);

        // Footer
        if (footer) {
            const footerEl = document.createElement('div');
            footerEl.className = 'card-footer';
            if (typeof footer === 'string') {
                footerEl.innerHTML = footer;
            } else {
                footerEl.appendChild(footer);
            }
            card.appendChild(footerEl);
        }

        // Evento click
        if (onClick) {
            card.style.cursor = 'pointer';
            card.addEventListener('click', onClick);
        }

        return card;
    }

    // Crear card de estadística
    createStats(options) {
        const {
            icon = null,
            value = '0',
            label = 'Stat',
            variant = 'primary',
            trend = null
        } = options;

        const body = `
            ${icon ? `<div class="card-stats-icon"><i class="${icon}"></i></div>` : ''}
            <div class="card-stats-value">${value}</div>
            <div class="card-stats-label">${label}</div>
            ${trend ? `<div style="margin-top: 1rem; font-size: 0.85rem; color: ${trend > 0 ? 'var(--color-success)' : 'var(--color-error)'}">
                <i class="fas fa-arrow-${trend > 0 ? 'up' : 'down'}"></i> ${Math.abs(trend)}%
            </div>` : ''}
        `;

        return this.create({
            body,
            variant,
            className: 'card-stats'
        });
    }

    // Crear card de perfil
    createProfile(options) {
        const {
            avatar = null,
            name = 'User Name',
            role = 'Role',
            bio = null,
            actions = []
        } = options;

        const body = `
            ${avatar ? `<img src="${avatar}" alt="${name}" class="card-profile-avatar">` : ''}
            <div class="card-profile-name">${name}</div>
            <div class="card-profile-role">${role}</div>
            ${bio ? `<p class="card-profile-bio">${bio}</p>` : ''}
        `;

        return this.create({
            body,
            footer: actions.length > 0 ? this.createActionsFooter(actions) : null,
            className: 'card-profile'
        });
    }

    // Helper para crear footer con acciones
    createActionsFooter(actions) {
        const footer = document.createElement('div');
        footer.style.display = 'flex';
        footer.style.gap = 'var(--space-2)';
        footer.style.justifyContent = 'center';
        
        actions.forEach(action => {
            footer.appendChild(action);
        });
        
        return footer;
    }
}

// Crear instancia global
const cardComponent = new Card();

// Exportar para uso en módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Card;
}