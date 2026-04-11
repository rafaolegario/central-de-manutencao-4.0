using Microsoft.EntityFrameworkCore;
using central_de_manutencao.Api.Models.Stock;

namespace central_de_manutencao.Api.Database.Repositories.Stock;

public class StockItemRepository : IStockItemRepository
{
    private readonly AppDbContext _context;

    public StockItemRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task Create(StockItem item)
    {
        _context.StockItems.Add(item);
        await _context.SaveChangesAsync();
    }

    public async Task Update(StockItem item)
    {
        _context.StockItems.Update(item);
        await _context.SaveChangesAsync();
    }

    public async Task<StockItem?> GetById(Guid id)
    {
        return await _context.StockItems.FirstOrDefaultAsync(i => i.Id == id);
    }

    public async Task<StockItem?> GetByCode(string code)
    {
        return await _context.StockItems.FirstOrDefaultAsync(i => i.Code == code);
    }

    public async Task<List<StockItem>> List(bool? lowStock)
    {
        var query = _context.StockItems.AsQueryable();

        if (lowStock == true)
            query = query.Where(i => i.Quantity < i.MinQuantity);

        return await query.OrderBy(i => i.Name).ToListAsync();
    }

    public async Task ReplenishWithMovement(StockItem item, StockMovement movement)
    {
        _context.StockItems.Update(item);
        _context.StockMovements.Add(movement);
        await _context.SaveChangesAsync();
    }

    public async Task<(List<StockMovement> Items, int TotalCount)> GetMovements(Guid stockItemId, int page, int pageSize)
    {
        var query = _context.StockMovements
            .Where(m => m.StockItemId == stockItemId)
            .OrderByDescending(m => m.CreatedAt);

        var totalCount = await query.CountAsync();

        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToListAsync();

        return (items, totalCount);
    }
}
