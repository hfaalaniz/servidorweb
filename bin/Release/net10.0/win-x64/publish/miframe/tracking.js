/* ============================================
   Sistema de monitoreo - LÓGICA PRINCIPAL
   Integrado con Framework Personal
   ============================================ */

// Configuración global
const TrackingApp = {
    supabase: null,
    instancias: [],
    instanciaSeleccionada: null,
    suscripcionActiva: null,
    chartTipo: null,
    chartSO: null,
    filtros: {
        tipo: '',
        busqueda: ''
    },
    
    // Inicialización
    async init() {
        console.log('🚀 Iniciando Sistema de monitoreo...');
        
        try {
            // Verificar que config.js esté cargado
            if (!window.SUPABASE_CONFIG) {
                console.warn('⚠️ Configuración de Supabase no encontrada - Iniciando en modo DEMO');
                this.actualizarEstadoConexion(false);
                this.cargarDatosDemostracion();
                return;
            }
            
            // Debug: Mostrar configuración recibida (sin mostrar la key completa por seguridad)
            console.log('🔍 Configuración detectada:', {
                url: window.SUPABASE_CONFIG.url,
                keyLength: window.SUPABASE_CONFIG.key ? window.SUPABASE_CONFIG.key.length : 0,
                keyStart: window.SUPABASE_CONFIG.key ? window.SUPABASE_CONFIG.key.substring(0, 10) + '...' : 'N/A'
            });
            
            // Verificar si las credenciales están configuradas (validación más flexible)
            const urlValida = window.SUPABASE_CONFIG.url && 
                             window.SUPABASE_CONFIG.url !== 'TU_SUPABASE_URL' &&
                             window.SUPABASE_CONFIG.url.trim().length > 10 &&
                             (window.SUPABASE_CONFIG.url.startsWith('http://') || 
                              window.SUPABASE_CONFIG.url.startsWith('https://'));
            
            const keyValida = window.SUPABASE_CONFIG.key && 
                             window.SUPABASE_CONFIG.key !== 'TU_SUPABASE_ANON_KEY' &&
                             window.SUPABASE_CONFIG.key.trim().length > 20;
            
            // Debug: Mostrar resultado de validación
            console.log('🔍 Validación de credenciales:', {
                urlValida,
                keyValida,
                urlLength: window.SUPABASE_CONFIG.url ? window.SUPABASE_CONFIG.url.length : 0,
                keyLength: window.SUPABASE_CONFIG.key ? window.SUPABASE_CONFIG.key.length : 0
            });
            
            if (!urlValida || !keyValida) {
                if (!urlValida) {
                    console.warn('❌ URL no válida. Debe ser una URL completa (http:// o https://)');
                }
                if (!keyValida) {
                    console.warn('❌ Key no válida. Debe tener más de 20 caracteres');
                }
                console.warn('⚠️ Iniciando en modo DEMO');
                console.info('💡 Edita config.js con tus credenciales reales de Supabase para conectar a tu base de datos');
                this.actualizarEstadoConexion(false);
                this.cargarDatosDemostracion();
                if (typeof toast !== 'undefined') {
                    toast.warning('Usando datos de demostración. Configura Supabase en config.js', 'Modo Demo');
                }
                return;
            }
            
            console.log('✅ Credenciales válidas - Intentando conectar con Supabase...');
            
            // Inicializar Supabase solo si las credenciales son válidas
            this.supabase = supabase.createClient(
                window.SUPABASE_CONFIG.url,
                window.SUPABASE_CONFIG.key
            );
            
            console.log('✅ Cliente Supabase creado correctamente');
            
            // Actualizar estado de conexión
            this.actualizarEstadoConexion(true);
            
            // Cargar datos iniciales
            console.log('📡 Intentando cargar datos desde Supabase...');
            await this.cargarDatos();
            
            // Configurar suscripción en tiempo real
            this.configurarSuscripcionRealtime();
            
            // Configurar actualización automática cada 30 segundos
            setInterval(() => this.actualizarStats(), 30000);
            
            // Inicializar gráficos
            this.inicializarGraficos();
            
            console.log('✅ Sistema de monitoreo iniciado correctamente con Supabase');
            
            // Mostrar mensaje de bienvenida
            if (typeof toast !== 'undefined') {
                toast.success('Sistema de monitoreo conectado a Supabase', '¡Conectado!');
            }
            
        } catch (error) {
            console.error('❌ Error al inicializar:', error);
            console.warn('⚠️ Iniciando en modo demostración debido al error');
            if (typeof toast !== 'undefined') {
                toast.warning('Error al conectar. Usando modo demostración', 'Modo Demo');
            }
            this.actualizarEstadoConexion(false);
            this.cargarDatosDemostracion();
        }
    },
    
    // Cargar datos de demostración
    cargarDatosDemostracion() {
        console.log('📊 Cargando datos de demostración...');
        
        this.instancias = [
            {
                id: 'demo-1',
                id_usuario: 'usuario_demo_1@example.com',
                session_id: 'session-demo-123',
                tipo_dispositivo: 'PC',
                navegador: 'Chrome 120',
                sistema_operativo: 'Windows 11',
                ubicacion: 'Buenos Aires, Argentina',
                ip: '192.168.1.1',
                tiempo_activo: 3600,
                last_ping: new Date().toISOString(),
                resolucion: '1920x1080',
                idioma: 'es-AR',
                zona_horaria: 'America/Argentina/Buenos_Aires'
            },
            {
                id: 'demo-2',
                id_usuario: 'usuario_demo_2@example.com',
                session_id: 'session-demo-456',
                tipo_dispositivo: 'Móvil',
                navegador: 'Safari 17',
                sistema_operativo: 'iOS 17',
                ubicacion: 'Santiago del Estero, Argentina',
                ip: '192.168.1.2',
                tiempo_activo: 1800,
                last_ping: new Date(Date.now() - 60000).toISOString(),
                resolucion: '390x844',
                idioma: 'es-AR',
                zona_horaria: 'America/Argentina/Buenos_Aires'
            },
            {
                id: 'demo-3',
                id_usuario: 'usuario_demo_3@example.com',
                session_id: 'session-demo-789',
                tipo_dispositivo: 'Tablet',
                navegador: 'Firefox 121',
                sistema_operativo: 'Android 14',
                ubicacion: 'Córdoba, Argentina',
                ip: '192.168.1.3',
                tiempo_activo: 2400,
                last_ping: new Date(Date.now() - 120000).toISOString(),
                resolucion: '768x1024',
                idioma: 'es-AR',
                zona_horaria: 'America/Argentina/Cordoba'
            }
        ];
        
        this.renderizarInstancias();
        this.inicializarGraficos();
        this.actualizarGraficos();
        
        // Actualizar stats con datos demo
        document.getElementById('statActivas').textContent = this.instancias.length;
        document.getElementById('statUsuarios').textContent = this.instancias.length;
        document.getElementById('statSesiones').textContent = this.instancias.length;
        document.getElementById('statTiempo').textContent = '40m';
        document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString('es-ES');
        
        // Timeline de actividad demo
        const timeline = document.getElementById('actividadTimeline');
        timeline.innerHTML = `
            <div class="timeline-item">
                <div class="timeline-content">
                    <div class="timeline-time">Hace 2 minutos</div>
                    <div class="timeline-text">🟢 <strong>Sesión iniciada</strong> - usuario_demo_3@example.com</div>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-content">
                    <div class="timeline-time">Hace 5 minutos</div>
                    <div class="timeline-text">🟢 <strong>Sesión iniciada</strong> - usuario_demo_2@example.com</div>
                </div>
            </div>
            <div class="timeline-item">
                <div class="timeline-content">
                    <div class="timeline-time">Hace 10 minutos</div>
                    <div class="timeline-text">🟢 <strong>Sesión iniciada</strong> - usuario_demo_1@example.com</div>
                </div>
            </div>
        `;
        
        console.log('✅ Modo demostración cargado - Configura Supabase para usar datos reales');
    },
    
    // Cargar todos los datos
    async cargarDatos() {
        try {
            await Promise.all([
                this.cargarInstancias(),
                this.actualizarStats(),
                this.cargarActividad()
            ]);
        } catch (error) {
            console.error('Error al cargar datos:', error);
            throw error;
        }
    },
    
    // Cargar instancias activas
    // Cargar instancias activas
    async cargarInstancias() {
        try {
            if (!this.supabase) {
                console.warn('Supabase no inicializado');
                return;
            }
            
            const ahora = new Date();
            const hace5Min = new Date(ahora - 5 * 60 * 1000);
            
            const { data, error } = await this.supabase
                .from('instancias_activas')
                .select('*')
                .gte('last_ping', hace5Min.toISOString())
                .order('last_ping', { ascending: false });
            
            if (error) {
                console.error('Error de Supabase:', error);
                throw error;
            }
            
            this.instancias = data || [];
            this.renderizarInstancias();
            
            // SOLO ACTUALIZAR GRÁFICOS SI ESTÁN INICIALIZADOS
            if (this.chartTipo && this.chartSO) {
                this.actualizarGraficos();
            }
            
            console.log(`📊 ${this.instancias.length} instancias activas cargadas`);
            
        } catch (error) {
            console.error('Error al cargar instancias:', error);
            if (typeof toast !== 'undefined') {
                toast.error('Error al cargar las instancias activas', 'Error');
            }
        }
    },
        
    // Renderizar lista de instancias
    renderizarInstancias() {
        const contenedor = document.getElementById('instanciasLista');
        
        // DEBUG: Verificar que el contenedor existe
        if (!contenedor) {
            console.error('❌ No se encontró el elemento #instanciasLista');
            return;
        }
        
        console.log(`🎨 Renderizando ${this.instancias.length} instancias`);
        console.log('📋 Datos de instancias:', this.instancias);
        
        if (!this.instancias || this.instancias.length === 0) {
            contenedor.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">📱</div>
                    <p>No hay instancias activas</p>
                    <p style="font-size: 0.85rem; opacity: 0.7; margin-top: 10px;">
                        Abre la página de prueba (test-tracking.html) para ver una conexión
                    </p>
                </div>
            `;
            return;
        }
        
        // Aplicar filtros
        let instanciasFiltradas = this.instancias;
        
        if (this.filtros.tipo) {
            instanciasFiltradas = instanciasFiltradas.filter(i => 
                i.tipo_dispositivo === this.filtros.tipo
            );
        }
        
        if (this.filtros.busqueda) {
            const busqueda = this.filtros.busqueda.toLowerCase();
            instanciasFiltradas = instanciasFiltradas.filter(i => 
                i.id_usuario?.toLowerCase().includes(busqueda) ||
                i.navegador?.toLowerCase().includes(busqueda) ||
                i.sistema_operativo?.toLowerCase().includes(busqueda) ||
                i.ubicacion?.toLowerCase().includes(busqueda)
            );
        }
        
        console.log(`🔍 Instancias después de filtros: ${instanciasFiltradas.length}`);
        
        if (instanciasFiltradas.length === 0) {
            contenedor.innerHTML = `
                <div class="empty-state">
                    <div class="empty-icon">🔍</div>
                    <p>No se encontraron instancias</p>
                </div>
            `;
            return;
        }
        
        // GENERAR HTML
        const html = instanciasFiltradas.map(instancia => {
            console.log('📄 Renderizando instancia:', instancia.id_usuario);
            
            return `
            <div class="card card-hover instancia-item ${this.instanciaSeleccionada?.id === instancia.id ? 'selected' : ''}" 
                onclick="TrackingApp.seleccionarInstancia('${instancia.id}')">
                <div class="card-body">
                    <div class="instancia-header">
                        <span class="instancia-nombre">
                            ${this.getIconoDispositivo(instancia.tipo_dispositivo)}
                            ${this.truncarTexto(instancia.id_usuario, 25)}
                        </span>
                        <span class="instancia-badge ${instancia.tipo_dispositivo.toLowerCase()}">
                            ${instancia.tipo_dispositivo}
                        </span>
                    </div>
                    <div class="instancia-info">
                        <div class="instancia-info-item">
                            <i class="fas fa-globe"></i>
                            ${instancia.navegador || 'Desconocido'}
                        </div>
                        <div class="instancia-info-item">
                            <i class="fas fa-laptop"></i>
                            ${instancia.sistema_operativo || 'Desconocido'}
                        </div>
                        <div class="instancia-info-item">
                            <i class="fas fa-map-marker-alt"></i>
                            ${instancia.ubicacion || 'Desconocida'}
                        </div>
                        <div class="instancia-info-item">
                            <i class="fas fa-clock"></i>
                            ${this.formatearTiempo(instancia.tiempo_activo)}
                        </div>
                    </div>
                    <div class="instancia-tiempo">
                        Última actividad: ${this.tiempoRelativo(instancia.last_ping)}
                    </div>
                </div>
            </div>
            `;
        }).join('');
        
        console.log('✅ HTML generado, insertando en DOM...');
        contenedor.innerHTML = html;
        console.log('✅ Instancias renderizadas exitosamente');
    },
    
    // Seleccionar instancia para ver detalles
    async seleccionarInstancia(id) {
        try {
            const instancia = this.instancias.find(i => i.id === id);
            if (!instancia) return;
            
            this.instanciaSeleccionada = instancia;
            
            let historial = [];
            
            // Cargar historial solo si supabase está disponible
            if (this.supabase) {
                const { data, error } = await this.supabase
                    .from('historial_conexiones')
                    .select('*')
                    .eq('id_usuario', instancia.id_usuario)
                    .order('inicio_sesion', { ascending: false })
                    .limit(10);
                
                if (!error && data) {
                    historial = data;
                }
            }
            
            this.mostrarDetalleInstancia(instancia, historial);
            this.renderizarInstancias();
            
        } catch (error) {
            console.error('Error al seleccionar instancia:', error);
            if (typeof toast !== 'undefined') {
                toast.error('Error al cargar los detalles', 'Error');
            }
        }
    },
    
    // Mostrar detalles de instancia
    mostrarDetalleInstancia(instancia, historial) {
        const panel = document.getElementById('detallePanel');
        const contenido = document.getElementById('detalleContenido');
        
        // Verificar múltiples sesiones activas
        const sesionesActivas = this.instancias.filter(i => 
            i.id_usuario === instancia.id_usuario
        );
        
        const alertaMultipleSesiones = sesionesActivas.length > 1 ? `
            <div class="alert-box">
                <strong>⚠️ Alerta de Seguridad</strong>
                <p>Este usuario tiene ${sesionesActivas.length} sesiones activas simultáneas</p>
            </div>
        ` : '';
        
        contenido.innerHTML = `
            ${alertaMultipleSesiones}
            
            <div class="detalle-grid">
                <div class="detalle-section">
                    <h3>Información General</h3>
                    <div class="detalle-item">
                        <span class="detalle-label">ID Usuario</span>
                        <span class="detalle-value">${instancia.id_usuario}</span>
                    </div>
                    <div class="detalle-item">
                        <span class="detalle-label">Session ID</span>
                        <span class="detalle-value">${this.truncarTexto(instancia.session_id, 20)}</span>
                    </div>
                    <div class="detalle-item">
                        <span class="detalle-label">Tiempo Activo</span>
                        <span class="detalle-value">${this.formatearTiempo(instancia.tiempo_activo)}</span>
                    </div>
                    <div class="detalle-item">
                        <span class="detalle-label">Estado</span>
                        <span class="detalle-value" style="color: var(--color-success);">
                            <i class="fas fa-circle" style="font-size: 8px;"></i> Activo
                        </span>
                    </div>
                </div>
                
                <div class="detalle-section">
                    <h3>Dispositivo</h3>
                    <div class="detalle-item">
                        <span class="detalle-label">Tipo</span>
                        <span class="detalle-value">${instancia.tipo_dispositivo}</span>
                    </div>
                    <div class="detalle-item">
                        <span class="detalle-label">Navegador</span>
                        <span class="detalle-value">${instancia.navegador || 'Desconocido'}</span>
                    </div>
                    <div class="detalle-item">
                        <span class="detalle-label">Sistema Operativo</span>
                        <span class="detalle-value">${instancia.sistema_operativo || 'Desconocido'}</span>
                    </div>
                    <div class="detalle-item">
                        <span class="detalle-label">Resolución</span>
                        <span class="detalle-value">${instancia.resolucion || 'N/A'}</span>
                    </div>
                </div>
                
                <div class="detalle-section">
                    <h3>Ubicación</h3>
                    <div class="detalle-item">
                        <span class="detalle-label">Ubicación</span>
                        <span class="detalle-value">${instancia.ubicacion || 'Desconocida'}</span>
                    </div>
                    <div class="detalle-item">
                        <span class="detalle-label">IP</span>
                        <span class="detalle-value">${instancia.ip || 'N/A'}</span>
                    </div>
                    <div class="detalle-item">
                        <span class="detalle-label">Idioma</span>
                        <span class="detalle-value">${instancia.idioma || 'N/A'}</span>
                    </div>
                    <div class="detalle-item">
                        <span class="detalle-label">Zona Horaria</span>
                        <span class="detalle-value">${instancia.zona_horaria || 'N/A'}</span>
                    </div>
                </div>
                
                <div class="detalle-section">
                    <h3>Historial de Sesiones (Últimas 10)</h3>
                    ${historial && historial.length > 0 ? `
                        <div style="font-size: var(--font-size-sm);">
                            ${historial.map(h => `
                                <div style="padding: var(--space-3) 0; border-bottom: 1px solid var(--glass-border);">
                                    <div style="display: flex; justify-content: space-between; margin-bottom: var(--space-1);">
                                        <span style="font-weight: 600; color: var(--color-white);">${new Date(h.inicio_sesion).toLocaleDateString('es-ES')}</span>
                                        <span style="color: var(--color-primary);">${this.formatearTiempo(h.duracion)}</span>
                                    </div>
                                    <div style="color: var(--color-gray-400); font-size: var(--font-size-xs);">
                                        ${new Date(h.inicio_sesion).toLocaleTimeString('es-ES')} - 
                                        ${h.fin_sesion ? new Date(h.fin_sesion).toLocaleTimeString('es-ES') : 'En curso'}
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <p style="color: var(--color-gray-500); font-size: var(--font-size-sm); padding: var(--space-4) 0;">
                            No hay historial disponible
                        </p>
                    `}
                </div>
            </div>
            
            <div style="margin-top: var(--space-6); padding-top: var(--space-6); border-top: 1px solid var(--glass-border); display: flex; gap: var(--space-3); flex-wrap: wrap;">
                <button onclick="TrackingApp.exportarUsuario('${instancia.id_usuario}')" class="btn btn-primary" style="flex: 1; min-width: 150px;">
                    <i class="fas fa-download"></i>
                    <span>Exportar Datos</span>
                </button>
                <button onclick="TrackingApp.verMapaUsuario('${instancia.id_usuario}')" class="btn btn-success" style="flex: 1; min-width: 150px;">
                    <i class="fas fa-map-marked-alt"></i>
                    <span>Ver Mapa</span>
                </button>
            </div>
        `;
        
        panel.style.display = 'block';
    },
    
    // Cerrar panel de detalles
    cerrarDetalle() {
        document.getElementById('detallePanel').style.display = 'none';
        this.instanciaSeleccionada = null;
        this.renderizarInstancias();
    },
    
    // Actualizar estadísticas
    async actualizarStats() {
        try {
            if (!this.supabase) {
                console.warn('Supabase no inicializado - Stats no actualizadas');
                return;
            }
            
            const ahora = new Date();
            const hace5Min = new Date(ahora - 5 * 60 * 1000);
            const inicioHoy = new Date(ahora.setHours(0, 0, 0, 0));
            
            // Instancias activas
            const { count: instanciasActivas } = await this.supabase
                .from('instancias_activas')
                .select('*', { count: 'exact', head: true })
                .gte('last_ping', hace5Min.toISOString());
            
            // Usuarios únicos activos
            const { data: usuariosActivos } = await this.supabase
                .from('instancias_activas')
                .select('id_usuario')
                .gte('last_ping', hace5Min.toISOString());
            
            const usuariosUnicos = new Set(usuariosActivos?.map(u => u.id_usuario) || []).size;
            
            // Sesiones hoy
            const { count: sesionesHoy } = await this.supabase
                .from('historial_conexiones')
                .select('*', { count: 'exact', head: true })
                .gte('inicio_sesion', inicioHoy.toISOString());
            
            // Tiempo promedio
            const { data: duraciones } = await this.supabase
                .from('historial_conexiones')
                .select('duracion')
                .gte('inicio_sesion', inicioHoy.toISOString())
                .not('duracion', 'is', null);
            
            let tiempoPromedio = 0;
            if (duraciones && duraciones.length > 0) {
                const total = duraciones.reduce((sum, d) => sum + (d.duracion || 0), 0);
                tiempoPromedio = Math.floor(total / duraciones.length);
            }
            
            // Actualizar UI con animación
            this.actualizarStatConAnimacion('statActivas', instanciasActivas || 0);
            this.actualizarStatConAnimacion('statUsuarios', usuariosUnicos || 0);
            this.actualizarStatConAnimacion('statSesiones', sesionesHoy || 0);
            document.getElementById('statTiempo').textContent = this.formatearTiempo(tiempoPromedio);
            
            // Actualizar última actualización
            document.getElementById('lastUpdate').textContent = new Date().toLocaleTimeString('es-ES');
            
        } catch (error) {
            console.error('Error al actualizar stats:', error);
        }
    },
    
    // Actualizar estadística con animación
    actualizarStatConAnimacion(elementId, valorNuevo) {
        const elemento = document.getElementById(elementId);
        const valorActual = parseInt(elemento.textContent) || 0;
        
        if (valorActual === valorNuevo) return;
        
        const duracion = 500;
        const pasos = 20;
        const incremento = (valorNuevo - valorActual) / pasos;
        let paso = 0;
        
        const intervalo = setInterval(() => {
            paso++;
            const valor = Math.round(valorActual + (incremento * paso));
            elemento.textContent = valor;
            
            if (paso >= pasos) {
                clearInterval(intervalo);
                elemento.textContent = valorNuevo;
            }
        }, duracion / pasos);
    },
    
    // Cargar actividad reciente
    async cargarActividad() {
        try {
            if (!this.supabase) {
                console.warn('Supabase no inicializado - Actividad no cargada');
                return;
            }
            
            const { data, error } = await this.supabase
                .from('historial_conexiones')
                .select('*')
                .order('inicio_sesion', { ascending: false })
                .limit(10);
            
            if (error) throw error;
            
            this.renderizarActividad(data || []);
            
        } catch (error) {
            console.error('Error al cargar actividad:', error);
        }
    },
    
    // Renderizar timeline de actividad
    renderizarActividad(actividades) {
        const timeline = document.getElementById('actividadTimeline');
        
        if (!actividades || actividades.length === 0) {
            timeline.innerHTML = `
                <div class="empty-state">
                    <p>No hay actividad reciente</p>
                </div>
            `;
            return;
        }
        
        timeline.innerHTML = actividades.map(act => {
            const tipo = act.fin_sesion ? 'Sesión finalizada' : 'Sesión iniciada';
            const icono = act.fin_sesion ? '🔴' : '🟢';
            
            return `
                <div class="timeline-item">
                    <div class="timeline-content">
                        <div class="timeline-time">
                            ${this.tiempoRelativo(act.inicio_sesion)}
                        </div>
                        <div class="timeline-text">
                            ${icono} <strong>${tipo}</strong> - ${this.truncarTexto(act.id_usuario, 30)}
                            ${act.duracion ? `<span style="color: var(--color-gray-500);">(${this.formatearTiempo(act.duracion)})</span>` : ''}
                        </div>
                    </div>
                </div>
            `;
        }).join('');
    },
    
    // Configurar suscripción en tiempo real
    configurarSuscripcionRealtime() {
        try {
            if (!this.supabase) {
                console.warn('Supabase no inicializado - Realtime no configurado');
                return;
            }
            
            this.suscripcionActiva = this.supabase
                .channel('tracking-changes')
                .on(
                    'postgres_changes',
                    {
                        event: '*',
                        schema: 'public',
                        table: 'instancias_activas'
                    },
                    (payload) => {
                        console.log('🔄 Cambio detectado:', payload);
                        this.manejarCambioRealtime(payload);
                    }
                )
                .subscribe((status) => {
                    console.log('Suscripción realtime:', status);
                });
            
            console.log('✅ Suscripción realtime configurada');
            
        } catch (error) {
            console.error('Error al configurar suscripción realtime:', error);
        }
    },
    
    // Manejar cambios en tiempo real
    manejarCambioRealtime(payload) {
        const { eventType, new: newRecord, old: oldRecord } = payload;
        
        switch (eventType) {
            case 'INSERT':
                this.instancias.unshift(newRecord);
                if (typeof toast !== 'undefined') {
                    toast.info(`Nueva instancia conectada: ${this.truncarTexto(newRecord.id_usuario, 20)}`, 'Nueva Conexión');
                }
                break;
            case 'UPDATE':
                const indexUpdate = this.instancias.findIndex(i => i.id === newRecord.id);
                if (indexUpdate !== -1) {
                    this.instancias[indexUpdate] = newRecord;
                }
                break;
            case 'DELETE':
                this.instancias = this.instancias.filter(i => i.id !== oldRecord.id);
                if (typeof toast !== 'undefined') {
                    toast.warning(`Instancia desconectada: ${this.truncarTexto(oldRecord.id_usuario, 20)}`, 'Desconexión');
                }
                break;
        }
        
        this.renderizarInstancias();
        this.actualizarStats();
        this.actualizarGraficos();
        this.cargarActividad();
    },
    
    // Inicializar gráficos
    inicializarGraficos() {
        const ctxTipo = document.getElementById('chartTipo').getContext('2d');
        const ctxSO = document.getElementById('chartSO').getContext('2d');
        
        // Colores del tema
        const colores = [
            'rgba(102, 126, 234, 0.8)',
            'rgba(16, 185, 129, 0.8)',
            'rgba(139, 92, 246, 0.8)',
            'rgba(245, 158, 11, 0.8)',
            'rgba(239, 68, 68, 0.8)'
        ];
        
        this.chartTipo = new Chart(ctxTipo, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: colores,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: 'rgba(255, 255, 255, 0.8)',
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });
        
        this.chartSO = new Chart(ctxSO, {
            type: 'doughnut',
            data: {
                labels: [],
                datasets: [{
                    data: [],
                    backgroundColor: colores,
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: 'rgba(255, 255, 255, 0.8)',
                            padding: 15,
                            font: {
                                size: 12
                            }
                        }
                    }
                }
            }
        });
    },
    
    // Actualizar gráficos
    // Actualizar gráficos
    actualizarGraficos() {
        // VERIFICAR QUE LOS GRÁFICOS ESTÉN INICIALIZADOS
        if (!this.chartTipo || !this.chartSO) {
            console.warn('⚠️ Gráficos no inicializados aún');
            return;
        }
        
        if (!this.instancias || this.instancias.length === 0) {
            // Limpiar gráficos si no hay datos
            this.chartTipo.data.labels = [];
            this.chartTipo.data.datasets[0].data = [];
            this.chartTipo.update();
            
            this.chartSO.data.labels = [];
            this.chartSO.data.datasets[0].data = [];
            this.chartSO.update();
            return;
        }
        
        // Gráfico por tipo de dispositivo
        const tiposCont = {};
        this.instancias.forEach(i => {
            tiposCont[i.tipo_dispositivo] = (tiposCont[i.tipo_dispositivo] || 0) + 1;
        });
        
        this.chartTipo.data.labels = Object.keys(tiposCont);
        this.chartTipo.data.datasets[0].data = Object.values(tiposCont);
        this.chartTipo.update();
        
        // Gráfico por sistema operativo
        const sosCont = {};
        this.instancias.forEach(i => {
            const so = i.sistema_operativo || 'Desconocido';
            sosCont[so] = (sosCont[so] || 0) + 1;
        });
        
        this.chartSO.data.labels = Object.keys(sosCont);
        this.chartSO.data.datasets[0].data = Object.values(sosCont);
        this.chartSO.update();
    },
    
    // Filtrar instancias
    filtrar() {
        this.filtros.tipo = document.getElementById('filterTipo').value;
        this.renderizarInstancias();
        if (typeof toast !== 'undefined' && this.filtros.tipo) {
            toast.info(`Filtrado por: ${this.filtros.tipo}`, 'Filtro Aplicado');
        }
    },
    
    // Buscar instancias
    buscar() {
        this.filtros.busqueda = document.getElementById('searchInstancias').value;
        this.renderizarInstancias();
    },
    
    // Refrescar datos
    async refrescar() {
        console.log('🔄 Refrescando datos...');
        if (typeof toast !== 'undefined') {
            toast.info('Actualizando datos...', 'Refrescando');
        }
        await this.cargarDatos();
        if (typeof toast !== 'undefined') {
            toast.success('Datos actualizados correctamente', '¡Actualizado!');
        }
    },
    
    // Cambiar período de gráficos
    async cambiarPeriodo() {
        const periodo = document.getElementById('chartPeriod').value;
        console.log('📊 Cambiando período:', periodo);
        if (typeof toast !== 'undefined') {
            toast.info(`Período cambiado a: ${periodo}`, 'Período Actualizado');
        }
        this.actualizarGraficos();
    },
    
    // Exportar datos generales
    async exportar() {
        try {
            console.log('📥 Exportando datos...');
            
            let loadingToast = null;
            if (typeof toast !== 'undefined') {
                loadingToast = toast.show({
                    type: 'info',
                    title: 'Exportando...',
                    message: 'Generando archivo de exportación',
                    duration: 0
                });
            }
            
            const ahora = new Date();
            const datos = {
                fecha_exportacion: ahora.toISOString(),
                instancias_activas: this.instancias,
                total_instancias: this.instancias.length,
                usuarios_unicos: new Set(this.instancias.map(i => i.id_usuario)).size,
                estadisticas: {
                    por_tipo: {},
                    por_so: {},
                    por_ubicacion: {}
                }
            };
            
            // Calcular estadísticas
            this.instancias.forEach(i => {
                datos.estadisticas.por_tipo[i.tipo_dispositivo] = 
                    (datos.estadisticas.por_tipo[i.tipo_dispositivo] || 0) + 1;
                
                datos.estadisticas.por_so[i.sistema_operativo || 'Desconocido'] = 
                    (datos.estadisticas.por_so[i.sistema_operativo || 'Desconocido'] || 0) + 1;
                
                datos.estadisticas.por_ubicacion[i.ubicacion || 'Desconocida'] = 
                    (datos.estadisticas.por_ubicacion[i.ubicacion || 'Desconocida'] || 0) + 1;
            });
            
            // Crear y descargar archivo JSON
            const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tracking-export-${ahora.toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // Cerrar toast de loading
            if (loadingToast && loadingToast.remove) {
                loadingToast.remove();
            }
            
            if (typeof toast !== 'undefined') {
                toast.success('Datos exportados correctamente', '¡Exportado!');
            }
            
        } catch (error) {
            console.error('Error al exportar:', error);
            if (typeof toast !== 'undefined') {
                toast.error('Error al exportar datos', 'Error');
            }
        }
    },
    
    // Exportar datos de un usuario específico
    async exportarUsuario(idUsuario) {
        try {
            console.log('📥 Exportando datos del usuario:', idUsuario);
            
            let loadingToast = null;
            if (typeof toast !== 'undefined') {
                loadingToast = toast.show({
                    type: 'info',
                    title: 'Exportando...',
                    message: 'Recopilando datos del usuario',
                    duration: 0
                });
            }
            
            let historial = [];
            
            // Obtener historial solo si supabase está disponible
            if (this.supabase) {
                const { data, error } = await this.supabase
                    .from('historial_conexiones')
                    .select('*')
                    .eq('id_usuario', idUsuario)
                    .order('inicio_sesion', { ascending: false });
                
                if (!error && data) {
                    historial = data;
                }
            }
            
            const instanciasUsuario = this.instancias.filter(i => i.id_usuario === idUsuario);
            
            const datos = {
                fecha_exportacion: new Date().toISOString(),
                id_usuario: idUsuario,
                instancias_activas: instanciasUsuario,
                historial_completo: historial,
                estadisticas: {
                    total_sesiones: historial.length,
                    sesiones_activas: instanciasUsuario.length,
                    tiempo_total: historial.reduce((sum, h) => sum + (h.duracion || 0), 0),
                    dispositivos_usados: [...new Set(instanciasUsuario.map(i => i.tipo_dispositivo))],
                    ubicaciones: [...new Set(instanciasUsuario.map(i => i.ubicacion))]
                }
            };
            
            // Crear y descargar archivo JSON
            const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `usuario-${idUsuario}-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            // Cerrar toast de loading
            if (loadingToast && loadingToast.remove) {
                loadingToast.remove();
            }
            
            if (typeof toast !== 'undefined') {
                toast.success('Datos del usuario exportados', '¡Exportado!');
            }
            
        } catch (error) {
            console.error('Error al exportar usuario:', error);
            if (typeof toast !== 'undefined') {
                toast.error('Error al exportar datos del usuario', 'Error');
            }
        }
    },
    
    // Ver mapa de ubicaciones del usuario
    async verMapaUsuario(idUsuario) {
        try {
            let ubicaciones = [];
            
            // Obtener ubicaciones solo si supabase está disponible
            if (this.supabase) {
                const { data: historial, error } = await this.supabase
                    .from('historial_conexiones')
                    .select('ubicacion, ip')
                    .eq('id_usuario', idUsuario);
                
                if (!error && historial) {
                    ubicaciones = [...new Set(historial.map(h => h.ubicacion).filter(Boolean))];
                }
            } else {
                // En modo demo, usar ubicaciones de instancias actuales
                ubicaciones = [...new Set(
                    this.instancias
                        .filter(i => i.id_usuario === idUsuario)
                        .map(i => i.ubicacion)
                        .filter(Boolean)
                )];
            }
            
            // Usar modal del framework si está disponible
            if (typeof modal !== 'undefined' && modal.alert) {
                modal.alert({
                    title: 'Ubicaciones del Usuario',
                    message: ubicaciones.length > 0 
                        ? `<p>Ubicaciones registradas:</p><ul style="margin-top: var(--space-3); padding-left: var(--space-6);">${ubicaciones.map(u => `<li style="margin: var(--space-2) 0;">${u}</li>`).join('')}</ul>` 
                        : '<p>No hay ubicaciones registradas para este usuario.</p>',
                    variant: 'info'
                });
            } else {
                // Fallback a alert nativo
                alert(`Ubicaciones del usuario ${idUsuario}:\n\n${ubicaciones.length > 0 ? ubicaciones.join('\n') : 'No hay ubicaciones registradas'}`);
            }
            
            // TODO: Implementar visualización de mapa real con Google Maps o Leaflet
            console.log('Ubicaciones del usuario:', ubicaciones);
            
        } catch (error) {
            console.error('Error al obtener ubicaciones:', error);
            if (typeof toast !== 'undefined') {
                toast.error('Error al obtener ubicaciones', 'Error');
            }
        }
    },
    
    // Actualizar estado de conexión
    actualizarEstadoConexion(conectado) {
        const statusEl = document.getElementById('connectionStatus');
        if (conectado) {
            statusEl.classList.remove('disconnected');
            statusEl.querySelector('.status-text').textContent = 'Conectado';
        } else {
            statusEl.classList.add('disconnected');
            statusEl.querySelector('.status-text').textContent = 'Desconectado';
        }
    },
    
    // Utilidades
    getIconoDispositivo(tipo) {
        const iconos = {
            'PC': '💻',
            'Móvil': '📱',
            'Tablet': '📱'
        };
        return iconos[tipo] || '🖥️';
    },
    
    formatearTiempo(segundos) {
        if (!segundos || segundos === 0) return '0m';
        
        const horas = Math.floor(segundos / 3600);
        const minutos = Math.floor((segundos % 3600) / 60);
        
        if (horas > 0) {
            return `${horas}h ${minutos}m`;
        }
        return `${minutos}m`;
    },
    
    tiempoRelativo(fecha) {
        const ahora = new Date();
        const entonces = new Date(fecha);
        const diff = Math.floor((ahora - entonces) / 1000);
        
        if (diff < 60) return 'Hace unos segundos';
        if (diff < 3600) return `Hace ${Math.floor(diff / 60)} min`;
        if (diff < 86400) return `Hace ${Math.floor(diff / 3600)} horas`;
        return `Hace ${Math.floor(diff / 86400)} días`;
    },
    
    truncarTexto(texto, maxLength) {
        if (!texto) return '';
        return texto.length > maxLength ? texto.substring(0, maxLength) + '...' : texto;
    }
};

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    TrackingApp.init();
});

// Limpiar suscripciones al cerrar
window.addEventListener('beforeunload', () => {
    if (TrackingApp.suscripcionActiva) {
        TrackingApp.supabase.removeChannel(TrackingApp.suscripcionActiva);
    }
});