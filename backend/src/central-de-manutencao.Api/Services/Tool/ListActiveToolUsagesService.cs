using central_de_manutencao.Api.Database.Repositories.Tools;
using central_de_manutencao.Api.Database.Repositories.Users;
using central_de_manutencao.Communication.Responses.Tool;

namespace central_de_manutencao.Api.Services.Tool;

public class ListActiveToolUsagesService
{
    private readonly IToolRepository _toolRepository;
    private readonly IUserRepository _userRepository;

    public ListActiveToolUsagesService(
        IToolRepository toolRepository,
        IUserRepository userRepository)
    {
        _toolRepository = toolRepository;
        _userRepository = userRepository;
    }

    public async Task<ActiveToolUsageListResponseJson> Execute()
    {
        var usages = await _toolRepository.GetAllActiveUsages();

        var items = new List<ToolUsageResponseJson>();

        foreach (var usage in usages)
        {
            var tool = await _toolRepository.GetById(usage.ToolId);
            var technician = await _userRepository.GetById(usage.TechnicianId);

            items.Add(new ToolUsageResponseJson
            {
                Id = usage.Id.ToString(),
                ToolId = usage.ToolId.ToString(),
                ToolName = tool?.Name,
                WorkOrderId = usage.WorkOrderId.ToString(),
                TechnicianId = usage.TechnicianId.ToString(),
                TechnicianName = technician?.Name,
                WithdrawnAt = usage.WithdrawnAt.ToString("o"),
                ReturnedAt = usage.ReturnedAt?.ToString("o"),
            });
        }

        return new ActiveToolUsageListResponseJson
        {
            Items = items,
        };
    }
}
