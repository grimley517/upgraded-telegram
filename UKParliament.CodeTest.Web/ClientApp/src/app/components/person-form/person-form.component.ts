import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators, ReactiveFormsModule } from '@angular/forms';
import { Department, PersonViewModel } from '../../models/person-view-model';
import { PersonService } from '../../services/person.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-person-form',
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class PersonFormComponent implements OnInit {
  @Input() person: PersonViewModel = {} as PersonViewModel;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();
  @Output() deleted = new EventEmitter<void>();

  personForm: FormGroup;
  departments: Department[] = [];
  isNew = true;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private personService: PersonService
  ) {
    this.personForm = this.createForm();
  }

  ngOnInit(): void {
    this.loadDepartments();
    this.isNew = !this.person.id;
    if (!this.isNew) {
      this.personForm.patchValue(this.person);
    }
  }

  private ageValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null;
    }

    const dob = new Date(control.value);
    const today = new Date();
    
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    return age < 16 ? { underage: true } : null;
  }

  private createForm(): FormGroup {
    return this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      lastName: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(20)]],
      dateOfBirth: ['', [Validators.required, this.ageValidator.bind(this)]],
      departmentId: ['', [Validators.required]]
    });
  }

  private loadDepartments(): void {
    this.personService.getDepartments().subscribe({
      next: (departments) => {
        this.departments = departments;
      },
      error: (error) => {
        console.error('Error loading departments:', error);
        this.errorMessage = 'Failed to load departments';
      }
    });
  }

  onSubmit(): void {
    if (this.personForm.valid) {
      const personData: PersonViewModel = {
        ...this.personForm.value,
        id: this.person.id
      };

      const action = this.isNew
        ? this.personService.create(personData)
        : this.personService.update(personData);

      action.subscribe({
        next: () => {
          this.saved.emit();
        },
        error: (error) => {
          console.error('Error saving person:', error);
          this.errorMessage = 'Failed to save person';
        }
      });
    } else {
      this.errorMessage = 'Please fill in all required fields correctly';
    }
  }

  onDelete(): void {
    if (this.person.id) {
      this.personService.delete(this.person.id).subscribe({
        next: () => {
          this.deleted.emit();
        },
        error: (error) => {
          console.error('Error deleting person:', error);
          this.errorMessage = 'Failed to delete person';
        }
      });
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }
}
