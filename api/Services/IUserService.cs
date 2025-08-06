using FiveMinuteGames.Api.Models.DTOs;

namespace FiveMinuteGames.Api.Services;

public interface IUserService
{
    Task<UserDto> GetUserDataAsync(Guid userId);
    Task<UserDto?> FindUserByUsernameAsync(string username);
    Task<UserDto> UpdateUserAsync(Guid userId, UpdateUserRequest request);
    Task<UserDto> UpdatePreferencesAsync(Guid userId, UpdatePreferencesRequest request);
    Task<List<FriendDto>> GetFriendsAsync(Guid userId);
    Task<UserDto> AddFriendAsync(Guid userId, string friendUsername);
    Task<bool> RemoveFriendAsync(Guid userId, Guid friendId);
    Task<List<string>> GetFavoritesAsync(Guid userId);
    Task<UserDto> AddFavoriteAsync(Guid userId, string gameId);
    Task<bool> RemoveFavoriteAsync(Guid userId, string gameId);
    Task<Dictionary<string, GamePlayDto>> GetTodayPlaysAsync(Guid userId, DateOnly date);
    Task<UserDto> UpdatePlayAsync(Guid userId, UpdatePlayRequest request);
}