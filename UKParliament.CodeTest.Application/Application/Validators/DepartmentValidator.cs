using FluentValidation;
using UKParliament.CodeTest.Application.Domain;

namespace UKParliament.CodeTest.Application.Application.Validators;

public class DepartmentValidator : AbstractValidator<Department>
{
    //todo: add link to repository to check that Department exists with ID
    public DepartmentValidator()
    {
        RuleFor(x => x.Id).NotEmpty();
    }
}
