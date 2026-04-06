namespace central_de_manutencao.Communication.Requests.ServiceOrder
{
    public class UpdateServiceOrderStatusRequestJson
    {
        public string Status { get; set; } = string.Empty;
        public string? TechnicianId { get; set; }
        public string? CompletionNotes { get; set; }
    }
}
