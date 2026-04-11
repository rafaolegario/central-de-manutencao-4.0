using central_de_manutencao.Api.Database.Repositories.Stock;
using central_de_manutencao.Api.Enums;
using central_de_manutencao.Api.Exceptions.ExceptionsBase;
using central_de_manutencao.Api.Models.Stock;
using central_de_manutencao.Api.Services.Stock.Validators;
using central_de_manutencao.Communication.Requests.Stock;
using central_de_manutencao.Communication.Responses.Stock;

namespace central_de_manutencao.Api.Services.Stock;

public class ReplenishStockService
{
    private readonly IStockItemRepository _repository;

    public ReplenishStockService(IStockItemRepository repository)
    {
        _repository = repository;
    }

    public async Task<StockItemResponseJson> Execute(Guid id, ReplenishStockRequestJson request)
    {
        Validate(request);

        var item = await _repository.GetById(id);

        if (item is null)
            throw new NotFoundException("Item de estoque não encontrado.");

        var quantity = int.Parse(request.Quantity);

        item.Quantity += quantity;

        var movement = new StockMovement
        {
            StockItemId = item.Id,
            Type = StockMovementType.In,
            Quantity = quantity,
            Note = request.Note,
        };

        await _repository.ReplenishWithMovement(item, movement);

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

    private void Validate(ReplenishStockRequestJson request)
    {
        var result = new ReplenishStockValidator().Validate(request);

        if (!result.IsValid)
        {
            var errors = result.Errors.Select(e => e.ErrorMessage).ToList();
            throw new BadRequestException(string.Join("; ", errors));
        }
    }
}
