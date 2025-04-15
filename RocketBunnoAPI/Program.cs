using Microsoft.EntityFrameworkCore;
using RocketBunnoAPI.Data;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Dodavanje IConfiguration u DI (preko builder.Configuration)
builder.Services.AddSingleton<IConfiguration>(builder.Configuration);

// Provjera da li je Jwt:Key postavljen u konfiguraciji
var keyString = builder.Configuration["Jwt:Key"];  // Koristi builder.Configuration

if (string.IsNullOrEmpty(keyString))
{
    throw new ArgumentNullException("JWT key is not configured properly.");
}

var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(keyString));

// Omogućavanje User Secrets ako koristiš ih za razvojnu konfiguraciju
builder.Configuration.AddUserSecrets<Program>();

// Dodavanje servisa za API
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Dodavanje DbContexta za SQLite bazu podataka
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite("Data Source=rocketbunno.db"));

// JWT autentifikacija
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = key  // Korištenje već definirane SymmetricSecurityKey
        };
    });

// Omogućavanje CORS-a za komunikaciju s frontendom
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader());
});

var app = builder.Build();

// Konfiguriranje HTTP request pipeline-a
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("AllowAll");

app.UseAuthentication();    // Ovo je KLJUČNO za JWT
app.UseAuthorization();

app.MapControllers();

app.Run();
