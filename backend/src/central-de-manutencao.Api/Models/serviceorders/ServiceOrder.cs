using System.ComponentModel.DataAnnotations;
using central_de_manutencao.Api.Enums;

namespace central_de_manutencao.Api.Models.ServiceOrders
{
    public class ServiceOrder
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string? Location { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        public DateTime? AssignedAt { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? CompletedAt { get; set; }
        public DateTime? ApprovedAt { get; set; }
        public DateTime? RejectedAt { get; set; }
        public ServiceOrderPriority Priority { get; set; }
        public ServiceOrderStatus Status { get; set; }
        public Guid? TechnicianId { get; set; }
        public Guid CreatedBy { get; set; }
        public Guid? AssignedBy { get; set; }
        public bool IsDeleted { get; set; }
        public string? CompletionNotes { get; set; }

        [Timestamp]
        public byte[] RowVersion { get; set; } = null!;
    }
}
