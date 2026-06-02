using central_de_manutencao.Api.Services.Onboarding;
using central_de_manutencao.Communication.Responses;
using central_de_manutencao.Communication.Responses.Onboarding;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace central_de_manutencao.Api.Controllers.Onboarding;

[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = "Admin")]
public class OnboardingController : ControllerBase
{
    [HttpGet("status")]
    [ProducesResponseType(typeof(OnboardingStatusResponseJson), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ResponseErrorJson), StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetStatus(
        [FromServices] GetOnboardingStatusService useCase)
    {
        var response = await useCase.Execute();
        return Ok(response);
    }
}
