using central_de_manutencao.Communication.Requests.Tool;
using FluentValidation;

namespace central_de_manutencao.Api.Services.Tool.Validators;

public class CreateToolValidator : AbstractValidator<CreateToolRequestJson>
{
    public CreateToolValidator()
    {
        RuleFor(x => x.Code)
            .NotEmpty().WithMessage("O código é obrigatório.")
            .MaximumLength(50).WithMessage("O código deve ter no máximo 50 caracteres.");

        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("O nome é obrigatório.")
            .MaximumLength(100).WithMessage("O nome deve ter no máximo 100 caracteres.");

        RuleFor(x => x.TotalQuantity)
            .NotEmpty().WithMessage("A quantidade total é obrigatória.")
            .Must(q => int.TryParse(q, out var v) && v > 0)
            .WithMessage("A quantidade total deve ser um número inteiro maior que zero.");
    }
}
