using Microsoft.AspNetCore.Mvc;
using UKParliament.CodeTest.Application.Application.Interfaces;
using UKParliament.CodeTest.Web.ViewModels;

namespace UKParliament.CodeTest.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PersonController : ControllerBase
{
    private readonly IPersonService _personService;

    public PersonController(IPersonService personService)
    {
        _personService = personService;
    }

    /// <summary>
    /// GET endpoint that returns unpaginated list of all people
    /// </summary>
    /// <remarks>
    /// Sample Request:
    ///
    /// GET /
    /// </remarks>
    /// <returns>List of all people, unpaginated</returns>
    /// <response code="200"> Returns the list of people</response>
    [HttpGet("")]
    public ActionResult<List<PersonViewModel>> GetAll()
    {
        var people = _personService.GetAllPersons();
        var vmPeople = people.Select(person => PersonViewModel.ToVieModel(person)).ToList();
        return vmPeople;
    }

    /// <summary>
    /// Returns details for a sinlge person
    /// </summary>
    /// <remarks>
    /// sample request:
    ///
    /// GET /
    /// </remarks>
    /// <param name="id"> ID of user</param>
    /// <returns>details of person with id requested</returns>
    /// <response code="200"> successfully returns user</response>
    /// <response code="404"> User does not exist </response>
    [HttpGet("{id:int}", Name = "GetPerson")]
    public ActionResult<PersonViewModel> GetById(int id)
    {
        try
        {
            var person = _personService.GetPersonWithId(id);
            var vm = PersonViewModel.ToVieModel(person);
            vm.Links.Add(new LinkResource(Url.Link("GetPerson", person.Id), "self", "GET"));

            return Ok();
        }
        catch
        {
            return NotFound();
        }
    }

    [HttpPut("")]
    public ActionResult Update(PersonViewModel person)
    {
        throw new NotImplementedException();
    }

    [HttpPost("")]
    public ActionResult Create(PersonViewModel person)
    {
        throw new NotImplementedException();
    }
}
