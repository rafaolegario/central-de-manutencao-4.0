
using Microsoft.IdentityModel.Tokens;
using central_de_manutencao.Api.Models.Users;
using System.Security.Claims;
using System.Text;
using System.IdentityModel.Tokens.Jwt;

namespace central_de_manutencao.Api.Token;
internal class JwtTokenGenerator : IAccessTokenGenerator
{
    private readonly uint _expirationTimeMinutes;
    private readonly string _signingKey;

    public JwtTokenGenerator(uint expirationTimeMinutes, string signingKey)
    {
        _expirationTimeMinutes = expirationTimeMinutes;
        _signingKey = signingKey;
    }

    public int ExpiresInSeconds => (int)(_expirationTimeMinutes * 60);

    public string Generate(User user)
    {
        var claims = new List<Claim>()
        {
            new(ClaimTypes.Name, user.Name),
            new(ClaimTypes.Sid, user.Id.ToString()),
            new(ClaimTypes.Role, user.Role.ToString())
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Expires = DateTime.UtcNow.AddMinutes(_expirationTimeMinutes),
            SigningCredentials = new SigningCredentials(SecurityKey(), SecurityAlgorithms.HmacSha256Signature),
            Subject = new ClaimsIdentity(claims)
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        
        var securityToken = tokenHandler.CreateToken(tokenDescriptor);

        return tokenHandler.WriteToken(securityToken);
    }

    private SymmetricSecurityKey SecurityKey()
    {
        var key = Encoding.UTF8.GetBytes(_signingKey);

        return new SymmetricSecurityKey(key);
    }
}