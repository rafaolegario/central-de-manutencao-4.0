using System.Net;

namespace central_de_manutencao.Api.Exceptions.ExceptionsBase;

public class ForbiddenException : CentralDeManutencaoException
{
    public ForbiddenException(string message) : base(message)
    {
    }

    public override int StatusCode => (int)HttpStatusCode.Forbidden;

    public override List<string> GetErrors()
    {
        return [Message];
    }
}
