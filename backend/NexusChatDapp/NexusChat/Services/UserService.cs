using NexusChat.Models;
using System.Security.Claims;

namespace NexusChat.Services
{
    public class UserService
    {
        public UserService() { }

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
    }
}
