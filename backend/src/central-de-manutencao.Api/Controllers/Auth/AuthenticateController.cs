using central_de_manutencao.Api.Services.Auth;
using central_de_manutencao.Communication.Requests.Auth;
using central_de_manutencao.Communication.Responses;
using central_de_manutencao.Communication.Responses.Auth;
using Microsoft.AspNetCore.Authorization;
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

    [AllowAnonymous]
    [HttpPost("check-email")]
    [ProducesResponseType(typeof(CheckEmailResponseJson), StatusCodes.Status200OK)]
    public async Task<IActionResult> CheckEmail(
        [FromServices] CheckEmailService useCase,
        [FromBody] CheckEmailRequestJson request)
    {
        var response = await useCase.Execute(request);
        return Ok(response);
    }

    [AllowAnonymous]
    [HttpPost("set-password")]
    [ProducesResponseType(typeof(AuthenticateResponseJson), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> SetPassword(
        [FromServices] SetFirstPasswordService useCase,
        [FromBody] SetFirstPasswordRequestJson request)
    {
        var response = await useCase.Execute(request);
        return Ok(response);
    }

    [AllowAnonymous]
    [HttpPost("register-first-admin")]
    [ProducesResponseType(typeof(AuthenticateResponseJson), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status409Conflict)]
    public async Task<IActionResult> RegisterFirstAdmin(
        [FromServices] RegisterFirstAdminService useCase,
        [FromBody] RegisterFirstAdminRequestJson request)
    {
        var response = await useCase.Execute(request);
        return Ok(response);
    }

    [Authorize]
    [HttpPost("refresh")]
    [ProducesResponseType(typeof(RefreshTokenResponseJson), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> Refresh(
        [FromServices] RefreshTokenService useCase)
    {
        var response = await useCase.Execute(User);

        return Ok(response);
    }

    [Authorize]
    [HttpPost("logout")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status401Unauthorized)]
    public IActionResult Logout(
        [FromServices] LogoutService useCase)
    {
        useCase.Execute();

        return Ok(new { message = "Logout realizado com sucesso." });
    }
}