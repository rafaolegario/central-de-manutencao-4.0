using central_de_manutencao.Api.Database.Repositories.Users;
using central_de_manutencao.Api.Exceptions.ExceptionsBase;

namespace central_de_manutencao.Api.Services.User;

public class DeleteUserService
{
    private readonly IUserRepository _userRepository;

    public DeleteUserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task Execute(Guid id)
    {
        var user = await _userRepository.GetById(id);

        if (user is null)
            throw new NotFoundException("Usuário não encontrado.");

        user.Active = false;

        await _userRepository.Update(user);
    }
}
