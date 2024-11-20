using Microsoft.AspNetCore.Identity;
using NexusChat.Models;
using NexusChat.Services;

namespace NexusChat.Context
{
    public class CustomUserStore : IUserStore<ApplicationUser>, IUserPasswordStore<ApplicationUser>
    {
        private readonly MoveService _moveService;

        public CustomUserStore(MoveService moveService)
        {
            _moveService = moveService;
        }

        public async Task<IdentityResult> CreateAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            // Save the user in Move blockchain
            var moveSuccess = await _moveService.CreateUserAsync(user);
            if (moveSuccess != null)
            {
                return IdentityResult.Failed(new IdentityError { Description = "Failed to save user to Move blockchain." });
            }

            return IdentityResult.Success;
        }

        public Task<ApplicationUser> FindByIdAsync(string userId, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        public Task<ApplicationUser> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken)
        {
            throw new NotImplementedException();
        }

        //public async Task<ApplicationUser> FindByIdAsync(string userId, CancellationToken cancellationToken)
        //{
        //    return await _moveService.GetUserById(userId);
        //}

        //public async Task<ApplicationUser> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken)
        //{
        //    return await _moveService.GetUserByName(normalizedUserName);
        //}

        public async Task<string> GetPasswordHashAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            return user.PasswordHash;
        }

        public Task SetPasswordHashAsync(ApplicationUser user, string passwordHash, CancellationToken cancellationToken)
        {
            user.PasswordHash = passwordHash;
            return Task.CompletedTask;
        }

        public Task<bool> HasPasswordAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(!string.IsNullOrEmpty(user.PasswordHash));
        }

        public async Task<string> GetUserIdAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            // Assuming WalletAddress is used as the user ID
            return await Task.FromResult(user.WalletAddress);
        }

        public Task<string> GetUserNameAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.UserName);
        }

        public Task SetUserNameAsync(ApplicationUser user, string userName, CancellationToken cancellationToken)
        {
            user.UserName = userName;
            return Task.CompletedTask;
        }

        public Task SetNormalizedUserNameAsync(ApplicationUser user, string normalizedName, CancellationToken cancellationToken)
        {
            user.UserName = normalizedName;
            return Task.CompletedTask;
        }
        public Task<string> GetNormalizedUserNameAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            return Task.FromResult(user.UserName.ToLower()); // or apply any other normalization logic
        }


        public async Task<IdentityResult> UpdateAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            // Update the user on the blockchain
            bool updateSuccess = await _moveService.UpdateUserPasswordAsync(user.WalletAddress, user.PasswordHash);
            return updateSuccess ? IdentityResult.Success : IdentityResult.Failed(new IdentityError { Description = "User update failed." });
        }

        public async Task<IdentityResult> DeleteAsync(ApplicationUser user, CancellationToken cancellationToken)
        {
            // Delete the user from the blockchain
            bool deleteSuccess = await _moveService.DeleteUserAsync(user.WalletAddress);
            return deleteSuccess ? IdentityResult.Success : IdentityResult.Failed(new IdentityError { Description = "User deletion failed." });
        }

        public void Dispose()
        {
            // Dispose resources if needed
        }

    }
}
