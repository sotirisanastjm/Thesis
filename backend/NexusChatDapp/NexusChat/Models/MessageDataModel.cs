using NexusChat.Controllers;
using System.Globalization;

namespace NexusChat.Models
{

    public class MessageResponse
    {
        public MessageItem Bot { get; set; }
        public string error { get; set; }
    }

    public class MessageItem
    {
        public string Id { get; set; }
        public string Date { get; set; }
        public string Message { get; set; }
        public int Sender { get; set; }

        public MessageItem()
        {
        }

        public MessageItem(OpenAiResponse openAiResponse)
        {
            this.Id = "temp-id-Bot";
            this.Date = DateTime.Now.ToString("dd/MM/yyyy", new CultureInfo("el-GR"));
            this.Sender = 0;
            this.Message = openAiResponse.Choices?[0]?.Message?.Content ?? "No response from AI";
        }

        public MessageItem(string message, string id, int sender)
        {
            this.Id = id;
            this.Date = DateTime.Now.ToString("dd/MM/yyyy", new CultureInfo("el-GR"));
            this.Message = message;
            this.Sender = sender;
        }
    }

    public class AIRequest
    {
        public MessageItem msgRequest { get; set; }
        public string chatObjectId { get; set; }
        public string? walletAddress { get; set; }
    }

    public class OpenAiResponse
    {
        public Choice[] Choices { get; set; }
    }

    public class Choice
    {
        public MessageDataModel Message { get; set; }
    }

    public class MessageDataModel
    {
        public string Content { get; set; }
    }

}
