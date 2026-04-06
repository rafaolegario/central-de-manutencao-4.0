using Microsoft.EntityFrameworkCore;
using central_de_manutencao.Api.Enums;
using central_de_manutencao.Api.Exceptions.ExceptionsBase;
using central_de_manutencao.Api.Models.ServiceOrders;

namespace central_de_manutencao.Api.Database.Repositories.ServiceOrders
{
    public class ServiceOrderRepository : IServiceOrderRepository
    {
        private readonly AppDbContext _context;

        public ServiceOrderRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task Create(ServiceOrder order)
        {
            _context.ServiceOrders.Add(order);
            await _context.SaveChangesAsync();
        }

        public async Task Update(ServiceOrder order)
        {
            try
            {
                _context.ServiceOrders.Update(order);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw new ConflictException("O registro foi modificado por outro usuário. Tente novamente.");
            }
        }

        public async Task<ServiceOrder?> GetById(Guid id)
        {
            return await _context.ServiceOrders
                .Where(o => !o.IsDeleted)
                .FirstOrDefaultAsync(o => o.Id == id);
        }

        public async Task<(List<ServiceOrder> Items, int TotalCount)> List(
            ServiceOrderStatus? status,
            ServiceOrderPriority? priority,
            Guid? technicianId,
            DateTime? createdAtFrom,
            DateTime? createdAtTo,
            string orderBy,
            string orderDirection,
            int page,
            int pageSize)
        {
            var query = _context.ServiceOrders
                .Where(o => !o.IsDeleted)
                .AsQueryable();

            if (status.HasValue)
                query = query.Where(o => o.Status == status.Value);

            if (priority.HasValue)
                query = query.Where(o => o.Priority == priority.Value);

            if (technicianId.HasValue)
                query = query.Where(o => o.TechnicianId == technicianId.Value);

            if (createdAtFrom.HasValue)
                query = query.Where(o => o.CreatedAt >= createdAtFrom.Value);

            if (createdAtTo.HasValue)
                query = query.Where(o => o.CreatedAt <= createdAtTo.Value);

            query = orderBy.ToLower() switch
            {
                "priority" => orderDirection.ToLower() == "asc"
                    ? query.OrderBy(o => o.Priority)
                    : query.OrderByDescending(o => o.Priority),
                "status" => orderDirection.ToLower() == "asc"
                    ? query.OrderBy(o => o.Status)
                    : query.OrderByDescending(o => o.Status),
                _ => orderDirection.ToLower() == "asc"
                    ? query.OrderBy(o => o.CreatedAt)
                    : query.OrderByDescending(o => o.CreatedAt),
            };

            var totalCount = await query.CountAsync();

            var items = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            return (items, totalCount);
        }

        public async Task UpdateWithLog(ServiceOrder order, ServiceOrderLog log)
        {
            try
            {
                _context.ServiceOrders.Update(order);
                _context.ServiceOrderLogs.Add(log);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                throw new ConflictException("O registro foi modificado por outro usuário. Tente novamente.");
            }
        }
    }
}
