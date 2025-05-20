
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NexusChat.Models;
using NexusChat.Services;
using System.Security.Claims;

namespace NexusChat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {
        private IConfiguration _config;
        private readonly UserService _userService;
        private readonly AuthService _authService;

        public TransactionController(IConfiguration config, UserService userService, AuthService authService)
        {
            _config = config;
            _userService = userService;
            _authService = authService;
        }

        // [HttpPost("execute_createUser")]
        // public async Task<IActionResult> Execute_CreateUser([FromBody] CreateUserRequest request)
        // {
        //     if (request.TransactionUserData != null)
        //     {
        //         await this._userService.execute_TransactionAsync(request.TransactionUserData);
        //         var userDB = await this._userService.GetUserByWalletAddress(request.WalletAddress);
        //         // await this._userService.execute_TransactionAsync(request.TransactionChatData);
        //         if (userDB != null)
        //         {
        //             // var token = this._authService.GenerateJwt(userDB);
        //             // return Ok(new
        //             // {
        //             //     Token = token,
        //             //     User = new UserClientModel(userDB)
        //             // });
        //         }
        //     }
        //     return Ok("Failed To Register the User");
        // }

        [HttpPost("execute_createUser")]
        public async Task<IActionResult> Execute_CreateUser([FromBody] CreateUserRequest request)
        {
            if (request.TransactionUserData != null)
            {
                await this._userService.execute_TransactionAsync(request.TransactionUserData);
                var userDB = await this._userService.GetUserByWalletAddress(request.WalletAddress);
                // await this._userService.execute_TransactionAsync(request.TransactionChatData);
                if (userDB != null)
                {
                    var token = this._authService.GenerateJwt(userDB.WalletAddress, userDB.Role);
                    return Ok(new
                    {
                        Token = token,
                        User = new UserClientModel(userDB)
                    });
                }
            }
            return Ok("Failed To Register the User");
        }

        [HttpPost("execute_Transaction")]
        public async Task<IActionResult> execute_Transaction([FromBody] TransactionData request)
        {
            if (request != null)
            {
                await this._userService.execute_TransactionAsync(request);
                return Ok();
            }
            return Ok("Failed To Register the User");
        }


    }

}
