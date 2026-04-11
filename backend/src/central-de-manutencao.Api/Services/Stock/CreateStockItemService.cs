using central_de_manutencao.Api.Database.Repositories.Stock;
using central_de_manutencao.Api.Exceptions.ExceptionsBase;
using central_de_manutencao.Api.Models.Stock;
using central_de_manutencao.Api.Services.Stock.Validators;
using central_de_manutencao.Communication.Requests.Stock;
using central_de_manutencao.Communication.Responses.Stock;

namespace central_de_manutencao.Api.Services.Stock;

public class CreateStockItemService
{
    private readonly IStockItemRepository _repository;

    public CreateStockItemService(IStockItemRepository repository)
    {
        _repository = repository;
    }

    public async Task<StockItemResponseJson> Execute(CreateStockItemRequestJson request)
    {
        Validate(request);

        var existingItem = await _repository.GetByCode(request.Code);
        if (existingItem is not null)
            throw new BadRequestException("Já existe um item com este código.");

        var quantity = int.Parse(request.Quantity);
        var minQuantity = int.Parse(request.MinQuantity);

        var item = new StockItem
        {
            Code = request.Code,
            Name = request.Name,
            Quantity = quantity,
            MinQuantity = minQuantity,
        };

        await _repository.Create(item);

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

    private void Validate(CreateStockItemRequestJson request)
    {
        var result = new CreateStockItemValidator().Validate(request);

        if (!result.IsValid)
        {
            var errors = result.Errors.Select(e => e.ErrorMessage).ToList();
            throw new BadRequestException(string.Join("; ", errors));
        }
    }
}
