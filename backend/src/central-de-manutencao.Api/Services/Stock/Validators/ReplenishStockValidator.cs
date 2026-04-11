using central_de_manutencao.Communication.Requests.Stock;
using FluentValidation;

namespace central_de_manutencao.Api.Services.Stock.Validators;

public class ReplenishStockValidator : AbstractValidator<ReplenishStockRequestJson>
{
    public ReplenishStockValidator()
    {
        RuleFor(x => x.Quantity)
            .NotEmpty().WithMessage("A quantidade é obrigatória.")
            .Must(q => int.TryParse(q, out var v) && v > 0)
            .WithMessage("A quantidade deve ser um número inteiro maior que zero.");
    }
}
