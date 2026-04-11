using central_de_manutencao.Api.Database.Repositories.Tools;
using central_de_manutencao.Api.Exceptions.ExceptionsBase;
using central_de_manutencao.Api.Models.Tools;
using central_de_manutencao.Api.Services.Tool.Validators;
using central_de_manutencao.Communication.Requests.Tool;
using central_de_manutencao.Communication.Responses.Tool;

namespace central_de_manutencao.Api.Services.Tool;

public class CreateToolService
{
    private readonly IToolRepository _repository;

    public CreateToolService(IToolRepository repository)
    {
        _repository = repository;
    }

    public async Task<ToolResponseJson> Execute(CreateToolRequestJson request)
    {
        Validate(request);

        var existingTool = await _repository.GetByCode(request.Code);
        if (existingTool is not null)
            throw new BadRequestException("Já existe uma ferramenta com este código.");

        var totalQuantity = int.Parse(request.TotalQuantity);

        var tool = new Models.Tools.Tool
        {
            Code = request.Code,
            Name = request.Name,
            TotalQuantity = totalQuantity,
            AvailableQuantity = totalQuantity,
        };

        await _repository.Create(tool);

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

    private void Validate(CreateToolRequestJson request)
    {
        var result = new CreateToolValidator().Validate(request);

        if (!result.IsValid)
        {
            var errors = result.Errors.Select(e => e.ErrorMessage).ToList();
            throw new BadRequestException(string.Join("; ", errors));
        }
    }
}
