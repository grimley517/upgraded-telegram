namespace UKParliament.CodeTest.Application.Domain;

public class Person : DomainBase
{
    public required string FirstName { get; init; }
    public required string LastName { get; init; }
    public required DateTime DateOfBirth { get; init; }
    public required Department Department { get; init; }
}
