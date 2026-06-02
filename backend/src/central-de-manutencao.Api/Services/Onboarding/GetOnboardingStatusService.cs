using central_de_manutencao.Api.Database.Repositories.Stock;
using central_de_manutencao.Api.Database.Repositories.Tools;
using central_de_manutencao.Api.Database.Repositories.Users;
using central_de_manutencao.Api.Enums;
using central_de_manutencao.Communication.Responses.Onboarding;

namespace central_de_manutencao.Api.Services.Onboarding
{
    public class GetOnboardingStatusService
    {
        private readonly IToolRepository _toolRepository;
        private readonly IStockItemRepository _stockRepository;
        private readonly IUserRepository _userRepository;

        public GetOnboardingStatusService(
            IToolRepository toolRepository,
            IStockItemRepository stockRepository,
            IUserRepository userRepository)
        {
            _toolRepository = toolRepository;
            _stockRepository = stockRepository;
            _userRepository = userRepository;
        }

        public async Task<OnboardingStatusResponseJson> Execute()
        {
            var tools = await _toolRepository.List(null);
            var stockItems = await _stockRepository.List(null);
            var technicians = await _userRepository.List(Roles.Technician, null, null);

            var hasTools = tools.Count > 0;
            var hasStockItems = stockItems.Count > 0;
            var hasTechnicians = technicians.Count > 0;

            return new OnboardingStatusResponseJson
            {
                HasTools = hasTools,
                HasStockItems = hasStockItems,
                HasTechnicians = hasTechnicians,
                Complete = hasTools && hasStockItems && hasTechnicians
            };
        }
    }
}
