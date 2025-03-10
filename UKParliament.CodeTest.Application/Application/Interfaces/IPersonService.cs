using UKParliament.CodeTest.Application.Domain;

namespace UKParliament.CodeTest.Application.Application.Interfaces;

public interface IPersonService
{
    List<Person> GetAllPersons();
    Person GetPersonWithId(int id);
    Task<int> UpdatePerson(Person person);
    Task<int> CreatePerson(Person person);
}
