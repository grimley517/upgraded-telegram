import { Component, Input } from '@angular/core';
import { PersonViewModel } from '../../models/person-view-model';

@Component({
  selector: 'app-person-item',
  templateUrl: './person-item.component.html',
  styleUrls: ['./person-item.component.css'],
  standalone: true
})
export class PersonItemComponent {
  @Input() person!: PersonViewModel;
}
