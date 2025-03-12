import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PersonService } from './person.service';
import { PersonViewModel } from '../models/person-view-model';

describe('PersonService', () => {
  let service: PersonService;
  let httpMock: HttpTestingController;
  const baseUrl = 'http://localhost:5000/';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PersonService,
        { provide: 'BASE_URL', useValue: baseUrl }
      ]
    });

    service = TestBed.inject(PersonService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verify that no unmatched requests are outstanding
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return all people', () => {
      const mockPeople: PersonViewModel[] = [
        { id: 1, firstName: 'John', lastName: 'Doe', dateOfBirth: '1990-01-01', departmentId: 1 },
        { id: 2, firstName: 'Jane', lastName: 'Smith', dateOfBirth: '1992-02-02', departmentId: 2 }
      ];

      service.getAll().subscribe(people => {
        expect(people).toEqual(mockPeople);
      });

      const req = httpMock.expectOne(`${baseUrl}api/person`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPeople);
    });

    it('should handle error when getting all people fails', () => {
      service.getAll().subscribe({
        error: error => {
          expect(error.status).toBe(500);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}api/person`);
      req.flush('Error fetching people', { status: 500, statusText: 'Internal Server Error' });
    });
  });

  describe('getById', () => {
    it('should return a person by id', () => {
      const mockPerson: PersonViewModel = {
        id: 1,
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        departmentId: 1
      };

      service.getById(1).subscribe(person => {
        expect(person).toEqual(mockPerson);
      });

      const req = httpMock.expectOne(`${baseUrl}api/person/1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPerson);
    });

    it('should handle error when getting person by id fails', () => {
      service.getById(999).subscribe({
        error: error => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}api/person/999`);
      req.flush('Person not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('create', () => {
    it('should create a new person', () => {
      const newPerson: PersonViewModel = {
        id: 0,
        firstName: 'New',
        lastName: 'Person',
        dateOfBirth: '1995-05-05',
        departmentId: 3
      };

      const createdPerson = { ...newPerson, id: 1 };

      service.create(newPerson).subscribe(person => {
        expect(person).toEqual(createdPerson);
      });

      const req = httpMock.expectOne(`${baseUrl}api/person`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(newPerson);
      req.flush(createdPerson);
    });

    it('should handle error when creating person fails', () => {
      const invalidPerson: PersonViewModel = {
        id: 0,
        firstName: '',
        lastName: '',
        dateOfBirth: '2025-03-11',
        departmentId: 0
      };

      service.create(invalidPerson).subscribe({
        error: error => {
          expect(error.status).toBe(400);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}api/person`);
      req.flush('Invalid person data', { status: 400, statusText: 'Bad Request' });
    });
  });

  describe('update', () => {
    it('should update an existing person', () => {
      const updatedPerson: PersonViewModel = {
        id: 1,
        firstName: 'Updated',
        lastName: 'Person',
        dateOfBirth: '1990-01-01',
        departmentId: 2
      };

      service.update(updatedPerson).subscribe(person => {
        expect(person).toEqual(updatedPerson);
      });

      const req = httpMock.expectOne(`${baseUrl}api/person`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(updatedPerson);
      req.flush(updatedPerson);
    });

    it('should handle error when updating person fails', () => {
      const nonExistentPerson: PersonViewModel = {
        id: 999,
        firstName: 'NonExistent',
        lastName: 'Person',
        dateOfBirth: '2025-03-11',
        departmentId: 999
      };

      service.update(nonExistentPerson).subscribe({
        error: error => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne(`${baseUrl}api/person`);
      req.flush('Person not found', { status: 404, statusText: 'Not Found' });
    });
  });

  describe('getDepartments', () => {
    it('should return all departments', () => {
      const expectedDepartments = [
        { id: 1, name: 'Information Technology' },
        { id: 2, name: 'Human Resources' },
        { id: 3, name: 'Finance' },
        { id: 4, name: 'Administration' }
      ];

      service.getDepartments().subscribe(departments => {
        expect(departments).toEqual(expectedDepartments);
      });
    });
  });
});
