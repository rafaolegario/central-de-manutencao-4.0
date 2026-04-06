using System.Net;

namespace central_de_manutencao.Api.Exceptions.ExceptionsBase;
public class BadRequestException : CentralDeManutencaoException
{
    public BadRequestException(string message) : base(message)
    {
    }

    public override int StatusCode => (int)HttpStatusCode.BadRequest;

    public override List<string> GetErrors()
    {
        return [Message];
    }
}
