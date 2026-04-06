using central_de_manutencao.Api.Models.ServiceOrders;

namespace central_de_manutencao.Api.Database.Repositories.ServiceOrders
{
    public interface IServiceOrderLogRepository
    {
        Task<List<ServiceOrderLog>> GetByServiceOrderId(Guid serviceOrderId);
    }
}
