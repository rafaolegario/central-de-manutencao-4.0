using central_de_manutencao.Api.Database.Repositories.Tools;
using central_de_manutencao.Api.Exceptions.ExceptionsBase;
using central_de_manutencao.Communication.Responses.Tool;

namespace central_de_manutencao.Api.Services.Tool;

public class GetToolService
{
    private readonly IToolRepository _repository;

    public GetToolService(IToolRepository repository)
    {
        _repository = repository;
    }

    public async Task<ToolResponseJson> Execute(Guid id)
    {
        var tool = await _repository.GetById(id);

        if (tool is null)
            throw new NotFoundException("Ferramenta não encontrada.");

        var openUsages = await _repository.GetOpenUsagesByToolId(id);

        return new ToolResponseJson
        {
            Id = tool.Id.ToString(),
            Code = tool.Code,
            Name = tool.Name,
            TotalQuantity = tool.TotalQuantity,
            AvailableQuantity = tool.AvailableQuantity,
            CreatedAt = tool.CreatedAt.ToString("o"),
            OpenUsages = openUsages.Select(u => new ToolUsageResponseJson
            {
                Id = u.Id.ToString(),
                ToolId = u.ToolId.ToString(),
                WorkOrderId = u.WorkOrderId.ToString(),
                TechnicianId = u.TechnicianId.ToString(),
                WithdrawnAt = u.WithdrawnAt.ToString("o"),
                ReturnedAt = u.ReturnedAt?.ToString("o"),
            }).ToList(),
        };
    }
}
