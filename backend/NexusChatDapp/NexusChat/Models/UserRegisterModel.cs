namespace NexusChat.Models
{
    public class UserRegisterModel
    {
        // public string Username { get; set; }
        // public string Password { get; set; }
        public string WalletAddress { get; set; }
        // public string? Email { get; set; }
    }

    public class CreateUserRequest
    {
        public TransactionData TransactionUserData { get; set; }
        public string WalletAddress { get; set; }
    }
}
