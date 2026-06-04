namespace central_de_manutencao.Communication.Responses.Stock;

public class MyStockMovementResponseJson
{
    public string Id { get; set; } = string.Empty;
    public string StockItemId { get; set; } = string.Empty;
    public string? StockItemCode { get; set; }
    public string? StockItemName { get; set; }
    public int Quantity { get; set; }
    public string? Note { get; set; }
    public string CreatedAt { get; set; } = string.Empty;
}
