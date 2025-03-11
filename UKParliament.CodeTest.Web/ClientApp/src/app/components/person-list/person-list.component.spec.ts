import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonListComponent } from './person-list.component';
import { PersonService } from '../../services/person.service';
import { PersonViewModel } from '../../models/person-view-model';
import { of, throwError } from 'rxjs';
import { PersonFormComponent } from '../person-form/person-form.component';
import { ReactiveFormsModule } from '@angular/forms';

describe('PersonListComponent', () => {
  let component: PersonListComponent;
  let fixture: ComponentFixture<PersonListComponent>;
  let personService: jasmine.SpyObj<PersonService>;

  const mockPeople: PersonViewModel[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com',
      dateOfBirth: '1990-01-01',
      departmentId: 1,
      department: { id: 1, name: 'IT' }
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      dateOfBirth: '1992-02-02',
      departmentId: 2,
      department: { id: 2, name: 'HR' }
    }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('PersonService', ['getAll']);
    spy.getAll.and.returnValue(of(mockPeople));

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        PersonListComponent,
        PersonFormComponent
      ],
      providers: [
        { provide: PersonService, useValue: spy }
      ]
    }).compileComponents();

    personService = TestBed.inject(PersonService) as jasmine.SpyObj<PersonService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load people on init', () => {
    expect(personService.getAll).toHaveBeenCalled();
    expect(component.people).toEqual(mockPeople);
  });

  it('should handle error when loading people', () => {
    const errorSpy = spyOn(console, 'error');
    personService.getAll.and.returnValue(throwError(() => new Error('Failed to load')));
    
    component.loadPeople();
    
    expect(errorSpy).toHaveBeenCalledWith('Error loading people:', jasmine.any(Error));
  });

  it('should select person when clicked', () => {
    component.selectPerson(mockPeople[0]);
    expect(component.selectedPerson).toEqual(mockPeople[0]);
  });

  it('should clear selected person when person is saved', () => {
    component.selectedPerson = mockPeople[0];
    const getAllSpy = personService.getAll;
    
    component.onPersonSaved();
    
    expect(component.selectedPerson).toBeNull();
    expect(getAllSpy).toHaveBeenCalledTimes(2); // Once in init, once after save
  });

  it('should clear selected person when person is deleted', () => {
    component.selectedPerson = mockPeople[0];
    const getAllSpy = personService.getAll;
    
    component.onPersonDeleted();
    
    expect(component.selectedPerson).toBeNull();
    expect(getAllSpy).toHaveBeenCalledTimes(2); // Once in init, once after delete
  });
});
