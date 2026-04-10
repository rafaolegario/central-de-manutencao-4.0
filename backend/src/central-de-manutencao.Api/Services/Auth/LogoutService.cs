using central_de_manutencao.Api.Token;

namespace central_de_manutencao.Api.Services.Auth
{
    public class LogoutService
    {
        private readonly ITokenProvider _tokenProvider;
        private readonly ITokenBlacklist _tokenBlacklist;
        private readonly IAccessTokenGenerator _tokenGenerator;

        public LogoutService(
            ITokenProvider tokenProvider,
            ITokenBlacklist tokenBlacklist,
            IAccessTokenGenerator tokenGenerator)
        {
            _tokenProvider = tokenProvider;
            _tokenBlacklist = tokenBlacklist;
            _tokenGenerator = tokenGenerator;
        }

        public void Execute()
        {
            var token = _tokenProvider.TokenOnRequest();
            var expiration = DateTime.UtcNow.AddSeconds(_tokenGenerator.ExpiresInSeconds);
            _tokenBlacklist.Blacklist(token, expiration);
        }
    }
}
