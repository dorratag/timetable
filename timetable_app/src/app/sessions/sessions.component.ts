import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-sessions',
  templateUrl: './sessions.component.html',
  styleUrls: ['./sessions.component.css']
})
export class SessionsComponent implements OnInit {
  sessions: any[] = [];
  newSession: any = { id: '', class_id: '', subject_id: '', teacher_id: '', room_id: '', beginTime: '', endTime: '', day: '' };
  selectedSession: any = '';
  daysOfWeek: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getSessions();
  }

  // Method to get the Bearer token from localStorage (or any other source)
  getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Fetch all sessions from the backend
  getSessions(): void {
    const headers = this.getAuthHeaders();
    this.http.get<any[]>('http://localhost:5000/sessions', { headers }).subscribe(data => {
      this.sessions = data;
    });
  }

  // Add a new session
  addSession(): void {
    if (this.newSession.id && this.newSession.class_id && this.newSession.subject_id && this.newSession.teacher_id && this.newSession.room_id && this.newSession.day && this.newSession.beginTime && this.newSession.endTime) {
      const headers = this.getAuthHeaders();
      this.http.post('http://localhost:5000/sessions', this.newSession, { headers }).subscribe(() => {
        this.getSessions();
        this.newSession = { id: '', class_id: '', subject_id: '', teacher_id: '', room_id: '', beginTime: '', endTime: '', day: '' }; // Reset form
        this.closeAddModal(); // Close modal
      });
    }
  }

  // Open Add Session Modal
  openAddModal(): void {
    const modal = new (window as any).bootstrap.Modal(document.getElementById('addSessionModal'));
    modal.show();
  }

  // Close Add Session Modal
  closeAddModal(): void {
    const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('addSessionModal'));
    modal.hide();
  }

  // Open Edit Session Modal
  openEditModal(session: any): void {
    this.selectedSession = { ...session }; // Copy the session data
    const modal = new (window as any).bootstrap.Modal(document.getElementById('editSessionModal'));
    modal.show();
  }

  // Update session details
  updateSession(): void {
    if (this.selectedSession.id && this.selectedSession.class_id && this.selectedSession.subject_id && this.selectedSession.teacher_id && this.selectedSession.room_id && this.selectedSession.day && this.selectedSession.beginTime && this.selectedSession.endTime) {
      const headers = this.getAuthHeaders();
      this.http.put(`http://localhost:5000/sessions/${this.selectedSession.id}`, this.selectedSession, { headers }).subscribe(() => {
        this.getSessions();
        this.closeEditModal(); // Close modal after update
      });
    }
  }

  // Close Edit Session Modal
  closeEditModal(): void {
    const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('editSessionModal'));
    modal.hide();
  }

  // Delete session
  deleteSession(id: string): void {
    const headers = this.getAuthHeaders();
    this.http.delete(`http://localhost:5000/sessions/${id}`, { headers }).subscribe(() => {
      this.getSessions(); // Reload the list after deletion
    });
  }
}
