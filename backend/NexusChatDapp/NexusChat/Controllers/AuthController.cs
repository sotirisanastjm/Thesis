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

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterModel registerData)
        {
            if(registerData != null) 
            {
                var user = await _authService.CreateUser(registerData);
                if (user != null)
                {
                    var token = _authService.GenerateJwt(user);
                    return Ok(token);
                }
                return Ok("There is a problem with your Data");
            }
            return Ok("Missing Fields");
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginModel loginData)
        {

            if (loginData != null)
            {
                var user = await _authService.Authenticate(loginUser: loginData);
                if (user != null)
                {
                    var token = _authService.GenerateJwt(user);
                    return Ok(token);
                }
            }
            else
            {
                var currentUser = HttpContext.User.Identity as ClaimsIdentity;
                if (currentUser != null)
                {
                    var unAuthorisedUser = _userService.GetCurrentUser(currentUser);
                    if(unAuthorisedUser != null)
                    {
                        var user = await _authService.Authenticate(unAuthorisedUser: unAuthorisedUser);
                        return Ok(user != null ? true : false);
                    }
                    return NotFound("User Not Found");
                }
                return NotFound("Token Not Found");
            }
            return NotFound("User Not Found");
        }

        //[HttpPost("logout")]
        //public async Task<IActionResult> Logout()
        //{
        //    return Ok("Logout successful.");
        //}
    }

}
