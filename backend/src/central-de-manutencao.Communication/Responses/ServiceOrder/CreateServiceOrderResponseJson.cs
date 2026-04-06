namespace central_de_manutencao.Communication.Responses.ServiceOrder
{
    public class CreateServiceOrderResponseJson
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? Location { get; set; }
        public string Priority { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string CreatedBy { get; set; } = string.Empty;
        public string? DueDate { get; set; }
    }
}
