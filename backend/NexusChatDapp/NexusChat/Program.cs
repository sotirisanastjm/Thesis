using NexusChat.Models;
using NexusChat.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Register HttpClient and AIService
builder.Services.AddHttpClient<AIService>(); // This registers HttpClient for AIService

// Configure CORS to allow requests from the React app
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", builder =>
    {
        builder.WithOrigins("http://localhost:5173")
               .AllowAnyMethod()
               .AllowAnyHeader()
               .AllowCredentials();
    });
});

string apiKeyAI = builder.Configuration["AiService:ApiKey"];

builder.Services.AddSingleton<AIService>(provider =>
{
    return new AIService(provider.GetRequiredService<HttpClient>(), apiKeyAI);
});

string AESKey = builder.Configuration["AES:Key"];
string AESIv = builder.Configuration["AES:IV"];

var configuration = builder.Configuration;
string encryptionKey = configuration["AES:Key"];
string encryptionIV = configuration["AES:IV"];
CryptoConfig.Key = encryptionKey;
CryptoConfig.IV = encryptionIV;

builder.Services.Configure<SuiSettings>(builder.Configuration.GetSection("Sui"));
builder.Services.AddSingleton<MoveClient>();

builder.Services.AddSingleton<ValidationService>();
builder.Services.AddSingleton<AuthService>();
builder.Services.AddSingleton<UserService>();




string Jwtkey = builder.Configuration["Jwt:Key"];
string Issuer = builder.Configuration["Jwt:Issuer"];
string Audience = builder.Configuration["Jwt:Audience"];

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = Issuer,
            ValidAudience = Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Jwtkey))
        };
    });
builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Use CORS policy
app.UseCors("AllowReactApp");

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
