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
        private readonly UserService _userService;

        public AuthController(SuiService suiService, UserService userService)
        {
            _suiService = suiService;
            _userService = userService;
        }

        [HttpPost("authenticate")]
        public async Task<IActionResult> Authenticate([FromBody] string walletData)
        {
            bool isValid = await _suiService.VerifyAddressAsync(walletData);
            if (!isValid)
                return Unauthorized();

            var user =  this._userService.GetUserByAddress(walletData);
            if (user == null)
            {
                user = this._userService.CreateUserProfile(walletData);
            }

            return Ok(user);
        }

        
    }

}
