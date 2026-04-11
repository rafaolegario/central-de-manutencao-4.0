using System.Security.Claims;
using central_de_manutencao.Api.Database.Repositories.ServiceOrders;
using central_de_manutencao.Api.Database.Repositories.Tools;
using central_de_manutencao.Api.Enums;
using central_de_manutencao.Api.Exceptions.ExceptionsBase;
using central_de_manutencao.Api.Models.Tools;
using central_de_manutencao.Api.Services.Tool.Validators;
using central_de_manutencao.Communication.Requests.Tool;
using central_de_manutencao.Communication.Responses.Tool;

namespace central_de_manutencao.Api.Services.Tool;

public class WithdrawToolService
{
    private readonly IToolRepository _toolRepository;
    private readonly IServiceOrderRepository _serviceOrderRepository;

    public WithdrawToolService(
        IToolRepository toolRepository,
        IServiceOrderRepository serviceOrderRepository)
    {
        _toolRepository = toolRepository;
        _serviceOrderRepository = serviceOrderRepository;
    }

    public async Task<ToolUsageResponseJson> Execute(Guid toolId, WithdrawToolRequestJson request, ClaimsPrincipal currentUser)
    {
        Validate(request);

        var currentUserId = Guid.Parse(currentUser.FindFirstValue(ClaimTypes.Sid)!);

        var tool = await _toolRepository.GetById(toolId);

        if (tool is null)
            throw new NotFoundException("Ferramenta não encontrada.");

        if (tool.AvailableQuantity <= 0)
            throw new ConflictException("Ferramenta indisponível. Todas as unidades estão em uso.");

        if (!Guid.TryParse(request.WorkOrderId, out var workOrderId))
            throw new BadRequestException("O ID da ordem de serviço é inválido.");

        var order = await _serviceOrderRepository.GetById(workOrderId);

        if (order is null)
            throw new NotFoundException("Ordem de serviço não encontrada.");

        if (order.Status != ServiceOrderStatus.InProgress)
            throw new BadRequestException("A ordem de serviço precisa estar em andamento para retirar ferramentas.");

        if (order.TechnicianId != currentUserId)
            throw new ForbiddenException("Você só pode retirar ferramentas para ordens de serviço atribuídas a você.");

        tool.AvailableQuantity--;

        var usage = new ToolUsage
        {
            ToolId = tool.Id,
            WorkOrderId = workOrderId,
            TechnicianId = currentUserId,
        };

        await _toolRepository.WithdrawTool(tool, usage);

        return new ToolUsageResponseJson
        {
            Id = usage.Id.ToString(),
            ToolId = tool.Id.ToString(),
            ToolName = tool.Name,
            WorkOrderId = usage.WorkOrderId.ToString(),
            TechnicianId = usage.TechnicianId.ToString(),
            WithdrawnAt = usage.WithdrawnAt.ToString("o"),
        };
    }

    private void Validate(WithdrawToolRequestJson request)
    {
        var result = new WithdrawToolValidator().Validate(request);

        if (!result.IsValid)
        {
            var errors = result.Errors.Select(e => e.ErrorMessage).ToList();
            throw new BadRequestException(string.Join("; ", errors));
        }
    }
}
