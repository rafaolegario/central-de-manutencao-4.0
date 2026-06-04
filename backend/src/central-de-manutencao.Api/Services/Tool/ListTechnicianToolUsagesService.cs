using System.Security.Claims;
using central_de_manutencao.Api.Database.Repositories.Tools;
using central_de_manutencao.Api.Database.Repositories.Users;
using central_de_manutencao.Communication.Responses.Tool;

namespace central_de_manutencao.Api.Services.Tool;

public class ListTechnicianToolUsagesService
{
    private readonly IToolRepository _toolRepository;
    private readonly IUserRepository _userRepository;

    public ListTechnicianToolUsagesService(
        IToolRepository toolRepository,
        IUserRepository userRepository)
    {
        _toolRepository = toolRepository;
        _userRepository = userRepository;
    }

    public async Task<ActiveToolUsageListResponseJson> Execute(ClaimsPrincipal currentUser)
    {
        var technicianId = Guid.Parse(currentUser.FindFirstValue(ClaimTypes.Sid)!);

        var usages = await _toolRepository.GetUsagesByTechnicianId(technicianId);
        var technician = await _userRepository.GetById(technicianId);

        var items = new List<ToolUsageResponseJson>();

        foreach (var usage in usages)
        {
            var tool = await _toolRepository.GetById(usage.ToolId);

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
