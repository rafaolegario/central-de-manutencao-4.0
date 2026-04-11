namespace central_de_manutencao.Api.Models.Stock;

public class StockItem
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Code { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public int Quantity { get; set; }
    public int MinQuantity { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
