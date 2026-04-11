using central_de_manutencao.Api.Models.Stock;

namespace central_de_manutencao.Api.Database.Repositories.Stock;

public interface IStockItemRepository
{
    Task Create(StockItem item);
    Task Update(StockItem item);
    Task<StockItem?> GetById(Guid id);
    Task<StockItem?> GetByCode(string code);
    Task<List<StockItem>> List(bool? lowStock);
    Task ReplenishWithMovement(StockItem item, StockMovement movement);
    Task<(List<StockMovement> Items, int TotalCount)> GetMovements(Guid stockItemId, int page, int pageSize);
}
