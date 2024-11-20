using NexusChat.Models;

namespace NexusChat.Services
{
    public class MoveService
    {
        private readonly HttpClient _httpClient;

        public MoveService(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        public async Task<ApplicationUser> CreateUserAsync(ApplicationUser user)
        {
            var requestData = new
            {
                id=user.Id,
                wallet_address = user.WalletAddress,
                username = user.UserName,
                password = user.PasswordHash,
                created_at = DateTime.UtcNow
            };

            var response = await _httpClient.PostAsJsonAsync("https://move-blockchain-api/create_user", requestData);

            if (response.IsSuccessStatusCode)
            {
                var userData = await response.Content.ReadFromJsonAsync<ApplicationUser>();
                return userData;
            }

            throw new Exception("Failed to create user on the Move blockchain.");
        }

        public async Task<ApplicationUser> GetUserByWalletAsync(string walletAddress)
        {
            var response = await _httpClient.GetAsync($"https://move-blockchain-api/get_user_by_wallet/{walletAddress}");

            if (response.IsSuccessStatusCode)
            {
                var user = await response.Content.ReadFromJsonAsync<ApplicationUser>();
                return user;
            }

            throw new Exception("Failed to fetch user from the Move blockchain.");
        }

        public async Task<bool> UpdateUserPasswordAsync(string walletAddress, string newPassword)
        {
            var requestData = new { wallet_address = walletAddress, new_password = newPassword };
            var response = await _httpClient.PostAsJsonAsync("https://move-blockchain-api/update_user_password", requestData);

            if (!response.IsSuccessStatusCode)
            {
                return false;
                throw new Exception("Failed to update user password on the Move blockchain.");
            }
            return true;
        }

        public async Task<bool> DeleteUserAsync(string walletAddress)
        {
            var response = await _httpClient.PostAsync($"https://move-blockchain-api/delete_user/{walletAddress}", null);

            if (!response.IsSuccessStatusCode)
            {
                return false;
                throw new Exception("Failed to delete user on the Move blockchain.");
            }
            return true;
        }
    }


}
