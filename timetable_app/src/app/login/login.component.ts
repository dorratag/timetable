import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private http: HttpClient, private router: Router) {}

  login() {
    const credentials = { username: this.username, password: this.password };
    
    this.http.post('http://localhost:5000/login', credentials)
      .subscribe({
        next: (response: any) => {
          localStorage.setItem('token', response.token); // Store the token in localStorage
          localStorage.setItem('username', this.username); 
          this.router.navigate(['/home']); // Redirect to home page
        },
        error: (err) => {
          this.errorMessage = err.error.message; // Display error message
        }
      });
  }
}
