using central_de_manutencao.Api.Models.Users;
using central_de_manutencao.Api.Models.ServiceOrders;
using central_de_manutencao.Api.Models.Stock;
using central_de_manutencao.Api.Models.Tools;
using Microsoft.EntityFrameworkCore;

namespace central_de_manutencao.Api.Database
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options){}

        public DbSet<User> Users { get; set; }
        public DbSet<ServiceOrder> ServiceOrders { get; set; }
        public DbSet<ServiceOrderLog> ServiceOrderLogs { get; set; }
        public DbSet<StockItem> StockItems { get; set; }
        public DbSet<StockMovement> StockMovements { get; set; }
        public DbSet<Tool> Tools { get; set; }
        public DbSet<ToolUsage> ToolUsages { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<ServiceOrder>(entity =>
            {
                entity.Property(e => e.RowVersion)
                    .IsRowVersion();

                entity.HasIndex(e => e.Status);
                entity.HasIndex(e => e.CreatedAt);
                entity.HasIndex(e => e.TechnicianId);
            });

            modelBuilder.Entity<StockItem>(entity =>
            {
                entity.HasIndex(e => e.Code).IsUnique();
            });

            modelBuilder.Entity<StockMovement>(entity =>
            {
                entity.HasIndex(e => e.StockItemId);
            });

            modelBuilder.Entity<Tool>(entity =>
            {
                entity.HasIndex(e => e.Code).IsUnique();
            });

            modelBuilder.Entity<ToolUsage>(entity =>
            {
                entity.HasIndex(e => e.ToolId);
                entity.HasIndex(e => e.TechnicianId);
                entity.HasIndex(e => e.ReturnedAt);
            });
        }
    }
}
