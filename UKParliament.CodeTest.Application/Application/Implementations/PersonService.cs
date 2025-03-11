using FluentValidation;
using UKParliament.CodeTest.Application.Domain;

namespace UKParliament.CodeTest.Application.Application.Interfaces;

public class PersonService : IPersonService
{
    private readonly IPersonRepository _repository;
    private readonly IValidator<Person> _personValidator;

    public PersonService(IPersonRepository repository, IValidator<Person> personValidator)
    {
        _repository = repository;
        _personValidator = personValidator;
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
        _personValidator.Validate(person);
        throw new NotImplementedException();
    }

    public async Task<int> CreatePerson(Person person)
    {
        _personValidator.Validate(person);
        throw new NotImplementedException();
    }
}
