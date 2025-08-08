using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using FiveMinuteGames.Api.Configuration;
using FiveMinuteGames.Api.Data;
using FiveMinuteGames.Api.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure Entity Framework
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Configure JWT settings
builder.Services.Configure<JwtSettings>(builder.Configuration.GetSection("JwtSettings"));
var jwtSettings = builder.Configuration.GetSection("JwtSettings").Get<JwtSettings>();

// Configure JWT authentication
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(jwtSettings.SecretKey)),
        ValidateIssuer = true,
        ValidIssuer = jwtSettings.Issuer,
        ValidateAudience = true,
        ValidAudience = jwtSettings.Audience,
        ValidateLifetime = true,
        ClockSkew = TimeSpan.Zero
    };
});

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        var allowedOrigins = builder.Configuration.GetSection("Cors:AllowedOrigins").Get<string[]>() ?? new[] { "https://five-minute-react-2.onrender.com/" };
        policy.WithOrigins(allowedOrigins)
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

// Register services
builder.Services.AddScoped<IJwtService, JwtService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IUserService, UserService>();

// Configure Swagger/OpenAPI
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo 
    { 
        Title = "Five Minute Games API", 
        Version = "v1",
        Description = "API for Five Minute Games application"
    });

    // Add JWT authentication to Swagger
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "JWT Authorization header using the Bearer scheme. Enter 'Bearer' [space] and then your token in the text input below.",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new string[] {}
        }
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v1/swagger.json", "Five Minute Games API V1");
        c.RoutePrefix = string.Empty; // Set Swagger UI at the app's root
    });
}

// Temporarily disabled HTTPS redirection for development
// app.UseHttpsRedirection();

// Enable CORS
app.UseCors("AllowReactApp");


app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

// Apply database migrations
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
    try
    {
        context.Database.Migrate();
        Console.WriteLine("Database migrations applied successfully!");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Database migration failed: {ex.Message}");
        Console.WriteLine("Please ensure PostgreSQL is running and connection string is correct.");
        Console.WriteLine("You may need to drop and recreate the database if schema conflicts exist.");
    }
}

app.Run();