using System.Security.Claims;
using central_de_manutencao.Api.Database.Repositories.ServiceOrders;
using central_de_manutencao.Api.Enums;
using central_de_manutencao.Api.Exceptions.ExceptionsBase;
using central_de_manutencao.Api.Services.ServiceOrder.Validators;
using central_de_manutencao.Communication.Requests.ServiceOrder;
using central_de_manutencao.Communication.Responses.ServiceOrder;

namespace central_de_manutencao.Api.Services.ServiceOrder;

public class EditServiceOrderService
{
    private readonly IServiceOrderRepository _serviceOrderRepository;

    public EditServiceOrderService(IServiceOrderRepository serviceOrderRepository)
    {
        _serviceOrderRepository = serviceOrderRepository;
    }

    public async Task<ServiceOrderResponseJson> Execute(Guid id, EditServiceOrderRequestJson request, ClaimsPrincipal currentUser)
    {
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
        }
        else
        {
            throw new BadRequestException("Não é possível editar uma ordem de serviço com o status atual.");
        }

        order.UpdatedAt = DateTime.UtcNow;

        await _serviceOrderRepository.Update(order);

        return MapToResponse(order);
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
