namespace central_de_manutencao.Communication.Responses.Tool;

public class ToolUsageResponseJson
{
    public string Id { get; set; } = string.Empty;
    public string ToolId { get; set; } = string.Empty;
    public string? ToolName { get; set; }
    public string WorkOrderId { get; set; } = string.Empty;
    public string TechnicianId { get; set; } = string.Empty;
    public string? TechnicianName { get; set; }
    public string WithdrawnAt { get; set; } = string.Empty;
    public string? ReturnedAt { get; set; }
}
