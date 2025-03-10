using Person = UKParliament.CodeTest.Application.Domain.Person;

namespace UKParliament.CodeTest.Application.Application.Interfaces;

public interface IPersonRepository
{
    List<Person> GetAllPersons();
    Person? GetPersonWithId(int id);
    Task<int?> UpdatePerson(Person person);
    Task<int?> CreatePerson(Person person);
}