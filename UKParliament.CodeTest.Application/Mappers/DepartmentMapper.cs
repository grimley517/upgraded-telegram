using UKParliament.CodeTest.Data;

namespace UKParliament.CodeTest.Application.Application.Mappers;

public static class DepartmentMapper
{
    public static Department MapToData(this Domain.Department department)
    {
        return new Department { Id = department.Id, Name = department.Name };
    }

    public static Domain.Department Map(this Department department)
    {
        return new Domain.Department { Id = department.Id, Name = department.Name };
    }
}
