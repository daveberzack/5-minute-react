using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FiveMinuteGames.Api.Models.Entities;

[Table("GamePlays")]
public class GamePlay
{
    [Key]
    public Guid Id { get; set; } = Guid.NewGuid();

    [Required]
    public Guid UserId { get; set; }

    [Required]
    [MaxLength(10)]
    public string GameId { get; set; } = string.Empty;

    [Required]
    public DateOnly PlayDate { get; set; }

    [MaxLength(50)]
    public string? Score { get; set; }

    public string? Message { get; set; }

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    // Navigation properties
    [ForeignKey("UserId")]
    public virtual User User { get; set; } = null!;
}