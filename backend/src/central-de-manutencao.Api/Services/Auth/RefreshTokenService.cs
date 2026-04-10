using System.Security.Claims;
using central_de_manutencao.Api.Database.Repositories.Users;
using central_de_manutencao.Api.Exceptions.ExceptionsBase;
using central_de_manutencao.Api.Token;
using central_de_manutencao.Communication.Responses.Auth;

namespace central_de_manutencao.Api.Services.Auth
{
    public class RefreshTokenService
    {
        private readonly IUserRepository _userRepository;
        private readonly IAccessTokenGenerator _tokenGenerator;
        private readonly ITokenBlacklist _tokenBlacklist;
        private readonly ITokenProvider _tokenProvider;

        public RefreshTokenService(
            IUserRepository userRepository,
            IAccessTokenGenerator tokenGenerator,
            ITokenBlacklist tokenBlacklist,
            ITokenProvider tokenProvider)
        {
            _userRepository = userRepository;
            _tokenGenerator = tokenGenerator;
            _tokenBlacklist = tokenBlacklist;
            _tokenProvider = tokenProvider;
        }

        public async Task<RefreshTokenResponseJson> Execute(ClaimsPrincipal currentUser)
        {
            var userId = currentUser.FindFirst(ClaimTypes.Sid)?.Value
                ?? throw new BadRequestException("Token inválido.");

            var user = await _userRepository.GetById(Guid.Parse(userId))
                ?? throw new NotFoundException("Usuário não encontrado.");

            if (!user.Active)
                throw new ForbiddenException("Usuário inativo.");

            var oldToken = _tokenProvider.TokenOnRequest();
            _tokenBlacklist.Blacklist(oldToken, DateTime.UtcNow.AddMinutes(5));

            var newToken = _tokenGenerator.Generate(user);

            return new RefreshTokenResponseJson
            {
                Token = newToken,
                ExpiresIn = _tokenGenerator.ExpiresInSeconds
            };
        }
    }
}
