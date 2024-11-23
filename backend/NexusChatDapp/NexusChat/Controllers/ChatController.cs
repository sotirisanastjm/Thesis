
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NexusChat.Models;
using NexusChat.Services;
using System.Security.Claims;

namespace NexusChat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly AIService _aIService;
        private readonly UserService _userService;
        public ChatController(AIService aIService, UserService userService)
        {
            _aIService = aIService;
            _userService = userService;
        }

        [HttpPost("sendMessage")]
        [Authorize]
        public async Task<IActionResult> SendMessage([FromBody] MessageItem msgRequest)
        {
            var currentUser = HttpContext.User.Identity as ClaimsIdentity;
            var user = _userService.GetCurrentUser(currentUser);
            if (msgRequest.Message != null || msgRequest.Message != "" && user != null)
            {
                var result = new MessageResponse();

                if (user.Role == "Admin")
                {
                    result = await this._aIService.GetAiResponse(msgRequest);
                }
                else
                {
                    result.Bot = new MessageItem("The AIService is offline, please try again later..", 0);
                }

                return Ok(result);
            }
            return BadRequest("Message cannot be null or empty");
            
        }

    }
    
}
