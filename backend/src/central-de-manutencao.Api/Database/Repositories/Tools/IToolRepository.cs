using central_de_manutencao.Api.Models.Tools;

namespace central_de_manutencao.Api.Database.Repositories.Tools;

public interface IToolRepository
{
    Task Create(Tool tool);
    Task Update(Tool tool);
    Task<Tool?> GetById(Guid id);
    Task<Tool?> GetByCode(string code);
    Task<List<Tool>> List(bool? available);
    Task<ToolUsage?> GetUsageById(Guid usageId);
    Task<List<ToolUsage>> GetOpenUsagesByToolId(Guid toolId);
    Task<List<ToolUsage>> GetAllActiveUsages();
    Task WithdrawTool(Tool tool, ToolUsage usage);
    Task ReturnTool(Tool tool, ToolUsage usage);
}
