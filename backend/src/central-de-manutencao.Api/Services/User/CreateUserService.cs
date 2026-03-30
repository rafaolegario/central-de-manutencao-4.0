using central_de_manutencao.Api.Database.Repositories.Users;
using central_de_manutencao.Api.Models.Users;
using central_de_manutencao.Communication.Requests.User;
using central_de_manutencao.Api.Enums;

public class CreateUserService
    {
        private readonly IUserRepository _userRepository;

        public CreateUserService(
           IUserRepository userRepository   
        ) {
            _userRepository = userRepository;
        }

        public async Task<CreateUserResponseJson> Execute(CreateUserRequestJson request)
        {
            await Validate(request);

            var user = new User
            {
                Id = Guid.NewGuid(),
                Name = request.Name,
                Email = request.Email,
                Specialty = Enum.TryParse<central_de_manutencao.Api.Enums.Specialties>(request.Specialty, out var specialty) ? specialty : null,
                Password = BCrypt.Net.BCrypt.HashPassword(request.Password),
                Role = Roles.Technician
            };

            await _userRepository.Create(user);

            return new CreateUserResponseJson
            {
                Id = user.Id.ToString(),
                Name = user.Name,
                Email = user.Email,
                Specialty = user.Specialty?.ToString() ?? string.Empty
            };
        }   

        private async Task Validate( CreateUserRequestJson request)
        {
            var result = new CreateUserValidator().Validate(request);

            if (!result.IsValid)
            {
                var errors = result.Errors.Select(e => e.ErrorMessage).ToList();
                throw new Exception(string.Join("; ", errors));
            }

            var existingUser = await _userRepository.GetByEmail(request.Email);
            if (existingUser != null)
                throw new Exception("Já existe um usuário com este email.");
        }
    }