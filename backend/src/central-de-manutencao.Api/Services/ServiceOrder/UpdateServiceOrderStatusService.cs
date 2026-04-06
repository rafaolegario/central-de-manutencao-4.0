using System.Security.Claims;
using central_de_manutencao.Api.Database.Repositories.ServiceOrders;
using central_de_manutencao.Api.Database.Repositories.Users;
using central_de_manutencao.Api.Enums;
using central_de_manutencao.Api.Exceptions.ExceptionsBase;
using central_de_manutencao.Api.Models.ServiceOrders;
using central_de_manutencao.Communication.Requests.ServiceOrder;
using central_de_manutencao.Communication.Responses.ServiceOrder;

namespace central_de_manutencao.Api.Services.ServiceOrder;

public class UpdateServiceOrderStatusService
{
    private readonly IServiceOrderRepository _serviceOrderRepository;
    private readonly IUserRepository _userRepository;

    public UpdateServiceOrderStatusService(
        IServiceOrderRepository serviceOrderRepository,
        IUserRepository userRepository)
    {
        _serviceOrderRepository = serviceOrderRepository;
        _userRepository = userRepository;
    }

    public async Task<ServiceOrderResponseJson> Execute(Guid id, UpdateServiceOrderStatusRequestJson request, ClaimsPrincipal currentUser)
    {
        var currentUserId = Guid.Parse(currentUser.FindFirstValue(ClaimTypes.Sid)!);
        var currentUserRole = currentUser.FindFirstValue(ClaimTypes.Role)!;

        var isAdmin = currentUserRole == Roles.Admin.ToString();
        var isTechnician = currentUserRole == Roles.Technician.ToString();

        if (!Enum.TryParse<ServiceOrderStatus>(request.Status, out var newStatus))
            throw new BadRequestException("Status inválido.");

        var order = await _serviceOrderRepository.GetById(id);

        if (order is null)
            throw new NotFoundException("Ordem de serviço não encontrada.");

        var oldStatus = order.Status;

        if (!ServiceOrderStatusTransitions.IsValidTransition(oldStatus, newStatus))
            throw new BadRequestException($"Transição de status inválida: {oldStatus} → {newStatus}.");

        if (ServiceOrderStatusTransitions.IsAdminTransition(newStatus) && !isAdmin)
            throw new ForbiddenException("Apenas administradores podem realizar esta transição de status.");

        if (ServiceOrderStatusTransitions.IsTechnicianTransition(newStatus) && !isTechnician)
            throw new ForbiddenException("Apenas técnicos podem realizar esta transição de status.");

        if (isTechnician && order.TechnicianId != currentUserId)
            throw new ForbiddenException("Você só pode atualizar ordens de serviço atribuídas a você.");

        string? logDescription = null;

        switch (newStatus)
        {
            case ServiceOrderStatus.Assigned:
                await ValidateAssignment(order, request);
                order.TechnicianId = Guid.Parse(request.TechnicianId!);
                order.AssignedBy = currentUserId;
                order.AssignedAt = DateTime.UtcNow;
                logDescription = "Técnico atribuído.";
                break;

            case ServiceOrderStatus.InProgress:
                break;

            case ServiceOrderStatus.Paused:
                break;

            case ServiceOrderStatus.Completed:
                order.CompletedAt = DateTime.UtcNow;
                order.CompletionNotes = request.CompletionNotes;
                break;

            case ServiceOrderStatus.Approved:
                order.ApprovedAt = DateTime.UtcNow;
                break;

            case ServiceOrderStatus.Rejected:
                order.RejectedAt = DateTime.UtcNow;
                break;

            case ServiceOrderStatus.Reopened:
                order.CompletedAt = null;
                order.ApprovedAt = null;
                order.RejectedAt = null;
                order.CompletionNotes = null;
                break;

            case ServiceOrderStatus.Canceled:
                break;
        }

        order.Status = newStatus;
        order.UpdatedAt = DateTime.UtcNow;

        var log = new ServiceOrderLog
        {
            Id = Guid.NewGuid(),
            ServiceOrderId = order.Id,
            OldStatus = oldStatus,
            NewStatus = newStatus,
            ChangedAt = DateTime.UtcNow,
            ChangedBy = currentUserId,
            Description = logDescription,
        };

        await _serviceOrderRepository.UpdateWithLog(order, log);

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

    private async Task ValidateAssignment(Models.ServiceOrders.ServiceOrder order, UpdateServiceOrderStatusRequestJson request)
    {
        if (string.IsNullOrEmpty(request.TechnicianId))
            throw new BadRequestException("O ID do técnico é obrigatório para atribuição.");

        if (!Guid.TryParse(request.TechnicianId, out var technicianId))
            throw new BadRequestException("O ID do técnico é inválido.");

        if (order.TechnicianId.HasValue)
            throw new BadRequestException("Esta ordem de serviço já possui um técnico atribuído.");

        var technician = await _userRepository.GetById(technicianId);

        if (technician is null)
            throw new BadRequestException("Técnico não encontrado.");

        if (!technician.Active)
            throw new BadRequestException("O técnico informado não está ativo.");

        if (technician.Role != Roles.Technician)
            throw new BadRequestException("O usuário informado não é um técnico.");
    }
}
