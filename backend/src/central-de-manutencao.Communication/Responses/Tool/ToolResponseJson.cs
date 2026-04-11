namespace central_de_manutencao.Communication.Responses.Tool;

public class ToolResponseJson
{
    public string Id { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int TotalQuantity { get; set; }
    public int AvailableQuantity { get; set; }
    public string CreatedAt { get; set; } = string.Empty;
    public List<ToolUsageResponseJson>? OpenUsages { get; set; }
}
