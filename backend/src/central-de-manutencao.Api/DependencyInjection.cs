using Microsoft.EntityFrameworkCore;
using central_de_manutencao.Api.Database;
using central_de_manutencao.Api.Database.Repositories.Users;
using central_de_manutencao.Api.Services.Auth;
using central_de_manutencao.Api.Services.User;
using central_de_manutencao.Api.Token;

namespace central_de_manutencao.Api
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            var connectionString = configuration.GetConnectionString("DefaultConnection");

            services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(connectionString));

            var expirationTimeMinutes = configuration.GetValue<uint>("Settings:Jwt:ExpiresMinutes");
            var signingKey = configuration.GetValue<string>("Settings:Jwt:SigningKey");

            services.AddScoped<IAccessTokenGenerator>(config => new JwtTokenGenerator(expirationTimeMinutes, signingKey!));

            services.AddScoped<IUserRepository, UserRepository>();

            services.AddScoped<AuthenticateService>();
            services.AddScoped<CreateUserService>();
            services.AddScoped<EditUserService>();
            services.AddScoped<DeleteUserService>();
            services.AddScoped<ListUsersService>();
            services.AddScoped<GetUserService>();

            return services;
        }
    }
}
