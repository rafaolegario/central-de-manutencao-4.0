using System.Security.Claims;
using central_de_manutencao.Api.Database.Repositories.ServiceOrders;
using central_de_manutencao.Api.Enums;
using central_de_manutencao.Communication.Responses.ServiceOrder;

namespace central_de_manutencao.Api.Services.ServiceOrder;

public class ListServiceOrdersService
{
    private readonly IServiceOrderRepository _serviceOrderRepository;

    public ListServiceOrdersService(IServiceOrderRepository serviceOrderRepository)
    {
        _serviceOrderRepository = serviceOrderRepository;
    }

    public async Task<ServiceOrderListResponseJson> Execute(
        string? status,
        string? priority,
        string? technicianId,
        string? createdAtFrom,
        string? createdAtTo,
        string? orderBy,
        string? orderDirection,
        int page,
        int pageSize,
        ClaimsPrincipal currentUser)
    {
        var currentUserId = currentUser.FindFirstValue(ClaimTypes.Sid);
        var currentUserRole = currentUser.FindFirstValue(ClaimTypes.Role);

        var isAdmin = currentUserRole == Roles.Admin.ToString();

        ServiceOrderStatus? statusEnum = null;
        if (!string.IsNullOrEmpty(status) && Enum.TryParse<ServiceOrderStatus>(status, out var parsedStatus))
            statusEnum = parsedStatus;

        ServiceOrderPriority? priorityEnum = null;
        if (!string.IsNullOrEmpty(priority) && Enum.TryParse<ServiceOrderPriority>(priority, out var parsedPriority))
            priorityEnum = parsedPriority;

        Guid? technicianIdGuid = null;
        if (isAdmin && !string.IsNullOrEmpty(technicianId) && Guid.TryParse(technicianId, out var parsedTechId))
            technicianIdGuid = parsedTechId;

        if (!isAdmin)
            technicianIdGuid = Guid.Parse(currentUserId!);

        DateTime? fromDate = null;
        if (!string.IsNullOrEmpty(createdAtFrom) && DateTime.TryParse(createdAtFrom, out var parsedFrom))
            fromDate = parsedFrom.ToUniversalTime();

        DateTime? toDate = null;
        if (!string.IsNullOrEmpty(createdAtTo) && DateTime.TryParse(createdAtTo, out var parsedTo))
            toDate = parsedTo.ToUniversalTime();

        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 20;

        var (items, totalCount) = await _serviceOrderRepository.List(
            statusEnum,
            priorityEnum,
            technicianIdGuid,
            fromDate,
            toDate,
            orderBy ?? "createdAt",
            orderDirection ?? "desc",
            page,
            pageSize);

        return new ServiceOrderListResponseJson
        {
            Items = items.Select(o => new ServiceOrderResponseJson
            {
                Id = o.Id.ToString(),
                Title = o.Title,
                Description = o.Description,
                Location = o.Location,
                CreatedAt = o.CreatedAt.ToString("o"),
                UpdatedAt = o.UpdatedAt?.ToString("o"),
                AssignedAt = o.AssignedAt?.ToString("o"),
                DueDate = o.DueDate?.ToString("o"),
                CompletedAt = o.CompletedAt?.ToString("o"),
                ApprovedAt = o.ApprovedAt?.ToString("o"),
                RejectedAt = o.RejectedAt?.ToString("o"),
                Priority = o.Priority.ToString(),
                Status = o.Status.ToString(),
                TechnicianId = o.TechnicianId?.ToString(),
                CreatedBy = o.CreatedBy.ToString(),
                AssignedBy = o.AssignedBy?.ToString(),
                CompletionNotes = o.CompletionNotes,
            }).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
        };
    }
}
