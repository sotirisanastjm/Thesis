using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using NexusChat.Models;
using System.Security.Claims;
using System.Text.Json;
using System.Threading.Tasks;

namespace NexusChat.Services
{
    public class UserService
    {
        private readonly MoveClient _moveClient;
        private readonly ValidationService _validationService;
        private readonly SuiSettings _settings;
        public UserService(MoveClient moveClient, ValidationService validationService, IOptions<SuiSettings> settings)
        {
            _moveClient = moveClient;
            _validationService = validationService;
            _settings = settings.Value;
        }

        public async Task<string> GetObjectIDByAddressAsync(string walletAddress, string type)
        {
            try
            {
                if (!string.IsNullOrEmpty(walletAddress))
                {
                    var response = await _moveClient.GetObjectIDByAddressAsync(walletAddress, type);
                    if (!string.IsNullOrEmpty(response))
                    {
                        using JsonDocument doc = JsonDocument.Parse(response);
                        var root = doc.RootElement;
                        var objectId = root.GetProperty("result")
                                            .GetProperty("data")[0]
                                            .GetProperty("data")
                                            .GetProperty("objectId")
                                            .GetString() ?? string.Empty;
                        return objectId;
                    }
                    return string.Empty;
                }
                else
                {
                    return string.Empty;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"GetWalletObjectsByAddress Service Error: {ex.Message}");
                return string.Empty;
            }
        }
        public async Task<UserModel?> GetUserByObjectIdAsync(string objectID)
        {
            try
            {
                if (!string.IsNullOrEmpty(objectID))
                {
                    var response = await _moveClient.GetObjectByObjectIdAsync(objectID);
                    if (!string.IsNullOrEmpty(response))
                    {
                        var jsonObject = JObject.Parse(response);
                        JObject fields = (JObject)jsonObject["result"]["data"]["content"]["fields"];
                        return new UserModel(fields);
                    }
                    return null;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"GetUserByObjectIdAsync Service Error: {ex.Message}");
                return null;
            }
        }

        public async Task<ChatDataModel?> GetChatByObjectIdAsync(string objectID)
        {
            try
            {
                if (!string.IsNullOrEmpty(objectID))
                {
                    var response = await _moveClient.GetObjectByObjectIdAsync(objectID);
                    if (!string.IsNullOrEmpty(response))
                    {
                        var jsonObject = JObject.Parse(response);
                        JObject fields = (JObject)jsonObject["result"]["data"]["content"]["fields"];
                        return new ChatDataModel(fields);
                    }
                    return null;
                }
                else
                {
                    return null;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"GetUserByObjectIdAsync Service Error: {ex.Message}");
                return null;
            }
        }

        public async Task<UserModel?> GetUserByWalletAddress(string walletAddress)
        {
            if (!string.IsNullOrEmpty(walletAddress))
            {
                var userObjectId = await GetObjectIDByAddressAsync(walletAddress, _settings.StructTypeUser);
                if (!string.IsNullOrEmpty(userObjectId))
                {
                    var user = await GetUserByObjectIdAsync(userObjectId);
                    return !string.IsNullOrEmpty(user?.ID) ? user : null;
                }
            }
            return null;
        }

        public async Task<ChatDataModel?> GetChatByWalletAddress(string walletAddress)
        {
            if (!string.IsNullOrEmpty(walletAddress))
            {
                var chatObjectId = await GetObjectIDByAddressAsync(walletAddress, _settings.StructTypeChat);
                if (!string.IsNullOrEmpty(chatObjectId))
                {
                    var chat = await GetChatByObjectIdAsync(chatObjectId);
                    return !string.IsNullOrEmpty(chat?.ChatId) ? chat : null;
                }
            }
            return null;
        }

        public async Task<Notepad?> GetNotepadByWalletAddress(string walletAddress)
        {
            if (!string.IsNullOrEmpty(walletAddress))
            {
                var notepadId = await GetObjectIDByAddressAsync(walletAddress, _settings.StructTypeNotepad);
                if (!string.IsNullOrEmpty(notepadId))
                {
                    var notepad = await GetNotepadByObjectIdAsync(notepadId);
                    return notepad;
                }
            }
            return null;
        }

        public async Task<Notepad> GetNotepadByObjectIdAsync(string notepadId)
        {
            var result = new Notepad();
            try
            {
                var response = await _moveClient.GetObjectByObjectIdAsync(notepadId);
                if (!string.IsNullOrEmpty(response))
                {
                    var jsonObject = JObject.Parse(response);
                    JObject fields = (JObject)jsonObject["result"]["data"]["content"]["fields"];
                    result = new Notepad(fields);
                    return result;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"GetUserByObjectIdAsync Service Error: {ex.Message}");
            }
            return result;
        }

        public async Task<string> AddMessageAsync(MessageItem message, string objectID, string walletAddress)
        {
            if (message != null)
            {
                var txBytes = await this._moveClient.AddMessageAsync(message, objectID, walletAddress);
                if (!string.IsNullOrEmpty(txBytes))
                {
                    return txBytes;
                }
                return "Error Parsing through Message";
            }
            return "Error Empty Message";
        }

        public async Task<TransactionMessageResponse> GetLastDialogAsync(string chatObjectId)
        {
            var chat = await GetChatByObjectIdAsync(chatObjectId);
            var result = new TransactionMessageResponse();
            result.UserMessage = chat.Messages[chat.Messages.Count() - 2];
            result.BotMessage = chat.Messages[chat.Messages.Count() - 1];
            return result;
        }

        public UserModel GetCurrentUser(ClaimsIdentity currentUser)
        {
            var userClaims = currentUser.Claims;
            return new UserModel
            {
                ID = userClaims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value,
                Role = userClaims.FirstOrDefault(x => x.Type == ClaimTypes.Role)?.Value
            };

        }

        public async Task<string> CreateClient(string walletAddress)
        {
            if (!string.IsNullOrEmpty(walletAddress))
            {
                var walletIsValid = await ValidateWallet(walletAddress);
                if (walletIsValid)
                {
                    var txBytes = await _moveClient.moveCall_CreateClientAsync(walletAddress);
                    return txBytes;
                }
                throw new Exception("Wrong Address");
            }
            throw new MissingFieldException();
        }
        public async Task<string> CreateFolder(CreateFolderRequest request)
        {
            var txBytes = await _moveClient.CreateFolderAsync(request.name, request.objectId, request.wallet);
            return txBytes;
        }

        public async Task<string> AddNoteAsync(AddNoteRequest request)
        {
            var txBytes = await _moveClient.AddNoteAsync(request.note, request.objectId, request.index , request.wallet);
            return txBytes;
        }

        public async Task execute_TransactionAsync(TransactionData transactionData)
        {

            await _moveClient.execute_TransactionAsync(transactionData);
        }

        public async Task<bool> ValidateWallet(string address)
        {
            if (!string.IsNullOrEmpty(address))
            {
                var walletIsValid = await _validationService.VerifyAddressAsync(address);
                if (walletIsValid)
                {
                    return true;
                }
            }
            return false;

        }

    }
}
