using central_de_manutencao.Api.Models.Users;

namespace central_de_manutencao.Api.Token
{
  public interface IAccessTokenGenerator
  {
    string Generate(User user);
  }
}