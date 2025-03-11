import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { PersonItemComponent } from './person-item.component';
import { PersonService } from '../../services/person.service';
import { PersonViewModel } from '../../models/person-view-model';

describe('PersonItemComponent', () => {
  let component: PersonItemComponent;
  let fixture: ComponentFixture<PersonItemComponent>;
  let personService: jasmine.SpyObj<PersonService>;
  let mockActivatedRoute: { snapshot: { paramMap: { get: jasmine.Spy } } };

  const mockPerson: PersonViewModel = {
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    dateOfBirth: '1990-01-01',
    departmentId: 1
  };

  beforeEach(async () => {
    personService = jasmine.createSpyObj('PersonService', ['getById']);
    mockActivatedRoute = {
      snapshot: {
        paramMap: {
          get: jasmine.createSpy('get')
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        PersonItemComponent
      ],
      providers: [
        { provide: PersonService, useValue: personService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PersonItemComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when person is provided as input', () => {
    beforeEach(() => {
      component.person = mockPerson;
      fixture.detectChanges();
    });

    it('should display the person details', () => {
      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.textContent).toContain('John Doe');
      expect(compiled.textContent).toContain('No Department');
      expect(compiled.textContent).toContain('Born: Jan 1, 1990');
    });

    it('should not call personService.getById', () => {
      expect(personService.getById).not.toHaveBeenCalled();
    });
  });

  describe('when loading person from route', () => {
    beforeEach(() => {
      mockActivatedRoute.snapshot.paramMap.get.and.returnValue('1');
    });

    it('should load person details when valid ID is provided', () => {
      personService.getById.and.returnValue(of(mockPerson));
      fixture.detectChanges();

      expect(personService.getById).toHaveBeenCalledWith(1);
      expect(component.person).toEqual(mockPerson);
      expect(component.errorMessage).toBe('');
    });

    it('should show error message when person is not found', () => {
      personService.getById.and.returnValue(throwError(() => new Error('Not found')));
      fixture.detectChanges();

      expect(personService.getById).toHaveBeenCalledWith(1);
      expect(component.person).toBeUndefined();
      expect(component.errorMessage).toBe('Person not found');
    });

    it('should not load person when no ID is provided', () => {
      mockActivatedRoute.snapshot.paramMap.get.and.returnValue(null);
      fixture.detectChanges();

      expect(personService.getById).not.toHaveBeenCalled();
      expect(component.person).toBeUndefined();
    });

    it('should not load person when ID is invalid', () => {
      mockActivatedRoute.snapshot.paramMap.get.and.returnValue('invalid');
      fixture.detectChanges();

      expect(personService.getById).not.toHaveBeenCalled();
      expect(component.person).toBeUndefined();
    });
  });
});
