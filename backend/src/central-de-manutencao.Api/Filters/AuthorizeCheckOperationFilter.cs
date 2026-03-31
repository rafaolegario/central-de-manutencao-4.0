using Microsoft.AspNetCore.Authorization;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace central_de_manutencao.Api.Filters;

public class AuthorizeCheckOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        var hasAuthorize = context.MethodInfo.DeclaringType!
            .GetCustomAttributes(true)
            .OfType<AuthorizeAttribute>()
            .Any()
            || context.MethodInfo
            .GetCustomAttributes(true)
            .OfType<AuthorizeAttribute>()
            .Any();

        if (!hasAuthorize) return;

        // Mark with empty security so the document filter can replace with proper reference
        operation.Security = new List<OpenApiSecurityRequirement> { new OpenApiSecurityRequirement() };
    }
}

public class SecurityDocumentFilter : IDocumentFilter
{
    public void Apply(OpenApiDocument swaggerDoc, DocumentFilterContext context)
    {
        foreach (var path in swaggerDoc.Paths)
        {
            foreach (var operation in path.Value.Operations)
            {
                var op = operation.Value;
                if (op.Security != null && op.Security.Any(s => s.Count == 0))
                {
                    var schemeRef = new OpenApiSecuritySchemeReference("Bearer", swaggerDoc);
                    op.Security = new List<OpenApiSecurityRequirement>
                    {
                        new OpenApiSecurityRequirement
                        {
                            { schemeRef, new List<string>() }
                        }
                    };
                }
            }
        }
    }
}
