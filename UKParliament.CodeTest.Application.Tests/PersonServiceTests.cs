using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Moq;
using UKParliament.CodeTest.Application.Application.Interfaces;
using UKParliament.CodeTest.Data;
using Person = UKParliament.CodeTest.Application.Domain.Person;

namespace UKParliament.CodeTest.Application.Tests;

public class PersonServiceTests
{
    private IPersonService serviceUnderTest;
    private Mock<IPersonRepository> mRepository;

    public PersonServiceTests()
    {
        mRepository = new Mock<IPersonRepository>();
        serviceUnderTest = new PersonService(mRepository.Object);
    }

    [Fact]
    public void Can_FetchAllFromContext_GetList()
    {
        var testlist = TestHelpers.ExampleListOfPeople();
        mRepository.Reset();
        mRepository.Setup(x => x.GetAllPersons()).Returns(testlist);
        var result = serviceUnderTest.GetAllPersons();
        Assert.NotNull(result);
        Assert.Equivalent(result, testlist);
    }

    [Fact]
    public void CanFetch_SinglePerson_FromList()
    {
        var expected = "Jane";
        var testdata = TestHelpers.CreateExamplePerson(expected, 1);
        mRepository.Reset();
        mRepository.Setup(x => x.GetPersonWithId(It.IsAny<int>())).Returns(testdata);
        var result = serviceUnderTest.GetPersonWithId(1);
        Assert.NotNull(result);
        Assert.Equal(expected, result.FirstName);
    }
}
