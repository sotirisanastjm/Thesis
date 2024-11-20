using Microsoft.AspNetCore.Identity;

namespace NexusChat.Models
{
    
    public class ApplicationUser : IdentityUser
    {
        public string WalletAddress { get; set; } 
        public DateTime CreatedAt { get; set; }
    }

}
