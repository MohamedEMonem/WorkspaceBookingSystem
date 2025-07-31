import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserApiService } from '../../network/services/user-api.service';
import { LoginRequest } from '../../models/userModel';
import { STORAGE_KEYS } from '../../network/constants'; // Adjust the path as needed
import { AuthService } from '../../network/services/auth.service';
import { Router } from '@angular/router';
interface SocialProvider {
  name: string;
  icon: string;
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class LoginComponent implements OnInit {
  loginData = {
    email: '',
    password: '',
    rememberMe: false
  };

  socialProviders: SocialProvider[] = [
    {
      name: 'Google',
      icon: '...' // icons omitted for brevity
    },
    {
      name: 'Twitter',
      icon: '...'
    }
  ];

  showPassword = false;
  isLoading = false;
  emailError = false;
  passwordError = false;
  errorMessage = '';

  constructor(
    private userApi: UserApiService ,
    private authService: AuthService,
    private router: Router
  
  ) {}

  ngOnInit() {}

  socialLogin(providerName: string) {
    alert(`${providerName} login would be implemented here!`);
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  onSubmit() {
    this.emailError = false;
    this.passwordError = false;
    this.errorMessage = '';

    if (!this.loginData.email || !this.validateEmail(this.loginData.email)) {
      this.emailError = true;
      return;
    }

    if (!this.loginData.password) {
      this.passwordError = true;
      return;
    }

    this.isLoading = true;
console.log('Login data:', this.loginData);

    this.userApi.login(this.loginData).subscribe({
      next: (response) => {
        console.log('Full login response:', response);
        // console.log('Response data:', response.token);
console.log('Type of response:', response.data);
        if (response && response.data && response.data.token) {
          
          this.userApi.storeUserData(response.data);
          this.authService.login(response.data.token);
          this.router.navigate(['/workspaces']);
          // Verify storage immediately after
          console.log('Token after storage:', localStorage.getItem(STORAGE_KEYS.USER_TOKEN));
        } else {
          this.errorMessage = 'Invalid response from server';
        }
        this.isLoading = false;
        // Example: redirect to dashboard or home
        // this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.error?.message || 'Login failed';
      }
    });
  }
}
