import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonViewModel } from '../../models/person-view-model';
import { PersonService } from '../../services/person.service';
import { PersonFormComponent } from '../person-form/person-form.component';
import { PersonItemComponent } from '../person-item/person-item.component';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.scss'],
  standalone: true,
  imports: [CommonModule, PersonFormComponent, PersonItemComponent]
})
export class PersonListComponent implements OnInit {
  people: PersonViewModel[] = [];
  selectedPerson: PersonViewModel | null = null;

  constructor(private personService: PersonService) {}

  ngOnInit(): void {
    this.loadPeople();
  }

  loadPeople(): void {
    this.personService.getAll().subscribe({
      next: (people) => {
        this.people = people;
      },
      error: (error) => {
        console.error('Error loading people:', error);
      }
    });
  }

  selectPerson(person: PersonViewModel): void {
    this.selectedPerson = person;
  }

  onPersonSaved(): void {
    this.loadPeople();
    this.selectedPerson = null;
  }

  onPersonDeleted(): void {
    this.loadPeople();
    this.selectedPerson = null;
  }
}
