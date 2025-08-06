using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using FiveMinuteGames.Api.Models.DTOs;
using FiveMinuteGames.Api.Services;

namespace FiveMinuteGames.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class FavoritesController : ControllerBase
{
    private readonly IUserService _userService;

    public FavoritesController(IUserService userService)
    {
        _userService = userService;
    }

    private Guid GetCurrentUserId()
    {
        var userIdClaim = HttpContext.User.FindFirst(ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out var userId))
        {
            throw new UnauthorizedAccessException("User not authenticated or user ID not found.");
        }
        return userId;
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<List<string>>>> GetFavorites()
    {
        try
        {
            var userId = GetCurrentUserId();
            var favorites = await _userService.GetFavoritesAsync(userId);
            return Ok(ApiResponse<List<string>>.SuccessResponse(favorites));
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ApiResponse<List<string>>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<List<string>>.ErrorResponse("An error occurred while retrieving favorites"));
        }
    }

    [HttpPost("{gameId}")]
    public async Task<ActionResult<ApiResponse<UserDto>>> AddFavorite(string gameId)
    {
        try
        {
            var userId = GetCurrentUserId();
            var user = await _userService.AddFavoriteAsync(userId, gameId);
            return Ok(ApiResponse<UserDto>.SuccessResponse(user, "Game added to favorites"));
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ApiResponse<UserDto>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<UserDto>.ErrorResponse("An error occurred while adding favorite"));
        }
    }

    [HttpDelete("{gameId}")]
    public async Task<ActionResult<ApiResponse<UserDto>>> RemoveFavorite(string gameId)
    {
        try
        {
            var userId = GetCurrentUserId();
            var removed = await _userService.RemoveFavoriteAsync(userId, gameId);

            if (!removed)
            {
                return NotFound(ApiResponse<UserDto>.ErrorResponse("Game not found in favorites."));
            }
            
            // Fetch updated user data after removal
            var user = await _userService.GetUserDataAsync(userId);
            return Ok(ApiResponse<UserDto>.SuccessResponse(user, "Game removed from favorites"));
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ApiResponse<UserDto>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<UserDto>.ErrorResponse("An error occurred while removing favorite"));
        }
    }
}