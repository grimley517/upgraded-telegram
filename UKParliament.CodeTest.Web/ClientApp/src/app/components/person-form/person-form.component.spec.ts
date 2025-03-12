import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PersonFormComponent } from './person-form.component';
import { PersonService } from '../../services/person.service';
import { PersonViewModel } from '../../models/person-view-model';

import { of, throwError } from 'rxjs';

describe('PersonFormComponent', () => {
  let component: PersonFormComponent;
  let fixture: ComponentFixture<PersonFormComponent>;
  let personService: jasmine.SpyObj<PersonService>;

  const mockDepartments: { id: number; name: string; }[] = [
    { id: 1, name: 'Information Technology' },
    { id: 2, name: 'Human Resources' },
    { id: 3, name: 'Finance' },
    { id: 4, name: 'Administration' }
  ];

  const mockPerson: PersonViewModel = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '2000-01-01',
    departmentId: 1,
    departmentName: mockDepartments[0].name
  };

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('PersonService', ['create', 'update', 'getDepartments', 'getById']);
    spy.getDepartments.and.returnValue(of(mockDepartments));
    spy.create.and.returnValue(of(mockPerson));
    spy.update.and.returnValue(of(mockPerson));
    spy.getById.and.returnValue(of(mockPerson));

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
      dateOfBirth: mockPerson.dateOfBirth,
      departmentId: mockPerson.departmentId
    });
  });

  it('should validate required fields', () => {
    component.personForm.controls['firstName'].setValue('');
    component.personForm.controls['lastName'].setValue('');
    component.personForm.controls['dateOfBirth'].setValue('');
    component.personForm.controls['departmentId'].setValue('');
    
    expect(component.personForm.valid).toBeFalse();
    expect(component.personForm.controls['firstName'].errors?.['required']).toBeTruthy();
    expect(component.personForm.controls['lastName'].errors?.['required']).toBeTruthy();
    expect(component.personForm.controls['dateOfBirth'].errors?.['required']).toBeTruthy();
    expect(component.personForm.controls['departmentId'].errors?.['required']).toBeTruthy();
  });

  it('should validate name length constraints', () => {
    // Test minimum length (2 characters)
    component.personForm.controls['firstName'].setValue('a');
    component.personForm.controls['lastName'].setValue('b');
    component.personForm.controls['firstName'].markAsTouched();
    component.personForm.controls['lastName'].markAsTouched();
    
    expect(component.personForm.controls['firstName'].hasError('minlength')).toBeTrue();
    expect(component.personForm.controls['lastName'].hasError('minlength')).toBeTrue();

    // Test valid length
    component.personForm.controls['firstName'].setValue('John');
    component.personForm.controls['lastName'].setValue('Doe');
    
    expect(component.personForm.controls['firstName'].errors).toBeNull();
    expect(component.personForm.controls['lastName'].errors).toBeNull();

    // Test maximum length (20 characters)
    component.personForm.controls['firstName'].setValue('ThisNameIsWayTooLongForTheForm');
    component.personForm.controls['lastName'].setValue('ThisSurnameIsAlsoTooLong');
    
    expect(component.personForm.controls['firstName'].hasError('maxlength')).toBeTrue();
    expect(component.personForm.controls['lastName'].hasError('maxlength')).toBeTrue();
  });

  it('should validate minimum age of 16', () => {
    // Set date to someone who is 15 years old
    const fifteenYearsAgo = new Date();
    fifteenYearsAgo.setFullYear(fifteenYearsAgo.getFullYear() - 15);
    component.personForm.controls['dateOfBirth'].setValue(fifteenYearsAgo.toISOString().split('T')[0]);
    
    expect(component.personForm.controls['dateOfBirth'].errors?.['underage']).toBeTruthy();
    
    // Set date to someone who is 16 years old
    const sixteenYearsAgo = new Date();
    sixteenYearsAgo.setFullYear(sixteenYearsAgo.getFullYear() - 16);
    component.personForm.controls['dateOfBirth'].setValue(sixteenYearsAgo.toISOString().split('T')[0]);
    
    expect(component.personForm.controls['dateOfBirth'].errors?.['underage']).toBeFalsy();
  });

  it('should create new person when form is valid', () => {
    const savedSpy = jasmine.createSpy('saved');
    component.saved.subscribe(savedSpy);
    
    component.personForm.patchValue({
      firstName: 'Jane',
      lastName: 'Smith',
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
      dateOfBirth: '2000-02-02',
      departmentId: 2
    });

    component.onSubmit();
    
    expect(component.errorMessage).toBe('Failed to save person');
  });

  it('should emit cancelled event when cancel is clicked', () => {
    const cancelledSpy = jasmine.createSpy('cancelled');
    component.cancelled.subscribe(cancelledSpy);
    
    component.onCancel();
    
    expect(cancelledSpy).toHaveBeenCalled();
  });
});
