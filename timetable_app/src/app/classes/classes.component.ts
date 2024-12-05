import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css']
})
export class ClassesComponent implements OnInit {
  classes: any[] = [];
  newClass: any = { id: '', name: '' }; // Initialize with id and name
  selectedClass: any = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getClasses();
  }

  // Method to get the Bearer token from localStorage (or any other source)
  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Fetch all classes from the backend
  getClasses(): void {
    const headers = this.getAuthHeaders();
    this.http.get<any[]>('http://localhost:5000/classes', { headers }).subscribe(data => {
      this.classes = data;
    });
  }

  // Add a new class
  addClass(): void {
    if (this.newClass.id && this.newClass.name) {
      const headers = this.getAuthHeaders(); // Get Bearer token in headers
      this.http.post('http://localhost:5000/classes', this.newClass, { headers }).subscribe(() => {
        this.getClasses();
        this.newClass.id = ''; // Clear input field after adding
        this.newClass.name = ''; // Clear input field after adding
        this.closeAddModal(); // Close modal
      });
    }
  }

  // Open Add Class Modal
  openAddModal(): void {
    const modal = new (window as any).bootstrap.Modal(document.getElementById('addClassModal'));
    modal.show();
  }

  // Close Add Class Modal
  closeAddModal(): void {
    const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('addClassModal'));
    modal.hide();
  }

  // Open Edit Class Modal
  openEditModal(classItem: any): void {
    this.selectedClass = { ...classItem }; // Copy the class data
    const modal = new (window as any).bootstrap.Modal(document.getElementById('editClassModal'));
    modal.show();
  }

  // Update class details
  updateClass(): void {
    if (this.selectedClass.name) {
      const headers = this.getAuthHeaders(); // Get Bearer token in headers
      this.http.put(`http://localhost:5000/classes/${this.selectedClass.id}`, this.selectedClass, { headers }).subscribe(() => {
        this.getClasses();
        this.closeEditModal(); // Close modal after update
      });
    }
  }

  // Close Edit Class Modal
  closeEditModal(): void {
    const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('editClassModal'));
    modal.hide();
  }

  // Delete class
  deleteClass(id: string): void {
    const headers = this.getAuthHeaders(); // Get Bearer token in headers
    this.http.delete(`http://localhost:5000/classes/${id}`, { headers }).subscribe(() => {
      this.getClasses(); // Reload the list after deletion
    });
  }
}
