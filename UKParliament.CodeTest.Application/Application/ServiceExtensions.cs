using FluentValidation;
using Microsoft.Extensions.DependencyInjection;
using UKParliament.CodeTest.Application.Application.Interfaces;
using UKParliament.CodeTest.Application.Application.Validators;

namespace UKParliament.CodeTest.Application.Application;

public static class ServiceExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IPersonService, PersonService>();
        services.AddValidatorsFromAssemblyContaining<PersonValidator>();
        return services;
    }
}
