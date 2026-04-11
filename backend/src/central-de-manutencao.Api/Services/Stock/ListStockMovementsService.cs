using central_de_manutencao.Api.Database.Repositories.Stock;
using central_de_manutencao.Api.Exceptions.ExceptionsBase;
using central_de_manutencao.Communication.Responses.Stock;

namespace central_de_manutencao.Api.Services.Stock;

public class ListStockMovementsService
{
    private readonly IStockItemRepository _repository;

    public ListStockMovementsService(IStockItemRepository repository)
    {
        _repository = repository;
    }

    public async Task<StockMovementListResponseJson> Execute(Guid stockItemId, int page, int pageSize)
    {
        var item = await _repository.GetById(stockItemId);

        if (item is null)
            throw new NotFoundException("Item de estoque não encontrado.");

        var (items, totalCount) = await _repository.GetMovements(stockItemId, page, pageSize);

        return new StockMovementListResponseJson
        {
            Items = items.Select(m => new StockMovementResponseJson
            {
                Id = m.Id.ToString(),
                Type = m.Type.ToString(),
                Quantity = m.Quantity,
                WorkOrderId = m.WorkOrderId?.ToString(),
                Note = m.Note,
                CreatedAt = m.CreatedAt.ToString("o"),
            }).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
        };
    }
}
