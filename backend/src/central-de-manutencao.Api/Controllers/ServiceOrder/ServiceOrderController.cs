using central_de_manutencao.Api.Services.ServiceOrder;
using central_de_manutencao.Communication.Requests.ServiceOrder;
using central_de_manutencao.Communication.Responses;
using central_de_manutencao.Communication.Responses.ServiceOrder;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace central_de_manutencao.Api.Controllers.ServiceOrder;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class ServiceOrderController : ControllerBase
{
    [Authorize(Roles = "Admin")]
    [HttpPost]
    [ProducesResponseType(typeof(CreateServiceOrderResponseJson), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(
        [FromServices] CreateServiceOrderService useCase,
        [FromBody] CreateServiceOrderRequestJson request)
    {
        var response = await useCase.Execute(request, User);
        return Ok(response);
    }

    [Authorize(Roles = "Admin")]
    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(ServiceOrderResponseJson), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Edit(
        [FromServices] EditServiceOrderService useCase,
        [FromRoute] Guid id,
        [FromBody] EditServiceOrderRequestJson request)
    {
        var response = await useCase.Execute(id, request, User);
        return Ok(response);
    }

    [Authorize(Roles = "Admin")]
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(
        [FromServices] DeleteServiceOrderService useCase,
        [FromRoute] Guid id)
    {
        await useCase.Execute(id);
        return NoContent();
    }

    [HttpGet]
    [ProducesResponseType(typeof(ServiceOrderListResponseJson), StatusCodes.Status200OK)]
    public async Task<IActionResult> List(
        [FromServices] ListServiceOrdersService useCase,
        [FromQuery] string? status,
        [FromQuery] string? priority,
        [FromQuery] string? technicianId,
        [FromQuery] string? createdAtFrom,
        [FromQuery] string? createdAtTo,
        [FromQuery] string? orderBy,
        [FromQuery] string? orderDirection,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var response = await useCase.Execute(
            status, priority, technicianId,
            createdAtFrom, createdAtTo,
            orderBy, orderDirection,
            page, pageSize, User);
        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(ServiceOrderResponseJson), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetById(
        [FromServices] GetServiceOrderService useCase,
        [FromRoute] Guid id)
    {
        var response = await useCase.Execute(id, User);
        return Ok(response);
    }

    [HttpPatch("{id:guid}/status")]
    [ProducesResponseType(typeof(ServiceOrderResponseJson), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> UpdateStatus(
        [FromServices] UpdateServiceOrderStatusService useCase,
        [FromRoute] Guid id,
        [FromBody] UpdateServiceOrderStatusRequestJson request)
    {
        var response = await useCase.Execute(id, request, User);
        return Ok(response);
    }
}
