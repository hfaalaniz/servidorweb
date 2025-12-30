/* ============================================
   SIDEBAR.JS - COMPONENTE SIDEBAR
   Framework Personal - Barra Lateral
   ============================================ */

class Sidebar {
    constructor(element, options = {}) {
        this.sidebar = element;
        this.toggle = document.querySelector('[data-sidebar-toggle]');
        this.close = element.querySelector('[data-sidebar-close]');
        this.overlay = document.querySelector('[data-sidebar-overlay]');
        this.submenuTriggers = element.querySelectorAll('[data-sidebar-submenu-trigger]');
        
        this.options = {
            startCollapsed: false,
            persistState: true,
            ...options
        };

        this.isOpen = false;
        this.isCollapsed = this.options.startCollapsed;
        
        this.init();
    }

    init() {
        // Restaurar estado guardado
        if (this.options.persistState) {
            const savedState = localStorage.getItem('sidebar-collapsed');
            if (savedState !== null) {
                this.isCollapsed = savedState === 'true';
            }
        }

        if (this.isCollapsed) {
            this.sidebar.classList.add('sidebar--collapsed');
        }

        // Toggle sidebar (desktop - colapsar)
        if (this.toggle) {
            this.toggle.addEventListener('click', () => {
                if (window.innerWidth > 1024) {
                    this.toggleCollapse();
                } else {
                    this.toggleOpen();
                }
            });
        }

        // Close button (mobile)
        if (this.close) {
            this.close.addEventListener('click', () => this.closeSidebar());
        }

        // Overlay click (mobile)
        if (this.overlay) {
            this.overlay.addEventListener('click', () => this.closeSidebar());
        }

        // Submenu toggles
        this.submenuTriggers.forEach(trigger => {
            trigger.addEventListener('click', (e) => {
                e.preventDefault();
                this.toggleSubmenu(trigger);
            });
        });

        // Handle resize
        window.addEventListener('resize', () => this.handleResize());

        // ESC key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeSidebar();
            }
        });

        // Active link highlight
        this.highlightActiveLink();
    }

    toggleOpen() {
        this.isOpen ? this.closeSidebar() : this.openSidebar();
    }

    openSidebar() {
        this.sidebar.classList.add('sidebar--open');
        if (this.overlay) {
            this.overlay.classList.add('sidebar-overlay--active');
        }
        document.body.style.overflow = 'hidden';
        this.isOpen = true;

        // Evento
        this.sidebar.dispatchEvent(new CustomEvent('sidebar:open'));
    }

    closeSidebar() {
        this.sidebar.classList.remove('sidebar--open');
        if (this.overlay) {
            this.overlay.classList.remove('sidebar-overlay--active');
        }
        document.body.style.overflow = '';
        this.isOpen = false;

        // Evento
        this.sidebar.dispatchEvent(new CustomEvent('sidebar:close'));
    }

    toggleCollapse() {
        this.isCollapsed = !this.isCollapsed;
        this.sidebar.classList.toggle('sidebar--collapsed');

        // Cerrar todos los submenus al colapsar
        if (this.isCollapsed) {
            this.closeAllSubmenus();
        }

        // Guardar estado
        if (this.options.persistState) {
            localStorage.setItem('sidebar-collapsed', this.isCollapsed);
        }

        // Evento
        this.sidebar.dispatchEvent(new CustomEvent('sidebar:collapse', {
            detail: { collapsed: this.isCollapsed }
        }));
    }

    toggleSubmenu(trigger) {
        const submenu = trigger.nextElementSibling;
        if (!submenu || !submenu.classList.contains('sidebar-submenu')) return;

        const isOpen = submenu.classList.contains('sidebar-submenu--open');

        // Cerrar otros submenus (accordion behavior)
        this.closeAllSubmenus();

        // Toggle este submenu
        if (!isOpen) {
            submenu.classList.add('sidebar-submenu--open');
            trigger.classList.add('sidebar-link--expanded');
            trigger.setAttribute('aria-expanded', 'true');
        }
    }

    closeAllSubmenus() {
        const allSubmenus = this.sidebar.querySelectorAll('.sidebar-submenu');
        const allTriggers = this.sidebar.querySelectorAll('[data-sidebar-submenu-trigger]');

        allSubmenus.forEach(submenu => {
            submenu.classList.remove('sidebar-submenu--open');
        });

        allTriggers.forEach(trigger => {
            trigger.classList.remove('sidebar-link--expanded');
            trigger.setAttribute('aria-expanded', 'false');
        });
    }

    highlightActiveLink() {
        const currentPath = window.location.pathname;
        const links = this.sidebar.querySelectorAll('.sidebar-link, .sidebar-submenu__link');

        links.forEach(link => {
            const href = link.getAttribute('href');
            
            if (href && href === currentPath) {
                link.classList.add('sidebar-link--active');
                
                // Si está en un submenu, expandirlo
                const submenu = link.closest('.sidebar-submenu');
                if (submenu) {
                    submenu.classList.add('sidebar-submenu--open');
                    const trigger = submenu.previousElementSibling;
                    if (trigger) {
                        trigger.classList.add('sidebar-link--expanded');
                        trigger.setAttribute('aria-expanded', 'true');
                    }
                }
            }
        });
    }

    handleResize() {
        if (window.innerWidth > 1024) {
            this.closeSidebar();
        }
    }

    destroy() {
        this.closeSidebar();
        this.closeAllSubmenus();
    }
}

// Auto-inicialización
document.addEventListener('DOMContentLoaded', () => {
    const sidebars = document.querySelectorAll('[data-sidebar]');
    sidebars.forEach(el => {
        const startCollapsed = el.dataset.sidebarCollapsed === 'true';
        new Sidebar(el, { startCollapsed });
    });
});

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Sidebar;
}