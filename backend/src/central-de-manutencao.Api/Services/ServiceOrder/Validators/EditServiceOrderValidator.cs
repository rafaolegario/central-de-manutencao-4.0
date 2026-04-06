using central_de_manutencao.Communication.Requests.ServiceOrder;
using FluentValidation;

namespace central_de_manutencao.Api.Services.ServiceOrder.Validators;

public class EditServiceOrderValidator : AbstractValidator<EditServiceOrderRequestJson>
{
    public EditServiceOrderValidator()
    {
        RuleFor(x => x.Title)
            .NotEmpty().WithMessage("O título é obrigatório.")
            .MaximumLength(200).WithMessage("O título deve ter no máximo 200 caracteres.");

        RuleFor(x => x.Description)
            .NotEmpty().WithMessage("A descrição é obrigatória.")
            .MaximumLength(2000).WithMessage("A descrição deve ter no máximo 2000 caracteres.");

        RuleFor(x => x.Location)
            .MaximumLength(200).WithMessage("A localização deve ter no máximo 200 caracteres.")
            .When(x => !string.IsNullOrEmpty(x.Location));
    }
}
