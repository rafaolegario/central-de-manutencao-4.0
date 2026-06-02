namespace central_de_manutencao.Communication.Requests.Auth
{
    public class SetFirstPasswordRequestJson
    {
        public string Email { get; set; } = string.Empty;
        public string NewPassword { get; set; } = string.Empty;
    }
}
