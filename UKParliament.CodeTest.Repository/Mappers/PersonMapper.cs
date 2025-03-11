using DataPerson = UKParliament.CodeTest.Data.Person;
using Person = UKParliament.CodeTest.Application.Domain.Person;

namespace UKParliament.CodeTest.Application.Application.Mappers;

/// <summary>
///
/// A mapper for different representations of person.
///
/// <remarks>
/// Manual mapping is more performant than other methods, Hopwever; generally auto mapper speeds up dev time
/// </remarks>
/// </summary>
public static class PersonMapper
{
    public static DataPerson MapPersonToData(this Person person)
    {
        return new DataPerson
        {
            FirstName = person.FirstName,
            LastName = person.LastName,
            DateOfBirth = person.DateOfBirth,
            Id = person.Id,
            Department = person.Department.MapToData(),
            DepartmentId = person.Department.MapToData().Id
        };
    }

    public static Person Map(this DataPerson person)
    {
        return new Person
        {
            FirstName = person.FirstName,
            LastName = person.LastName,
            DateOfBirth = person.DateOfBirth,
            Department = person.Department.Map(),
        };
    }
}
