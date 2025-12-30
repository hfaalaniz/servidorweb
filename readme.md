# Servidor web estático mejorado

Un servidor web estático simple, ligero y portable desarrollado en **C# con ASP.NET Core**. Permite servir páginas web estáticas (HTML, CSS, JavaScript, imágenes, etc.) desde una carpeta local con un solo ejecutable.

Ideal para:
- Probar sitios web estáticos localmente.
- Compartir proyectos web sin necesidad de instalar un servidor (Nginx, Apache, etc.).
- Ejecutar dashboards, documentación o demos offline.
- Servir aplicaciones SPA (Single Page Application).


## Características

- **Ejecutable único** (single-file) – no requiere instalación de .NET en la máquina destino.
- Soporte para **HTTP** y **HTTPS** (con certificado de desarrollo auto-confiado).
- **Autenticación básica opcional** (usuario/contraseña) – protege el acceso pero permite cargar recursos estáticos (JS, CSS, imágenes) sin login.
- Configuración mediante **appsettings.json** (puertos, carpeta, autenticación, etc.).
- Compresión automática de respuestas (gzip/brotli).
- Soporte para `index.html` automático.
- Listado de directorios opcional (útil en desarrollo).
- Cross-platform (Windows, Linux, macOS) – aunque el ejecutable publicado aquí es para Windows x64.

## Requisitos

- Para **compilar** el proyecto: .NET 8.0 SDK (recomendado) o superior.
- Para **ejecutar** el ejecutable publicado: ningún requisito – es completamente autónomo (self-contained).


## Uso rápido (ejecutable publicado)

1. Descarga la última release o la carpeta `publish`.
2. Dentro de la carpeta `publish` coloca tus archivos estáticos en una subcarpeta llamada `miframe` (o cambia el nombre en `appsettings.json`).

publish/
├── EnhancedStaticWebServer.exe
├── appsettings.json
└── miframe/
├── index.html
├── assets/
└── ... (tus archivos)

3. (Opcional) Edita `appsettings.json` para cambiar puertos, usuario/contraseña, etc.
4. Ejecuta doble clic en `EnhancedStaticWebServer.exe`.
5. Abre el navegador:
- http://localhost:5000
- https://localhost:5001 (acepta el certificado de desarrollo si es necesario)

¡Listo! Tu sitio está servido.

## Configuración (appsettings.json)

```json
{
  "ServerSettings": {
  "Port": 5000,
  "HttpsPort": 5001,               // 0 para deshabilitar HTTPS
  "WebRootPath": "miframe",        // Carpeta con tus archivos estáticos (relativa al ejecutable)
  "EnableDirectoryBrowsing": false, // true solo en desarrollo
  "EnableAuthentication": true,    // false para acceso público completo
  "BasicAuth": {
    "Username": "admin",
    "Password": "cambia_esta_contraseña"
   }
 }
}
```
Compilar y publicar manualmente
Bash# Clonar el repositorio
git clone https://github.com/tu-usuario/EnhancedStaticWebServer.git
cd EnhancedStaticWebServer

# (Recomendado) Usar .NET 8.0
# Edita EnhancedStaticWebServer.csproj y asegúrate de tener <TargetFramework>net8.0</TargetFramework>

# Publicar como ejecutable único para Windows x64

dotnet publish -c Release -r win-x64 --self-contained true /p:PublishSingleFile=true /p:IncludeNativeLibrariesForSelfExtract=true

El ejecutable quedará en:
bin\Release\net8.0\win-x64\publish\EnhancedStaticWebServer.exe

# Ejemplo de uso con tu proyecto de Tracking
Este servidor fue creado específicamente para servir el Sistema de Tracking localmente:

Coloca toda la carpeta de tu proyecto web en miframe.
Todos los componentes (button.js, card.js, modal.js, toast.js, tracking.js, etc.) se cargan correctamente.
Conexión a Supabase funciona sin problemas.

Licencia
MIT License – siéntete libre de usar, modificar y distribuir.
Autor
Fabian Alaniz – Diciembre 2025
¡Disfruta de tu servidor web estático portable! 🚀#   s e r v i d o r _ w e b 
 
