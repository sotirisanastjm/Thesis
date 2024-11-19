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
               .AllowAnyHeader();
    });
});

// Retrieve the API key from configuration
string apiKeyAI = builder.Configuration["AiService:ApiKey"];

// Register AIService with the API key
builder.Services.AddSingleton<AIService>(provider =>
{
    return new AIService(provider.GetRequiredService<HttpClient>(), apiKeyAI);
});


// Register AuthService and SuiService
builder.Services.AddSingleton<AuthService>();
builder.Services.AddSingleton<SuiService>();
builder.Services.AddSingleton<UserService>();

//Register the Secret Key
var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSettings.SecretKey)),
            ValidateIssuer = false, // You can set this to true and provide a valid issuer
            ValidateAudience = false, // You can set this to true and provide a valid audience
            ValidateLifetime = true, // Validates token expiry
            ClockSkew = TimeSpan.Zero // Optional: adjusts for server time drift
        };
    });
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
app.UseAuthorization();

app.MapControllers();

app.Run();
