using FluentValidation;
using UKParliament.CodeTest.Application.Domain;

namespace UKParliament.CodeTest.Application.Application.Validators;

public class PersonValidator : AbstractValidator<Person>
{
    public PersonValidator()
    {
        RuleFor(x => x.FirstName).MinimumLength(2).MaximumLength(20).NotEmpty();
        RuleFor(x => x.LastName).MinimumLength(2).MaximumLength(20).NotEmpty();
        RuleFor(x => x.DateOfBirth)
            .LessThanOrEqualTo(DateTime.Today - TimeSpan.FromDays(16 * 365))
            .WithMessage("Person cannot be aged under 16");
        RuleFor(x => x.Department).SetValidator(new DepartmentValidator());
    }
}
