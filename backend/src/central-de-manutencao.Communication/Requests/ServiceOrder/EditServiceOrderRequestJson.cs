namespace central_de_manutencao.Communication.Requests.ServiceOrder
{
    public class EditServiceOrderRequestJson
    {
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? Location { get; set; }
        public string? DueDate { get; set; }
    }
}
