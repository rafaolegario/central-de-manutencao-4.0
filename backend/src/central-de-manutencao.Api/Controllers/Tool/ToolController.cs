using central_de_manutencao.Api.Services.Tool;
using central_de_manutencao.Communication.Requests.Tool;
using central_de_manutencao.Communication.Responses;
using central_de_manutencao.Communication.Responses.Tool;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace central_de_manutencao.Api.Controllers.Tool;

[Route("api/tools")]
[ApiController]
[Authorize]
public class ToolController : ControllerBase
{
    [HttpGet]
    [Authorize(Roles = "Admin,Technician")]
    [ProducesResponseType(typeof(List<ToolResponseJson>), StatusCodes.Status200OK)]
    public async Task<IActionResult> List(
        [FromServices] ListToolsService useCase,
        [FromQuery] bool? available)
    {
        var response = await useCase.Execute(available);
        return Ok(response);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ToolResponseJson), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create(
        [FromServices] CreateToolService useCase,
        [FromBody] CreateToolRequestJson request)
    {
        var response = await useCase.Execute(request);
        return Ok(response);
    }

    [HttpGet("{id:guid}")]
    [Authorize(Roles = "Admin,Technician")]
    [ProducesResponseType(typeof(ToolResponseJson), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(
        [FromServices] GetToolService useCase,
        [FromRoute] Guid id)
    {
        var response = await useCase.Execute(id);
        return Ok(response);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ToolResponseJson), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Edit(
        [FromServices] EditToolService useCase,
        [FromRoute] Guid id,
        [FromBody] EditToolRequestJson request)
    {
        var response = await useCase.Execute(id, request);
        return Ok(response);
    }

    [HttpPost("{id:guid}/withdraw")]
    [Authorize(Roles = "Technician")]
    [ProducesResponseType(typeof(ToolUsageResponseJson), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> Withdraw(
        [FromServices] WithdrawToolService useCase,
        [FromRoute] Guid id,
        [FromBody] WithdrawToolRequestJson request)
    {
        var response = await useCase.Execute(id, request, User);
        return Ok(response);
    }

    [HttpPost("usage/{usageId:guid}/return")]
    [Authorize(Roles = "Technician")]
    [ProducesResponseType(typeof(ToolUsageResponseJson), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Return(
        [FromServices] ReturnToolService useCase,
        [FromRoute] Guid usageId)
    {
        var response = await useCase.Execute(usageId, User);
        return Ok(response);
    }

    [HttpGet("usage/active")]
    [Authorize(Roles = "Admin")]
    [ProducesResponseType(typeof(ActiveToolUsageListResponseJson), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListActiveUsages(
        [FromServices] ListActiveToolUsagesService useCase)
    {
        var response = await useCase.Execute();
        return Ok(response);
    }
}
