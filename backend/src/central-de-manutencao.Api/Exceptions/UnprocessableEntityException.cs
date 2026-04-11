namespace central_de_manutencao.Api.Exceptions.ExceptionsBase;

public class UnprocessableEntityException : CentralDeManutencaoException
{
    private readonly List<string> _errors;

    public UnprocessableEntityException(string message) : base(message)
    {
        _errors = [message];
    }

    public UnprocessableEntityException(List<string> errors) : base(string.Join("; ", errors))
    {
        _errors = errors;
    }

    public override int StatusCode => 422;

    public override List<string> GetErrors()
    {
        return _errors;
    }
}
