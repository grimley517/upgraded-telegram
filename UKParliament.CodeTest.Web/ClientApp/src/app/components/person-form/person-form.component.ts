import { Component, EventEmitter, Input, OnInit, OnChanges, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators, ReactiveFormsModule } from '@angular/forms';
import { PersonViewModel } from '../../models/person-view-model';

import { PersonService } from '../../services/person.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-person-form',
  templateUrl: './person-form.component.html',
  styleUrls: ['./person-form.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class PersonFormComponent implements OnInit, OnChanges {
  @Input() person: PersonViewModel = {} as PersonViewModel;
  @Output() saved = new EventEmitter<void>();
  @Output() cancelled = new EventEmitter<void>();

  personForm: FormGroup;
  departments: { id: number; name: string; }[] = [];
  isNew = true;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private personService: PersonService
  ) {
    this.personForm = this.createForm();
  }

  private updateFormWithPersonData(): void {
    if (this.person) {
      this.isNew = !this.person.id;
      
      // Handle the date conversion
      let formattedDate = '';
      if (this.person.dateOfBirth) {
        // Try to parse the date string
        const date = new Date(this.person.dateOfBirth);
        if (!isNaN(date.getTime())) {
          formattedDate = date.toISOString().split('T')[0];
        }
      }
      
      // Update form values
      this.personForm.patchValue({
        firstName: this.person.firstName || '',
        lastName: this.person.lastName || '',
        dateOfBirth: formattedDate,
        departmentId: this.person.departmentId ? this.person.departmentId.toString() : ''
      }, { emitEvent: false });
    }
  }

  ngOnChanges(): void {
    // Always update form when person input changes
    this.updateFormWithPersonData();
    // Reset form state
    this.personForm.markAsPristine();
    this.personForm.markAsUntouched();
    this.errorMessage = '';
  }

  ngOnInit(): void {
    this.loadDepartments();
    this.isNew = !this.person.id;
    if (!this.isNew) {
      this.updateFormWithPersonData();
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
      firstName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20)
      ]],
      lastName: ['', [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(20)
      ]],
      dateOfBirth: ['', [
        Validators.required,
        this.ageValidator.bind(this)
      ]],
      departmentId: ['', [
        Validators.required,
        (control: AbstractControl): ValidationErrors | null => {
          const value = control.value;
          if (!value) return null;
          const numValue = Number(value);
          if (isNaN(numValue)) return { invalidDepartment: true };
          const department = this.departments.find(d => d.id === numValue);
          return department ? null : { invalidDepartment: true };
        }
      ]]
    });
  }

  private loadDepartments(): void {
    this.personService.getDepartments().subscribe({
      next: (departments: {id: number; name: string;}[]) => {
        this.departments = departments;
        // If editing an existing person, find and set their department name
        if (this.person && this.person.departmentId) {
          const department = departments.find((d: {id: number; name: string;}) => d.id === this.person.departmentId);
          if (department) {
            this.person.departmentName = department.name;
            // Update the form if it's already initialized
            if (this.personForm) {
              this.updateFormWithPersonData();
            }
          }
        }
      },
      error: (error: Error) => {
        console.error('Error loading departments:', error);
        this.errorMessage = 'Failed to load departments';
      }
    });
  }

  onSubmit(): void {
    if (this.personForm.valid) {
      const formValue = this.personForm.value;
      const department = this.departments.find(d => d.id === Number(formValue.departmentId));
      
      if (!department) {
        this.errorMessage = 'Please select a valid department';
        return;
      }
      
      // Validate name lengths
      if (formValue.firstName.length < 2 || formValue.firstName.length > 20) {
        this.errorMessage = 'First name must be between 2 and 20 characters';
        return;
      }
      if (formValue.lastName.length < 2 || formValue.lastName.length > 20) {
        this.errorMessage = 'Last name must be between 2 and 20 characters';
        return;
      }
      
      // Ensure date is properly formatted and validated
      const dateOfBirth = new Date(formValue.dateOfBirth);
      if (this.ageValidator({ value: dateOfBirth } as AbstractControl)) {
        this.errorMessage = 'Person must be at least 16 years old';
        return;
      }
      
      const personData: PersonViewModel = {
        ...formValue,
        id: this.person.id,
        departmentId: department.id,
        departmentName: department.name,
        dateOfBirth: dateOfBirth.toISOString()
      };

      const saveAction = this.isNew
        ? this.personService.create(personData)
        : this.personService.update(personData);

      saveAction.subscribe({
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



  onCancel(): void {
    this.cancelled.emit();
  }
}
