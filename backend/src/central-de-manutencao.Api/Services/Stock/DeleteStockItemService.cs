using central_de_manutencao.Api.Database.Repositories.Stock;
using central_de_manutencao.Api.Exceptions.ExceptionsBase;

namespace central_de_manutencao.Api.Services.Stock;

public class DeleteStockItemService
{
    private readonly IStockItemRepository _repository;

    public DeleteStockItemService(IStockItemRepository repository)
    {
        _repository = repository;
    }

    public async Task Execute(Guid id)
    {
        var item = await _repository.GetById(id);

        if (item is null)
            throw new NotFoundException("Item de estoque não encontrado.");

        item.IsDeleted = true;

        await _repository.Update(item);
    }
}
