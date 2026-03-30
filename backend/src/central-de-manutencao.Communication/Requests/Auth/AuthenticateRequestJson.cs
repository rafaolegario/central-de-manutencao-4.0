namespace central_de_manutencao.Communication.Requests.Auth
{
    public class AuthenticateRequestJson
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}