using central_de_manutencao.Api.Services.User;
using central_de_manutencao.Communication.Requests.User;
using central_de_manutencao.Communication.Responses;
using central_de_manutencao.Communication.Responses.User;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace central_de_manutencao.Api.Controllers.User;

[Route("api/[controller]")]
[ApiController]
[Authorize]
public class UserController : ControllerBase
{
  [Authorize(Roles = "Admin")]
  [HttpPost("create")]
  [ProducesResponseType(typeof(CreateUserResponseJson), StatusCodes.Status200OK)]
  [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status400BadRequest)]
  public async Task<IActionResult> Create(
      [FromServices] CreateUserService useCase,
      [FromBody] CreateUserRequestJson request)
  {
    var response = await useCase.Execute(request);
    return Ok(response);
  }

  [Authorize(Roles = "Admin")]
  [HttpPut("{id:guid}")]
  [ProducesResponseType(typeof(UserResponseJson), StatusCodes.Status200OK)]
  [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status404NotFound)]
  public async Task<IActionResult> Edit(
      [FromServices] EditUserService useCase,
      [FromRoute] Guid id,
      [FromBody] EditUserRequestJson request)
  {
    var response = await useCase.Execute(id, request);
    return Ok(response);
  }

  [Authorize(Roles = "Admin")]
  [HttpDelete("{id:guid}")]
  [ProducesResponseType(StatusCodes.Status204NoContent)]
  [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status404NotFound)]
  public async Task<IActionResult> Delete(
      [FromServices] DeleteUserService useCase,
      [FromRoute] Guid id)
  {
    await useCase.Execute(id);
    return NoContent();
  }

  [Authorize(Roles = "Admin")]
  [HttpGet]
  [ProducesResponseType(typeof(List<UserResponseJson>), StatusCodes.Status200OK)]
  public async Task<IActionResult> List(
      [FromServices] ListUsersService useCase,
      [FromQuery] string? specialty,
      [FromQuery] bool? active)
  {
    var response = await useCase.Execute(specialty, active);
    return Ok(response);
  }

  [HttpGet("{id:guid}")]
  [ProducesResponseType(typeof(UserResponseJson), StatusCodes.Status200OK)]
  [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status404NotFound)]
  [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status403Forbidden)]
  public async Task<IActionResult> GetById(
      [FromServices] GetUserService useCase,
      [FromRoute] Guid id)
  {
    var response = await useCase.Execute(id, User);
    return Ok(response);
  }
}