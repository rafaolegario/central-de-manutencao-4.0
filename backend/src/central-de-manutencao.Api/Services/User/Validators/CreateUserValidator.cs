using central_de_manutencao.Communication.Requests.User;
using FluentValidation;

public class CreateUserValidator : AbstractValidator<CreateUserRequestJson>
{
    public CreateUserValidator()
    {
        RuleFor(x => x.Name)
            .NotEmpty().WithMessage("O nome é obrigatório.")
            .MaximumLength(100).WithMessage("O nome deve ter no máximo 100 caracteres.");

        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("O email é obrigatório.")
            .EmailAddress().WithMessage("O email deve ser válido.");

        RuleFor(x => x.Specialty)
            .NotEmpty().WithMessage("A especialidade é obrigatória.")
            .MaximumLength(50).WithMessage("A especialidade deve ter no máximo 50 caracteres.");

        RuleFor(x => x.Password)
            .NotEmpty().WithMessage("A senha é obrigatória.")
            .MinimumLength(6).WithMessage("A senha deve ter no mínimo 6 caracteres.");
    }
}