using UKParliament.CodeTest.Application.Domain;

namespace UKParliament.CodeTest.Application.Application.Interfaces;

public class PersonService : IPersonService
{
    private readonly IPersonRepository _repository;

    public PersonService(IPersonRepository repository)
    {
        _repository = repository;
    }

    public List<Person> GetAllPersons()
    {
        return _repository.GetAllPersons();
    }

    public Person GetPersonWithId(int id)
    {
        return _repository.GetPersonWithId(id);
    }

    public async Task<int> UpdatePerson(Person person)
    {
        throw new NotImplementedException();
    }

    public async Task<int> CreatePerson(Person person)
    {
        throw new NotImplementedException();
    }
}