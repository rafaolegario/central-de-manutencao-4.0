using Microsoft.EntityFrameworkCore;
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

        public async Task Create(User user)
        {
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
        }

        public async Task Delete(User user)
        {
            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
        }

        public async Task Update(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task<User?> GetById(Guid id)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
        }

        public async Task<User?> GetByEmail(string email)
        {
            return await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<List<User>> List(Specialties? specialty, bool? active)
        {
            var query = _context.Users.AsQueryable();

            if (specialty.HasValue)
                query = query.Where(u => u.Specialty == specialty.Value);

            if (active.HasValue)
                query = query.Where(u => u.Active == active.Value);

            return await query.ToListAsync();
        }
    }
}
