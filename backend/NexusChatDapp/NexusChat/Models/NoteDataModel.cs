using System.Text;
using Newtonsoft.Json.Linq;

namespace NexusChat.Models
{

    public class Notepad
    {
        public string Id { get; set; }
        public List<NoteFolder> Folders { get; set; } = new();

        public Notepad() { }

        public Notepad(JObject? fields)
        {
            Id = fields["id"]["id"].ToString();
            var foldersArray = (JArray)fields["folders"];
            var folders = new List<NoteFolder>();

            foreach (var folder in foldersArray)
            {
                var id = folder["fields"]["id"]?["id"]?.ToString();
                var name = CryptoService.Decrypt(ConvertByteArrayToString(folder["fields"]["name"]));
                var notesArray = (JArray)folder["fields"]["notes"];
                var notes = new List<Note>();
                foreach (var note in notesArray)
                {
                    var noteid = ConvertByteArrayToString(note["fields"]["id"]);
                    var message = CryptoService.Decrypt(ConvertByteArrayToString(note["fields"]["message"]));
                    var date = ConvertUnixTimestampToDateTime(note["fields"]["date"]?.ToString() ?? "0");
                    var senderStr = ConvertByteArrayToString(note["fields"]["sender"]);
                    int sender = int.TryParse(senderStr, out var parsedSender) ? parsedSender : 0;

                    notes.Add(new Note{
                        Id= noteid,
                        Message= message,
                        Date= date.ToString(),
                        Sender= sender
                    });
                }

                folders.Add(new NoteFolder
                {
                    Id = id,
                    Name = name,
                    Notes = notes
                });
            }

            Folders = folders;
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
    public class NoteFolder
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public List<Note> Notes { get; set; } = new();
    }

    public class Note
    {
        public string Id { get; set; }
        public string Message { get; set; }
        public string Date { get; set; }
        public int Sender { get; set; }
    }

    public class CreateFolderRequest
    {
        public string wallet { get; set; }
        public string name { get; set; }
        public string objectId { get; set; }
    }
    public class AddNoteRequest
    {
        public string wallet { get; set; }
        public Note note { get; set; }
        public string objectId { get; set; }
        public int index { get; set; }
    }

}
