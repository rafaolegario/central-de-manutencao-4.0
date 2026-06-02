using central_de_manutencao.Api.Database.Repositories.Users;
using central_de_manutencao.Api.Enums;
using central_de_manutencao.Communication.Requests.Auth;
using central_de_manutencao.Communication.Responses.Auth;

namespace central_de_manutencao.Api.Services.Auth
{
    public class CheckEmailService
    {
        private readonly IUserRepository _userRepository;

        public CheckEmailService(IUserRepository userRepository)
        {
            _userRepository = userRepository;
        }

        public async Task<CheckEmailResponseJson> Execute(CheckEmailRequestJson request)
        {
            var email = (request.Email ?? string.Empty).Trim().ToLowerInvariant();

            var admins = await _userRepository.List(Roles.Admin, null, null);
            var anyAdminExists = admins.Count > 0;

            if (string.IsNullOrEmpty(email))
            {
                return new CheckEmailResponseJson
                {
                    Exists = false,
                    MustSetPassword = false,
                    AnyAdminExists = anyAdminExists
                };
            }

            var user = await _userRepository.GetByEmail(email);

            return new CheckEmailResponseJson
            {
                Exists = user != null,
                MustSetPassword = user?.MustSetPassword ?? false,
                AnyAdminExists = anyAdminExists
            };
        }
    }
}
