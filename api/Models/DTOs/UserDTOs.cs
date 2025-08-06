using System.ComponentModel.DataAnnotations;

namespace FiveMinuteGames.Api.Models.DTOs;

public class UserDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string Character { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public bool ShowOther { get; set; }
    public List<string> Favorites { get; set; } = new();
    public List<Guid> FriendIds { get; set; } = new();
    public List<FriendDto> Friends { get; set; } = new();
    public Dictionary<string, GamePlayDto> TodayPlays { get; set; } = new();
    public UserPreferencesDto Preferences { get; set; } = new();
}

public class FriendDto
{
    public Guid Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Character { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
}

public class UserPreferencesDto
{
    public bool ShowOther { get; set; } = true;
}

public class UpdateUserRequest
{
    [MaxLength(50)]
    public string? Username { get; set; }

    [MaxLength(10)]
    public string? Character { get; set; }

    [MaxLength(7)]
    public string? Color { get; set; }
}

public class UpdatePreferencesRequest
{
    public bool ShowOther { get; set; }
}

public class AddFriendRequest
{
    [Required]
    [MaxLength(50)]
    public string Username { get; set; } = string.Empty;
}