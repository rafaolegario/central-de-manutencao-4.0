namespace central_de_manutencao.Communication.Requests.Stock;

public class ReplenishStockRequestJson
{
    public string Quantity { get; set; } = string.Empty;
    public string? Note { get; set; }
}
