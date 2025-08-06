using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FiveMinuteGames.Api.Models.DTOs;
using FiveMinuteGames.Api.Services;

namespace FiveMinuteGames.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class FriendsController : ControllerBase
{
    private readonly IUserService _userService;

    public FriendsController(IUserService userService)
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
    public async Task<ActionResult<ApiResponse<List<FriendDto>>>> GetFriends()
    {
        try
        {
            var userId = GetCurrentUserId();
            var friends = await _userService.GetFriendsAsync(userId);
            return Ok(ApiResponse<List<FriendDto>>.SuccessResponse(friends));
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ApiResponse<List<FriendDto>>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<List<FriendDto>>.ErrorResponse("An error occurred while retrieving friends"));
        }
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<UserDto>>> AddFriend([FromBody] AddFriendRequest request)
    {
        try
        {
            var userId = GetCurrentUserId();
            var user = await _userService.AddFriendAsync(userId, request.Username);
            return Ok(ApiResponse<UserDto>.SuccessResponse(user, "Friend added successfully"));
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
            return StatusCode(500, ApiResponse<UserDto>.ErrorResponse("An error occurred while adding friend"));
        }
    }

    [HttpDelete("{friendId}")]
    public async Task<ActionResult<ApiResponse<UserDto>>> RemoveFriend(Guid friendId)
    {
        try
        {
            var userId = GetCurrentUserId();
            var removed = await _userService.RemoveFriendAsync(userId, friendId);

            if (!removed)
            {
                return NotFound(ApiResponse<UserDto>.ErrorResponse("Friend not found."));
            }

            // Fetch updated user data after removal
            var user = await _userService.GetUserDataAsync(userId);
            return Ok(ApiResponse<UserDto>.SuccessResponse(user, "Friend removed successfully"));
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ApiResponse<UserDto>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<UserDto>.ErrorResponse("An error occurred while removing friend"));
        }
    }
}