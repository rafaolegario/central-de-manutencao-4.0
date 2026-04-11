using central_de_manutencao.Api.Database.Repositories.Stock;
using central_de_manutencao.Api.Exceptions.ExceptionsBase;
using central_de_manutencao.Api.Services.Stock.Validators;
using central_de_manutencao.Communication.Requests.Stock;
using central_de_manutencao.Communication.Responses.Stock;

namespace central_de_manutencao.Api.Services.Stock;

public class EditStockItemService
{
    private readonly IStockItemRepository _repository;

    public EditStockItemService(IStockItemRepository repository)
    {
        _repository = repository;
    }

    public async Task<StockItemResponseJson> Execute(Guid id, EditStockItemRequestJson request)
    {
        Validate(request);

        var item = await _repository.GetById(id);

        if (item is null)
            throw new NotFoundException("Item de estoque não encontrado.");

        if (item.Code != request.Code)
        {
            var existingItem = await _repository.GetByCode(request.Code);
            if (existingItem is not null)
                throw new BadRequestException("Já existe um item com este código.");
        }

        item.Code = request.Code;
        item.Name = request.Name;
        item.MinQuantity = int.Parse(request.MinQuantity);

        await _repository.Update(item);

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

    private void Validate(EditStockItemRequestJson request)
    {
        var result = new EditStockItemValidator().Validate(request);

        if (!result.IsValid)
        {
            var errors = result.Errors.Select(e => e.ErrorMessage).ToList();
            throw new BadRequestException(string.Join("; ", errors));
        }
    }
}
