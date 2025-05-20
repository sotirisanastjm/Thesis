using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using NexusChat.Models;
using NexusChat.Services;
using System.Security.Claims;

namespace NexusChat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private IConfiguration _config;
        private readonly AuthService _authService;
        private readonly UserService _userService;

        public AuthController(IConfiguration config, AuthService authService, UserService userService)
        {
            _config = config;
            _authService = authService;
            _userService = userService;
        }

        [HttpPost("validate-client")]
        public async Task<IActionResult> ValidateClient([FromBody] string walletAddress)
        {
            if (walletAddress != "invalid")
            {
                var isValidate = await this._authService.ValidateExistingWallet(walletAddress);
                if (!isValidate.Exists)
                {
                    var txBytes = await this._userService.CreateClient(walletAddress);
                    return Ok(new
                    {
                        exists = false,
                        txBytes = txBytes,
                    });
                }
                else
                {
                    var user = await this._userService.GetUserByWalletAddress(walletAddress);
                    var token = _authService.GenerateJwt(walletAddress, user.Role);
                    return Ok(new
                    {
                        exists = true,
                        token = token,
                        user = user,
                    });
                }
            }
            else
            {
                var currentUser = HttpContext.User.Identity as ClaimsIdentity;
                if (currentUser != null)
                {
                    var unAuthorisedUser = _userService.GetCurrentUser(currentUser);
                    if (unAuthorisedUser != null)
                    {
                        var user = await _authService.AuthenticateUser(unAuthorisedUser: unAuthorisedUser);
                        return Ok(user != null ? new UserClientModel(user) : false);
                    }
                    return NotFound("User Not Found");
                }
                return NotFound("Token Not Found");
            }

        }
    }



}
