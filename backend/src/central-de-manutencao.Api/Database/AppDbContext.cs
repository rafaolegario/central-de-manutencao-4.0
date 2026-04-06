using central_de_manutencao.Api.Models.Users;
using central_de_manutencao.Api.Models.ServiceOrders;
using Microsoft.EntityFrameworkCore;

namespace central_de_manutencao.Api.Database
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options){}

        public DbSet<User> Users { get; set; }
        public DbSet<ServiceOrder> ServiceOrders { get; set; }
        public DbSet<ServiceOrderLog> ServiceOrderLogs { get; set; }

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
        }
    }
}
