import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { PersonViewModel } from '../models/person-view-model';


@Injectable({
  providedIn: 'root'
})
export class PersonService {
  private apiUrl = 'api/person';

  constructor(private http: HttpClient, @Inject('BASE_URL') private baseUrl: string) { }

  getAll(): Observable<PersonViewModel[]> {
    return this.http.get<PersonViewModel[]>(`${this.baseUrl}${this.apiUrl}`);
  }

  getById(id: number): Observable<PersonViewModel> {
    return this.http.get<PersonViewModel>(`${this.baseUrl}${this.apiUrl}/${id}`);
  }

  create(person: PersonViewModel): Observable<PersonViewModel> {
    return this.http.post<PersonViewModel>(`${this.baseUrl}${this.apiUrl}`, person);
  }

  update(person: PersonViewModel): Observable<PersonViewModel> {
    return this.http.put<PersonViewModel>(`${this.baseUrl}${this.apiUrl}`, person);
  }

  getDepartments(): Observable<{id: number; name: string;}[]> {
    const departments = [
      { id: 1, name: 'Information Technology' },
      { id: 2, name: 'Marketing' },
      { id: 3, name: 'Finance' },
      { id: 4, name: 'Human Resources' }
    ];
    return of(departments);
  }
}
