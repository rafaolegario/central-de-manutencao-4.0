using central_de_manutencao.Api.Database.Repositories.Tools;
using central_de_manutencao.Api.Exceptions.ExceptionsBase;

namespace central_de_manutencao.Api.Services.Tool;

public class DeleteToolService
{
    private readonly IToolRepository _repository;

    public DeleteToolService(IToolRepository repository)
    {
        _repository = repository;
    }

    public async Task Execute(Guid id)
    {
        var tool = await _repository.GetById(id);

        if (tool is null)
            throw new NotFoundException("Ferramenta não encontrada.");

        if (tool.AvailableQuantity < tool.TotalQuantity)
            throw new BadRequestException("Não é possível excluir uma ferramenta com retiradas ativas. Aguarde a devolução.");

        tool.IsDeleted = true;

        await _repository.Update(tool);
    }
}
