namespace NexusChat.Models
{
    public class UserDataModel
    {
        public Guid ID { get; set; }
        public string WalletAddress { get; set; }
    }
    public class User
    {
        public string WalletAddress { get; set; } // Unique identifier
        public string Username { get; set; }
        public string? Email { get; set; } // Optional
        public List<string> ChatHistoryReferences { get; set; } = new();
        public DateTime CreatedAt { get; set; }
    }

}
