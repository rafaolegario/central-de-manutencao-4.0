namespace central_de_manutencao.Communication.Responses.Auth
{
    public class AuthenticateResponseJson
    {
        public string Token { get; set; } = string.Empty;
        public int ExpiresIn { get; set; }
        public AuthenticateUserJson User { get; set; } = new();
    }

    public class AuthenticateUserJson
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Role { get; set; } = string.Empty;
        public string? Specialty { get; set; }
    }
}