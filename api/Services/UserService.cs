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
        var today = DateOnly.FromDateTime(DateTime.UtcNow);
        
        // Single optimized query to get all data at once
        var user = await _context.Users
            .Include(u => u.Friends).ThenInclude(f => f.Friend)
            .Include(u => u.Favorites)
            .Include(u => u.GamePlays.Where(gp => gp.PlayDate == today))
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
            throw new InvalidOperationException("User not found");

        // Get friend IDs for the friends' plays query
        var friendIds = user.Friends.Select(f => f.FriendId).ToList();
        
        // Single query to get all friends' today plays
        var friendsPlays = await _context.GamePlays
            .Where(gp => friendIds.Contains(gp.UserId) && gp.PlayDate == today)
            .ToListAsync();

        // Process user's today plays
        var todayPlays = user.GamePlays
            .ToDictionary(
                gp => gp.GameId,
                gp => new GamePlayDto
                {
                    Score = gp.Score,
                    Message = gp.Message
                }
            );

        // Process friends' today plays
        var friendsTodayPlays = friendsPlays
            .GroupBy(gp => gp.UserId)
            .ToDictionary(
                g => g.Key,
                g => g.ToDictionary(
                    gp => gp.GameId,
                    gp => new GamePlayDto
                    {
                        Score = gp.Score,
                        Message = gp.Message
                    }
                )
            );


        return new UserDto
        {
            Id = user.Id,
            Email = user.Email,
            Username = user.Username,
            Character = user.Character,
            Color = user.Color,
            Favorites = user.Favorites.Select(f => f.GameId).ToList(),
            FriendIds = user.Friends.Select(f => f.FriendId).ToList(),
            Friends = user.Friends.Select(f => new FriendDto
            {
                Id = f.Friend.Id,
                Username = f.Friend.Username,
                Character = f.Friend.Character,
                Color = f.Friend.Color,
                TodayPlays = friendsTodayPlays.ContainsKey(f.FriendId) ? friendsTodayPlays[f.FriendId] : new Dictionary<string, GamePlayDto>()
            }).ToList(),
            TodayPlays = todayPlays
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
            Color = user.Color
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

    public async Task<Dictionary<Guid, Dictionary<string, GamePlayDto>>> GetFriendsTodayPlaysAsync(Guid userId, DateOnly date)
    {
        var user = await _context.Users
            .Include(u => u.Friends).ThenInclude(f => f.Friend)
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
            throw new InvalidOperationException("User not found");

        var friendIds = user.Friends.Select(f => f.FriendId).ToList();
        
        var friendsPlays = await _context.GamePlays
            .Where(gp => friendIds.Contains(gp.UserId) && gp.PlayDate == date)
            .ToListAsync();

        var result = new Dictionary<Guid, Dictionary<string, GamePlayDto>>();
        
        foreach (var friend in user.Friends)
        {
            var friendPlays = friendsPlays
                .Where(gp => gp.UserId == friend.FriendId)
                .ToDictionary(
                    gp => gp.GameId,
                    gp => new GamePlayDto
                    {
                        Score = gp.Score,
                        Message = gp.Message
                    }
                );
            
            result[friend.FriendId] = friendPlays;
        }

        return result;
    }
}