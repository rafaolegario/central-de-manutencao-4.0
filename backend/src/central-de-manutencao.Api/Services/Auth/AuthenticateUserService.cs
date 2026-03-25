using central_de_manutencao.Api.Database.Repositories.Users;
using central_de_manutencao.Api.Exceptions.ExceptionsBase;
using central_de_manutencao.Communication.Requests.Auth;
using central_de_manutencao.Communication.Responses.Auth;

namespace central_de_manutencao.Api.Services.Auth
{
    public class AuthenticateUserService
    {
        private readonly IUserRepository _userRepository;

        public AuthenticateUserService(
           IUserRepository userRepository   
        ) {
            _userRepository = userRepository;
        }

        public async Task<AuthenticateResponseJson> Execute(AuthenticateRequestJson request)
        {
            await Validate(request);

        var user = await _userRepository.GetByEmail(request.Email) ?? throw new NotFoundException("Usuário não encontrado.");

        
    }   

        private async Task Validate( AuthenticateRequestJson request)
        {
            var result = new AuthenticateUserValidator().Validate(request);

            if (!result.IsValid)
            {
                var errors = result.Errors.Select(e => e.ErrorMessage).ToList();
                throw new Exception(string.Join("; ", errors));
            }

            
        }
    }
}
