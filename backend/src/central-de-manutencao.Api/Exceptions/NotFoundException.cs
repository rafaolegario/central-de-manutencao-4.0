using System.Net;

namespace central_de_manutencao.Api.Exceptions.ExceptionsBase;
public class NotFoundException : CentralDeManutencaoException
{
    public NotFoundException(string message) : base(message)
    {
    }

    public override int StatusCode => (int)HttpStatusCode.NotFound;

    public override List<string> GetErrors()
    {
        return [Message];
    }
}
