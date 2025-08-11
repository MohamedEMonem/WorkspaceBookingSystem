import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { API_ENDPOINTS, STORAGE_KEYS, ApiResponse } from '../constants';
import { User, LoginRequest, RegisterRequest, UpdateUserRequest, LoginResponse } from '../../models/userModel';

@Injectable({
  providedIn: 'root'
})
export class UserApiService {
  constructor(private httpService: HttpService) {}

  /**
   * Register a new user
   */
  register(userData: RegisterRequest): Observable<ApiResponse<LoginResponse>> {
    return this.httpService.post<LoginResponse>(API_ENDPOINTS.USERS.SIGNUP, userData);
  }

  /**
   * Login user
   */
  login(credentials: LoginRequest): Observable<ApiResponse<LoginResponse>> {
    return this.httpService.post<LoginResponse>(API_ENDPOINTS.USERS.LOGIN, credentials);
  }

  /**
   * Get current user profile
   */
  getCurrentUser(): Observable<ApiResponse<{ user: User }>> {
    return this.httpService.get<{ user: User }>(API_ENDPOINTS.USERS.ME);
  }

  /**
   * Get user by ID
   */
  getUserById(userId: string): Observable<ApiResponse<User>> {
    const endpoint = API_ENDPOINTS.USERS.BASE + `/${userId}`;
    return this.httpService.get<User>(endpoint);
  }

  /**
   * Update user profile
   */
  updateUser(userId: string, userData: UpdateUserRequest): Observable<ApiResponse<User>> {
    const endpoint = API_ENDPOINTS.USERS.BASE + `/${userId}`;
    return this.httpService.put<User>(endpoint, userData);
  }

  /**
   * Patch user profile
   */
  patchUser(userId: string, userData: Partial<UpdateUserRequest>): Observable<ApiResponse<User>> {
    const endpoint = API_ENDPOINTS.USERS.BASE + `/${userId}`;
    return this.httpService.patch<User>(endpoint, userData);
  }

  /**
   * Delete user account
   */
  deleteUser(userId: string): Observable<ApiResponse<{ message: string }>> {
    const endpoint = API_ENDPOINTS.USERS.BASE + `/${userId}`;
    return this.httpService.delete<{ message: string }>(endpoint);
  }

  /**
   * Logout current user
   */
  logout(): Observable<ApiResponse<{ message: string }>> {
    return this.httpService.post<{ message: string }>(API_ENDPOINTS.USERS.LOGOUT, {});
  }

  /**
   * Logout from all devices
   */
  logoutAllDevices(userId?: string): Observable<ApiResponse<{ message: string }>> {
    const endpoint = userId 
      ? API_ENDPOINTS.USERS.LOGOUT_ALL + `/${userId}`
      : API_ENDPOINTS.USERS.LOGOUT_ALL;
    return this.httpService.post<{ message: string }>(endpoint, {});
  }

  /**
   * Verify invite (admin only)
   */
  verifyInvite(inviteData: any): Observable<ApiResponse<{ message: string }>> {
    return this.httpService.post<{ message: string }>(API_ENDPOINTS.USERS.VERIFY_INVITE, inviteData);
  }

  /**
   * Signup with invite
   */
  signupWithInvite(signupData: any): Observable<ApiResponse<LoginResponse>> {
    return this.httpService.post<LoginResponse>(API_ENDPOINTS.USERS.SIGNUP_WITH_INVITE, signupData);
  }

  /**
   * Get token stats (admin only)
   */
  getTokenStats(): Observable<ApiResponse<any>> {
    return this.httpService.get<any>(API_ENDPOINTS.USERS.TOKEN_STATS);
  }

  /**
   * Create admin invite (admin only)
   */
  createAdminInvite(inviteData: any): Observable<ApiResponse<{ message: string }>> {
    return this.httpService.post<{ message: string }>(API_ENDPOINTS.USERS.ADMIN_INVITE, inviteData);
  }

  /**
   * Store user data in localStorage
   */
  storeUserData(userData: LoginResponse): void {
      console.log('Storing data in localStorage:', userData);

    localStorage.setItem(STORAGE_KEYS.USER_TOKEN, userData.token);
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData.user));
  }

  /**
   * Get stored user data from localStorage
   */
  getStoredUserData(): User | null {
    const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
    return userData ? JSON.parse(userData) : null;
  }

  /**
   * Clear stored user data from localStorage
   */
  clearStoredUserData(): void {
    localStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  }

  /**
   * Check if user is logged in
   */
  isLoggedIn(): boolean {
    const token = localStorage.getItem(STORAGE_KEYS.USER_TOKEN);
    return !!token;
  }

  /**
   * Get current user role
   */
  getCurrentUserRole(): string | null {
    const user = this.getStoredUserData();
    return user?.role || null;
  }

  /**
   * Check if current user is admin
   */
  isAdmin(): boolean {
    return this.getCurrentUserRole() === 'admin';
  }

  /**
   * Check if current user is owner
   */
  isOwner(): boolean {
    return this.getCurrentUserRole() === 'owner';
  }
} 