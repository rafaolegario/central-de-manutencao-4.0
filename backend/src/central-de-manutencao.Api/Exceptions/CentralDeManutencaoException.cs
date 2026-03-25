namespace central_de_manutencao.Api.Exceptions;
public abstract class CentralDeManutencaoException : SystemException
{
    protected CentralDeManutencaoException(string message) : base(message)
    {
        
    }

    public abstract int StatusCode { get; }
    public abstract List<string> GetErrors();
}
