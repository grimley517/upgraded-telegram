using Microsoft.Extensions.DependencyInjection;

namespace UKParliament.CodeTest.Application.Application.Interfaces;

public static class ServiceExtensions
{
    public static IServiceCollection AddPersonRepository(this IServiceCollection services)
    {
        services.AddScoped<IPersonRepository, PersonRepository>();
        return services;
    }
}
