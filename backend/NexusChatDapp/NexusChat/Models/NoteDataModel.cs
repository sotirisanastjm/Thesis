namespace NexusChat.Models
{
    
    public class NoteFolder
    {
        public Guid FolderId { get; set; }
        public string Title { get; set; }
        public string UserID { get; set; } // Links to the user
        public List<Note> Notes { get; set; } = new();
    }

    public class Note
    {
        public Guid NoteId { get; set; }
        public string Content { get; set; }
        public string Title { get; set; }
        public string? Description { get; set; }
        public DateTime CreatedAt { get; set; }
    }

}
