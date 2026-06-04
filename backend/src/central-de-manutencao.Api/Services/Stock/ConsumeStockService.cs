using System.Security.Claims;
using central_de_manutencao.Api.Database.Repositories.Stock;
using central_de_manutencao.Api.Enums;
using central_de_manutencao.Api.Exceptions.ExceptionsBase;
using central_de_manutencao.Api.Models.Stock;
using central_de_manutencao.Api.Services.Stock.Validators;
using central_de_manutencao.Communication.Requests.Stock;
using central_de_manutencao.Communication.Responses.Stock;

namespace central_de_manutencao.Api.Services.Stock;

public class ConsumeStockService
{
    private readonly IStockItemRepository _repository;

    public ConsumeStockService(IStockItemRepository repository)
    {
        _repository = repository;
    }

    public async Task<StockItemResponseJson> Execute(Guid id, ConsumeStockRequestJson request, ClaimsPrincipal currentUser)
    {
        Validate(request);

        var item = await _repository.GetById(id);

        if (item is null)
            throw new NotFoundException("Item de estoque não encontrado.");

        var quantity = int.Parse(request.Quantity);

        if (quantity > item.Quantity)
            throw new UnprocessableEntityException("Quantidade indisponível em estoque.");

        item.Quantity -= quantity;

        Guid? createdBy = null;
        var currentUserId = currentUser.FindFirstValue(ClaimTypes.Sid);
        if (Guid.TryParse(currentUserId, out var parsedUserId))
            createdBy = parsedUserId;

        var movement = new StockMovement
        {
            StockItemId = item.Id,
            Type = StockMovementType.Out,
            Quantity = quantity,
            CreatedBy = createdBy,
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

    private void Validate(ConsumeStockRequestJson request)
    {
        var result = new ConsumeStockValidator().Validate(request);

        if (!result.IsValid)
        {
            var errors = result.Errors.Select(e => e.ErrorMessage).ToList();
            throw new BadRequestException(string.Join("; ", errors));
        }
    }
}
