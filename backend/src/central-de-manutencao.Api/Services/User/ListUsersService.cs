using central_de_manutencao.Api.Database.Repositories.Users;
using central_de_manutencao.Api.Enums;
using central_de_manutencao.Communication.Responses.User;

namespace central_de_manutencao.Api.Services.User;

public class ListUsersService
{
    private readonly IUserRepository _userRepository;

    public ListUsersService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<List<UserResponseJson>> Execute(string? specialty, bool? active)
    {
        Specialties? specialtyEnum = null;
        if (!string.IsNullOrEmpty(specialty) && Enum.TryParse<Specialties>(specialty, out var parsed))
            specialtyEnum = parsed;

        var users = await _userRepository.List(specialtyEnum, active);

        return users.Select(u => new UserResponseJson
        {
            Id = u.Id.ToString(),
            Name = u.Name,
            Email = u.Email,
            Specialty = u.Specialty?.ToString() ?? string.Empty,
            Role = u.Role.ToString(),
            Active = u.Active
        }).ToList();
    }
}
