import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PersonViewModel } from '../../models/person-view-model';
import { PersonService } from '../../services/person.service';
import { PersonListitemComponent } from '../person-listitem/person-listitem.component';

@Component({
  selector: 'app-person-list',
  templateUrl: './person-list.component.html',
  styleUrls: ['./person-list.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, PersonListitemComponent]
})
export class PersonListComponent implements OnInit {
  people: PersonViewModel[] = [];
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
}
