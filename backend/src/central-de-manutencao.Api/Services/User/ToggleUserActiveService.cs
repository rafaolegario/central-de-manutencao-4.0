using central_de_manutencao.Api.Database.Repositories.Users;
using central_de_manutencao.Api.Exceptions.ExceptionsBase;
using central_de_manutencao.Communication.Requests.User;

namespace central_de_manutencao.Api.Services.User;

public class ToggleUserActiveService
{
    private readonly IUserRepository _userRepository;

    public ToggleUserActiveService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task Execute(Guid id, ToggleUserActiveRequestJson request)
    {
        var user = await _userRepository.GetById(id)
            ?? throw new NotFoundException("Usuário não encontrado.");

        user.Active = request.Active;

        await _userRepository.Update(user);
    }
}
