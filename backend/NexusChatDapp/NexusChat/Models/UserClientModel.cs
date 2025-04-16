namespace NexusChat.Models
{
    public class UserClientModel
    {
        
        public string Username { get; set; }
        public string Email { get; set; }
        public string WalletAddress { get; set; }
        public string ID { get; set; }

        public UserClientModel() { }

        public UserClientModel(UserModel user)
        {
            Username = user.WalletAddress;
            Email = user.Email;
            WalletAddress = user.WalletAddress;
            ID = user.ID;
        }
    }
}
