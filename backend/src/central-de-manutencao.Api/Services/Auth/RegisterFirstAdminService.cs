using central_de_manutencao.Api.Database.Repositories.Users;
using central_de_manutencao.Api.Enums;
using central_de_manutencao.Api.Exceptions.ExceptionsBase;
using central_de_manutencao.Api.Models.Users;
using central_de_manutencao.Api.Token;
using central_de_manutencao.Communication.Requests.Auth;
using central_de_manutencao.Communication.Responses.Auth;

namespace central_de_manutencao.Api.Services.Auth
{
    public class RegisterFirstAdminService
    {
        private readonly IUserRepository _userRepository;
        private readonly IAccessTokenGenerator _tokenGenerator;

        public RegisterFirstAdminService(
            IUserRepository userRepository,
            IAccessTokenGenerator tokenGenerator)
        {
            _userRepository = userRepository;
            _tokenGenerator = tokenGenerator;
        }

        public async Task<AuthenticateResponseJson> Execute(RegisterFirstAdminRequestJson request)
        {
            var name = (request.Name ?? string.Empty).Trim();
            var email = (request.Email ?? string.Empty).Trim().ToLowerInvariant();
            var password = request.Password ?? string.Empty;

            if (string.IsNullOrEmpty(name))
                throw new BadRequestException("O nome é obrigatório.");

            if (string.IsNullOrEmpty(email) || !email.Contains('@'))
                throw new BadRequestException("E-mail inválido.");

            if (password.Length < 6)
                throw new BadRequestException("A senha deve ter no mínimo 6 caracteres.");

            var existingAdmins = await _userRepository.List(Roles.Admin, null, null);
            if (existingAdmins.Count > 0)
                throw new ConflictException("Já existe um administrador cadastrado. Use o login normal.");

            var existing = await _userRepository.GetByEmail(email);
            if (existing != null)
                throw new ConflictException("Já existe um usuário com este e-mail.");

            var admin = new central_de_manutencao.Api.Models.Users.User
            {
                Id = Guid.NewGuid(),
                Name = name,
                Email = email,
                Password = BCrypt.Net.BCrypt.HashPassword(password),
                MustSetPassword = false,
                Role = Roles.Admin,
                Specialty = null,
                Active = true,
                CreatedAt = DateTime.UtcNow
            };

            await _userRepository.Create(admin);

            var token = _tokenGenerator.Generate(admin);

            return new AuthenticateResponseJson
            {
                Token = token,
                ExpiresIn = _tokenGenerator.ExpiresInSeconds,
                User = new AuthenticateUserJson
                {
                    Id = admin.Id.ToString(),
                    Name = admin.Name,
                    Role = admin.Role.ToString().ToLower(),
                    Specialty = null
                }
            };
        }
    }
}
