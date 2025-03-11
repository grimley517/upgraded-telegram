namespace UKParliament.CodeTest.Data;

public class Person
{
    public int Id { get; set; }

    public string FirstName { get; set; }

    public string LastName { get; set; }
    public DateTime DateOfBirth { get; set; }

    public virtual Department Department { get; set; }
    public int DepartmentId { get; set; }
}
