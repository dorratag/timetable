import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';
  successMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  register() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match!';
      return;
    }

    const newUser = { username: this.username, password: this.password };

    this.http.post('http://localhost:5000/register', newUser)
      .subscribe({
        next: (response: any) => {
          this.successMessage = 'Registration successful! You can now login.';
          this.errorMessage = '';
        },
        error: (err) => {
          this.errorMessage = err.error.message;
          this.successMessage = '';
        }
      });
  }
}
