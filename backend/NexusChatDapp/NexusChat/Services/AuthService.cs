using Microsoft.IdentityModel.Tokens;
using NexusChat.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Reflection;
using System.Security.Claims;
using System.Text;

namespace NexusChat.Services
{
    public class AuthService
    {
        private IConfiguration _config;
        private readonly MoveClient _moveClient;
        private readonly SuiService _suiService;
        private readonly UserService _userService;
        public AuthService(IConfiguration config, MoveClient moveClient, SuiService suiService, UserService userService)
        {
            _config = config;
            _moveClient = moveClient;
            _suiService = suiService;
            _userService = userService;
        }

        public async Task<WalletValidationResult> ValidateExistingWallet(string address)
        {
            var isWalletValid = await this._userService.ValidateWallet(address);
            var result = new WalletValidationResult
            {
                Validate = isWalletValid,
                Exists = isWalletValid ? await this._userService.GetUserByWallet(address) != null : false
            };
            return result;
        }

        public async Task<UserModel> AuthenticateUser(UserLoginModel loginUser = null, UserModel? unAuthorisedUser=null)
        {
            var userDB = new UserModel();
            var userClient = loginUser !=null ? new UserModel(loginUser) : unAuthorisedUser != null ? unAuthorisedUser : null;

            if (userClient != null)
            {
                if (!string.IsNullOrEmpty(loginUser.WalletAddress))
                {
                    userDB = await _moveClient.GetUserByWalletAsync(loginUser.WalletAddress);
                }
                else if (!string.IsNullOrEmpty(loginUser.Username))
                {
                    userDB = await _moveClient.GetUserByNameAsync(loginUser.Username);
                }
                else if (!string.IsNullOrEmpty(loginUser.Email))
                {
                    userDB = await _moveClient.GetUserByEmailAsync(loginUser.Email);
                }
                else
                {
                    return null;
                }
                return ValidateUser(userDB, new UserModel(loginUser)) ? userDB : null;
            }
            else
            {
                return null;
            }
        }

        private bool ValidateUser(UserModel user, UserModel request)
        {
            if (user == null)
                return false;

            if (!string.IsNullOrEmpty(request.WalletAddress) &&
                user.WalletAddress != request.WalletAddress)
            {
                return false;
            }

            if (!string.IsNullOrEmpty(request.Username) &&
                user.Username != request.Username)
            {
                return false;
            }

            if (!string.IsNullOrEmpty(request.Email) &&
                user.Email != request.Email)
            {
                return false;
            }

            if (user.Password != request.Password)
            {
                return false;
            }

            return true;
        }

        private string GetJwtToken(UserModel user)
        {
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config["Jwt:Key"]));
            var credentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.ID.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(ClaimTypes.Role, user.Role),
            };

            var token = new JwtSecurityToken(_config["Jwt:Issuer"],
                _config["Audience"],
                claims,expires: DateTime.Now.AddMinutes(30),
                signingCredentials: credentials);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }

        public string GenerateJwt(UserModel user)
        {
            return GetJwtToken(user);
        }
    }
}
public class WalletValidationResult
{
    public bool Validate { get; set; }
    public bool Exists { get; set; }
}