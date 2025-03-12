import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PersonListComponent } from './person-list.component';
import { PersonService } from '../../services/person.service';
import { PersonViewModel } from '../../models/person-view-model';
import { of, throwError } from 'rxjs';
import { PersonFormComponent } from '../person-form/person-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

describe('PersonListComponent', () => {
  let component: PersonListComponent;
  let fixture: ComponentFixture<PersonListComponent>;
  let personService: jasmine.SpyObj<PersonService>;

  const mockPeople: PersonViewModel[] = [
    {
      id: 1,
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: '1990-01-01',
      departmentId: 1,
      departmentName: 'Information Technology'
    },
    {
      id: 2,
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfBirth: '1992-02-02',
      departmentId: 2,
      departmentName: 'Human Resources'
    }
  ];

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('PersonService', ['getAll']);
    spy.getAll.and.returnValue(of(mockPeople));

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        RouterTestingModule,
        RouterModule,
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


});
