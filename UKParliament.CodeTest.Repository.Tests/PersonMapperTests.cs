using UKParliament.CodeTest.Application.Application.Mappers;
using DataDepartment = UKParliament.CodeTest.Data.Department;
using DataPerson = UKParliament.CodeTest.Data.Person;
using Department = UKParliament.CodeTest.Application.Domain.Department;
using Person = UKParliament.CodeTest.Application.Domain.Person;

namespace UKParliament.CodeTest.Application.Tests;

public class PersonMapperTests
{
    [Fact]
    public void Person_CreatesExpected_DataPerson()
    {
        var person = Given_ADomainPerson();
        var result = person.MapPersonToData();
        var expected = MatchingDataPerson();
        Assert.Equivalent(expected, result);
    }

    [Fact]
    public void DataPerson_CreatesExpected_Person()
    {
        var person = MatchingDataPerson();
        var result = person.Map();
        var expected = Given_ADomainPerson();
        Assert.Equivalent(expected, result);
    }

    private Person Given_ADomainPerson()
    {
        return new Person
        {
            DateOfBirth = new DateTime(2000, 1, 1),
            FirstName = "Joe",
            LastName = "Bloggs",
            Department = new Department { Name = "IT", Id = 0 }
        };
    }

    private DataPerson MatchingDataPerson()
    {
        return new DataPerson
        {
            Department = new DataDepartment { Name = "IT", Id = 0 },
            DateOfBirth = new DateTime(2000, 1, 1),
            FirstName = "Joe",
            LastName = "Bloggs",
        };
    }
}
