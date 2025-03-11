using Microsoft.EntityFrameworkCore;
using UKParliament.CodeTest.Application.Application;
using UKParliament.CodeTest.Application.Application.Interfaces;
using UKParliament.CodeTest.Data;

namespace UKParliament.CodeTest.Web;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);
        var services = builder.Services;
        //todo: add swagger
        // Add services to the container.

        services.AddControllersWithViews();
        services.AddDbContext<PersonManagerContext>(op => op.UseInMemoryDatabase("PersonManager"));
        services.AddEndpointsApiExplorer();
        services.AddPersonRepository();
        services.AddApplicationServices();

        var app = builder.Build();

        // Create database so the data seeds
        using (
            var serviceScope = app.Services.GetRequiredService<IServiceScopeFactory>().CreateScope()
        )
        {
            using var context =
                serviceScope.ServiceProvider.GetRequiredService<PersonManagerContext>();
            context.Database.EnsureCreated();
        }

        // Configure the HTTP request pipeline.
        if (!app.Environment.IsDevelopment())
        {
            // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            app.UseHsts();
        }
        else { }

        app.UseHttpsRedirection();
        app.UseStaticFiles();
        app.UseRouting();
        app.MapControllerRoute(name: "default", pattern: "{controller}/{action=Index}/{id?}");

        app.MapFallbackToFile("index.html");

        app.Run();
    }
}
