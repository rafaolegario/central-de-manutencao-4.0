namespace central_de_manutencao.Communication.Responses.Auth
{
    public class RefreshTokenResponseJson
    {
        public string Token { get; set; } = string.Empty;
        public int ExpiresIn { get; set; }
    }
}
