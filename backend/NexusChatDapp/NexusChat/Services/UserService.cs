using NexusChat.Models;
using System.Reflection;
using System.Security.Claims;

namespace NexusChat.Services
{
    public class UserService
    {
        private readonly MoveClient _moveClient;
        private readonly SuiService _suiService;
        public UserService(MoveClient moveClient, SuiService suiService) 
        {
            _moveClient = moveClient;
            _suiService = suiService;
        }

        public async Task GreetingsAsync()
        {
            var result = await _moveClient.GreetingsAsync();
            Console.WriteLine("Function Greetings Output: " + result);
        }

        public UserModel GetCurrentUser(ClaimsIdentity currentUser)
        {
            var userClaims = currentUser.Claims;
            return new UserModel
            { 
                ID = Guid.Parse(userClaims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value),
                Username = userClaims.FirstOrDefault(x => x.Type == ClaimTypes.Name)?.Value,
                Email = userClaims.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value,
                Role = userClaims.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value
            };
        }

        public async Task<UserModel> CreateUser(UserRegisterModel model)
        {
            if (!string.IsNullOrEmpty(model.WalletAddress) && !string.IsNullOrEmpty(model.Password))
            {
                var walletIsValid = await ValidateWallet(model.WalletAddress);
                if (walletIsValid)
                {
                    var user = new UserModel();
                    user = await _moveClient.CreateUserAsync(model);
                    return user;
                }
                throw new Exception("Wrong Address");
            }
            throw new MissingFieldException();
        }

        public async Task<UserModel> GetUserByWallet(string address)
        {
            if (!string.IsNullOrEmpty(address))
            {
                //var walletIsValid = await this._authService.ValidateWallet(model.WalletAddress);
                var user = new UserModel();
                user = await _moveClient.GetUserByWalletAsync(address);
                if(user != null)
                {
                    return user;
                }
                return null;
            }
            throw new MissingFieldException();
        }

        public async Task<bool> ValidateWallet(string address)
        {
            if (!string.IsNullOrEmpty(address))
            {
                var walletIsValid = await _suiService.VerifyAddressAsync(address);
                if (walletIsValid)
                {
                    return true;
                }
            }
            return false;

        }
    }
}
