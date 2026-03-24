using central_de_manutencao.Api.Enums;
using central_de_manutencao.Api.Models.Users;

namespace central_de_manutencao.Api.Database.Repositories.Users
{
    public interface IUserRepository
    {
        void Create(User user);
        void Delete(User user);
        void Update(User user);
        User? GetById(Guid id);
        List<User> List(Specialties? specialty);
    }
}
