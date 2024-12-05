import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-teachers',
  templateUrl: './teachers.component.html',
  styleUrls: ['./teachers.component.css']
})
export class TeachersComponent implements OnInit {
  teachers: any[] = [];
  newTeacher: any = { id: '', name: '' };
  selectedTeacher: any = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getTeachers();
  }

  // Fetch all teachers from the backend with Bearer token
  getTeachers(): void {
    const headers = this.getAuthHeaders(); // Get headers with Bearer token
    this.http.get<any[]>('http://localhost:5000/teachers', { headers }).subscribe(data => {
      this.teachers = data;
    });
    
  }

  // Add a new teacher with manually assigned ID and Bearer token
  addTeacher(): void {
    if (this.newTeacher.name && this.newTeacher.id) {
      const headers = this.getAuthHeaders(); // Get headers with Bearer token
      this.http.post('http://localhost:5000/teachers', this.newTeacher, { headers }).subscribe(() => {
        this.getTeachers();
        this.newTeacher.name = ''; // Clear name input after adding
        this.newTeacher.id = ''; // Clear id input after adding
        this.closeAddModal(); // Close modal
      });
    } else {
      alert('Please provide both name and ID for the teacher.');
    }
  }

  // Open Add Teacher Modal
  openAddModal(): void {
    const modal = new (window as any).bootstrap.Modal(document.getElementById('addTeacherModal'));
    modal.show();
  }

  // Close Add Teacher Modal
  closeAddModal(): void {
    const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('addTeacherModal'));
    modal.hide();
  }

  // Open Edit Teacher Modal
  openEditModal(teacher: any): void {
    this.selectedTeacher = { ...teacher }; // Copy the teacher data
    const modal = new (window as any).bootstrap.Modal(document.getElementById('editTeacherModal'));
    modal.show();
  }

  // Update teacher details with Bearer token
  updateTeacher(): void {
    if (this.selectedTeacher.name && this.selectedTeacher.id) {
      const headers = this.getAuthHeaders(); // Get headers with Bearer token
      this.http.put(`http://localhost:5000/teachers/${this.selectedTeacher.id}`, this.selectedTeacher, { headers }).subscribe(() => {
        this.getTeachers();
        this.closeEditModal(); // Close modal after update
      });
    }
  }

  // Close Edit Teacher Modal
  closeEditModal(): void {
    const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('editTeacherModal'));
    modal.hide();
  }

  // Delete teacher with Bearer token
  deleteTeacher(id: string): void {
    const headers = this.getAuthHeaders(); // Get headers with Bearer token
    this.http.delete(`http://localhost:5000/teachers/${id}`, { headers }).subscribe(() => {
      this.getTeachers(); // Reload the list after deletion
    });
  }

  // Method to get the Bearer token from localStorage (or sessionStorage)
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Replace with your actual token storage mechanism
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }
}
