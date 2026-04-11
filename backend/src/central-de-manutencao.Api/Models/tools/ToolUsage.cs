namespace central_de_manutencao.Api.Models.Tools;

public class ToolUsage
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid ToolId { get; set; }
    public Guid WorkOrderId { get; set; }
    public Guid TechnicianId { get; set; }
    public DateTime WithdrawnAt { get; set; } = DateTime.UtcNow;
    public DateTime? ReturnedAt { get; set; }
}
