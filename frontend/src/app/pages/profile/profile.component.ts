import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from '../../models/userModel';
import { UserApiService } from '../../network/services/user-api.service';
import { ApiResponse } from '../../network/services';
import { ProfileHeader } from "../../components/profile-header/profile-header";
import { Datepicker } from 'flowbite'; // take care

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  standalone: true,
  imports: [CommonModule, ProfileHeader]
})
export class ProfileComponent implements OnInit {
  automaticTimezone = true;
  currentUser: User | undefined = {} as User; // Initialize with an empty User object
  cuser: User | undefined = {} as User; // Initialize with an empty User object
  loading = true;
  error: string | null = null;

  constructor(private userService: UserApiService) { }

  ngOnInit() {
  this.loadUserProfile();
  }
  get avatarUrl(): string {
  return this.currentUser?.imgUrl || 'default-avatar.jpg';
}




  toggleAutomaticTimezone() {
    this.automaticTimezone = !this.automaticTimezone;
  }

  // Add methods for updating profile information
   updateProfile(field: string) {

if (field === 'birthday') {
  const inputEl = document.getElementById('edit-birthday') as HTMLInputElement;
  if (!inputEl) return;

  const datepickerInstance = new Datepicker(inputEl, {
    format: 'yyyy-mm-dd',
    autohide: true,
  });

  inputEl.addEventListener('changeDate', () => {
    const newValue = inputEl.value;
    if (newValue && this.currentUser?._id) {
      const dateValue = new Date(newValue); // Convert string → Date

      this.userService.patchUser(this.currentUser._id, { birthday: dateValue }).subscribe({
        next: (updatedUser) => {
          this.currentUser = this.toUser(updatedUser.data);
        },
        error: (err) => console.error(`Failed to update ${field}`, err)
      });
    }
  });

  datepickerInstance.show();
}

else {
      const newValue = prompt(`Enter new ${field}:`, this.currentUser?.[field as keyof typeof this.currentUser] as string);

      this.userService.patchUser(this.currentUser!._id!, { [field]: newValue }).subscribe({
        next: (updatedUser) => {
          this.currentUser = this.toUser(updatedUser.data); // update local data
        },
        error: (err) => {
          console.error(`Failed to update ${field}`, err);
        }
      });
   
    }
  }
  


  // Add this method to your ProfileComponent class
  // retryLoading() {
  //   this.loadUserProfile();
  // }




  private loadUserProfile() {
    this.loading = true; // Ensure loading is true when starting
    this.error = null;
    this.userService.getCurrentUser().subscribe({
      next: (response: ApiResponse<{ user: any }>) => {
        console.log('API Response:', response); // Debug log
        const dto = response.data?.user;
        if (dto) {
          this.currentUser = this.toUser(dto);
          console.log('Current User:', this.currentUser);
        } else {
          this.error = 'No user data returned';
        }
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

  private toUser(dto: any): User {
    return {
      _id: dto._id ?? dto.id,
      imgUrl: dto.imgUrl,
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      gender: dto.gender,
      birthday: dto.birthday ? new Date(dto.birthday) : undefined,
      role: dto.role,
      history: dto.history,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : undefined,
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : undefined,
    } as User;
  }
}
