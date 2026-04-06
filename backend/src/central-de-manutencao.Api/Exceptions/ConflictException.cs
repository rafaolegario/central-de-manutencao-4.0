using System.Net;

namespace central_de_manutencao.Api.Exceptions.ExceptionsBase;
public class ConflictException : CentralDeManutencaoException
{
    public ConflictException(string message) : base(message)
    {
    }

    public override int StatusCode => (int)HttpStatusCode.Conflict;

    public override List<string> GetErrors()
    {
        return [Message];
    }
}
