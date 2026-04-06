using System.Security.Claims;
using central_de_manutencao.Api.Database.Repositories.ServiceOrders;
using central_de_manutencao.Api.Enums;
using central_de_manutencao.Api.Exceptions.ExceptionsBase;
using central_de_manutencao.Communication.Responses.ServiceOrder;

namespace central_de_manutencao.Api.Services.ServiceOrder;

public class GetServiceOrderService
{
    private readonly IServiceOrderRepository _serviceOrderRepository;

    public GetServiceOrderService(IServiceOrderRepository serviceOrderRepository)
    {
        _serviceOrderRepository = serviceOrderRepository;
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
            CreatedBy = order.CreatedBy.ToString(),
            AssignedBy = order.AssignedBy?.ToString(),
            CompletionNotes = order.CompletionNotes,
        };
    }
}
