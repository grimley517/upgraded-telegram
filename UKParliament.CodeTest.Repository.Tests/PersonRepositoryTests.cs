using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using UKParliament.CodeTest.Application.Application.Interfaces;
using UKParliament.CodeTest.Application.Application.Mappers;
using UKParliament.CodeTest.Data;
using DataDepartment = UKParliament.CodeTest.Data.Department;
using Department = UKParliament.CodeTest.Application.Domain.Department;
using Person = UKParliament.CodeTest.Application.Domain.Person;

namespace UKParliament.CodeTest.Repository.Tests;

public class PersonRepositoryTests
{
    private readonly Mock<ILogger<PersonRepository>> _loggerMock;
    private readonly DbContextOptions<PersonManagerContext> _options;

    public PersonRepositoryTests()
    {
        _loggerMock = new Mock<ILogger<PersonRepository>>();
        _options = new DbContextOptionsBuilder<PersonManagerContext>()
            .UseInMemoryDatabase(databaseName: "TestPersonManager")
            .Options;
    }

    [Fact]
    public void GetAllPersons_ReturnsAllPersons()
    {
        // Arrange
        using var context = GivenContextWith2Users();

        var repository = new PersonRepository(context, _loggerMock.Object);

        // Act
        var result = repository.GetAllPersons();

        // Assert
        Assert.Equal(2, result.Count);
        Assert.Contains(result, p => p.FirstName == "John" && p.LastName == "Doe");
        Assert.Contains(result, p => p.FirstName == "Jane" && p.LastName == "Smith");
    }

    [Fact]
    public void GetPersonWithId_ExistingId_ReturnsPerson()
    {
        // Arrange
        using var context = GivenContextWith2Users();

        var repository = new PersonRepository(context, _loggerMock.Object);

        // Act
        var result = repository.GetPersonWithId(1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal("John", result.FirstName);
        Assert.Equal("Doe", result.LastName);
    }

    [Fact]
    public void GetPersonWithId_NonExistingId_ReturnsNull()
    {
        // Arrange
        using var context = CreateContext();
        var repository = new PersonRepository(context, _loggerMock.Object);

        // Act
        var result = repository.GetPersonWithId(999);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task CreatePerson_ValidPerson_ReturnsId()
    {
        // Arrange
        using var context = GivenContextWith2Users();
        var repository = new PersonRepository(context, _loggerMock.Object);
        var newPerson = new Person
        {
            FirstName = "New",
            LastName = "Person",
            DateOfBirth = DateTime.Now.AddYears(-25),
            Department = TestDataDepartment().Map()
        };

        // Act
        var result = await repository.CreatePerson(newPerson);

        // Assert
        Assert.NotNull(result);
        Assert.True(result > 0);
        var savedPerson = context.People.Find(result);
        Assert.NotNull(savedPerson);
        Assert.Equal("New", savedPerson.FirstName);
        Assert.Equal("Person", savedPerson.LastName);
    }

    [Fact]
    public async Task UpdatePerson_NonExistingPerson_ThrowsException()
    {
        // Arrange
        using var context = CreateContext();
        var repository = new PersonRepository(context, _loggerMock.Object);
        var dataDepartment = TestDataDepartment();
        var nonExistingPerson = new Person
        {
            Id = 999,
            FirstName = "Non",
            LastName = "Existing",
            DateOfBirth = DateTime.Now.AddYears(-25),
            Department = dataDepartment.Map()
        };

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(
            () => repository.UpdatePerson(nonExistingPerson)
        );
        _loggerMock.Verify(
            x =>
                x.Log(
                    LogLevel.Warning,
                    It.IsAny<EventId>(),
                    It.Is<It.IsAnyType>((v, t) => true),
                    It.IsAny<InvalidOperationException>(),
                    It.Is<Func<It.IsAnyType, Exception?, string>>((v, t) => true)
                ),
            Times.Once
        );
    }

    private PersonManagerContext CreateContext()
    {
        var context = new PersonManagerContext(_options);
        context.Database.EnsureDeleted();
        context.Database.EnsureCreated();
        return context;
    }

    private PersonManagerContext GivenContextWith2Users()
    {
        PersonManagerContext? context = null;
        try
        {
            context = CreateContext();
            var department = TestDataDepartment();
            context.Departments.Add(department);
            context.People.AddRange(
                new Data.Person
                {
                    Id = 1,
                    FirstName = "John",
                    LastName = "Doe",
                    DateOfBirth = DateTime.Now.AddYears(-30),
                    Department = department
                },
                new Data.Person
                {
                    Id = 2,
                    FirstName = "Jane",
                    LastName = "Smith",
                    DateOfBirth = DateTime.Now.AddYears(-25),
                    Department = department
                }
            );
            context.SaveChanges();
            return context;
        }
        catch
        {
            context?.Dispose();
            throw;
        }
    }

    private static DataDepartment TestDataDepartment()
    {
        return new DataDepartment { Id = 11, Name = "Test Department" };
    }
}
