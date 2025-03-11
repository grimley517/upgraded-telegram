using UKParliament.CodeTest.Application.Domain;

namespace UKParliament.CodeTest.Web.ViewModels;

public class PersonViewModel : HyperMediaViewModel
{
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Department { get; set; }
    public int DepartmentId { get; set; }
    public DateTime DateOfBirth { get; set; }
    public int Id { get; set; }

    public Person ToDomainPerson()
    {
        return new Person
        {
            Id = Id,
            DateOfBirth = DateOfBirth,
            FirstName = FirstName,
            LastName = LastName,
            Department = new Department { Id = DepartmentId, Name = Department }
        };
    }

    public static PersonViewModel ToVieModel(Person person)
    {
        return new PersonViewModel
        {
            Id = person.Id,
            FirstName = person.FirstName,
            DateOfBirth = person.DateOfBirth,
            LastName = person.LastName,
            Department = person.Department.Name,
            DepartmentId = person.Department.Id
        };
    }
}
