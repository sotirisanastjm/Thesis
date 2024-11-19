using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json.Linq;

public class SuiService
{
    private readonly HttpClient _httpClient;
    private const string SuiDevnetRpcUrl = "https://fullnode.devnet.sui.io";

    public SuiService(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    public async Task<bool> VerifyAddressAsync(string address)
    {
        var requestBody = new
        {
            jsonrpc = "2.0",
            method = "suix_getBalance",
            @params = new object[] { address },
            id = 1
        };

        var content = new StringContent(
            Newtonsoft.Json.JsonConvert.SerializeObject(requestBody),
            Encoding.UTF8,
            "application/json"
        );

        try
        {
            var response = await _httpClient.PostAsync(SuiDevnetRpcUrl, content);
            if (!response.IsSuccessStatusCode)
            {
                Console.WriteLine($"Error: Received status code {response.StatusCode}");
                return false;
            }

            var responseString = await response.Content.ReadAsStringAsync();
            var jsonResponse = JObject.Parse(responseString);

            if (jsonResponse["result"] != null && jsonResponse["error"] == null)
            {
                return true;
            }

            Console.WriteLine("Error: Invalid wallet address or response contained an error.");
            return false;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Exception during address verification: {ex.Message}");
            return false;
        }
    }

}
