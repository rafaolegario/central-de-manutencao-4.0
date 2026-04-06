namespace central_de_manutencao.Communication.Responses.ServiceOrder
{
    public class ServiceOrderLogResponseJson
    {
        public string Id { get; set; } = string.Empty;
        public string ServiceOrderId { get; set; } = string.Empty;
        public string OldStatus { get; set; } = string.Empty;
        public string NewStatus { get; set; } = string.Empty;
        public string ChangedAt { get; set; } = string.Empty;
        public string ChangedBy { get; set; } = string.Empty;
        public string? Description { get; set; }
    }
}
