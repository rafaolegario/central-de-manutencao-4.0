using System.Security.Claims;
using central_de_manutencao.Api.Database.Repositories.ServiceOrders;
using central_de_manutencao.Api.Database.Repositories.Users;
using central_de_manutencao.Api.Enums;
using central_de_manutencao.Api.Exceptions.ExceptionsBase;
using central_de_manutencao.Api.Services.ServiceOrder.Validators;
using central_de_manutencao.Communication.Requests.ServiceOrder;
using central_de_manutencao.Communication.Responses.ServiceOrder;

namespace central_de_manutencao.Api.Services.ServiceOrder;

public class EditServiceOrderService
{
    private readonly IServiceOrderRepository _serviceOrderRepository;
    private readonly IUserRepository _userRepository;

    public EditServiceOrderService(
        IServiceOrderRepository serviceOrderRepository,
        IUserRepository userRepository)
    {
        _serviceOrderRepository = serviceOrderRepository;
        _userRepository = userRepository;
    }

    public async Task<ServiceOrderResponseJson> Execute(Guid id, EditServiceOrderRequestJson request, ClaimsPrincipal currentUser)
    {
        var currentUserId = Guid.Parse(currentUser.FindFirstValue(ClaimTypes.Sid)!);

        var order = await _serviceOrderRepository.GetById(id);

        if (order is null)
            throw new NotFoundException("Ordem de serviço não encontrada.");

        if (order.Status == ServiceOrderStatus.InProgress)
        {
            DateTime? dueDate = null;
            if (!string.IsNullOrEmpty(request.DueDate) && DateTime.TryParse(request.DueDate, out var parsedDueDate))
                dueDate = parsedDueDate.ToUniversalTime();

            order.DueDate = dueDate;
        }
        else if (order.Status == ServiceOrderStatus.Open ||
                 order.Status == ServiceOrderStatus.Assigned ||
                 order.Status == ServiceOrderStatus.Reopened)
        {
            Validate(request);

            order.Title = request.Title;
            order.Description = request.Description;
            order.Location = request.Location;

            if (!string.IsNullOrEmpty(request.DueDate) && DateTime.TryParse(request.DueDate, out var parsedDueDate))
                order.DueDate = parsedDueDate.ToUniversalTime();
            else
                order.DueDate = null;

            if (!string.IsNullOrEmpty(request.Priority))
            {
                if (!Enum.TryParse<ServiceOrderPriority>(request.Priority, out var priority))
                    throw new BadRequestException("Prioridade inválida.");
                order.Priority = priority;
            }

            await ApplyTechnicianChange(order, request.TechnicianId, currentUserId);
        }
        else
        {
            throw new BadRequestException("Não é possível editar uma ordem de serviço com o status atual.");
        }

        order.UpdatedAt = DateTime.UtcNow;

        await _serviceOrderRepository.Update(order);

        return MapToResponse(order);
    }

    private async Task ApplyTechnicianChange(
        Models.ServiceOrders.ServiceOrder order,
        string? requestedTechnicianId,
        Guid currentUserId)
    {
        Guid? newTechnicianId = null;
        if (!string.IsNullOrWhiteSpace(requestedTechnicianId))
        {
            if (!Guid.TryParse(requestedTechnicianId, out var parsed))
                throw new BadRequestException("ID do técnico inválido.");
            newTechnicianId = parsed;
        }

        if (newTechnicianId == order.TechnicianId)
            return;

        if (newTechnicianId.HasValue)
        {
            var technician = await _userRepository.GetById(newTechnicianId.Value);
            if (technician is null)
                throw new BadRequestException("Técnico não encontrado.");
            if (!technician.Active)
                throw new BadRequestException("O técnico informado não está ativo.");
            if (technician.Role != Roles.Technician)
                throw new BadRequestException("O usuário informado não é um técnico.");

            order.TechnicianId = newTechnicianId;
            order.AssignedBy = currentUserId;
            order.AssignedAt = DateTime.UtcNow;

            if (order.Status == ServiceOrderStatus.Open || order.Status == ServiceOrderStatus.Reopened)
                order.Status = ServiceOrderStatus.Assigned;
        }
        else
        {
            order.TechnicianId = null;
            order.AssignedBy = null;
            order.AssignedAt = null;

            if (order.Status == ServiceOrderStatus.Assigned)
                order.Status = ServiceOrderStatus.Open;
        }
    }

    private void Validate(EditServiceOrderRequestJson request)
    {
        var result = new EditServiceOrderValidator().Validate(request);

        if (!result.IsValid)
        {
            var errors = result.Errors.Select(e => e.ErrorMessage).ToList();
            throw new BadRequestException(string.Join("; ", errors));
        }
    }

    private ServiceOrderResponseJson MapToResponse(Models.ServiceOrders.ServiceOrder order)
    {
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
