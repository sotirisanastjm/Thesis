
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using NexusChat.Models;
using NexusChat.Services;
using System.Security.Claims;
using System.Threading.Tasks;

namespace NexusChat.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NoteController : ControllerBase
    {
        private readonly UserService _userService;
        public NoteController(UserService userService)
        {
            _userService = userService;
        }

        [HttpPost("fetch-notepad")]
        [Authorize]
        public async Task<IActionResult> FetchNotepad([FromBody] string wallet_address)
        {

            if (!string.IsNullOrEmpty(wallet_address))
            {
                var notepad = await this._userService.GetNotepadByWalletAddress(wallet_address);
                return Ok(notepad);
            }
            return BadRequest("Invalid Address to Fetch Notepad");
        }

        [HttpPost("create-folder")]
        [Authorize]
        public async Task<IActionResult> FetchNotepad([FromBody] CreateFolderRequest request)
        {

            if (!string.IsNullOrEmpty(request.wallet) && !string.IsNullOrEmpty(request.objectId) && !string.IsNullOrEmpty(request.name))
            {
                var txBytes = await this._userService.CreateFolder(request);
                return Ok(new { txBytes = txBytes});
            }
            return BadRequest("Invalid Payload to Create Folder");
        }

        [HttpPost("add-note")]
        [Authorize]
        public async Task<IActionResult> AddNote([FromBody] AddNoteRequest request)
        {

            if (!string.IsNullOrEmpty(request.wallet) && !string.IsNullOrEmpty(request.note.Id))
            {
                var txBytes = await this._userService.AddNoteAsync(request);
                return Ok(new { txBytes = txBytes});
            }
            return BadRequest("Invalid Payload to Create Folder");
        }



    }

}
