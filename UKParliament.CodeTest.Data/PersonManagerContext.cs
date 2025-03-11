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
    }

    public DbSet<Person> People { get; set; }

    public DbSet<Department> Departments { get; set; }
}
