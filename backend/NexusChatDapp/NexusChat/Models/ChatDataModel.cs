namespace NexusChat.Models
{
    public class ChatDataModel
    {
        public class ChatHistory
        {
            public string ChatId { get; set; }
            public string UserID { get; set; } 
            public List<MessageItem> Messages { get; set; } = new();
            public DateTime CreatedAt { get; set; }
        }

    }
}
