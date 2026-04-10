using System.Collections.Concurrent;

namespace central_de_manutencao.Api.Token
{
    public class InMemoryTokenBlacklist : ITokenBlacklist
    {
        private readonly ConcurrentDictionary<string, DateTime> _blacklistedTokens = new();

        public void Blacklist(string token, DateTime expiration)
        {
            _blacklistedTokens[token] = expiration;
            CleanupExpired();
        }

        public bool IsBlacklisted(string token)
        {
            return _blacklistedTokens.ContainsKey(token);
        }

        private void CleanupExpired()
        {
            var now = DateTime.UtcNow;
            foreach (var kvp in _blacklistedTokens)
            {
                if (kvp.Value < now)
                    _blacklistedTokens.TryRemove(kvp.Key, out _);
            }
        }
    }
}
