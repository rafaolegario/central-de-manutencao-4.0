namespace central_de_manutencao.Communication.Requests.ServiceOrder
{
    public class CreateServiceOrderRequestJson
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? Location { get; set; }
        public string Priority { get; set; } = string.Empty;
        public string? DueDate { get; set; }
    }
}
