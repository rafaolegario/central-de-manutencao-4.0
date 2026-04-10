namespace central_de_manutencao.Api.Token
{
    public interface ITokenBlacklist
    {
        void Blacklist(string token, DateTime expiration);
        bool IsBlacklisted(string token);
    }
}
