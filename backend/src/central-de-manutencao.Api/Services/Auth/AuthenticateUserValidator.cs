using central_de_manutencao.Communication.Requests.Auth;
using FluentValidation;

namespace central_de_manutencao.Api.Services.Auth
{
    public class AuthenticateUserValidator : AbstractValidator<AuthenticateRequestJson>
    {
        public AuthenticateUserValidator()
        {
            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email is required.")
                .EmailAddress().WithMessage("Invalid email format.");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required.")
                .MinimumLength(6).WithMessage("Password must be at least 6 characters long.");
        }
    }
}
