import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  acceptTerms: boolean;
}

interface SocialProvider {
  name: string;
  icon: string;
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
    password: '',
    confirmPassword: '',
    acceptTerms: false
  };

  socialProviders: SocialProvider[] = [
    {
      name: 'Google',
      icon: '<path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>'
    },
    {
      name: 'Twitter',
      icon: '<path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>'
    }
  ];

  showPassword = false;
  showConfirmPassword = false;
  isLoading = false;

  // Error states
  firstNameError = false;
  lastNameError = false;
  emailError = false;
  phoneError = false;
  passwordError = false;
  confirmPasswordError = false;
  termsError = false;

  constructor() { }

  ngOnInit() {
  }

  socialLogin(providerName: string) {
    console.log(`Social login with ${providerName}`);
    // Here you would implement the social login logic
    alert(`${providerName} login would be implemented here!`);
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

    // Simulate registration process
    this.isLoading = true;

    // Simulate API call
    setTimeout(() => {
      console.log('Registration attempt:', this.registerData);
      this.isLoading = false;

      // Here you would typically make an API call to register the user
      // For now, we'll just log the data
      alert('Registration functionality would be implemented here!');
    }, 2000);
  }
}
