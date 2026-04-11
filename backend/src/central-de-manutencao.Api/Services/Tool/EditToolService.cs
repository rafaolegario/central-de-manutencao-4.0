using central_de_manutencao.Api.Database.Repositories.Tools;
using central_de_manutencao.Api.Exceptions.ExceptionsBase;
using central_de_manutencao.Communication.Requests.Tool;
using central_de_manutencao.Communication.Responses.Tool;

namespace central_de_manutencao.Api.Services.Tool;

public class EditToolService
{
    private readonly IToolRepository _repository;

    public EditToolService(IToolRepository repository)
    {
        _repository = repository;
    }

    public async Task<ToolResponseJson> Execute(Guid id, EditToolRequestJson request)
    {
        var tool = await _repository.GetById(id);

        if (tool is null)
            throw new NotFoundException("Ferramenta não encontrada.");

        if (tool.Code != request.Code)
        {
            var existingTool = await _repository.GetByCode(request.Code);
            if (existingTool is not null)
                throw new BadRequestException("Já existe uma ferramenta com este código.");
        }

        tool.Code = request.Code;
        tool.Name = request.Name;

        await _repository.Update(tool);

        return new ToolResponseJson
        {
            Id = tool.Id.ToString(),
            Code = tool.Code,
            Name = tool.Name,
            TotalQuantity = tool.TotalQuantity,
            AvailableQuantity = tool.AvailableQuantity,
            CreatedAt = tool.CreatedAt.ToString("o"),
        };
    }
}
