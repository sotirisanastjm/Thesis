using NexusChat.Models;
using System.Text.Json;
using System.Text;
using System.Reflection;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;

namespace NexusChat.Services
{
    public class MoveClient
    {
        private readonly HttpClient _httpClient;
        private readonly SuiSettings _settings;

        public MoveClient(HttpClient httpClient, IOptions<SuiSettings> settings)
        {
            _httpClient = httpClient;
            _settings = settings.Value;
        }

        public async Task execute_TransactionAsync(TransactionData transactionData)
        {

            var requestBody = new
            {
                jsonrpc = "2.0",
                id = 1,
                method = "sui_executeTransactionBlock",
                @params = new object[]
                {
                    transactionData.bytes,
                    new List<Object>
                    {
                       transactionData.signature
                    },
                    new
                    {
                        showInput = true,
                        showRawInput = true,
                        showEffects = true,
                        showEvents = true,
                        showObjectChanges = true,
                        showBalanceChanges = true,
                        showRawEffects = false
                    },
                    "WaitForEffectsCert"
                }
            };

            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            try
            {
                var response = await _httpClient.PostAsync(_settings.SuiRpcUrl, content);
                response.EnsureSuccessStatusCode();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error ExecuteTransactionBlock: {ex.Message}");
            }
        }
        public async Task<string> GetObjectIDByAddressAsync(string walletAddress, string type)
        {
            var requestBody = new
            {
                jsonrpc = "2.0",
                id = 1,
                method = "suix_getOwnedObjects",
                @params = new object[]
                {
                    walletAddress,
                    new
                    {
                        filter = new
                        {
                            StructType = type
                        },
                        options = new
                        {
                            showType = true,
                            showOwner = true,
                            showPreviousTransaction = false,
                            showDisplay = false,
                            showContent = false,
                            showBcs = false,
                            showStorageRebate = false
                        }
                    }
                }
            };

            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

            try
            {
                var response = await _httpClient.PostAsync(_settings.SuiRpcUrl, content);
                response.EnsureSuccessStatusCode();

                var responseContent = await response.Content.ReadAsStringAsync();

                return responseContent.ToString();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching wallet objects: {ex.Message}");
                return string.Empty;
            }
        }

        public async Task<string> AddMessageAsync(MessageItem message, string objectID, string walletAddress)
        {
            ulong timestamp = (ulong)DateTime.UtcNow.Subtract(DateTime.UnixEpoch).TotalSeconds;
            var requestBody = new
            {
                jsonrpc = "2.0",
                id = 1,
                method = "unsafe_moveCall",
                @params = new object[]
                {
                walletAddress,
                _settings.PackageID,
                "client",
                "add_message",
                new List<string>(),
                new List<Object>
                    {
                        objectID,
                        CryptoService.Encrypt(message.Message),
                        message.Sender.ToString(),
                        timestamp.ToString()
                    },
                null,
                "500000000"
                }
            };
            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            try
            {
                var response = await _httpClient.PostAsync(_settings.SuiRpcUrl, content);
                response.EnsureSuccessStatusCode();
                if (response.IsSuccessStatusCode)
                {
                    var jsonResponse = await response.Content.ReadAsStringAsync();
                    var jsonObject = JObject.Parse(jsonResponse.ToString());
                    return jsonObject["result"]["txBytes"].ToString();
                }

                return string.Empty;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating User: {ex.Message}");
                return string.Empty;
            }
        }

        public async Task<string> CreateFolderAsync(string folderName, string objectID, string walletAddress)
        {
            ulong timestamp = (ulong)DateTime.UtcNow.Subtract(DateTime.UnixEpoch).TotalSeconds;
            var requestBody = new
            {
                jsonrpc = "2.0",
                id = 1,
                method = "unsafe_moveCall",
                @params = new object[]
                {
                walletAddress,
                _settings.PackageID,
                "client",
                "create_folder",
                new List<string>(),
                new List<Object>
                    {
                        objectID,
                        CryptoService.Encrypt(folderName)
                    },
                null,
                "500000000"
                }
            };
            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            try
            {
                var response = await _httpClient.PostAsync(_settings.SuiRpcUrl, content);
                response.EnsureSuccessStatusCode();
                if (response.IsSuccessStatusCode)
                {
                    var jsonResponse = await response.Content.ReadAsStringAsync();
                    var jsonObject = JObject.Parse(jsonResponse.ToString());
                    return jsonObject["result"]["txBytes"].ToString();
                }

                return string.Empty;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating User: {ex.Message}");
                return string.Empty;
            }
        }

        public async Task<string> AddNoteAsync(Note note, string objectID, int index , string walletAddress)
        {
            DateTime parsedDate = DateTime.Parse(note.Date, null, System.Globalization.DateTimeStyles.AdjustToUniversal);
            ulong timestamp = (ulong)(parsedDate - DateTime.UnixEpoch).TotalSeconds;

            var requestBody = new
            {
                jsonrpc = "2.0",
                id = 1,
                method = "unsafe_moveCall",
                @params = new object[]
                {
                walletAddress,
                _settings.PackageID,
                "client",
                "add_note",
                new List<string>(),
                new List<Object>
                    {
                        objectID,
                        index.ToString(),
                        note.Id,
                        CryptoService.Encrypt(note.Message),
                        timestamp.ToString(),
                        note.Sender.ToString(),
                    },
                null,
                "500000000"
                }
            };
            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            try
            {
                var response = await _httpClient.PostAsync(_settings.SuiRpcUrl, content);
                response.EnsureSuccessStatusCode();
                if (response.IsSuccessStatusCode)
                {
                    var jsonResponse = await response.Content.ReadAsStringAsync();
                    var jsonObject = JObject.Parse(jsonResponse.ToString());
                    return jsonObject["result"]["txBytes"].ToString();
                }

                return string.Empty;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating User: {ex.Message}");
                return string.Empty;
            }
        }
        public async Task<string> GetObjectByObjectIdAsync(string objectID)
        {

            var requestBody = new
            {
                jsonrpc = "2.0",
                id = 1,
                method = "sui_getObject",
                @params = new object[]
                {
                    objectID,
                    new
                    {
                        showType = true,
                        showOwner = true,
                        showPreviousTransaction = true,
                        showDisplay = false,
                        showContent = true,
                        showBcs = false,
                        showStorageRebate = false
                    }
                }
            };

            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

            try
            {
                var response = await _httpClient.PostAsync(_settings.SuiRpcUrl, content);
                response.EnsureSuccessStatusCode();

                var responseContent = await response.Content.ReadAsStringAsync();

                return responseContent.ToString();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching UserObject: {ex.Message}");
                return string.Empty;
            }
        }

        public async Task<string> moveCall_CreateUserAsync(UserRegisterModel user)
        {
            ulong timestamp = (ulong)DateTime.UtcNow.Subtract(DateTime.UnixEpoch).TotalSeconds;

            // var username = !string.IsNullOrEmpty(user?.Username) ? CryptoService.Encrypt(user.Username) : "";
            // var email = !string.IsNullOrEmpty(user?.Email) ? CryptoService.Encrypt(user.Email) : "";
            // var pass = CryptoService.Encrypt(user.Password);
            var role = CryptoService.Encrypt("User");


            var requestBody = new
            {
                jsonrpc = "2.0",
                id = 1,
                method = "unsafe_moveCall",
                @params = new object[]
                {
                _settings.Signer,
                _settings.PackageID,
                "client",
                "create_user",
                new List<string>(),
                new List<Object>
                    {
                        !string.IsNullOrEmpty(user?.WalletAddress) ? user.WalletAddress: "",
                        // username,
                        // email,
                        // pass,
                        role,
                        timestamp.ToString()
                    },
                null,
                "500000000"
                }
            };
            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            try
            {
                var response = await _httpClient.PostAsync(_settings.SuiRpcUrl, content);
                response.EnsureSuccessStatusCode();
                if (response.IsSuccessStatusCode)
                {
                    var jsonResponse = await response.Content.ReadAsStringAsync();
                    var jsonObject = JObject.Parse(jsonResponse.ToString());
                    return jsonObject["result"]["txBytes"].ToString();
                }

                return string.Empty;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating User: {ex.Message}");
                return string.Empty;
            }

        }
        public async Task<string> moveCall_CreateClientAsync(string walletAddress)
        {
            ulong timestamp = (ulong)DateTime.UtcNow.Subtract(DateTime.UnixEpoch).TotalSeconds;
            var role = CryptoService.Encrypt("User");


            var requestBody = new
            {
                jsonrpc = "2.0",
                id = 1,
                method = "unsafe_moveCall",
                @params = new object[]
                {
                _settings.Signer,
                _settings.PackageID,
                "client",
                "create_user",
                new List<string>(),
                new List<Object>
                    {
                        !string.IsNullOrEmpty(walletAddress) ? walletAddress: "",
                        role,
                        timestamp.ToString()
                    },
                null,
                "500000000"
                }
            };
            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");
            try
            {
                var response = await _httpClient.PostAsync(_settings.SuiRpcUrl, content);
                response.EnsureSuccessStatusCode();
                if (response.IsSuccessStatusCode)
                {
                    var jsonResponse = await response.Content.ReadAsStringAsync();
                    var jsonObject = JObject.Parse(jsonResponse.ToString());
                    return jsonObject["result"]["txBytes"].ToString();
                }

                return string.Empty;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error creating User: {ex.Message}");
                return string.Empty;
            }

        }

    }
}
