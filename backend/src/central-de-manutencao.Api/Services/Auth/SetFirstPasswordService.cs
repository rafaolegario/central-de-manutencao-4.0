using central_de_manutencao.Api.Database.Repositories.Users;
using central_de_manutencao.Api.Exceptions.ExceptionsBase;
using central_de_manutencao.Api.Token;
using central_de_manutencao.Communication.Requests.Auth;
using central_de_manutencao.Communication.Responses.Auth;

namespace central_de_manutencao.Api.Services.Auth
{
    public class SetFirstPasswordService
    {
        private readonly IUserRepository _userRepository;
        private readonly IAccessTokenGenerator _tokenGenerator;

        public SetFirstPasswordService(
            IUserRepository userRepository,
            IAccessTokenGenerator tokenGenerator)
        {
            _userRepository = userRepository;
            _tokenGenerator = tokenGenerator;
        }

        public async Task<AuthenticateResponseJson> Execute(SetFirstPasswordRequestJson request)
        {
            var email = (request.Email ?? string.Empty).Trim().ToLowerInvariant();

            if (string.IsNullOrEmpty(email))
                throw new NotFoundException("E-mail é obrigatório.");

            if (string.IsNullOrEmpty(request.NewPassword) || request.NewPassword.Length < 6)
                throw new BadRequestException("A senha deve ter no mínimo 6 caracteres.");

            var user = await _userRepository.GetByEmail(email)
                ?? throw new NotFoundException("Usuário não encontrado.");

            if (!user.MustSetPassword)
                throw new ConflictException("Este usuário já possui senha definida.");

            user.Password = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
            user.MustSetPassword = false;
            user.Active = true;

            await _userRepository.Update(user);

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
    }
}
