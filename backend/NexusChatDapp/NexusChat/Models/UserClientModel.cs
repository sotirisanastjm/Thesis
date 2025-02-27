namespace NexusChat.Models
{
    public class UserClientModel
    {
        
        public string Username { get; set; }
        public string Email { get; set; }

        public UserClientModel() { }

        public UserClientModel(UserModel user)
        {
            Username = user.WalletAddress;
            Email = user.Email;
        }
    }
}
