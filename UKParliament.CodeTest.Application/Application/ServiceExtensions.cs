using Microsoft.Extensions.DependencyInjection;
using UKParliament.CodeTest.Application.Application.Interfaces;

namespace UKParliament.CodeTest.Application.Application;

public static class ServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IPersonRepository, PersonRepository>();
        services.AddScoped<IPersonService, PersonService>();
        return services;
    }
}
