public class SuiSettings
{
    public string SuiRpcUrl { get; set; }
    public string StructTypeUser { get; set; }
    public string StructTypeChat { get; set; }
    public string StructTypeNotepad { get; set; }
    public string PackageID { get; set; }
    public string Signer { get; set; }
    public string PrivateKey { get; set; }
    public string PublicKey { get; set; }
    public string Flag { get; set; }
}

public static class CryptoConfig
{
    public static string Key { get; set; }
    public static string IV { get; set; }
}
