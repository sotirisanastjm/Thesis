using NexusChat.Services;

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
