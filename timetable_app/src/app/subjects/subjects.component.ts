import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-subjects',
  templateUrl: './subjects.component.html',
  styleUrls: ['./subjects.component.css']
})
export class SubjectsComponent implements OnInit {
  subjects: any[] = [];
  newSubject: any = { id: '', name: '', code: '' }; // Include id field for manual entry
  selectedSubject: any = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getSubjects();
  }

  // Fetch all subjects from the backend
  getSubjects(): void {
    const headers = this.getAuthHeaders();
    this.http.get<any[]>('http://localhost:5000/subjects', { headers })
      .subscribe(data => {
        this.subjects = data;
      });
  }

  // Add a new subject
  addSubject(): void {
    if (this.newSubject.id && this.newSubject.name && this.newSubject.code) {
      const headers = this.getAuthHeaders();
      this.http.post('http://localhost:5000/subjects', this.newSubject, { headers })
        .subscribe(() => {
          this.getSubjects();
          this.newSubject.id = ''; // Clear id after adding
          this.newSubject.name = ''; // Clear name after adding
          this.newSubject.code = ''; // Clear code after adding
          this.closeAddModal(); // Close modal
        });
    } else {
      alert('Please fill in all fields (ID, Name, and Code).');
    }
  }

  // Open Add Subject Modal
  openAddModal(): void {
    const modal = new (window as any).bootstrap.Modal(document.getElementById('addSubjectModal'));
    modal.show();
  }

  // Close Add Subject Modal
  closeAddModal(): void {
    const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('addSubjectModal'));
    modal.hide();
  }

  // Open Edit Subject Modal
  openEditModal(subject: any): void {
    this.selectedSubject = { ...subject }; // Copy the subject data for editing
    const modal = new (window as any).bootstrap.Modal(document.getElementById('editSubjectModal'));
    modal.show();
  }

  // Update subject details
  updateSubject(): void {
    if (this.selectedSubject.id && this.selectedSubject.name && this.selectedSubject.code) {
      const headers = this.getAuthHeaders();
      this.http.put(`http://localhost:5000/subjects/${this.selectedSubject.id}`, this.selectedSubject, { headers })
        .subscribe(() => {
          this.getSubjects();
          this.closeEditModal(); // Close modal after update
        });
    } else {
      alert('Please fill in all fields (ID, Name, and Code).');
    }
  }

  // Close Edit Subject Modal
  closeEditModal(): void {
    const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('editSubjectModal'));
    modal.hide();
  }

  // Delete subject
  deleteSubject(id: string): void {
    const headers = this.getAuthHeaders();
    this.http.delete(`http://localhost:5000/subjects/${id}`, { headers })
      .subscribe(() => {
        this.getSubjects(); // Reload the list after deletion
      });
  }

  // Get the authentication headers
  getAuthHeaders() {
    const token = localStorage.getItem('token'); // Get token from localStorage (adjust as needed)
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
}
