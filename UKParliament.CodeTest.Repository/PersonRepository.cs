using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using UKParliament.CodeTest.Application.Application.Mappers;
using UKParliament.CodeTest.Data;
using Person = UKParliament.CodeTest.Application.Domain.Person;

namespace UKParliament.CodeTest.Application.Application.Interfaces;

public class PersonRepository : IPersonRepository
{
    private readonly PersonManagerContext _context;
    private readonly ILogger<PersonRepository> _logger;

    public PersonRepository(PersonManagerContext context, ILogger<PersonRepository> logger)
    {
        _context = context;
        _logger = logger;
    }

    public List<Person> GetAllPersons()
    {
        var result = _context.People.Include(person => person.Department).AsNoTracking();
        //Todo: consider pagination
        return result.Select(dataPerson => dataPerson.Map()).ToList();
    }

    public Person? GetPersonWithId(int id)
    {
        var dataPerson = _context
            .People.Where(p => p.Id == id)
            .Include(p => p.Department)
            .AsNoTracking();
        return dataPerson.SingleOrDefault()?.Map();
    }

    public async Task<int?> UpdatePerson(Person person)
    {
        try
        {
            var dataPerson = await _context.People.SingleAsync(p => p.Id == person.Id);
            var updatePerson = person.MapPersonToData();
            dataPerson = updatePerson;
            await _context.SaveChangesAsync();
            return dataPerson.Id;
        }
        catch (InvalidOperationException ioe)
        {
            _logger.LogWarning(ioe, "Tried to update someone who wasn't there");
            throw;
        }
        catch (ArgumentNullException ane)
        {
            _logger.LogWarning(ane, "Tried to update someone without supplying an ID");
            throw;
        }
    }

    public async Task<int?> CreatePerson(Person person)
    {
        var dataPerson = person.MapPersonToData();
        var dataDepartment = _context.Departments.Single(x => x.Id == dataPerson.DepartmentId);
        dataPerson.Department = dataDepartment;
        await _context.People.AddAsync(dataPerson);
        await _context.SaveChangesAsync();
        return dataPerson.Id;
    }
}
