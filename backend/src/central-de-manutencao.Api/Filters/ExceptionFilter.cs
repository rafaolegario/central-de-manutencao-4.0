using central_de_manutencao.Communication.Responses;
using central_de_manutencao.Api.Exceptions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace central_de_manutencao.Api.Filters;

public class ExceptionFilter : IExceptionFilter
{
    public void OnException(ExceptionContext context)
    {
        if(context.Exception is CentralDeManutencaoException)
        {
            HandleProjectException(context);
        }
        else
        {
            ThrowUnkowError(context);
        }
    }

    private void HandleProjectException(ExceptionContext context)
    {
        var centralDeManutencaoException = (CentralDeManutencaoException)context.Exception;
        var errorResponse = new ResponseErrorJson(centralDeManutencaoException.GetErrors());

        context.HttpContext.Response.StatusCode = centralDeManutencaoException.StatusCode;
        context.Result = new ObjectResult(errorResponse);
    }

    private void ThrowUnkowError(ExceptionContext context)
    {
        var errorResponse = new ResponseErrorJson("Erro desconhecido.");

        context.HttpContext.Response.StatusCode = StatusCodes.Status500InternalServerError;
        context.Result = new ObjectResult(errorResponse);
    }
}
