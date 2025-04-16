using Microsoft.AspNetCore.DataProtection.KeyManagement;
using Microsoft.AspNetCore.Identity;
using System.Numerics;
using System;
using System.Text.Json;
using System.Text;
using System.Text.Json.Serialization;
using Newtonsoft.Json.Linq;

namespace NexusChat.Models
{

    public class UserModel
    {
        public string ID { get; set; }
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

        public UserModel(JObject? fields)
        {
            ID = fields["id"]["id"].ToString();
            WalletAddress = fields["wallet_address"].ToString();
            Username = CryptoService.Decrypt(ConvertByteArrayToString(fields["username"]));
            Email = CryptoService.Decrypt(ConvertByteArrayToString(fields["email"]));
            Password = CryptoService.Decrypt(ConvertByteArrayToString(fields["password"]));
            Role = CryptoService.Decrypt(ConvertByteArrayToString(fields["role"]));
            CreatedAt = ConvertUnixTimestampToDateTime(fields["created_at"].ToString());
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