using System.Security.Claims;
using central_de_manutencao.Api.Database.Repositories.ServiceOrders;
using central_de_manutencao.Api.Database.Repositories.Users;
using central_de_manutencao.Api.Enums;
using central_de_manutencao.Communication.Responses.ServiceOrder;

namespace central_de_manutencao.Api.Services.ServiceOrder;

public class ListServiceOrdersService
{
    private readonly IServiceOrderRepository _serviceOrderRepository;
    private readonly IUserRepository _userRepository;

    public ListServiceOrdersService(
        IServiceOrderRepository serviceOrderRepository,
        IUserRepository userRepository)
    {
        _serviceOrderRepository = serviceOrderRepository;
        _userRepository = userRepository;
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

        var ids = new List<Guid>();
        foreach (var o in items)
        {
            ids.Add(o.CreatedBy);
            if (o.TechnicianId.HasValue) ids.Add(o.TechnicianId.Value);
            if (o.AssignedBy.HasValue) ids.Add(o.AssignedBy.Value);
        }

        var users = await _userRepository.GetByIds(ids);
        var nameById = users.ToDictionary(u => u.Id, u => u.Name);

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
                TechnicianName = o.TechnicianId.HasValue && nameById.TryGetValue(o.TechnicianId.Value, out var techName) ? techName : null,
                CreatedBy = o.CreatedBy.ToString(),
                CreatedByName = nameById.TryGetValue(o.CreatedBy, out var creatorName) ? creatorName : null,
                AssignedBy = o.AssignedBy?.ToString(),
                AssignedByName = o.AssignedBy.HasValue && nameById.TryGetValue(o.AssignedBy.Value, out var assignerName) ? assignerName : null,
                CompletionNotes = o.CompletionNotes,
            }).ToList(),
            Page = page,
            PageSize = pageSize,
            TotalCount = totalCount,
        };
    }
}
