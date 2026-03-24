using Microsoft.EntityFrameworkCore;
using central_de_manutencao.Api.Database;
using central_de_manutencao.Api.Database.Repositories.Users;

namespace central_de_manutencao.Api
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(connectionString));

            services.AddScoped<IUserRepository, UserRepository>();

            return services;
        }
    }
}
