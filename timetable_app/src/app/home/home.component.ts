import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs'; // Import forkJoin to fetch data in parallel
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  getUsername(): string {
    return localStorage.getItem('username') || 'Guest';
  }

  // Logout function to clear the localStorage and redirect to login page
  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    this.router.navigate(['/login']); // Redirect to login page after logout
  }

  timetable: any = {
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: []
  };

  days: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  timeSlots: string[] = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

  subjects: any[] = [];
  teachers: any[] = [];
  classes: any[] = [];
  rooms: any[] = [];
  sessions: any[] = [];

  constructor(private http: HttpClient , private router: Router) {}

  ngOnInit(): void {
    // Fetch timetable data and related data for subjects, teachers, classes, and rooms
    this.getAllRelatedData();
  }

  // Fetch all related data (subjects, teachers, classes, rooms) in parallel
  getAllRelatedData(): void {
    const headers = this.getAuthHeaders();

    // Use forkJoin to fetch data in parallel
    forkJoin([
      this.http.get<any[]>('http://localhost:5000/classes', { headers }),
      this.http.get<any[]>('http://localhost:5000/subjects', { headers }),
      this.http.get<any[]>('http://localhost:5000/teachers', { headers }),
      this.http.get<any[]>('http://localhost:5000/rooms', { headers }),
      this.http.get<any[]>('http://localhost:5000/sessions', { headers })
    ]).subscribe(
      ([classes, subjects, teachers, rooms, sessions]) => {
        this.classes = classes;
        this.subjects = subjects;
        this.teachers = teachers;
        this.rooms = rooms;
        this.sessions = sessions;
        this.organizeTimetable(); // Call to organize timetable after all data is fetched
      },
      (error) => {
        console.error('Error fetching data', error);
      }
    );
  }

  // Organize sessions by day and time slot
  organizeTimetable(): void {
    this.timetable = {
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: []
    };

    this.sessions.forEach(session => {
      const day = session.day;
      const time = session.beginTime; // Adjust to match time slot (e.g., 08:00)

      // Get the related subject, teacher, room, and class names
      const subject = this.subjects.find(s => s.id === session.subject_id)?.name || '';
      const teacher = this.teachers.find(t => t.id === session.teacher_id)?.name || '';
      const room = this.rooms.find(r => r.id === session.room_id)?.name || '';
      const className = this.classes.find(c => c.id === session.class_id)?.name || '';

      // Ensure day is valid and then push the session to the timetable
      if (this.timetable[day]) {
        this.timetable[day].push({
          time,
          subject,
          teacher,
          room,
          className
        });
      }
    });
  }

  // Get the authentication headers
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    };
  }
}
