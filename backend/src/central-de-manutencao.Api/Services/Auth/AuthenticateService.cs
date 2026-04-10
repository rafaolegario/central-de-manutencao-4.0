using central_de_manutencao.Api.Database.Repositories.Users;
using central_de_manutencao.Api.Exceptions.ExceptionsBase;
using central_de_manutencao.Api.Token;
using central_de_manutencao.Communication.Requests.Auth;
using central_de_manutencao.Communication.Responses.Auth;

namespace central_de_manutencao.Api.Services.Auth
{
    public class AuthenticateService
    {
        private readonly IUserRepository _userRepository;
        private readonly IAccessTokenGenerator _tokenGenerator;

        public AuthenticateService(
           IUserRepository userRepository,
           IAccessTokenGenerator tokenGenerator
        )
        {
            _userRepository = userRepository;
            _tokenGenerator = tokenGenerator;
        }

        public async Task<AuthenticateResponseJson> Execute(AuthenticateRequestJson request)
        {
            await Validate(request);

            var user = await _userRepository.GetByEmail(request.Email) ?? throw new NotFoundException("Usuário ou senha incorretos.");

            var passwordMatch = BCrypt.Net.BCrypt.Verify(request.Password, user.Password);
            if (!passwordMatch)
            {
                throw new NotFoundException("Usuário ou senha incorretos.");
            }

            if (user.Active == false)
            {
                throw new Exception("Usuário inativo. Contate o administrador.");
            }

            var token = _tokenGenerator.Generate(user);

            return new AuthenticateResponseJson
            {
                Token = token,
                ExpiresIn = _tokenGenerator.ExpiresInSeconds,
                User = new AuthenticateUserJson
                {
                    Id = user.Id.ToString(),
                    Name = user.Name,
                    Role = user.Role.ToString().ToLower(),
                    Specialty = user.Specialty?.ToString().ToLower()
                }
            };

        }

        private async Task Validate(AuthenticateRequestJson request)
        {
            var result = new AuthenticateValidator().Validate(request);

            if (!result.IsValid)
            {
                var errors = result.Errors.Select(e => e.ErrorMessage).ToList();
                throw new Exception(string.Join("; ", errors));
            }


        }
    }
}
