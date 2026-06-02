using central_de_manutencao.Api.Enums;

namespace central_de_manutencao.Api.Models.Users
{
    public class User
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
        public bool MustSetPassword { get; set; } = true;
        public Roles Role { get; set; }
        public Specialties? Specialty { get; set; }
        public bool Active { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    }
}
