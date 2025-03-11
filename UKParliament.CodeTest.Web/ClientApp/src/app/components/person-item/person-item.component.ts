import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PersonViewModel } from '../../models/person-view-model';
import { PersonService } from '../../services/person.service';

@Component({
  selector: 'app-person-item',
  templateUrl: './person-item.component.html',
  styleUrls: ['./person-item.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class PersonItemComponent implements OnInit {
  @Input() person?: PersonViewModel;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private personService: PersonService
  ) {}

  ngOnInit(): void {
    if (!this.person) {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      if (id) {
        this.loadPerson(id);
      }
    }
  }

  private loadPerson(id: number): void {
    this.personService.getById(id).subscribe({
      next: (person) => {
        this.person = person;
      },
      error: (error) => {
        console.error('Error loading person:', error);
        this.errorMessage = 'Person not found';
      }
    });
  }
}
