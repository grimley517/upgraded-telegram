using UKParliament.CodeTest.Application.Domain;

namespace UKParliament.CodeTest.Application.Tests;

public static class TestHelpers
{
    public static Department CreateDataDepartment()
    {
        return new Department { Id = 1, Name = "IT" };
    }

    public static Person CreateExamplePerson(string firstName, int id)
    {
        return new Person
        {
            Id = id,
            DateOfBirth = new DateTime(2000, 1, 1),
            Department = TestHelpers.CreateDataDepartment(),
            FirstName = firstName,
            LastName = "Bloggs"
        };
    }

    public static List<Person> ExampleListOfPeople()
    {
        return new List<Person>
        {
            TestHelpers.CreateExamplePerson("Jane", 1),
            TestHelpers.CreateExamplePerson("Joe", 2)
        };
    }
}
