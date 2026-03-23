using central_de_manutencao.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace central_de_manutencao.Api.Database
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options){}

        public DbSet<User> Users { get; set; }
    }
}
