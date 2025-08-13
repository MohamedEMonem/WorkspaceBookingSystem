import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-profile-header',
  imports: [],
  templateUrl: './profile-header.html',
  styleUrl: './profile-header.css'
})
export class ProfileHeader {

  @Input() name!: string;
  @Input() email!: string;
  @Input() bio!: string;
@Input() avatar: string | undefined = 'default-avatar.jpg';
  @Input() headerImage!: string;
  @Input() socialLinks!: { icon: string, label: string, url: string }[];

setDefaultAvatar(event: Event) {
    (event.target as HTMLImageElement).src = 'default-avatar.jpg';
  }

  setDefaultHeader(event: Event) {
    (event.target as HTMLImageElement).src = 'default-header.png';
  }


}
