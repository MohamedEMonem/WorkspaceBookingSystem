import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RegisterRequest, LoginResponse } from '../../models/userModel';
import { UserApiService } from '../../network/services/user-api.service';

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: 'male' | 'female';
  birthday: string;  // We'll convert to Date when sending to API
  role: 'user' | 'owner';
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  standalone: true,
  imports: [FormsModule, CommonModule]
})
export class RegisterComponent implements OnInit {
  registerData: RegisterData = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: 'male',
    birthday: '',
    role: 'user',
    password: '',
    confirmPassword: '',
    acceptTerms: false
  };

  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;

  // Error states
  firstNameError = false;
  lastNameError = false;
  emailError = false;
  phoneError = false;
  genderError = false;
  birthdayError = false;
  roleError = false;
  passwordError = false;
  confirmPasswordError = false;
  termsError = false;

  constructor(
    private userApiService: UserApiService,
    private router: Router
  ) { }

  ngOnInit() {
    // Check if user is already logged in
    if (this.userApiService.isLoggedIn()) {
      // Redirect to home page if already logged in
      this.router.navigate(['/']);
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPassword() {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  validatePhone(phone: string): boolean {
    // Egyptian phone numbers: 11 digits, start with 010, 011, 012, or 015
    const phoneRegex = /^(010|011|012|015)\d{8}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  }

  validatePassword(password: string): boolean {
    return password.length >= 8;
  }

  validatePasswordMatch(password: string, confirmPassword: string): boolean {
    return password === confirmPassword;
  }

  onSubmit() {
    // Reset all errors
    this.firstNameError = false;
    this.lastNameError = false;
    this.emailError = false;
    this.phoneError = false;
    this.genderError = false;
    this.birthdayError = false;
    this.roleError = false;
    this.passwordError = false;
    this.confirmPasswordError = false;
    this.termsError = false;

    let hasErrors = false;

    // Validate first name
    if (!this.registerData.firstName.trim()) {
      this.firstNameError = true;
      hasErrors = true;
    }

    // Validate last name
    if (!this.registerData.lastName.trim()) {
      this.lastNameError = true;
      hasErrors = true;
    }

    // Validate email
    if (!this.registerData.email || !this.validateEmail(this.registerData.email)) {
      this.emailError = true;
      hasErrors = true;
    }

    // Validate phone (optional but if provided, must be valid)
    if (this.registerData.phone && !this.validatePhone(this.registerData.phone)) {
      this.phoneError = true;
      hasErrors = true;
    }

    // Validate gender
    if (!this.registerData.gender) {
      this.genderError = true;
      hasErrors = true;
    }

    // Validate birthday
    if (!this.registerData.birthday) {
      this.birthdayError = true;
      hasErrors = true;
    }

    // Validate role
    if (!this.registerData.role) {
      this.roleError = true;
      hasErrors = true;
    }

    // Validate password
    if (!this.registerData.password || !this.validatePassword(this.registerData.password)) {
      this.passwordError = true;
      hasErrors = true;
    }

    // Validate confirm password
    if (!this.registerData.confirmPassword || !this.validatePasswordMatch(this.registerData.password, this.registerData.confirmPassword)) {
      this.confirmPasswordError = true;
      hasErrors = true;
    }

    // Validate terms acceptance
    if (!this.registerData.acceptTerms) {
      this.termsError = true;
      hasErrors = true;
    }

    if (hasErrors) {
      return;
    }

    // Prepare registration data for API
    this.isLoading = true;

    // Create RegisterRequest object combining first and last name
    const registerRequest: RegisterRequest = {
      name: `${this.registerData.firstName.trim()} ${this.registerData.lastName.trim()}`,
      email: this.registerData.email,
      phone: this.registerData.phone,
      gender: this.registerData.gender,
      birthday: this.registerData.birthday ? new Date(this.registerData.birthday) : undefined,
      role: this.registerData.role,
      password: this.registerData.password
    };

    // Call the API
    this.userApiService.register(registerRequest).subscribe({
      next: (response: any) => {
        console.log('Registration successful:', response);
        this.isLoading = false;

        // Check if response has data property (like login) or direct properties
        let tokenData, userData;

        if (response.data && response.data.token && response.data.user) {
          // Response wrapped in data property (like login)
          tokenData = response.data.token;
          userData = response.data.user;
        } else if (response.token && response.user) {
          // Response has direct properties
          tokenData = response.token;
          userData = response.user;
        }

        if (tokenData && userData) {
          // Create LoginResponse object for storeUserData (matching login format)
          const loginResponse: LoginResponse = {
            message: response.message || 'Registration successful',
            token: tokenData,
            user: userData
          };

          // Store user data and token
          this.userApiService.storeUserData(loginResponse);

          // Redirect to home page or dashboard
          this.router.navigate(['/']);

          // Show success message
          // alert('Registration successful! Welcome to Deskly!');
        } else {
          console.error('Invalid response structure:', response);
          alert('Registration successful but login data is missing. Please login manually.');
        }
      },
      error: (error) => {
        console.error('Registration failed:', error);
        this.isLoading = false;

        // Handle specific error messages
        if (error.error && error.error.error) {
          alert(`Registration failed: ${error.error.error}`);
        } else {
          alert('Registration failed. Please try again.');
        }
      }
    });
  }
}
