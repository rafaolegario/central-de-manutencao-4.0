using central_de_manutencao.Api.Enums;
using central_de_manutencao.Api.Models.ServiceOrders;

namespace central_de_manutencao.Api.Database.Repositories.ServiceOrders
{
    public interface IServiceOrderRepository
    {
        Task Create(ServiceOrder order);
        Task Update(ServiceOrder order);
        Task<ServiceOrder?> GetById(Guid id);
        Task<(List<ServiceOrder> Items, int TotalCount)> List(
            ServiceOrderStatus? status,
            ServiceOrderPriority? priority,
            Guid? technicianId,
            DateTime? createdAtFrom,
            DateTime? createdAtTo,
            string orderBy,
            string orderDirection,
            int page,
            int pageSize);
        Task UpdateWithLog(ServiceOrder order, ServiceOrderLog log);
    }
}
