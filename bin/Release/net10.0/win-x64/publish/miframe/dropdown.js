/* ============================================
   DROPDOWN.JS - COMPONENTE DROPDOWN
   Framework Personal - Menús Desplegables
   ============================================ */

class Dropdown {
    constructor(element) {
        this.dropdown = element;
        this.trigger = element.querySelector('[data-dropdown-trigger]');
        this.menu = element.querySelector('[data-dropdown-menu]');
        this.items = element.querySelectorAll('[data-dropdown-item]');
        this.isOpen = false;
        
        this.init();
    }

    init() {
        if (!this.trigger || !this.menu) return;

        // Event listeners
        this.trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });

        // Cerrar al hacer click fuera
        document.addEventListener('click', (e) => {
            if (!this.dropdown.contains(e.target) && this.isOpen) {
                this.close();
            }
        });

        // Cerrar con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Items clickeables
        this.items.forEach(item => {
            item.addEventListener('click', (e) => {
                const closeOnClick = item.dataset.dropdownClose !== 'false';
                if (closeOnClick) {
                    this.close();
                }
                
                // Callback personalizado
                const callback = item.dataset.dropdownCallback;
                if (callback && window[callback]) {
                    window[callback](e);
                }
            });
        });
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        this.menu.classList.add('dropdown-menu--open');
        this.trigger.setAttribute('aria-expanded', 'true');
        this.isOpen = true;

        // Posicionar el menú
        this.position();

        // Evento personalizado
        this.dropdown.dispatchEvent(new CustomEvent('dropdown:open', {
            detail: { dropdown: this }
        }));
    }

    close() {
        this.menu.classList.remove('dropdown-menu--open');
        this.trigger.setAttribute('aria-expanded', 'false');
        this.isOpen = false;

        // Evento personalizado
        this.dropdown.dispatchEvent(new CustomEvent('dropdown:close', {
            detail: { dropdown: this }
        }));
    }

    position() {
        const position = this.dropdown.dataset.dropdownPosition || 'bottom-start';
        const rect = this.trigger.getBoundingClientRect();
        const menuRect = this.menu.getBoundingClientRect();
        const spacing = 8;

        // Reset
        this.menu.style.top = '';
        this.menu.style.bottom = '';
        this.menu.style.left = '';
        this.menu.style.right = '';

        switch(position) {
            case 'bottom-start':
                this.menu.style.top = `calc(100% + ${spacing}px)`;
                this.menu.style.left = '0';
                break;
            case 'bottom-end':
                this.menu.style.top = `calc(100% + ${spacing}px)`;
                this.menu.style.right = '0';
                break;
            case 'top-start':
                this.menu.style.bottom = `calc(100% + ${spacing}px)`;
                this.menu.style.left = '0';
                break;
            case 'top-end':
                this.menu.style.bottom = `calc(100% + ${spacing}px)`;
                this.menu.style.right = '0';
                break;
            case 'left':
                this.menu.style.right = `calc(100% + ${spacing}px)`;
                this.menu.style.top = '0';
                break;
            case 'right':
                this.menu.style.left = `calc(100% + ${spacing}px)`;
                this.menu.style.top = '0';
                break;
        }
    }

    destroy() {
        this.close();
        // Remover listeners si es necesario
    }
}

// Auto-inicialización
document.addEventListener('DOMContentLoaded', () => {
    const dropdowns = document.querySelectorAll('[data-dropdown]');
    dropdowns.forEach(el => new Dropdown(el));
});

// Export para uso como módulo
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Dropdown;
}