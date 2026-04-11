namespace central_de_manutencao.Communication.Requests.Stock;

public class CreateStockItemRequestJson
{
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Quantity { get; set; } = string.Empty;
    public string MinQuantity { get; set; } = string.Empty;
}
