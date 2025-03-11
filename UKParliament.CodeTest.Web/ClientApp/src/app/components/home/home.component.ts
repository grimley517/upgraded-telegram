import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PersonListComponent } from '../person-list/person-list.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [RouterModule, PersonListComponent]
})
export class HomeComponent {
}
