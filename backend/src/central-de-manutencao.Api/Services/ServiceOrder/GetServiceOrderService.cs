using System.Security.Claims;
using central_de_manutencao.Api.Database.Repositories.ServiceOrders;
using central_de_manutencao.Api.Database.Repositories.Users;
using central_de_manutencao.Api.Enums;
using central_de_manutencao.Api.Exceptions.ExceptionsBase;
using central_de_manutencao.Communication.Responses.ServiceOrder;

namespace central_de_manutencao.Api.Services.ServiceOrder;

public class GetServiceOrderService
{
    private readonly IServiceOrderRepository _serviceOrderRepository;
    private readonly IUserRepository _userRepository;

    public GetServiceOrderService(
        IServiceOrderRepository serviceOrderRepository,
        IUserRepository userRepository)
    {
        _serviceOrderRepository = serviceOrderRepository;
        _userRepository = userRepository;
    }

    public async Task<ServiceOrderResponseJson> Execute(Guid id, ClaimsPrincipal currentUser)
    {
        var currentUserId = currentUser.FindFirstValue(ClaimTypes.Sid);
        var currentUserRole = currentUser.FindFirstValue(ClaimTypes.Role);

        var order = await _serviceOrderRepository.GetById(id);

        if (order is null)
            throw new NotFoundException("Ordem de serviço não encontrada.");

        var isAdmin = currentUserRole == Roles.Admin.ToString();

        if (!isAdmin && order.TechnicianId?.ToString() != currentUserId)
            throw new ForbiddenException("Você não tem permissão para acessar esta ordem de serviço.");

        var ids = new List<Guid> { order.CreatedBy };
        if (order.TechnicianId.HasValue) ids.Add(order.TechnicianId.Value);
        if (order.AssignedBy.HasValue) ids.Add(order.AssignedBy.Value);

        var users = await _userRepository.GetByIds(ids);
        var nameById = users.ToDictionary(u => u.Id, u => u.Name);

        return new ServiceOrderResponseJson
        {
            Id = order.Id.ToString(),
            Title = order.Title,
            Description = order.Description,
            Location = order.Location,
            CreatedAt = order.CreatedAt.ToString("o"),
            UpdatedAt = order.UpdatedAt?.ToString("o"),
            AssignedAt = order.AssignedAt?.ToString("o"),
            DueDate = order.DueDate?.ToString("o"),
            CompletedAt = order.CompletedAt?.ToString("o"),
            ApprovedAt = order.ApprovedAt?.ToString("o"),
            RejectedAt = order.RejectedAt?.ToString("o"),
            Priority = order.Priority.ToString(),
            Status = order.Status.ToString(),
            TechnicianId = order.TechnicianId?.ToString(),
            TechnicianName = order.TechnicianId.HasValue && nameById.TryGetValue(order.TechnicianId.Value, out var techName) ? techName : null,
            CreatedBy = order.CreatedBy.ToString(),
            CreatedByName = nameById.TryGetValue(order.CreatedBy, out var creatorName) ? creatorName : null,
            AssignedBy = order.AssignedBy?.ToString(),
            AssignedByName = order.AssignedBy.HasValue && nameById.TryGetValue(order.AssignedBy.Value, out var assignerName) ? assignerName : null,
            CompletionNotes = order.CompletionNotes,
        };
    }
}
