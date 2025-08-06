using Microsoft.AspNetCore.Mvc;
using FiveMinuteGames.Api.Models.DTOs;
using FiveMinuteGames.Api.Services;

namespace FiveMinuteGames.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    [HttpPost("register")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> Register([FromBody] RegisterRequest request)
    {
        try
        {
            var result = await _authService.RegisterAsync(request);
            return Ok(ApiResponse<AuthResponse>.SuccessResponse(result, "User registered successfully"));
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ApiResponse<AuthResponse>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<AuthResponse>.ErrorResponse("An error occurred during registration"));
        }
    }

    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> Login([FromBody] LoginRequest request)
    {
        try
        {
            var result = await _authService.LoginAsync(request);
            return Ok(ApiResponse<AuthResponse>.SuccessResponse(result, "Login successful"));
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ApiResponse<AuthResponse>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<AuthResponse>.ErrorResponse("An error occurred during login"));
        }
    }

    [HttpPost("google")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> GoogleAuth([FromBody] GoogleAuthRequest request)
    {
        try
        {
            var result = await _authService.GoogleAuthAsync(request);
            return Ok(ApiResponse<AuthResponse>.SuccessResponse(result, "Google authentication successful"));
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ApiResponse<AuthResponse>.ErrorResponse(ex.Message));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<AuthResponse>.ErrorResponse("An error occurred during Google authentication"));
        }
    }

    [HttpPost("refresh")]
    public async Task<ActionResult<ApiResponse<AuthResponse>>> RefreshToken([FromBody] RefreshTokenRequest request)
    {
        try
        {
            var result = await _authService.RefreshTokenAsync(request);
            return Ok(ApiResponse<AuthResponse>.SuccessResponse(result, "Token refreshed successfully"));
        }
        catch (UnauthorizedAccessException ex)
        {
            return Unauthorized(ApiResponse<AuthResponse>.ErrorResponse(ex.Message));
        }
        catch (NotImplementedException)
        {
            return StatusCode(501, ApiResponse<AuthResponse>.ErrorResponse("Refresh token functionality not yet implemented"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<AuthResponse>.ErrorResponse("An error occurred during token refresh"));
        }
    }

    [HttpPost("logout")]
    public async Task<ActionResult<ApiResponse<bool>>> Logout([FromBody] RefreshTokenRequest request)
    {
        try
        {
            var result = await _authService.LogoutAsync(request.RefreshToken);
            return Ok(ApiResponse<bool>.SuccessResponse(result, "Logout successful"));
        }
        catch (Exception ex)
        {
            return StatusCode(500, ApiResponse<bool>.ErrorResponse("An error occurred during logout"));
        }
    }
}