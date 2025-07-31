import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpErrorResponse, HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of } from 'rxjs';
import { catchError, timeout, retry, finalize, tap } from 'rxjs/operators';
import { 
  BASE_URL, 
  REQUEST_TIMEOUT, 
  ERROR_MESSAGES, 
  STORAGE_KEYS,
  ApiResponse 
} from './constants';

@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public loading$ = this.loadingSubject.asObservable();

  constructor(private http: HttpClient) {}

  /**
   * Get request with proper Angular patterns
   */
  get<T>(endpoint: string, params?: any): Observable<ApiResponse<T>> {
    this.setLoading(true);
    const url = this.buildUrl(endpoint);
    const httpParams = this.buildParams(params);
    
    return this.http.get<ApiResponse<T>>(url, { 
      params: httpParams,
      headers: this.getHeaders()
    }).pipe(
      timeout(REQUEST_TIMEOUT),
      retry(1),
      tap(() => this.setLoading(false)),
      catchError((error: HttpErrorResponse) => {
        this.setLoading(false);
        return this.handleError(error);
      })
    );
  }

  /**
   * Post request with proper Angular patterns
   */
  post<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    this.setLoading(true);
    const url = this.buildUrl(endpoint);

    return this.http.post<ApiResponse<T>>(url, data, {
      headers: this.getHeaders()
    }).pipe(
      timeout(REQUEST_TIMEOUT),
      tap(() => this.setLoading(false)),
      catchError((error: HttpErrorResponse) => {
        this.setLoading(false);
        return this.handleError(error);
      })
    );
  }

  /**
   * Put request with proper Angular patterns
   */
  put<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    this.setLoading(true);
    const url = this.buildUrl(endpoint);

    return this.http.put<ApiResponse<T>>(url, data, {
      headers: this.getHeaders()
    }).pipe(
      timeout(REQUEST_TIMEOUT),
      tap(() => this.setLoading(false)),
      catchError((error: HttpErrorResponse) => {
        this.setLoading(false);
        return this.handleError(error);
      })
    );
  }

  /**
   * Patch request with proper Angular patterns
   */
  patch<T>(endpoint: string, data: any): Observable<ApiResponse<T>> {
    this.setLoading(true);
    const url = this.buildUrl(endpoint);

    return this.http.patch<ApiResponse<T>>(url, data, {
      headers: this.getHeaders()
    }).pipe(
      timeout(REQUEST_TIMEOUT),
      tap(() => this.setLoading(false)),
      catchError((error: HttpErrorResponse) => {
        this.setLoading(false);
        return this.handleError(error);
      })
    );
  }

  /**
   * Delete request with proper Angular patterns
   */
  delete<T>(endpoint: string): Observable<ApiResponse<T>> {
    this.setLoading(true);
    const url = this.buildUrl(endpoint);

    return this.http.delete<ApiResponse<T>>(url, {
      headers: this.getHeaders()
    }).pipe(
      timeout(REQUEST_TIMEOUT),
      tap(() => this.setLoading(false)),
      catchError((error: HttpErrorResponse) => {
        this.setLoading(false);
        return this.handleError(error);
      })
    );
  }

  /**
   * Upload file with proper Angular patterns
   */
  uploadFile<T>(endpoint: string, file: File): Observable<ApiResponse<T>> {
    this.setLoading(true);
    const url = this.buildUrl(endpoint);
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<ApiResponse<T>>(url, formData, {
      headers: this.getHeaders(true)
    }).pipe(
      timeout(REQUEST_TIMEOUT),
      tap(() => this.setLoading(false)),
      catchError((error: HttpErrorResponse) => {
        this.setLoading(false);
        return this.handleError(error);
      })
    );
  }

  /**
   * Build full URL from endpoint
   */
  private buildUrl(endpoint: string): string {
    return `${BASE_URL}${endpoint}`;
  }

  /**
   * Build HTTP parameters using Angular's HttpParams
   */
  private buildParams(params: any): HttpParams {
    let httpParams = new HttpParams();
    
    if (params) {
      Object.keys(params).forEach(key => {
        if (params[key] !== null && params[key] !== undefined) {
          httpParams = httpParams.set(key, params[key].toString());
        }
      });
    }

    return httpParams;
  }

  /**
   * Get headers with authentication token using Angular's HttpHeaders
   */
  private getHeaders(isFormData: boolean = false): HttpHeaders {
    let headers = new HttpHeaders();

    if (!isFormData) {
      headers = headers.set('Content-Type', 'application/json');
    }

    const token = this.getToken();
    if (token) {
      headers = headers.set('Authorization', `Bearer ${token}`);
    }

    return headers;
  }

  /**
   * Get authentication token from localStorage
   */
  private getToken(): string | null {
    return localStorage.getItem(STORAGE_KEYS.USER_TOKEN);
  }

  /**
   * Set loading state using Angular's BehaviorSubject
   */
  private setLoading(loading: boolean): void {
    this.loadingSubject.next(loading);
  }

  /**
   * Handle HTTP errors using Angular's error handling patterns
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = ERROR_MESSAGES.SERVER_ERROR;

    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message || ERROR_MESSAGES.NETWORK_ERROR;
    } else {
      // Server-side error
      switch (error.status) {
        case 400:
          errorMessage = error.error?.message || ERROR_MESSAGES.VALIDATION_ERROR;
          break;
        case 401:
          errorMessage = ERROR_MESSAGES.UNAUTHORIZED;
          this.handleUnauthorized();
          break;
        case 403:
          errorMessage = ERROR_MESSAGES.FORBIDDEN;
          break;
        case 404:
          errorMessage = ERROR_MESSAGES.NOT_FOUND;
          break;
        case 409:
          errorMessage = error.error?.message || 'Resource already exists.';
          break;
        case 500:
          errorMessage = ERROR_MESSAGES.SERVER_ERROR;
          break;
        default:
          errorMessage = error.error?.message || ERROR_MESSAGES.SERVER_ERROR;
      }
    }

    console.error('HTTP Error:', error);
    return throwError(() => new Error(errorMessage));
  }

  /**
   * Handle unauthorized access
   */
  private handleUnauthorized(): void {
    // Clear stored tokens
    localStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);

    // Redirect to login page
    window.location.href = '/login';
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    const token = this.getToken();
    return !!token;
  }

  /**
   * Clear authentication data
   */
  logout(): void {
    localStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER_DATA);
  }
} 