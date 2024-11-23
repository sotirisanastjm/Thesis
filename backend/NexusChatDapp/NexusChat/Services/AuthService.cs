using Microsoft.IdentityModel.Tokens;
using NexusChat.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace NexusChat.Services
{
    public class AuthService
    {
        private IConfiguration _config;
        private readonly MoveService _moveService;
        private readonly SuiService _suiService;
        public AuthService(IConfiguration config, MoveService moveService, SuiService suiService)
        {
            _config = config;
            _moveService = moveService;
            _suiService = suiService;
        }

        public async Task<UserModel> CreateUser(UserRegisterModel model)
        {
            if(string.IsNullOrEmpty(model.WalletAddress) && string.IsNullOrEmpty(model.Password))
            {
                var walletIsValid = await _suiService.VerifyAddressAsync(model.WalletAddress);
                if (walletIsValid)
                {
                    var user = new UserModel();
                    user = await _moveService.CreateUserAsync(model);
                    return user;
                }
                throw new Exception("Wrong Address");
            }
            throw new MissingFieldException();
        }

        public async Task<UserModel> Authenticate(UserLoginModel loginUser = null, UserModel? unAuthorisedUser=null)
        {
            var userDB = new UserModel();
            var userClient = loginUser !=null ? new UserModel(loginUser) : unAuthorisedUser != null ? unAuthorisedUser : null;

            if (userClient != null)
            {
                if (!string.IsNullOrEmpty(loginUser.WalletAddress))
                {
                    userDB = await _moveService.GetUserByWalletAsync(loginUser.WalletAddress);
                }
                else if (!string.IsNullOrEmpty(loginUser.Username))
                {
                    userDB = await _moveService.GetUserByNameAsync(loginUser.Username);
                }
                else if (!string.IsNullOrEmpty(loginUser.Email))
                {
                    userDB = await _moveService.GetUserByEmailAsync(loginUser.Email);
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
