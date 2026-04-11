using central_de_manutencao.Communication.Requests.Stock;
using FluentValidation;

namespace central_de_manutencao.Api.Services.Stock.Validators;

public class EditStockItemValidator : AbstractValidator<EditStockItemRequestJson>
{
    public EditStockItemValidator()
    {
        RuleFor(x => x.Code)
            .NotEmpty().WithMessage("O código é obrigatório.")
            .MaximumLength(50).WithMessage("O código deve ter no máximo 50 caracteres.");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("O nome é obrigatório.")
            .MaximumLength(100).WithMessage("O nome deve ter no máximo 100 caracteres.");

        RuleFor(x => x.MinQuantity)
            .NotEmpty().WithMessage("A quantidade mínima é obrigatória.")
            .Must(q => int.TryParse(q, out var v) && v >= 0)
            .WithMessage("A quantidade mínima deve ser um número inteiro maior ou igual a zero.");
    }
}
