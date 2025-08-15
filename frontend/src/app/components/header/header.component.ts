import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { STORAGE_KEYS } from '../../network/constants';
import { AuthService } from '../../network/services/auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  profileImage: string | null = null;

  constructor(private authService: AuthService, private router: Router) {
    // Check auth status on route changes
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkAuthStatus();
    });
  }

  ngOnInit() {
    // Initial check on component load
    this.checkAuthStatus();
    
    // Listen for storage events (in case token changes in another tab)
   this.authService.isLoggedIn$.subscribe(status => {
      this.isLoggedIn = status;
      const userdata = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      if(userdata){
        this.profileImage = JSON.parse(userdata).imageUrl || "default-avatar.jpg";
      }
    });
    


  }

checkAuthStatus() {
  const token = localStorage.getItem(STORAGE_KEYS.USER_TOKEN);
  this.isLoggedIn = !!token;
}

  logout() {
    localStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    this.isLoggedIn = false;
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
