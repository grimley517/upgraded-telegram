namespace UKParliament.CodeTest.Data;

public class Department
{
    public int Id { get; set; }

    public string Name { get; set; }
    public IList<Person> People { get; set; }
}
