using NexusChat.Models;

public class TransactionData
{
    public string bytes { get; set; }
    public string signature { get; set; }
}

public class TransactionMessageResponse
{
    public MessageItem UserMessage { get; set; }
    public MessageItem BotMessage { get; set; }
}