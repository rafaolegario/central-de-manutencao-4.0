using central_de_manutencao.Api.Database.Repositories.Users;
using central_de_manutencao.Api.Exceptions.ExceptionsBase;
using central_de_manutencao.Communication.Requests.User;
using central_de_manutencao.Communication.Responses.User;

namespace central_de_manutencao.Api.Services.User;

public class EditUserService
{
    private readonly IUserRepository _userRepository;

    public EditUserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<UserResponseJson> Execute(Guid id, EditUserRequestJson request)
    {
        var user = await _userRepository.GetById(id);

        if (user is null)
            throw new NotFoundException("Usuário não encontrado.");

        user.Name = request.Name;
        user.Email = request.Email;
        user.Specialty = Enum.TryParse<Enums.Specialties>(request.Specialty, out var specialty) ? specialty : null;
        user.Active = request.Active;

        await _userRepository.Update(user);

        return new UserResponseJson
        {
            Id = user.Id.ToString(),
            Name = user.Name,
            Email = user.Email,
            Specialty = user.Specialty?.ToString() ?? string.Empty,
            Role = user.Role.ToString(),
            Active = user.Active
        };
    }
}
