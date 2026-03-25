namespace central_de_manutencao.Communication.Responses.Auth
{
    public class AuthenticateResponseJson
    {
        public string Token { get; set; } = string.Empty;
        public string UserId { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
    }
}