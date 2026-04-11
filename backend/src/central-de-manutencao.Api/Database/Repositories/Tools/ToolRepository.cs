using Microsoft.EntityFrameworkCore;
using central_de_manutencao.Api.Models.Tools;

namespace central_de_manutencao.Api.Database.Repositories.Tools;

public class ToolRepository : IToolRepository
{
    private readonly AppDbContext _context;

    public ToolRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task Create(Tool tool)
    {
        _context.Tools.Add(tool);
        await _context.SaveChangesAsync();
    }

    public async Task Update(Tool tool)
    {
        _context.Tools.Update(tool);
        await _context.SaveChangesAsync();
    }

    public async Task<Tool?> GetById(Guid id)
    {
        return await _context.Tools.FirstOrDefaultAsync(t => t.Id == id);
    }

    public async Task<Tool?> GetByCode(string code)
    {
        return await _context.Tools.FirstOrDefaultAsync(t => t.Code == code);
    }

    public async Task<List<Tool>> List(bool? available)
    {
        var query = _context.Tools.AsQueryable();

        if (available == true)
            query = query.Where(t => t.AvailableQuantity > 0);

        return await query.OrderBy(t => t.Name).ToListAsync();
    }

    public async Task<ToolUsage?> GetUsageById(Guid usageId)
    {
        return await _context.ToolUsages.FirstOrDefaultAsync(u => u.Id == usageId);
    }

    public async Task<List<ToolUsage>> GetOpenUsagesByToolId(Guid toolId)
    {
        return await _context.ToolUsages
            .Where(u => u.ToolId == toolId && u.ReturnedAt == null)
            .OrderByDescending(u => u.WithdrawnAt)
            .ToListAsync();
    }

    public async Task<List<ToolUsage>> GetAllActiveUsages()
    {
        return await _context.ToolUsages
            .Where(u => u.ReturnedAt == null)
            .OrderByDescending(u => u.WithdrawnAt)
            .ToListAsync();
    }

    public async Task WithdrawTool(Tool tool, ToolUsage usage)
    {
        _context.Tools.Update(tool);
        _context.ToolUsages.Add(usage);
        await _context.SaveChangesAsync();
    }

    public async Task ReturnTool(Tool tool, ToolUsage usage)
    {
        _context.Tools.Update(tool);
        _context.ToolUsages.Update(usage);
        await _context.SaveChangesAsync();
    }
}
