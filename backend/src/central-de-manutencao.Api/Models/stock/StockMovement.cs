using central_de_manutencao.Api.Enums;

namespace central_de_manutencao.Api.Models.Stock;

public class StockMovement
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public Guid StockItemId { get; set; }
    public StockMovementType Type { get; set; }
    public int Quantity { get; set; }
    public Guid? WorkOrderId { get; set; }
    public string? Note { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
