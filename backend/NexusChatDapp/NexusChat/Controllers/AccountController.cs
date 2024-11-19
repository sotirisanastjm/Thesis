using Microsoft.AspNetCore.Mvc;
using NexusChat.Services;
using NexusChat.Models;

namespace NexusChat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly SuiService _suiService;
        private readonly AuthService _authService;
        private readonly UserService _userService;

        public AuthController(SuiService suiService, AuthService authService, UserService userService)
        {
            _suiService = suiService;
            _authService = authService;
            _userService = userService;
        }

        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] WalletData walletData)
        {
            bool isValid = await _suiService.VerifyAddressAsync(walletData.Address);
            if (!isValid)
                return Unauthorized();

            var user =  this._userService.GetUserByAddress(walletData.Address);
            if (user == null)
            {
                user = this._userService.CreateUserProfile(walletData.Address);
            }

            var token = this._authService.CreateTokenForUser(walletData.Address);
            return Ok(new { Token = token, UserProfile = user });
        }

        
    }

}
