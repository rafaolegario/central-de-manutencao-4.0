using central_de_manutencao.Api.Enums;
using central_de_manutencao.Api.Models.Users;

namespace central_de_manutencao.Api.Database.Repositories.Users
{
    public interface IUserRepository
    {
        Task Create(User user);
        Task Delete(User user);
        Task Update(User user);
        Task<User?> GetById(Guid id);
        Task<User?> GetByEmail(string email);
        Task<List<User>> List(Roles? role, Specialties? specialty, bool? active);
    }
}
