using central_de_manutencao.Api.Enums;

namespace central_de_manutencao.Api.Services.ServiceOrder;

public static class ServiceOrderStatusTransitions
{
    private static readonly Dictionary<ServiceOrderStatus, List<ServiceOrderStatus>> _allowedTransitions = new()
    {
        { ServiceOrderStatus.Open, [ServiceOrderStatus.Assigned, ServiceOrderStatus.Canceled] },
        { ServiceOrderStatus.Assigned, [ServiceOrderStatus.InProgress] },
        { ServiceOrderStatus.InProgress, [ServiceOrderStatus.Paused, ServiceOrderStatus.Completed] },
        { ServiceOrderStatus.Paused, [ServiceOrderStatus.InProgress] },
        { ServiceOrderStatus.Completed, [ServiceOrderStatus.Approved, ServiceOrderStatus.Rejected, ServiceOrderStatus.Reopened] },
    };

    private static readonly HashSet<ServiceOrderStatus> _adminOnlyTransitions =
    [
        ServiceOrderStatus.Assigned,
        ServiceOrderStatus.Approved,
        ServiceOrderStatus.Rejected,
        ServiceOrderStatus.Reopened,
        ServiceOrderStatus.Canceled,
    ];

    private static readonly HashSet<ServiceOrderStatus> _technicianTransitions =
    [
        ServiceOrderStatus.InProgress,
        ServiceOrderStatus.Paused,
        ServiceOrderStatus.Completed,
    ];

    public static bool IsValidTransition(ServiceOrderStatus from, ServiceOrderStatus to)
    {
        return _allowedTransitions.TryGetValue(from, out var allowed) && allowed.Contains(to);
    }

    public static bool IsAdminTransition(ServiceOrderStatus to)
    {
        return _adminOnlyTransitions.Contains(to);
    }

    public static bool IsTechnicianTransition(ServiceOrderStatus to)
    {
        return _technicianTransitions.Contains(to);
    }
}
