/* ============================================
   NAVBAR.JS - COMPONENTE NAVBAR
   Framework Personal - Barra de Navegación
   ============================================ */

class Navbar {
    constructor(element, options = {}) {
        this.navbar = element;
        this.toggle = element.querySelector('[data-navbar-toggle]');
        this.menu = element.querySelector('[data-navbar-menu]');
        this.links = element.querySelectorAll('[data-navbar-link]');
        
        this.options = {
            scrollThreshold: 50,
            closeOnLinkClick: true,
            ...options
        };

        this.isOpen = false;
        this.lastScroll = 0;
        
        this.init();
    }

    init() {
        // Toggle menu mobile
        if (this.toggle && this.menu) {
            this.toggle.addEventListener('click', () => this.toggleMenu());
        }

        // Cerrar menú al hacer click en enlaces (mobile)
        if (this.options.closeOnLinkClick) {
            this.links.forEach(link => {
                link.addEventListener('click', () => {
                    if (window.innerWidth <= 768 && this.isOpen) {
                        this.closeMenu();
                    }
                });
            });
        }

        // Scroll effects
        this.handleScroll();
        window.addEventListener('scroll', () => this.handleScroll());

        // Resize handler
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isOpen) {
                this.closeMenu();
            }
        });

        // Cerrar menú con ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.closeMenu();
            }
        });

        // Active link on scroll
        this.highlightActiveSection();
        window.addEventListener('scroll', () => this.highlightActiveSection());
    }

    toggleMenu() {
        this.isOpen ? this.closeMenu() : this.openMenu();
    }

    openMenu() {
        this.menu.setAttribute('data-open', 'true');
        this.toggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
        this.isOpen = true;

        // Evento
        this.navbar.dispatchEvent(new CustomEvent('navbar:open'));
    }

    closeMenu() {
        this.menu.setAttribute('data-open', 'false');
        this.toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
        this.isOpen = false;

        // Evento
        this.navbar.dispatchEvent(new CustomEvent('navbar:close'));
    }

    handleScroll() {
        const currentScroll = window.pageYOffset;

        // Agregar clase cuando se hace scroll
        if (currentScroll > this.options.scrollThreshold) {
            this.navbar.classList.add('navbar--scrolled');
        } else {
            this.navbar.classList.remove('navbar--scrolled');
        }

        // Ocultar navbar al hacer scroll down (opcional)
        if (this.navbar.dataset.navbarHide === 'true') {
            if (currentScroll > this.lastScroll && currentScroll > 100) {
                this.navbar.style.transform = 'translateY(-100%)';
            } else {
                this.navbar.style.transform = 'translateY(0)';
            }
        }

        this.lastScroll = currentScroll;
    }

    highlightActiveSection() {
        // Solo si hay links con href a secciones
        const sections = document.querySelectorAll('section[id]');
        if (sections.length === 0) return;

        let currentSection = '';
        const scrollPosition = window.pageYOffset + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        this.links.forEach(link => {
            const href = link.getAttribute('href');
            if (!href || !href.startsWith('#')) return;

            link.classList.remove('navbar-link--active');
            
            if (href === `#${currentSection}`) {
                link.classList.add('navbar-link--active');
            }
        });
    }

    destroy() {
        if (this.isOpen) {
            this.closeMenu();
        }
    }
}

// Auto-inicialización
document.addEventListener('DOMContentLoaded', () => {
    const navbars = document.querySelectorAll('[data-navbar]');
    navbars.forEach(el => new Navbar(el));
});

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Navbar;
}