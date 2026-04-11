using central_de_manutencao.Api.Database.Repositories.Tools;
using central_de_manutencao.Communication.Responses.Tool;

namespace central_de_manutencao.Api.Services.Tool;

public class ListToolsService
{
    private readonly IToolRepository _repository;

    public ListToolsService(IToolRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<ToolResponseJson>> Execute(bool? available)
    {
        var tools = await _repository.List(available);

        return tools.Select(tool => new ToolResponseJson
        {
            Id = tool.Id.ToString(),
            Code = tool.Code,
            Name = tool.Name,
            TotalQuantity = tool.TotalQuantity,
            AvailableQuantity = tool.AvailableQuantity,
            CreatedAt = tool.CreatedAt.ToString("o"),
        }).ToList();
    }
}
