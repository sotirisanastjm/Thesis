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

        [HttpPost("validate-address")]
        public async Task<IActionResult> ValidateAddress([FromBody] string address)
        {
            if (address != null)
            {
                var isValidate = await this._authService.ValidateExistingWallet(address);
                return Ok(isValidate);
            }
            return NotFound("Address is missing");
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterModel registerData)
        {
            if (registerData != null)
            {
                var txBytesUser = await this._userService.CreateUser(registerData);
                return Ok(new { txBytesUser = txBytesUser});

            }
            return Ok("Missing Fields");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginModel loginData)
        {

            if (!string.IsNullOrEmpty(loginData?.WalletAddress))
            {
                var user = await _authService.AuthenticateUser(loginUser: loginData);
                var userDB = await this._userService.GetUserByWalletAddress(loginData.WalletAddress);
                if (user != null)
                {
                    var token = _authService.GenerateJwt(user);
                    return Ok(new
                    {
                        Token = token,
                        User = new UserClientModel(user)
                    });

                }
                else if (user == null && userDB != null)
                {
                    return Ok(new { Message = "Wrong Password" });
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
            return NotFound("User Not Found");
        }

        // [HttpPost("delete")]
        // public async Task<IActionResult> DeleteUser([FromBody] string walletAddress)
        // {
        //     if (!string.IsNullOrEmpty(walletAddress))
        //     {
        //         var result = await _userService.DeleteUser(walletAddress);
        //         return Ok(result);
        //     }
        //     return Ok(new { Message = "Wrong Wallet Address" });
        // }

    }

}
