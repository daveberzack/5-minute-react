using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Google.Apis.Auth;
using BCrypt.Net;
using FiveMinuteGames.Api.Data;
using FiveMinuteGames.Api.Models.Entities;
using FiveMinuteGames.Api.Models.DTOs;
using FiveMinuteGames.Api.Configuration;

namespace FiveMinuteGames.Api.Services;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IJwtService _jwtService;
    private readonly IUserService _userService;
    private readonly JwtSettings _jwtSettings;
    private readonly IConfiguration _configuration;

    public AuthService(
        ApplicationDbContext context,
        IJwtService jwtService,
        IUserService userService,
        IOptions<JwtSettings> jwtSettings,
        IConfiguration configuration)
    {
        _context = context;
        _jwtService = jwtService;
        _userService = userService;
        _jwtSettings = jwtSettings.Value;
        _configuration = configuration;
    }

    public async Task<AuthResponse> RegisterAsync(RegisterRequest request)
    {
        // Check if user already exists
        if (await _context.Users.AnyAsync(u => u.Email == request.Email))
        {
            throw new InvalidOperationException("User with this email already exists");
        }

        if (await _context.Users.AnyAsync(u => u.Username == request.Username))
        {
            throw new InvalidOperationException("Username already exists");
        }

        // Create new user
        var user = new User
        {
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Username = request.Username,
            Character = request.Character,
            Color = request.Color,
            ShowOther = true
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        // Generate tokens
        var token = _jwtService.GenerateToken(user);
        var refreshToken = _jwtService.GenerateRefreshToken();

        // Create basic user data for registration response
        var userData = new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            Username = user.Username,
            Character = user.Character,
            Color = user.Color,
            ShowOther = user.ShowOther,
            Favorites = new List<string>(),
            FriendIds = new List<Guid>(),
            Friends = new List<FriendDto>(),
            TodayPlays = new Dictionary<string, GamePlayDto>(),
            Preferences = new UserPreferencesDto { ShowOther = user.ShowOther }
        };

        return new AuthResponse
        {
            Token = token,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationMinutes),
            User = userData
        };
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == request.Email);
        
        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
        {
            throw new UnauthorizedAccessException("Invalid email or password");
        }

        // Generate tokens
        var token = _jwtService.GenerateToken(user);
        var refreshToken = _jwtService.GenerateRefreshToken();

        // Create basic user data for login response
        var userData = new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            Username = user.Username,
            Character = user.Character,
            Color = user.Color,
            ShowOther = user.ShowOther,
            Favorites = new List<string>(),
            FriendIds = new List<Guid>(),
            Friends = new List<FriendDto>(),
            TodayPlays = new Dictionary<string, GamePlayDto>(),
            Preferences = new UserPreferencesDto { ShowOther = user.ShowOther }
        };

        return new AuthResponse
        {
            Token = token,
            RefreshToken = refreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationMinutes),
            User = userData
        };
    }

    public async Task<AuthResponse> GoogleAuthAsync(GoogleAuthRequest request)
    {
        try
        {
            var googleClientId = _configuration["GoogleAuth:ClientId"];
            var payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken, new GoogleJsonWebSignature.ValidationSettings
            {
                Audience = new[] { googleClientId }
            });

            var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == payload.Email);

            if (user == null)
            {
                // Create new user from Google account
                user = new User
                {
                    Email = payload.Email,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(Guid.NewGuid().ToString()), // Random password for Google users
                    Username = payload.Name ?? payload.Email.Split('@')[0],
                    Character = "👤", // Default character
                    Color = "#333366", // Default color
                    ShowOther = true
                };

                // Ensure username is unique
                var baseUsername = user.Username;
                var counter = 1;
                while (await _context.Users.AnyAsync(u => u.Username == user.Username))
                {
                    user.Username = $"{baseUsername}{counter}";
                    counter++;
                }

                _context.Users.Add(user);
                await _context.SaveChangesAsync();
            }

            // Generate tokens
            var token = _jwtService.GenerateToken(user);
            var refreshToken = _jwtService.GenerateRefreshToken();

            // Create basic user data for Google OAuth response
            var userData = new UserDto
            {
                Id = user.Id,
                Email = user.Email,
                Username = user.Username,
                Character = user.Character,
                Color = user.Color,
                ShowOther = user.ShowOther,
                Favorites = new List<string>(),
                FriendIds = new List<Guid>(),
                Friends = new List<FriendDto>(),
                TodayPlays = new Dictionary<string, GamePlayDto>(),
                Preferences = new UserPreferencesDto { ShowOther = user.ShowOther }
            };

            return new AuthResponse
            {
                Token = token,
                RefreshToken = refreshToken,
                ExpiresAt = DateTime.UtcNow.AddMinutes(_jwtSettings.ExpirationMinutes),
                User = userData
            };
        }
        catch (InvalidJwtException)
        {
            throw new UnauthorizedAccessException("Invalid Google token");
        }
    }

    public async Task<AuthResponse> RefreshTokenAsync(RefreshTokenRequest request)
    {
        // In a production app, you'd store refresh tokens in the database
        // For now, we'll just validate the format and generate new tokens
        if (string.IsNullOrEmpty(request.RefreshToken))
        {
            throw new UnauthorizedAccessException("Invalid refresh token");
        }

        // This is a simplified implementation
        // In production, you'd validate the refresh token against stored tokens
        throw new NotImplementedException("Refresh token functionality needs to be implemented with token storage");
    }

    public async Task<bool> LogoutAsync(string refreshToken)
    {
        // In a production app, you'd invalidate the refresh token in the database
        // For now, we'll just return true
        await Task.CompletedTask;
        return true;
    }
}