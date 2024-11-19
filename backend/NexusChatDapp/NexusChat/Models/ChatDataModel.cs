namespace NexusChat.Models
{
    public class ChatDataModel
    {
        public class ChatHistory
        {
            public string ChatId { get; set; }
            public string UserWalletAddress { get; set; } // Links to the user
            public List<MessageItem> Messages { get; set; } = new();
            public DateTime CreatedAt { get; set; }
        }

    }
}
