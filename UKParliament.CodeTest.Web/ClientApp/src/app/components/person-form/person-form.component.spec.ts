import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PersonFormComponent } from './person-form.component';
import { PersonService } from '../../services/person.service';
import { Department, PersonViewModel } from '../../models/person-view-model';
import { of, throwError } from 'rxjs';

describe('PersonFormComponent', () => {
  let component: PersonFormComponent;
  let fixture: ComponentFixture<PersonFormComponent>;
  let personService: jasmine.SpyObj<PersonService>;

  const mockDepartments: Department[] = [
    { id: 1, name: 'IT' },
    { id: 2, name: 'HR' }
  ];

  const mockPerson: PersonViewModel = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    dateOfBirth: '2000-01-01',
    departmentId: 1,
    department: mockDepartments[0]
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('PersonService', ['create', 'update', 'delete', 'getDepartments']);
    spy.getDepartments.and.returnValue(of(mockDepartments));
    spy.create.and.returnValue(of(mockPerson));
    spy.update.and.returnValue(of(mockPerson));
    spy.delete.and.returnValue(of(void 0));

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        PersonFormComponent
      ],
      providers: [
        FormBuilder,
        { provide: PersonService, useValue: spy }
      ]
    }).compileComponents();

    personService = TestBed.inject(PersonService) as jasmine.SpyObj<PersonService>;
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PersonFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load departments on init', () => {
    expect(personService.getDepartments).toHaveBeenCalled();
    expect(component.departments).toEqual(mockDepartments);
  });

  it('should handle error when loading departments', () => {
    const errorSpy = spyOn(console, 'error');
    personService.getDepartments.and.returnValue(throwError(() => new Error('Failed to load')));
    
    component.ngOnInit();
    
    expect(errorSpy).toHaveBeenCalledWith('Error loading departments:', jasmine.any(Error));
    expect(component.errorMessage).toBe('Failed to load departments');
  });

  it('should initialize form with empty values for new person', () => {
    expect(component.isNew).toBeTrue();
    expect(component.personForm.value).toEqual({
      firstName: '',
      lastName: '',
      email: '',
      dateOfBirth: '',
      departmentId: ''
    });
  });

  it('should initialize form with person values for existing person', () => {
    component.person = mockPerson;
    component.ngOnInit();
    
    expect(component.isNew).toBeFalse();
    expect(component.personForm.value).toEqual({
      firstName: mockPerson.firstName,
      lastName: mockPerson.lastName,
      email: mockPerson.email,
      dateOfBirth: mockPerson.dateOfBirth,
      departmentId: mockPerson.departmentId
    });
  });

  it('should validate required fields', () => {
    component.personForm.controls['firstName'].setValue('');
    component.personForm.controls['email'].setValue('invalid-email');
    
    expect(component.personForm.valid).toBeFalse();
    expect(component.personForm.controls['firstName'].errors?.['required']).toBeTruthy();
    expect(component.personForm.controls['email'].errors?.['email']).toBeTruthy();
  });

  it('should create new person when form is valid', () => {
    const savedSpy = jasmine.createSpy('saved');
    component.saved.subscribe(savedSpy);
    
    component.personForm.patchValue({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      dateOfBirth: '1992-02-02',
      departmentId: 2
    });

    component.onSubmit();
    
    expect(personService.create).toHaveBeenCalled();
    expect(savedSpy).toHaveBeenCalled();
  });

  it('should update existing person when form is valid', () => {
    const savedSpy = jasmine.createSpy('saved');
    component.saved.subscribe(savedSpy);
    component.person = mockPerson;
    component.ngOnInit();
    
    component.personForm.patchValue({
      firstName: 'Jane Updated',
      lastName: 'Smith Updated',
      email: 'jane.updated@example.com',
      dateOfBirth: '2000-02-02',
      departmentId: 2
    });

    component.onSubmit();
    
    expect(personService.update).toHaveBeenCalled();
    expect(savedSpy).toHaveBeenCalled();
  });

  it('should handle error when saving person', () => {
    personService.create.and.returnValue(throwError(() => new Error('Failed to save')));
    
    component.personForm.patchValue({
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@example.com',
      dateOfBirth: '2000-02-02',
      departmentId: 2
    });

    component.onSubmit();
    
    expect(component.errorMessage).toBe('Failed to save person');
  });

  it('should delete person', () => {
    const deletedSpy = jasmine.createSpy('deleted');
    component.deleted.subscribe(deletedSpy);
    component.person = mockPerson;
    
    component.onDelete();
    
    expect(personService.delete).toHaveBeenCalledWith(mockPerson.id!);
    expect(deletedSpy).toHaveBeenCalled();
  });

  it('should handle error when deleting person', () => {
    personService.delete.and.returnValue(throwError(() => new Error('Failed to delete')));
    component.person = mockPerson;
    
    component.onDelete();
    
    expect(component.errorMessage).toBe('Failed to delete person');
  });

  it('should emit cancelled event when cancel is clicked', () => {
    const cancelledSpy = jasmine.createSpy('cancelled');
    component.cancelled.subscribe(cancelledSpy);
    
    component.onCancel();
    
    expect(cancelledSpy).toHaveBeenCalled();
  });
});
