using Microsoft.EntityFrameworkCore;

namespace UKParliament.CodeTest.Data;

public class PersonManagerContext : DbContext
{
    public PersonManagerContext(DbContextOptions<PersonManagerContext> options)
        : base(options) { }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.Entity<Department>().HasKey(d => d.Id);
        modelBuilder.Entity<Person>().HasKey(p => p.Id);
        modelBuilder
            .Entity<Person>()
            .HasOne(p => p.Department)
            .WithMany(d => d.People)
            .HasForeignKey(p => p.DepartmentId);
        modelBuilder
            .Entity<Department>()
            .HasData(
                new Department { Id = 1, Name = "Sales" },
                new Department { Id = 2, Name = "Marketing" },
                new Department { Id = 3, Name = "Finance" },
                new Department { Id = 4, Name = "HR" }
            );
        modelBuilder
            .Entity<Person>()
            .HasData(
                new Person
                {
                    Id = 20,
                    FirstName = "Harry",
                    LastName = "Potter",
                    DateOfBirth = new DateTime(2000, 1, 1),
                    DepartmentId = 4
                },
                new Person
                {
                    Id = 21,
                    FirstName = "Hermione",
                    LastName = "Granger",
                    DateOfBirth = new DateTime(2000, 1, 1),
                    DepartmentId = 4
                },
                new Person
                {
                    Id = 23,
                    FirstName = "Ronald",
                    LastName = "Weasley",
                    DateOfBirth = new DateTime(2000, 1, 1),
                    DepartmentId = 4
                }
            );
    }

    public DbSet<Person> People { get; set; }

    public DbSet<Department> Departments { get; set; }
}
