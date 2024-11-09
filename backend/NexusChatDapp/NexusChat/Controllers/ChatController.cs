
using Microsoft.AspNetCore.Mvc;
using NexusChat.Models;
using NexusChat.Services;

namespace NexusChat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ChatController : ControllerBase
    {
        private readonly AIService _aIService;
        public ChatController(AIService aIService)
        {
            _aIService = aIService;
        }

        [HttpPost("sendMessage")]
        public async Task<IActionResult> SendMessage([FromBody] MessageItem msgRequest)
        {

            if(msgRequest.Message != null || msgRequest.Message != "")
            {
                var result = new MessageResponse();
                result.Bot = new MessageItem("Hello how can i help you?", 0);
                //var result = await this._aIService.GetAiResponse(msgRequest);
                return Ok(result);
            }
            return BadRequest("Message cannot be null or empty");
            
        }

    }
    
}
