using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using FiveMinuteGames.Api.Models.DTOs;
using FiveMinuteGames.Api.Services;

namespace FiveMinuteGames.Api.Controllers;

[Authorize]
[ApiController]
[Route("api/[controller]")]
public class PlaysController : ControllerBase
{
    private readonly IUserService _userService;

    public PlaysController(IUserService userService)
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

    [HttpGet("{date}")]
    public async Task<ActionResult<ApiResponse<Dictionary<string, GamePlayDto>>>> GetPlays(string date)
    {
        try
        {
            var userId = GetCurrentUserId();
            
            if (!DateOnly.TryParse(date, out var playDate))
            {
                return BadRequest(ApiResponse<Dictionary<string, GamePlayDto>>.ErrorResponse("Invalid date format"));
            }

            var plays = await _userService.GetTodayPlaysAsync(userId, playDate);
            return Ok(ApiResponse<Dictionary<string, GamePlayDto>>.SuccessResponse(plays));
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ApiResponse<Dictionary<string, GamePlayDto>>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<Dictionary<string, GamePlayDto>>.ErrorResponse("An error occurred while retrieving plays"));
        }
    }

    [HttpGet("today")]
    public async Task<ActionResult<ApiResponse<Dictionary<string, GamePlayDto>>>> GetTodayPlays()
    {
        try
        {
            var userId = GetCurrentUserId();
            var today = DateOnly.FromDateTime(DateTime.UtcNow);
            var plays = await _userService.GetTodayPlaysAsync(userId, today);
            return Ok(ApiResponse<Dictionary<string, GamePlayDto>>.SuccessResponse(plays));
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ApiResponse<Dictionary<string, GamePlayDto>>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<Dictionary<string, GamePlayDto>>.ErrorResponse("An error occurred while retrieving today's plays"));
        }
    }

    [HttpPut("{gameId}")]
    public async Task<ActionResult<ApiResponse<UserDto>>> UpdatePlay(string gameId, [FromBody] GamePlayDto playData)
    {
        try
        {
            var userId = GetCurrentUserId();
            var request = new UpdatePlayRequest
            {
                GameId = gameId,
                Score = playData.Score,
                Message = playData.Message
            };

            var user = await _userService.UpdatePlayAsync(userId, request);
            return Ok(ApiResponse<UserDto>.SuccessResponse(user, "Play updated successfully"));
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ApiResponse<UserDto>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<UserDto>.ErrorResponse("An error occurred while updating play"));
        }
    }

    [HttpPost]
    public async Task<ActionResult<ApiResponse<UserDto>>> CreatePlay([FromBody] UpdatePlayRequest request)
    {
        try
        {
            var userId = GetCurrentUserId();
            var user = await _userService.UpdatePlayAsync(userId, request);
            return Ok(ApiResponse<UserDto>.SuccessResponse(user, "Play created successfully"));
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ApiResponse<UserDto>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<UserDto>.ErrorResponse("An error occurred while creating play"));
        }
    }
}