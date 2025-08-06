using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FiveMinuteGames.Api.Models.DTOs;
using FiveMinuteGames.Api.Services;

namespace FiveMinuteGames.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
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

    [HttpGet("profile")]
    public async Task<ActionResult<ApiResponse<UserDto>>> GetProfile()
    {
        try
        {
            var userId = GetCurrentUserId();
            var user = await _userService.GetUserDataAsync(userId);
            return Ok(ApiResponse<UserDto>.SuccessResponse(user));
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ApiResponse<UserDto>.ErrorResponse(ex.Message));
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(ApiResponse<UserDto>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<UserDto>.ErrorResponse("An error occurred while retrieving user profile"));
        }
    }

    [HttpPut("profile")]
    public async Task<ActionResult<ApiResponse<UserDto>>> UpdateProfile([FromBody] UpdateUserRequest request)
    {
        try
        {
            var userId = GetCurrentUserId();
            var user = await _userService.UpdateUserAsync(userId, request);
            return Ok(ApiResponse<UserDto>.SuccessResponse(user, "Profile updated successfully"));
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ApiResponse<UserDto>.ErrorResponse(ex.Message));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<UserDto>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<UserDto>.ErrorResponse("An error occurred while updating profile"));
        }
    }

    [HttpGet("search/{username}")]
    public async Task<ActionResult<ApiResponse<UserDto>>> SearchUser(string username)
    {
        try
        {
            var user = await _userService.FindUserByUsernameAsync(username);
            if (user == null)
                return NotFound(ApiResponse<UserDto>.ErrorResponse("User not found"));

            return Ok(ApiResponse<UserDto>.SuccessResponse(user));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<UserDto>.ErrorResponse("An error occurred while searching for user"));
        }
    }

    [HttpPut("preferences")]
    public async Task<ActionResult<ApiResponse<UserDto>>> UpdatePreferences([FromBody] UpdatePreferencesRequest request)
    {
        try
        {
            var userId = GetCurrentUserId();
            var user = await _userService.UpdatePreferencesAsync(userId, request);
            return Ok(ApiResponse<UserDto>.SuccessResponse(user, "Preferences updated successfully"));
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ApiResponse<UserDto>.ErrorResponse(ex.Message));
        }
        catch (InvalidOperationException ex)
        {
            return NotFound(ApiResponse<UserDto>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<UserDto>.ErrorResponse("An error occurred while updating preferences"));
        }
    }
}