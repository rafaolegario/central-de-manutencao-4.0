namespace central_de_manutencao.Api.Token
{
  public class HttpContextTokenValue : ITokenProvider
  {
    private readonly IHttpContextAccessor _httpContextAccessor;

    public HttpContextTokenValue(IHttpContextAccessor httpContextAccessor)
    {
      _httpContextAccessor = httpContextAccessor;
    }

    public string TokenOnRequest()
    {
      var authorizationHeader = _httpContextAccessor.HttpContext?.Request.Headers["Authorization"].FirstOrDefault();

      if (authorizationHeader != null && authorizationHeader.StartsWith("Bearer "))
      {
        return authorizationHeader.Substring("Bearer ".Length).Trim();
      }

      return string.Empty;
    }
  }
}