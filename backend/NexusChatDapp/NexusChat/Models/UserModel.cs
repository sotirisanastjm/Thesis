using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.Identity;
using System.Numerics;
using System;

namespace NexusChat.Models
{
    
    public class UserModel
    {

        public Guid ID { get; set; }
        public string WalletAddress { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public DateTime CreatedAt { get; set; }

        public UserModel() { }

        public UserModel(UserLoginModel user)
        {
            WalletAddress = user.WalletAddress;
            Username = user.Username;
            Email = user.Email;
            Password = user.Password;
        }
    }
}