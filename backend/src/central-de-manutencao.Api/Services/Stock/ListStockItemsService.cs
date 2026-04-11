using central_de_manutencao.Api.Database.Repositories.Stock;
using central_de_manutencao.Communication.Responses.Stock;

namespace central_de_manutencao.Api.Services.Stock;

public class ListStockItemsService
{
    private readonly IStockItemRepository _repository;

    public ListStockItemsService(IStockItemRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<StockItemResponseJson>> Execute(bool? lowStock)
    {
        var items = await _repository.List(lowStock);

        return items.Select(item => new StockItemResponseJson
        {
            Id = item.Id.ToString(),
            Code = item.Code,
            Name = item.Name,
            Quantity = item.Quantity,
            MinQuantity = item.MinQuantity,
            IsLow = item.Quantity < item.MinQuantity,
            CreatedAt = item.CreatedAt.ToString("o"),
        }).ToList();
    }
}
