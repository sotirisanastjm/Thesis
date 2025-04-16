using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;

public static class CryptoService
{
    public static string Encrypt(string plainText)
    {
        using (Aes aesAlg = Aes.Create())
        {
            aesAlg.Key = GetValidKey(CryptoConfig.Key, 32);
            aesAlg.IV = GetValidKey(CryptoConfig.IV, 16);

            ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);
            using (MemoryStream msEncrypt = new MemoryStream())
            {
                using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                {
                    using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
                    {
                        swEncrypt.Write(plainText);
                    }
                }
                return Convert.ToBase64String(msEncrypt.ToArray());
            }
        }
    }

    public static string Decrypt(string cipherText)
    {
        using (Aes aesAlg = Aes.Create())
        {
            aesAlg.Key = GetValidKey(CryptoConfig.Key, 32);
            aesAlg.IV = GetValidKey(CryptoConfig.IV, 16);

            ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);
            using (MemoryStream msDecrypt = new MemoryStream(Convert.FromBase64String(cipherText)))
            {
                using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                {
                    using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                    {
                        return srDecrypt.ReadToEnd();
                    }
                }
            }
        }
    }

    private static byte[] GetValidKey(string key, int requiredLength)
    {
        byte[] keyBytes = Encoding.UTF8.GetBytes(key);

        if (keyBytes.Length < requiredLength)
        {
            Array.Resize(ref keyBytes, requiredLength);
        }
        else if (keyBytes.Length > requiredLength)
        {
            Array.Resize(ref keyBytes, requiredLength);
        }

        return keyBytes;
    }
}
