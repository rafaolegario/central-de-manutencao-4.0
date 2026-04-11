using central_de_manutencao.Communication.Requests.Tool;
using FluentValidation;

namespace central_de_manutencao.Api.Services.Tool.Validators;

public class WithdrawToolValidator : AbstractValidator<WithdrawToolRequestJson>
{
    public WithdrawToolValidator()
    {
        RuleFor(x => x.WorkOrderId)
            .NotEmpty().WithMessage("O ID da ordem de serviço é obrigatório.");
    }
}
