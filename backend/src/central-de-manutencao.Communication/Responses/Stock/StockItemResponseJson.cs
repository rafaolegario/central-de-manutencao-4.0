namespace central_de_manutencao.Communication.Responses.Stock;

public class StockItemResponseJson
{
    public string Id { get; set; } = string.Empty;
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public int MinQuantity { get; set; }
    public bool IsLow { get; set; }
    public string CreatedAt { get; set; } = string.Empty;
}
