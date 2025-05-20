
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NexusChat.Models;
using NexusChat.Services;
using System.Security.Claims;
using System.Threading.Tasks;

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
        public async Task<IActionResult> SendMessage([FromBody] AIRequest request)
        {
            var currentUser = HttpContext.User.Identity as ClaimsIdentity;
            var user = _userService.GetCurrentUser(currentUser);
            if (request.msgRequest.Message != null || request.msgRequest.Message != "" && user != null)
            {
                var result = new MessageResponse();

                if (user.Role == "User")
                {
                    result = await this._aIService.GetAiResponse(request.msgRequest);
                    return Ok(result);
                    // var userChat = await this._userService.GetChatByObjectIdAsync(request.chatObjectId);

                    // if (userChat != null)
                    // {
                    // }
                    // BadRequest("User's Chat cannot be synchronized");
                }
                else
                {
                    result.Bot = new MessageItem("The AIService is offline, please try again later..", "tempID", 0);
                }

                return Ok(result);
            }
            return BadRequest("Message cannot be null or empty");

        }

        [HttpPost("getChat")]
        public async Task<IActionResult> getChat([FromBody] string walletAddress)
        {
            if (!string.IsNullOrEmpty(walletAddress))
            {
                var chat = await this._userService.GetChatByWalletAddress(walletAddress);
                if (chat != null)
                {
                    return Ok(chat);

                }

                return BadRequest("Chat cannot be Found");
            }
            return BadRequest("Missing Wallet Address");

        }

        [HttpPost("addMessage")]
        public async Task<IActionResult> addMessage([FromBody] AIRequest request)
        {
            if (request.msgRequest != null && !string.IsNullOrEmpty(request.chatObjectId))
            {
                var txBytes = await this._userService.AddMessageAsync(request.msgRequest, request.chatObjectId, request.walletAddress);
                return Ok(new { txBytes = txBytes});
            }
            return BadRequest("Missing MessageItem");

        }

        [HttpPost("getLastDialog")]
        public async Task<IActionResult> getLastDialog([FromBody] string objectID)
        {
            if (!string.IsNullOrEmpty(objectID))
            {
                var result = await this._userService.GetLastDialogAsync(objectID);
                return Ok(result);
            }
            return BadRequest("Missing Chat objectID");

        }

    }

}
