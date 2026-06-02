namespace central_de_manutencao.Communication.Responses.Auth
{
    public class CheckEmailResponseJson
    {
        public bool Exists { get; set; }
        public bool MustSetPassword { get; set; }
        public bool AnyAdminExists { get; set; }
    }
}
