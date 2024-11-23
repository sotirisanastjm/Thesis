using NexusChat.Models;
using System.Net.Http.Json;

namespace NexusChat.Services
{
    public class MoveService
    {
        private readonly HttpClient _httpClient;

        public MoveService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        // Create a user on the Move blockchain
        public async Task<UserModel> CreateUserAsync(UserRegisterModel user)
        {
            var requestData = new
            {
                ID = new Guid(),
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
                if(userData != null)
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
            var response = await _httpClient.GetAsync($"https://move-blockchain-api/fetch_user_by_id/{id}");

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
