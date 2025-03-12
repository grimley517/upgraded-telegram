import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { PersonViewModel } from '../../models/person-view-model';
import { PersonFormComponent } from '../person-form/person-form.component';
import { PersonItemComponent } from '../person-item/person-item.component';

@Component({
  selector: 'app-person-listitem',
  templateUrl: './person-listitem.component.html',
  styleUrls: ['./person-listitem.component.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule, PersonFormComponent, PersonItemComponent]
})
export class PersonListitemComponent {
  @Input() person!: PersonViewModel;
  @Output() refreshList = new EventEmitter<void>();
  showEditModal = false;
  showViewModal = false;

  openEditModal(): void {
    this.showEditModal = true;
  }

  closeEditModal(): void {
    this.showEditModal = false;
  }

  openViewModal(): void {
    this.showViewModal = true;
  }

  closeViewModal(): void {
    this.showViewModal = false;
  }

  onPersonSaved(): void {
    this.closeEditModal();
    this.refreshList.emit();
  }


}
