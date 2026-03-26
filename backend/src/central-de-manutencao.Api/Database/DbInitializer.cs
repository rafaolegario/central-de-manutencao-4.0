using central_de_manutencao.Api.Models.Users;
using central_de_manutencao.Api.Enums;
using central_de_manutencao.Api.Database;

public static class DbInitializer
{
    public static void Seed(AppDbContext context, IConfiguration config)
    {
        var email = config["AdminUser:Email"];
        var password = config["AdminUser:Password"];

        if (string.IsNullOrWhiteSpace(email))
        {
            throw new ArgumentNullException(nameof(email), "Admin email configuration is missing.");
        }

        if (!context.Users.Any(u => u.Email == email))
        {
            var admin = new User
            {
                Name = "Admin",
                Email = email,
                Password = BCrypt.Net.BCrypt.HashPassword(password),
                Role = Roles.Admin,
                Active = true,
                CreatedAt = DateTime.UtcNow
            };

            context.Users.Add(admin);
            context.SaveChanges();
        }
    }
}