using FiveMinuteGames.Api.Models.Entities;

namespace FiveMinuteGames.Api.Services;

public interface IJwtService
{
    string GenerateToken(User user);
    string GenerateRefreshToken();
    bool ValidateToken(string token);
    Guid? GetUserIdFromToken(string token);
}