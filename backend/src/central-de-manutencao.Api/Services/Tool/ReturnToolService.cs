using System.Security.Claims;
using central_de_manutencao.Api.Database.Repositories.Tools;
using central_de_manutencao.Api.Exceptions.ExceptionsBase;
using central_de_manutencao.Communication.Responses.Tool;

namespace central_de_manutencao.Api.Services.Tool;

public class ReturnToolService
{
    private readonly IToolRepository _toolRepository;

    public ReturnToolService(IToolRepository toolRepository)
    {
        _toolRepository = toolRepository;
    }

    public async Task<ToolUsageResponseJson> Execute(Guid usageId, ClaimsPrincipal currentUser)
    {
        var currentUserId = Guid.Parse(currentUser.FindFirstValue(ClaimTypes.Sid)!);

        var usage = await _toolRepository.GetUsageById(usageId);

        if (usage is null)
            throw new NotFoundException("Registro de uso não encontrado.");

        if (usage.ReturnedAt is not null)
            throw new BadRequestException("Esta ferramenta já foi devolvida.");

        if (usage.TechnicianId != currentUserId)
            throw new ForbiddenException("Apenas o técnico que retirou a ferramenta pode devolvê-la.");

        var tool = await _toolRepository.GetById(usage.ToolId);

        if (tool is null)
            throw new NotFoundException("Ferramenta não encontrada.");

        usage.ReturnedAt = DateTime.UtcNow;
        tool.AvailableQuantity++;

        await _toolRepository.ReturnTool(tool, usage);

        return new ToolUsageResponseJson
        {
            Id = usage.Id.ToString(),
            ToolId = tool.Id.ToString(),
            ToolName = tool.Name,
            WorkOrderId = usage.WorkOrderId.ToString(),
            TechnicianId = usage.TechnicianId.ToString(),
            WithdrawnAt = usage.WithdrawnAt.ToString("o"),
            ReturnedAt = usage.ReturnedAt?.ToString("o"),
        };
    }
}
