import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Department, PersonViewModel } from '../models/person-view-model';

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
    return this.http.put<PersonViewModel>(`${this.baseUrl}${this.apiUrl}/${person.id}`, person);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}${this.apiUrl}/${id}`);
  }

  getDepartments(): Observable<Department[]> {
    return this.http.get<Department[]>(`${this.baseUrl}api/department`);
  }
}
