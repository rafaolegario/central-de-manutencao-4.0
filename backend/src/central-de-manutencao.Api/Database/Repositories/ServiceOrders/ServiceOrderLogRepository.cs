using Microsoft.EntityFrameworkCore;
using central_de_manutencao.Api.Models.ServiceOrders;

namespace central_de_manutencao.Api.Database.Repositories.ServiceOrders
{
    public class ServiceOrderLogRepository : IServiceOrderLogRepository
    {
        private readonly AppDbContext _context;

        public ServiceOrderLogRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ServiceOrderLog>> GetByServiceOrderId(Guid serviceOrderId)
        {
            return await _context.ServiceOrderLogs
                .Where(l => l.ServiceOrderId == serviceOrderId)
                .OrderByDescending(l => l.ChangedAt)
                .ToListAsync();
        }
    }
}
