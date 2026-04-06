using central_de_manutencao.Api.Enums;

namespace central_de_manutencao.Api.Models.ServiceOrders
{
    public class ServiceOrderLog
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public Guid ServiceOrderId { get; set; }
        public ServiceOrderStatus OldStatus { get; set; }
        public ServiceOrderStatus NewStatus { get; set; }
        public DateTime ChangedAt { get; set; } = DateTime.UtcNow;
        public Guid ChangedBy { get; set; }
        public string? Description { get; set; }
    }
}
