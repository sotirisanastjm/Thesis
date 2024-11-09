using Newtonsoft.Json;
using NexusChat.Models;
using System.Text;

namespace NexusChat.Services
{
    public class AIService
    {
        private readonly HttpClient _httpClient;
        private readonly string _apiKey;

        public AIService(HttpClient httpClient, string apiKey)
        {
            _httpClient = httpClient;
            _apiKey = apiKey;
        }

        public async Task<MessageResponse> GetAiResponse(MessageItem message)
        {
            var requestBody = new
            {
                model = "gpt-4o-mini",
                messages = new[]
                {
                    new
                    {
                        role = "user",
                        content = message.Message
                    }
                },
                max_tokens = 150
            };

            var jsonRequest = JsonConvert.SerializeObject(requestBody);
            var request = new HttpRequestMessage
            {
                Method = HttpMethod.Post,
                RequestUri = new Uri("https://api.openai.com/v1/chat/completions"),
                Content = new StringContent(jsonRequest, Encoding.UTF8, "application/json")
            };

            request.Headers.Add("Authorization", $"Bearer {this._apiKey}");
            var response = await _httpClient.SendAsync(request);

            var result = new MessageResponse();

            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStringAsync();
                var openAiResponse = JsonConvert.DeserializeObject<OpenAiResponse>(responseContent);
                result.Bot = new MessageItem(openAiResponse);
                return result;
            }
            else
            {
                if (response.StatusCode == System.Net.HttpStatusCode.TooManyRequests)
                {
                    result.error = "Too Many Requests - Please try again later.";
                }
                else
                {
                    result.error = "Error communicating with OpenAI API.";
                }

                return result;
            }

        }
    }
}
