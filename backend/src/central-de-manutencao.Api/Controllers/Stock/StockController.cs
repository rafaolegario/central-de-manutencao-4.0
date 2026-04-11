using central_de_manutencao.Api.Services.Stock;
using central_de_manutencao.Communication.Requests.Stock;
using central_de_manutencao.Communication.Responses;
using central_de_manutencao.Communication.Responses.Stock;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace central_de_manutencao.Api.Controllers.Stock;

[Route("api/stock")]
[ApiController]
[Authorize(Roles = "Admin")]
public class StockController : ControllerBase
{
    [HttpGet]
    [ProducesResponseType(typeof(List<StockItemResponseJson>), StatusCodes.Status200OK)]
    public async Task<IActionResult> List(
        [FromServices] ListStockItemsService useCase,
        [FromQuery] bool? lowStock)
    {
        var response = await useCase.Execute(lowStock);
        return Ok(response);
    }

    [HttpPost]
    [ProducesResponseType(typeof(StockItemResponseJson), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(
        [FromServices] CreateStockItemService useCase,
        [FromBody] CreateStockItemRequestJson request)
    {
        var response = await useCase.Execute(request);
        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    [ProducesResponseType(typeof(StockItemResponseJson), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(
        [FromServices] GetStockItemService useCase,
        [FromRoute] Guid id)
    {
        var response = await useCase.Execute(id);
        return Ok(response);
    }

    [HttpPut("{id:guid}")]
    [ProducesResponseType(typeof(StockItemResponseJson), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Edit(
        [FromServices] EditStockItemService useCase,
        [FromRoute] Guid id,
        [FromBody] EditStockItemRequestJson request)
    {
        var response = await useCase.Execute(id, request);
        return Ok(response);
    }

    [HttpPost("{id:guid}/replenish")]
    [ProducesResponseType(typeof(StockItemResponseJson), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Replenish(
        [FromServices] ReplenishStockService useCase,
        [FromRoute] Guid id,
        [FromBody] ReplenishStockRequestJson request)
    {
        var response = await useCase.Execute(id, request);
        return Ok(response);
    }

    [HttpGet("{id:guid}/movements")]
    [ProducesResponseType(typeof(StockMovementListResponseJson), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ListMovements(
        [FromServices] ListStockMovementsService useCase,
        [FromRoute] Guid id,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20)
    {
        var response = await useCase.Execute(id, page, pageSize);
        return Ok(response);
    }
}
