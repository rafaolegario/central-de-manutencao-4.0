using central_de_manutencao.Api.Database.Repositories.Stock;
using central_de_manutencao.Api.Exceptions.ExceptionsBase;
using central_de_manutencao.Communication.Responses.Stock;

namespace central_de_manutencao.Api.Services.Stock;

public class GetStockItemService
{
    private readonly IStockItemRepository _repository;

    public GetStockItemService(IStockItemRepository repository)
    {
        _repository = repository;
    }

    public async Task<StockItemResponseJson> Execute(Guid id)
    {
        var item = await _repository.GetById(id);

        if (item is null)
            throw new NotFoundException("Item de estoque não encontrado.");

        return new StockItemResponseJson
        {
            Id = item.Id.ToString(),
            Code = item.Code,
            Name = item.Name,
            Quantity = item.Quantity,
            MinQuantity = item.MinQuantity,
            IsLow = item.Quantity < item.MinQuantity,
            CreatedAt = item.CreatedAt.ToString("o"),
        };
    }
}
