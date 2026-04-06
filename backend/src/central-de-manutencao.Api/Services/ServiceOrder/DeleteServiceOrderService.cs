using central_de_manutencao.Api.Database.Repositories.ServiceOrders;
using central_de_manutencao.Api.Enums;
using central_de_manutencao.Api.Exceptions.ExceptionsBase;

namespace central_de_manutencao.Api.Services.ServiceOrder;

public class DeleteServiceOrderService
{
    private readonly IServiceOrderRepository _serviceOrderRepository;

    public DeleteServiceOrderService(IServiceOrderRepository serviceOrderRepository)
    {
        _serviceOrderRepository = serviceOrderRepository;
    }

    public async Task Execute(Guid id)
    {
        var order = await _serviceOrderRepository.GetById(id);

        if (order is null)
            throw new NotFoundException("Ordem de serviço não encontrada.");

        if (order.Status == ServiceOrderStatus.Completed || order.Status == ServiceOrderStatus.Approved)
            throw new BadRequestException("Não é possível excluir uma ordem de serviço com status Concluída ou Aprovada.");

        order.IsDeleted = true;
        order.UpdatedAt = DateTime.UtcNow;

        await _serviceOrderRepository.Update(order);
    }
}
