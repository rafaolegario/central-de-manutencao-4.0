using System.Security.Claims;
using central_de_manutencao.Api.Database.Repositories.Users;
using central_de_manutencao.Api.Enums;
using central_de_manutencao.Api.Exceptions.ExceptionsBase;
using central_de_manutencao.Communication.Responses.User;

namespace central_de_manutencao.Api.Services.User;

public class GetUserService
{
    private readonly IUserRepository _userRepository;

    public GetUserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public async Task<UserResponseJson> Execute(Guid id, ClaimsPrincipal currentUser)
    {
        var currentUserId = currentUser.FindFirstValue(ClaimTypes.Sid);
        var currentUserRole = currentUser.FindFirstValue(ClaimTypes.Role);

        var isAdmin = currentUserRole == Roles.Admin.ToString();
        var isSelf = currentUserId == id.ToString();

        if (!isAdmin && !isSelf)
            throw new ForbiddenException("Você não tem permissão para acessar este usuário.");

        var user = await _userRepository.GetById(id);

        if (user is null)
            throw new NotFoundException("Usuário não encontrado.");

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
