using System.Security.Claims;
using central_de_manutencao.Api.Database.Repositories.ServiceOrders;
using central_de_manutencao.Api.Database.Repositories.Users;
using central_de_manutencao.Api.Enums;
using central_de_manutencao.Api.Exceptions.ExceptionsBase;
using central_de_manutencao.Communication.Responses.ServiceOrder;

namespace central_de_manutencao.Api.Services.ServiceOrder;

public class GetServiceOrderLogsService
{
    private readonly IServiceOrderRepository _serviceOrderRepository;
    private readonly IServiceOrderLogRepository _serviceOrderLogRepository;
    private readonly IUserRepository _userRepository;

    public GetServiceOrderLogsService(
        IServiceOrderRepository serviceOrderRepository,
        IServiceOrderLogRepository serviceOrderLogRepository,
        IUserRepository userRepository)
    {
        _serviceOrderRepository = serviceOrderRepository;
        _serviceOrderLogRepository = serviceOrderLogRepository;
        _userRepository = userRepository;
    }

    public async Task<List<ServiceOrderLogResponseJson>> Execute(Guid id, ClaimsPrincipal currentUser)
    {
        var currentUserId = currentUser.FindFirstValue(ClaimTypes.Sid);
        var currentUserRole = currentUser.FindFirstValue(ClaimTypes.Role);

        var order = await _serviceOrderRepository.GetById(id);

        if (order is null)
            throw new NotFoundException("Ordem de serviço não encontrada.");

        var isAdmin = currentUserRole == Roles.Admin.ToString();

        if (!isAdmin && order.TechnicianId?.ToString() != currentUserId)
            throw new ForbiddenException("Você não tem permissão para acessar esta ordem de serviço.");

        var logs = await _serviceOrderLogRepository.GetByServiceOrderId(id);

        var users = await _userRepository.GetByIds(logs.Select(l => l.ChangedBy));
        var nameById = users.ToDictionary(u => u.Id, u => u.Name);

        return logs.Select(l => new ServiceOrderLogResponseJson
        {
            Id = l.Id.ToString(),
            ServiceOrderId = l.ServiceOrderId.ToString(),
            OldStatus = l.OldStatus.ToString(),
            NewStatus = l.NewStatus.ToString(),
            ChangedAt = l.ChangedAt.ToString("o"),
            ChangedBy = l.ChangedBy.ToString(),
            ChangedByName = nameById.TryGetValue(l.ChangedBy, out var name) ? name : null,
            Description = l.Description,
        }).ToList();
    }
}
