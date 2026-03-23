using central_de_manutencao.Api.Enums;

namespace central_de_manutencao.Api.Models
{

    public class User
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string name { get; set; }
        public string email { get; set; }
        public string password { get; set; }
        public Roles role { get; set; }
        public Specialties? specialty { get; set; }
        public bool active { get; set; }
        public DateTime createdAt { get; set; }
    }
}
