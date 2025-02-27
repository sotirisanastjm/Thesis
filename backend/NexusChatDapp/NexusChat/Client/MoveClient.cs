using NexusChat.Models;
using System.Text.Json;
using System.Text;

namespace NexusChat.Services
{
    public class MoveClient
    {
        private readonly HttpClient _httpClient;
        private const string SuiRpcUrl = "https://fullnode.devnet.sui.io";

        public MoveClient(HttpClient httpClient)
        {
            //_httpClient = new HttpClient { BaseAddress = new Uri(SuiRpcUrl) };
            _httpClient = httpClient;

        }

        public async Task<string> GreetingsAsync()
        {
            
            var requestBody = new
            {
                jsonrpc = "2.0",
                id = 1,
                method = "unsafe_moveCall",
                @params = new object[]
                {
                "0xf90abae4224ad922c2685fb88c369d902f24ec271890993e7fcd9ab80ba077b0",
                "0xaab73fe2d249ce4ead0dec410c22fc72742a5a153df4e7ce17c09fe83ff0fcee",
                "greetings",
                "say_hello",
                new List<string>(),
                new List<string>(),
                null,
                "5000000" 
                }
            };

            var content = new StringContent(JsonSerializer.Serialize(requestBody), Encoding.UTF8, "application/json");

           
            var response = await _httpClient.PostAsync(SuiRpcUrl, content);
            response.EnsureSuccessStatusCode();

            var responseContent = await response.Content.ReadAsStringAsync();
            var jsonResponse = JsonDocument.Parse(responseContent);

            var result = jsonResponse.RootElement.GetProperty("result").GetProperty("returnValues").ToString();
            return result;
        }
        // Create a user on the Move blockchain
        public async Task<UserModel> CreateUserAsync(UserRegisterModel user)
        {
            var requestData = new
            {
                ID = Guid.NewGuid(),
                WalletAddress = user.WalletAddress,
                Username = !string.IsNullOrEmpty(user.Username) ? user.Username : "",
                Email = !string.IsNullOrEmpty(user.Email) ? user.Email : "",
                Password = user.Password,
                Role = "User",
                CreatedAt = DateTime.UtcNow,
            };

            var response = await _httpClient.PostAsJsonAsync("https://move-blockchain-api/create_user", requestData);

            if (response.IsSuccessStatusCode)
            {
                var userData = await response.Content.ReadFromJsonAsync<UserModel>();
                if (userData != null)
                {
                    return userData;
                }
            }

            throw new Exception("Failed to create user on the Move blockchain.");
        }

        // Get a user by their wallet address
        public async Task<UserModel> GetUserByWalletAsync(string walletAddress)
        {
            var response = await _httpClient.GetAsync($"https://move-blockchain-api/get_user_by_wallet/{walletAddress}");

            if (response.IsSuccessStatusCode)
            {
                var user = await response.Content.ReadFromJsonAsync<UserModel>();
                return user;
            }

            throw new Exception($"Failed to fetch user with wallet address {walletAddress} from the Move blockchain.");
        }

        // Get a user by their username
        public async Task<UserModel> GetUserByNameAsync(string username)
        {
            var response = await _httpClient.GetAsync($"https://move-blockchain-api/get_user_by_username/{username}");

            if (response.IsSuccessStatusCode)
            {
                var user = await response.Content.ReadFromJsonAsync<UserModel>();
                return user;
            }

            throw new Exception($"Failed to fetch user with username {username} from the Move blockchain.");
        }
        public async Task<UserModel> GetUserByEmailAsync(string email)
        {
            var response = await _httpClient.GetAsync($"https://move-blockchain-api/get_user_by_email/{email}");

            if (response.IsSuccessStatusCode)
            {
                var user = await response.Content.ReadFromJsonAsync<UserModel>();
                return user;
            }

            throw new Exception($"Failed to fetch user with email {email} from the Move blockchain.");
        }

        // Get a user by their ID
        public async Task<UserModel> GetUserByIdAsync(string id)
        {
            var response = await _httpClient.GetAsync($"https://move-blockchain-api/get_user_by_id/{id}");

            if (response.IsSuccessStatusCode)
            {
                var user = await response.Content.ReadFromJsonAsync<UserModel>();
                return user;
            }

            throw new Exception($"Failed to fetch user with ID {id} from the Move blockchain.");
        }

        public async Task<bool> UpdateUserPasswordAsync(string id, string newPassword)
        {
            var requestData = new { id = id, new_password = newPassword };
            var response = await _httpClient.PostAsJsonAsync("https://move-blockchain-api/update_user_password", requestData);

            if (response.IsSuccessStatusCode)
            {
                return true;
            }

            throw new Exception($"Failed to update user password for user with ID {id} on the Move blockchain.");
        }

        public async Task<bool> DeleteUserAsync(string id)
        {
            var response = await _httpClient.PostAsync($"https://move-blockchain-api/delete_user/{id}", null);

            if (response.IsSuccessStatusCode)
            {
                return true;
            }

            throw new Exception($"Failed to delete user with ID {id} on the Move blockchain.");
        }
    }
}
