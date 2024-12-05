import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = 'http://localhost:5000';

  constructor(private http: HttpClient) {}

  getTeachers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/teachers`);
  }

  // Add a new teacher
  addTeacher(teacher: { name: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/teachers`, teacher);
  }

  // Delete a teacher
  deleteTeacher(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/teachers/${id}`);
  }
}
