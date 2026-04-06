namespace central_de_manutencao.Communication.Responses.ServiceOrder
{
    public class ServiceOrderResponseJson
    {
        public string Id { get; set; } = string.Empty;
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? Location { get; set; }
        public string CreatedAt { get; set; } = string.Empty;
        public string? UpdatedAt { get; set; }
        public string? AssignedAt { get; set; }
        public string? DueDate { get; set; }
        public string? CompletedAt { get; set; }
        public string? ApprovedAt { get; set; }
        public string? RejectedAt { get; set; }
        public string Priority { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? TechnicianId { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public string? AssignedBy { get; set; }
        public string? CompletionNotes { get; set; }
    }
}
