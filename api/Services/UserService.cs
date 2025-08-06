using Microsoft.EntityFrameworkCore;
using FiveMinuteGames.Api.Data;
using FiveMinuteGames.Api.Models.Entities;
using FiveMinuteGames.Api.Models.DTOs;

namespace FiveMinuteGames.Api.Services;

public class UserService : IUserService
{
    private readonly ApplicationDbContext _context;

    public UserService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<UserDto> GetUserDataAsync(Guid userId)
    {
        var user = await _context.Users
            .Include(u => u.Friends).ThenInclude(f => f.Friend)
            .Include(u => u.Favorites)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
            throw new InvalidOperationException("User not found");

        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        var todayPlays = await GetTodayPlaysAsync(userId, today);

        return new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            Username = user.Username,
            Character = user.Character,
            Color = user.Color,
            ShowOther = user.ShowOther,
            Favorites = user.Favorites.Select(f => f.GameId).ToList(),
            FriendIds = user.Friends.Select(f => f.FriendId).ToList(),
            Friends = user.Friends.Select(f => new FriendDto
            {
                Id = f.Friend.Id,
                Username = f.Friend.Username,
                Character = f.Friend.Character,
                Color = f.Friend.Color
            }).ToList(),
            TodayPlays = todayPlays,
            Preferences = new UserPreferencesDto
            {
                ShowOther = user.ShowOther
            }
        };
    }

    public async Task<UserDto?> FindUserByUsernameAsync(string username)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Username == username);
        
        if (user == null)
            return null;

        return new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            Username = user.Username,
            Character = user.Character,
            Color = user.Color,
            ShowOther = user.ShowOther
        };
    }

    public async Task<UserDto> UpdateUserAsync(Guid userId, UpdateUserRequest request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
            throw new InvalidOperationException("User not found");

        if (!string.IsNullOrEmpty(request.Username))
        {
            if (await _context.Users.AnyAsync(u => u.Username == request.Username && u.Id != userId))
                throw new InvalidOperationException("Username already exists");
            user.Username = request.Username;
        }

        if (!string.IsNullOrEmpty(request.Character))
            user.Character = request.Character;

        if (!string.IsNullOrEmpty(request.Color))
            user.Color = request.Color;

        user.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return await GetUserDataAsync(userId);
    }

    public async Task<UserDto> UpdatePreferencesAsync(Guid userId, UpdatePreferencesRequest request)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
            throw new InvalidOperationException("User not found");

        user.ShowOther = request.ShowOther;
        user.UpdatedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();

        return await GetUserDataAsync(userId);
    }

    public async Task<List<FriendDto>> GetFriendsAsync(Guid userId)
    {
        var friends = await _context.UserFriends
            .Where(uf => uf.UserId == userId)
            .Include(uf => uf.Friend)
            .Select(uf => new FriendDto
            {
                Id = uf.Friend.Id,
                Username = uf.Friend.Username,
                Character = uf.Friend.Character,
                Color = uf.Friend.Color
            })
            .ToListAsync();

        return friends;
    }

    public async Task<UserDto> AddFriendAsync(Guid userId, string friendUsername)
    {
        var friend = await _context.Users.FirstOrDefaultAsync(u => u.Username == friendUsername);
        if (friend == null)
            throw new InvalidOperationException("User not found");

        if (friend.Id == userId)
            throw new InvalidOperationException("Cannot add yourself as a friend");

        var existingFriendship = await _context.UserFriends
            .FirstOrDefaultAsync(uf => uf.UserId == userId && uf.FriendId == friend.Id);

        if (existingFriendship != null)
            throw new InvalidOperationException("User is already a friend");

        var userFriend = new UserFriend
        {
            UserId = userId,
            FriendId = friend.Id
        };

        _context.UserFriends.Add(userFriend);
        await _context.SaveChangesAsync();

        return await GetUserDataAsync(userId);
    }

    public async Task<bool> RemoveFriendAsync(Guid userId, Guid friendId)
    {
        var friendship = await _context.UserFriends
            .FirstOrDefaultAsync(uf => uf.UserId == userId && uf.FriendId == friendId);

        if (friendship == null)
        {
            return false; // Friendship not found for this user
        }

        _context.UserFriends.Remove(friendship);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<List<string>> GetFavoritesAsync(Guid userId)
    {
        var favorites = await _context.UserFavorites
            .Where(uf => uf.UserId == userId)
            .Select(uf => uf.GameId)
            .ToListAsync();

        return favorites;
    }

    public async Task<UserDto> AddFavoriteAsync(Guid userId, string gameId)
    {
        var existingFavorite = await _context.UserFavorites
            .FirstOrDefaultAsync(uf => uf.UserId == userId && uf.GameId == gameId);

        if (existingFavorite == null)
        {
            var favorite = new UserFavorite
            {
                UserId = userId,
                GameId = gameId
            };

            _context.UserFavorites.Add(favorite);
            await _context.SaveChangesAsync();
        }

        return await GetUserDataAsync(userId);
    }

    public async Task<bool> RemoveFavoriteAsync(Guid userId, string gameId)
    {
        var favorite = await _context.UserFavorites
            .FirstOrDefaultAsync(uf => uf.UserId == userId && uf.GameId == gameId);

        if (favorite == null)
        {
            return false; // Game not found for this user
        }

        _context.UserFavorites.Remove(favorite);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<Dictionary<string, GamePlayDto>> GetTodayPlaysAsync(Guid userId, DateOnly date)
    {
        var plays = await _context.GamePlays
            .Where(gp => gp.UserId == userId && gp.PlayDate == date)
            .ToListAsync();

        return plays.ToDictionary(
            gp => gp.GameId,
            gp => new GamePlayDto
            {
                Score = gp.Score,
                Message = gp.Message
            }
        );
    }

    public async Task<UserDto> UpdatePlayAsync(Guid userId, UpdatePlayRequest request)
    {
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        
        var existingPlay = await _context.GamePlays
            .FirstOrDefaultAsync(gp => gp.UserId == userId && gp.GameId == request.GameId && gp.PlayDate == today);

        if (existingPlay != null)
        {
            existingPlay.Score = request.Score;
            existingPlay.Message = request.Message;
            existingPlay.UpdatedAt = DateTime.UtcNow;
        }
        else
        {
            var newPlay = new GamePlay
            {
                UserId = userId,
                GameId = request.GameId,
                PlayDate = today,
                Score = request.Score,
                Message = request.Message
            };

            _context.GamePlays.Add(newPlay);
        }

        await _context.SaveChangesAsync();
        return await GetUserDataAsync(userId);
    }
}