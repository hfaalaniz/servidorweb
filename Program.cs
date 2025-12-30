using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Microsoft.Net.Http.Headers;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using System.Text.Encodings.Web;

var builder = WebApplication.CreateBuilder(args);

// Configuración
builder.Configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true);

var serverSettings = builder.Configuration.GetSection("ServerSettings");
int port = serverSettings.GetValue<int>("Port");
int httpsPort = serverSettings.GetValue<int>("HttpsPort");
string webRootRelative = serverSettings.GetValue<string>("WebRootPath") ?? "wwwroot";
bool enableDirectoryBrowsing = serverSettings.GetValue<bool>("EnableDirectoryBrowsing");
bool enableAuthentication = serverSettings.GetValue<bool>("EnableAuthentication");

string webRootPath = Path.GetFullPath(webRootRelative);

if (!Directory.Exists(webRootPath))
{
    Directory.CreateDirectory(webRootPath);
    Console.WriteLine($"Carpeta creada: {webRootPath}");
}

// Servicios
builder.Services.AddResponseCompression(options =>
{
    options.EnableForHttps = true;
    options.MimeTypes = new[]
    {
        "text/plain",
        "text/css",
        "text/html",
        "application/javascript",
        "application/json",
        "application/xml",
        "image/svg+xml"
    };
});

if (enableAuthentication)
{
    builder.Services.AddAuthentication("BasicAuthentication")
        .AddScheme<AuthenticationSchemeOptions, BasicAuthHandler>("BasicAuthentication", null);
    builder.Services.AddAuthorization();
}

if (enableDirectoryBrowsing)
{
    builder.Services.AddDirectoryBrowser();
}

builder.Logging.ClearProviders();
builder.Logging.AddConsole();

var app = builder.Build();

app.UseResponseCompression();

// Configurar MIME types completos
var fileProvider = new PhysicalFileProvider(webRootPath);
var contentTypeProvider = new FileExtensionContentTypeProvider();

// JavaScript
contentTypeProvider.Mappings[".js"] = "application/javascript; charset=utf-8";
contentTypeProvider.Mappings[".mjs"] = "application/javascript; charset=utf-8";
contentTypeProvider.Mappings[".cjs"] = "application/javascript; charset=utf-8";

// CSS
contentTypeProvider.Mappings[".css"] = "text/css; charset=utf-8";

// HTML
contentTypeProvider.Mappings[".html"] = "text/html; charset=utf-8";
contentTypeProvider.Mappings[".htm"] = "text/html; charset=utf-8";

// JSON
contentTypeProvider.Mappings[".json"] = "application/json; charset=utf-8";
contentTypeProvider.Mappings[".jsonld"] = "application/ld+json; charset=utf-8";

// Imágenes
contentTypeProvider.Mappings[".png"] = "image/png";
contentTypeProvider.Mappings[".jpg"] = "image/jpeg";
contentTypeProvider.Mappings[".jpeg"] = "image/jpeg";
contentTypeProvider.Mappings[".gif"] = "image/gif";
contentTypeProvider.Mappings[".svg"] = "image/svg+xml";
contentTypeProvider.Mappings[".ico"] = "image/x-icon";
contentTypeProvider.Mappings[".webp"] = "image/webp";
contentTypeProvider.Mappings[".bmp"] = "image/bmp";
contentTypeProvider.Mappings[".tiff"] = "image/tiff";
contentTypeProvider.Mappings[".tif"] = "image/tiff";

// Fuentes
contentTypeProvider.Mappings[".woff"] = "font/woff";
contentTypeProvider.Mappings[".woff2"] = "font/woff2";
contentTypeProvider.Mappings[".ttf"] = "font/ttf";
contentTypeProvider.Mappings[".otf"] = "font/otf";
contentTypeProvider.Mappings[".eot"] = "application/vnd.ms-fontobject";

// Audio/Video
contentTypeProvider.Mappings[".mp3"] = "audio/mpeg";
contentTypeProvider.Mappings[".mp4"] = "video/mp4";
contentTypeProvider.Mappings[".webm"] = "video/webm";
contentTypeProvider.Mappings[".ogg"] = "audio/ogg";
contentTypeProvider.Mappings[".wav"] = "audio/wav";
contentTypeProvider.Mappings[".avi"] = "video/x-msvideo";

// Documentos
contentTypeProvider.Mappings[".pdf"] = "application/pdf";
contentTypeProvider.Mappings[".zip"] = "application/zip";
contentTypeProvider.Mappings[".xml"] = "application/xml; charset=utf-8";
contentTypeProvider.Mappings[".txt"] = "text/plain; charset=utf-8";
contentTypeProvider.Mappings[".md"] = "text/markdown; charset=utf-8";

// Manifiestos y configs
contentTypeProvider.Mappings[".webmanifest"] = "application/manifest+json";
contentTypeProvider.Mappings[".map"] = "application/json";

// Archivos estáticos con caché inteligente
var staticFileOptions = new StaticFileOptions
{
    FileProvider = fileProvider,
    RequestPath = "",
    ContentTypeProvider = contentTypeProvider,
    ServeUnknownFileTypes = false,
    OnPrepareResponse = ctx =>
    {
        var path = ctx.File.Name.ToLowerInvariant();

        // Cache largo para archivos versionados (1 año)
        if (path.Contains(".min.") || path.Contains("-") &&
            (path.EndsWith(".js") || path.EndsWith(".css")))
        {
            ctx.Context.Response.Headers[HeaderNames.CacheControl] = "public,max-age=31536000,immutable";
        }
        // Cache medio para recursos estáticos (30 días)
        else if (path.EndsWith(".js") || path.EndsWith(".css") ||
                 path.EndsWith(".png") || path.EndsWith(".jpg") ||
                 path.EndsWith(".jpeg") || path.EndsWith(".gif") ||
                 path.EndsWith(".webp") || path.EndsWith(".svg") ||
                 path.EndsWith(".woff") || path.EndsWith(".woff2") ||
                 path.EndsWith(".ttf") || path.EndsWith(".otf"))
        {
            ctx.Context.Response.Headers[HeaderNames.CacheControl] = "public,max-age=2592000";
        }
        // Sin cache para HTML (siempre fresh)
        else if (path.EndsWith(".html") || path.EndsWith(".htm"))
        {
            ctx.Context.Response.Headers[HeaderNames.CacheControl] = "no-cache,must-revalidate";
        }
    }
};

// Archivos por defecto
var defaultFilesOptions = new DefaultFilesOptions
{
    FileProvider = fileProvider,
    RequestPath = ""
};
defaultFilesOptions.DefaultFileNames.Clear();
defaultFilesOptions.DefaultFileNames.Add("index.html");
defaultFilesOptions.DefaultFileNames.Add("index.htm");
defaultFilesOptions.DefaultFileNames.Add("default.html");

app.UseDefaultFiles(defaultFilesOptions);
app.UseStaticFiles(staticFileOptions);

// Después de app.UseStaticFiles(staticFileOptions);
// ANTES de la autenticación

app.MapGet("/debug/{file}", async (string file) =>
{
    var filePath = Path.Combine(webRootPath, file);
    if (!File.Exists(filePath))
        return Results.NotFound($"Archivo no encontrado: {filePath}");

    var bytes = await File.ReadAllBytesAsync(filePath);
    var text = Encoding.UTF8.GetString(bytes);

    return Results.Json(new
    {
        exists = true,
        path = filePath,
        sizeBytes = bytes.Length,
        firstBytes = BitConverter.ToString(bytes.Take(20).ToArray()),
        encoding = DetectEncoding(bytes),
        first200chars = text.Length > 200 ? text.Substring(0, 200) : text,
        hasUtf8Bom = bytes.Length >= 3 && bytes[0] == 0xEF && bytes[1] == 0xBB && bytes[2] == 0xBF
    });
});

static string DetectEncoding(byte[] bytes)
{
    if (bytes.Length >= 3 && bytes[0] == 0xEF && bytes[1] == 0xBB && bytes[2] == 0xBF)
        return "UTF-8 with BOM";
    if (bytes.Length >= 2 && bytes[0] == 0xFF && bytes[1] == 0xFE)
        return "UTF-16 LE";
    if (bytes.Length >= 2 && bytes[0] == 0xFE && bytes[1] == 0xFF)
        return "UTF-16 BE";
    return "UTF-8 or ASCII";
}

if (enableDirectoryBrowsing)
{
    app.UseDirectoryBrowser(new DirectoryBrowserOptions
    {
        FileProvider = fileProvider,
        RequestPath = ""
    });
}

// Autenticación solo para rutas protegidas
if (enableAuthentication)
{
    app.UseAuthentication();
    app.UseAuthorization();

    app.Use(async (context, next) =>
    {
        if (context.Response.StatusCode == 200)
        {
            await next();
            return;
        }
        await context.ChallengeAsync("BasicAuthentication");
    });
}

// Info
Console.WriteLine("=== Servidor Web Estático ===");
Console.WriteLine($"📁 Carpeta: {webRootPath}");
Console.WriteLine($"🌐 HTTP:  http://localhost:{port}");
if (httpsPort > 0)
    Console.WriteLine($"🔒 HTTPS: https://localhost:{httpsPort}");
Console.WriteLine($"🔐 Auth: {(enableAuthentication ? "✓ Habilitada" : "✗ Deshabilitada")}");
Console.WriteLine($"📂 Browse: {(enableDirectoryBrowsing ? "✓ Habilitado" : "✗ Deshabilitado")}");
Console.WriteLine("⚡ Compresión Gzip activada");
Console.WriteLine("🎯 MIME types configurados para todos los recursos");
Console.WriteLine("\nPresiona Ctrl+C para detener.\n");

// Configurar puertos
var urls = new List<string> { $"http://localhost:{port}" };
if (httpsPort > 0)
    urls.Add($"https://localhost:{httpsPort}");

app.Urls.Clear();
foreach (var url in urls)
    app.Urls.Add(url);

app.Run();

// Handler de autenticación básica
public class BasicAuthHandler : AuthenticationHandler<AuthenticationSchemeOptions>
{
    private readonly IConfiguration _configuration;

    public BasicAuthHandler(
        IOptionsMonitor<AuthenticationSchemeOptions> options,
        ILoggerFactory logger,
        UrlEncoder encoder,
        ISystemClock clock,
        IConfiguration configuration)
        : base(options, logger, encoder, clock)
    {
        _configuration = configuration;
    }

    protected override Task<AuthenticateResult> HandleAuthenticateAsync()
    {
        if (!Request.Headers.ContainsKey("Authorization"))
            return Task.FromResult(AuthenticateResult.Fail("Missing Authorization"));

        try
        {
            var authHeader = AuthenticationHeaderValue.Parse(Request.Headers["Authorization"]);
            if (authHeader.Scheme != "Basic")
                return Task.FromResult(AuthenticateResult.Fail("Invalid scheme"));

            var credentialBytes = Convert.FromBase64String(authHeader.Parameter ?? "");
            var credentials = Encoding.UTF8.GetString(credentialBytes).Split(':', 2);
            if (credentials.Length != 2)
                return Task.FromResult(AuthenticateResult.Fail("Invalid format"));

            var username = credentials[0];
            var password = credentials[1];

            var expectedUser = _configuration["ServerSettings:BasicAuth:Username"];
            var expectedPass = _configuration["ServerSettings:BasicAuth:Password"];

            if (username == expectedUser && password == expectedPass)
            {
                var claims = new[] { new Claim(ClaimTypes.Name, username) };
                var identity = new ClaimsIdentity(claims, Scheme.Name);
                var principal = new ClaimsPrincipal(identity);
                var ticket = new AuthenticationTicket(principal, Scheme.Name);
                return Task.FromResult(AuthenticateResult.Success(ticket));
            }

            return Task.FromResult(AuthenticateResult.Fail("Invalid credentials"));
        }
        catch
        {
            return Task.FromResult(AuthenticateResult.Fail("Invalid header"));
        }
    }
}