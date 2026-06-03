using System.Security.Claims;
using central_de_manutencao.Api.Database.Repositories.ServiceOrders;
using central_de_manutencao.Api.Database.Repositories.Users;
using central_de_manutencao.Api.Enums;
using central_de_manutencao.Api.Exceptions.ExceptionsBase;
using central_de_manutencao.Api.Models.ServiceOrders;
using central_de_manutencao.Api.Services.ServiceOrder.Validators;
using central_de_manutencao.Communication.Requests.ServiceOrder;
using central_de_manutencao.Communication.Responses.ServiceOrder;

namespace central_de_manutencao.Api.Services.ServiceOrder;

public class CreateServiceOrderService
{
    private readonly IServiceOrderRepository _serviceOrderRepository;
    private readonly IUserRepository _userRepository;

    public CreateServiceOrderService(
        IServiceOrderRepository serviceOrderRepository,
        IUserRepository userRepository)
    {
        _serviceOrderRepository = serviceOrderRepository;
        _userRepository = userRepository;
    }

    public async Task<CreateServiceOrderResponseJson> Execute(CreateServiceOrderRequestJson request, ClaimsPrincipal currentUser)
    {
        Validate(request);

        var currentUserId = Guid.Parse(currentUser.FindFirstValue(ClaimTypes.Sid)!);

        if (!Enum.TryParse<ServiceOrderPriority>(request.Priority, out var priority))
            throw new BadRequestException("Prioridade inválida.");

        DateTime? dueDate = null;
        if (!string.IsNullOrEmpty(request.DueDate) && DateTime.TryParse(request.DueDate, out var parsedDueDate))
            dueDate = parsedDueDate.ToUniversalTime();

        Guid? technicianId = null;
        DateTime? assignedAt = null;
        Guid? assignedBy = null;
        var status = ServiceOrderStatus.Open;

        if (!string.IsNullOrWhiteSpace(request.TechnicianId))
        {
            if (!Guid.TryParse(request.TechnicianId, out var techGuid))
                throw new BadRequestException("ID do técnico inválido.");

            var technician = await _userRepository.GetById(techGuid);
            if (technician is null)
                throw new BadRequestException("Técnico não encontrado.");
            if (!technician.Active)
                throw new BadRequestException("O técnico informado não está ativo.");
            if (technician.Role != Roles.Technician)
                throw new BadRequestException("O usuário informado não é um técnico.");

            technicianId = techGuid;
            assignedAt = DateTime.UtcNow;
            assignedBy = currentUserId;
            status = ServiceOrderStatus.Assigned;
        }

        var order = new Models.ServiceOrders.ServiceOrder
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            Description = request.Description,
            Location = request.Location,
            Priority = priority,
            Status = status,
            CreatedBy = currentUserId,
            TechnicianId = technicianId,
            AssignedAt = assignedAt,
            AssignedBy = assignedBy,
            DueDate = dueDate,
            IsDeleted = false,
        };

        await _serviceOrderRepository.Create(order);

        return new CreateServiceOrderResponseJson
        {
            Id = order.Id.ToString(),
            Title = order.Title,
            Description = order.Description,
            Location = order.Location,
            Priority = order.Priority.ToString(),
            Status = order.Status.ToString(),
            CreatedBy = order.CreatedBy.ToString(),
            DueDate = order.DueDate?.ToString("o"),
        };
    }

    private void Validate(CreateServiceOrderRequestJson request)
    {
        var result = new CreateServiceOrderValidator().Validate(request);

        if (!result.IsValid)
        {
            var errors = result.Errors.Select(e => e.ErrorMessage).ToList();
            throw new BadRequestException(string.Join("; ", errors));
        }
    }
}
