using Microsoft.AspNetCore.Mvc;
using Moq;
using UKParliament.CodeTest.Application.Application.Interfaces;
using UKParliament.CodeTest.Application.Tests;
using UKParliament.CodeTest.Web.Controllers;
using UKParliament.CodeTest.Web.ViewModels;

namespace UKParliament.CodeTest.Web.Tests.Unit;

public class PersonControllerTests
{
    private PersonController controllerUnderTest;

    private Mock<IPersonService> mPersonService;

    public PersonControllerTests()
    {
        mPersonService = new Mock<IPersonService>();
        controllerUnderTest = new PersonController(mPersonService.Object);
    }

    [Fact]
    public void GetAll_ReturnsListPassedFromService()
    {
        mPersonService
            .Setup(x => x.GetAllPersons())
            .Returns(TestHelpers.ExampleListOfPeople())
            .Verifiable();
        var response = controllerUnderTest.GetAll();
        mPersonService.Verify(x => x.GetAllPersons(), Times.Once);
        Assert.IsType<ActionResult<List<PersonViewModel>>>(response);
        Assert.NotNull(response);
    }
}
