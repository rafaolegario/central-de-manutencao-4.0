namespace central_de_manutencao.Communication.Requests.User
{
    public class EditUserRequestJson
    {
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Specialty { get; set; } = string.Empty;
        public bool Active { get; set; }
    }
}
