export interface Department {
  id: number;
  name: string;
}

export interface PersonViewModel {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  departmentId: number;
  department?: Department;
}
