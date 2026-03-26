using central_de_manutencao.Api.Services.Auth;
using central_de_manutencao.Communication.Requests.Auth;
using central_de_manutencao.Communication.Responses;
using central_de_manutencao.Communication.Responses.Auth;
using Microsoft.AspNetCore.Mvc;

namespace central_de_manutencao.Api.Controllers.Auth;

[Route("api/[controller]")]
[ApiController]
public class AuthenticateController : ControllerBase
{
    [HttpPost("login")]
    [ProducesResponseType(typeof(AuthenticateResponseJson), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Login(
        [FromServices] AuthenticateService useCase,
        [FromBody] AuthenticateRequestJson request)
    {
        var response = await useCase.Execute(request);

        return Ok(response);
    }
}