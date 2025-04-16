using System.Text;
using Newtonsoft.Json.Linq;

namespace NexusChat.Models
{
    public class ChatDataModel
    {

        public string ChatId { get; set; }
        public List<MessageItem> Messages { get; set; }

        public ChatDataModel() { }

        public ChatDataModel(JObject? fields)
        {
            ChatId = fields["id"]["id"].ToString();
            var messagesArray = (JArray)fields["messages"];
            var messageItems = new List<MessageItem>();

            foreach (var msg in messagesArray)
            {
                var id = msg["fields"]["id"]?["id"]?.ToString();
                var message = ConvertByteArrayToString(msg["fields"]["message"]);
                var date = ConvertUnixTimestampToDateTime(msg["fields"]["date"]?.ToString() ?? "0");
                var senderStr = ConvertByteArrayToString(msg["fields"]["sender"]);
                int sender = int.TryParse(senderStr, out var parsedSender) ? parsedSender : 0;

                messageItems.Add(new MessageItem
                {
                    Id = id,
                    Message = message,
                    Date = date.ToString(),
                    Sender = sender
                });
            }

            Messages = messageItems;
        }
        private static DateTime ConvertUnixTimestampToDateTime(string unixTimestamp)
        {
            // Convert Unix timestamp to DateTime
            long timestamp = long.Parse(unixTimestamp);
            DateTimeOffset dateTimeOffset = DateTimeOffset.FromUnixTimeSeconds(timestamp);
            return dateTimeOffset.DateTime;
        }
        private static string ConvertByteArrayToString(JToken jsonElement)
        {
            // Convert byte array to string
            return Encoding.UTF8.GetString(jsonElement.Select(e => (byte)e).ToArray());
        }
    }
}
