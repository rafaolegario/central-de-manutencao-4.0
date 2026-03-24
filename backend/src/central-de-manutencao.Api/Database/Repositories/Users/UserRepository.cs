using central_de_manutencao.Api.Enums;
using central_de_manutencao.Api.Models.Users;

namespace central_de_manutencao.Api.Database.Repositories.Users
{
    public class UserRepository : IUserRepository
    {
        private readonly AppDbContext _context;

        public UserRepository(AppDbContext context)
        {
            _context = context;
        }

        public void Create(User user)
        {
            _context.Users.Add(user);
            _context.SaveChanges();
        }

        public void Delete(User user)
        {
            _context.Users.Remove(user);
            _context.SaveChanges();
        }

        public void Update(User user)
        {
            _context.Users.Update(user);
            _context.SaveChanges();
        }

        public User? GetById(Guid id)
        {
            return _context.Users.FirstOrDefault(u => u.Id == id);
        }

        public List<User> List(Specialties? specialty)
        {
            if (specialty.HasValue)
                return _context.Users.Where(u => u.Specialty == specialty.Value).ToList();

            return _context.Users.ToList();
        }
    }
}
