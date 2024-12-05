import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-rooms',
  templateUrl: './rooms.component.html',
  styleUrls: ['./rooms.component.css']
})
export class RoomsComponent implements OnInit {
  rooms: any[] = [];
  newRoom: any = { id: '', name: '', capacity: 0 }; // Include id field for manual entry
  selectedRoom: any = '';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.getRooms();
  }

  // Fetch all rooms from the backend
  getRooms(): void {
    const headers = this.getAuthHeaders();
    this.http.get<any[]>('http://localhost:5000/rooms', { headers })
      .subscribe(data => {
        this.rooms = data;
      });
  }

  // Add a new room
  addRoom(): void {
    if (this.newRoom.id && this.newRoom.name && this.newRoom.capacity) {
      const headers = this.getAuthHeaders();
      this.http.post('http://localhost:5000/rooms', this.newRoom, { headers })
        .subscribe(() => {
          this.getRooms();
          this.newRoom.id = ''; // Clear id after adding
          this.newRoom.name = ''; // Clear name after adding
          this.newRoom.capacity = 0; // Clear capacity after adding
          this.closeAddModal(); // Close modal
        });
    } else {
      alert('Please fill in all fields (ID, Name, and Capacity).');
    }
  }

  // Open Add Room Modal
  openAddModal(): void {
    const modal = new (window as any).bootstrap.Modal(document.getElementById('addRoomModal'));
    modal.show();
  }

  // Close Add Room Modal
  closeAddModal(): void {
    const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('addRoomModal'));
    modal.hide();
  }

  // Open Edit Room Modal
  openEditModal(room: any): void {
    this.selectedRoom = { ...room }; // Copy the room data for editing
    const modal = new (window as any).bootstrap.Modal(document.getElementById('editRoomModal'));
    modal.show();
  }

  // Update room details
  updateRoom(): void {
    if (this.selectedRoom.id && this.selectedRoom.name && this.selectedRoom.capacity) {
      const headers = this.getAuthHeaders();
      this.http.put(`http://localhost:5000/rooms/${this.selectedRoom.id}`, this.selectedRoom, { headers })
        .subscribe(() => {
          this.getRooms();
          this.closeEditModal(); // Close modal after update
        });
    } else {
      alert('Please fill in all fields (ID, Name, and Capacity).');
    }
  }

  // Close Edit Room Modal
  closeEditModal(): void {
    const modal = (window as any).bootstrap.Modal.getInstance(document.getElementById('editRoomModal'));
    modal.hide();
  }

  // Delete room
  deleteRoom(id: string): void {
    const headers = this.getAuthHeaders();
    this.http.delete(`http://localhost:5000/rooms/${id}`, { headers })
      .subscribe(() => {
        this.getRooms(); // Reload the list after deletion
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
