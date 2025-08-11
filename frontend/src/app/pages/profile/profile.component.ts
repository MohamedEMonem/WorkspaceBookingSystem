import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../models/userModel';
import { UserApiService } from '../../network/services/user-api.service';
import { ApiResponse } from '../../network/services';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ProfileComponent implements OnInit {
  automaticTimezone = true;
  currentUser: User | undefined = {} as User; // Initialize with an empty User object
  cuser: User | undefined = {} as User; // Initialize with an empty User object
  loading = true;
  error: string | null = null;

  constructor(private userService: UserApiService) { }

  ngOnInit() {
    this.loading = true; // Ensure loading is true when starting
    this.userService.getCurrentUser().subscribe({
      next: (response) => { // Changed type to ApiResponse<User>
        console.log('API Response:', response); // Debug log
        this.currentUser = response.data; // Assuming response.data is the User object
        console.log('Current User:', this.currentUser);

        this.loading = false;
      },
      error: (err) => {
        console.error('Error details:', err); // Debug log
        this.error = 'Error loading user data';
        this.loading = false;
      },
      complete: () => {
        this.loading = false; // Ensure loading is set to false when complete
      }
    });
  }
  

  toggleAutomaticTimezone() {
    this.automaticTimezone = !this.automaticTimezone;
  }

  // Add methods for updating profile information
  updateProfile(field: string) {
    // Implement update logic here
    console.log(`Updating ${field}`);
  }

  // Add this method to your ProfileComponent class
  // retryLoading() {
  //   this.loadUserProfile();
  // }

  // private loadUserProfile() {
  //   this.loading = true;
  //   this.userService.getCurrentUser().subscribe({
  //     next: (response: ApiResponse<User>) => {
  //       this.currentUser.data = response.data;
  //       this.loading = false;
  //     },
  //     error: (err) => {
  //       this.error = 'Error loading user data';
  //       this.loading = false;
  //     }
  //   });
  // }
}
