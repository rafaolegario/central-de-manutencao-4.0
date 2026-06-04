using System.Security.Claims;
using central_de_manutencao.Api.Database.Repositories.Stock;
using central_de_manutencao.Communication.Responses.Stock;

namespace central_de_manutencao.Api.Services.Stock;

public class ListMyStockMovementsService
{
    private readonly IStockItemRepository _repository;

    public ListMyStockMovementsService(IStockItemRepository repository)
    {
        _repository = repository;
    }

    public async Task<List<MyStockMovementResponseJson>> Execute(ClaimsPrincipal currentUser)
    {
        var userId = Guid.Parse(currentUser.FindFirstValue(ClaimTypes.Sid)!);

        var movements = await _repository.GetOutMovementsByUser(userId);

        var items = new List<MyStockMovementResponseJson>();

        foreach (var movement in movements)
        {
            var item = await _repository.GetById(movement.StockItemId);

            items.Add(new MyStockMovementResponseJson
            {
                Id = movement.Id.ToString(),
                StockItemId = movement.StockItemId.ToString(),
                StockItemCode = item?.Code,
                StockItemName = item?.Name,
                Quantity = movement.Quantity,
                Note = movement.Note,
                CreatedAt = movement.CreatedAt.ToString("o"),
            });
        }

        return items;
    }
}
