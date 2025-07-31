import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());

  // Observable that other components can subscribe to
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor() {}

  private hasToken(): boolean {
    return !!localStorage.getItem('token');
  }

  // Call this after login
  login(token: string) {
    localStorage.setItem('token', token);
    this.isLoggedInSubject.next(true);
  }

  // Call this when logging out
  logout() {
    localStorage.removeItem('token');
    this.isLoggedInSubject.next(false);
  }
}
