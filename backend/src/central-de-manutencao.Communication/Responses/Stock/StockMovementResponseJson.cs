namespace central_de_manutencao.Communication.Responses.Stock;

public class StockMovementResponseJson
{
    public string Id { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public string? WorkOrderId { get; set; }
    public string? Note { get; set; }
    public string CreatedAt { get; set; } = string.Empty;
}
