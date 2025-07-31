import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { BASE_URL, ApiResponse } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class BaseApiService {
  protected baseUrl = BASE_URL;

  constructor(protected http: HttpClient) {}

  /**
   * GET request with proper Angular patterns
   */
  protected get<T>(endpoint: string, params?: any): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const httpParams = this.buildParams(params);

    return this.http.get<ApiResponse<T>>(url, { params: httpParams }).pipe(
      map(response => response.data as T),
      catchError(this.handleError)
    );
  }

  /**
   * POST request with proper Angular patterns
   */
  protected post<T>(endpoint: string, data: any): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;

    return this.http.post<ApiResponse<T>>(url, data).pipe(
      map(response => response.data as T),
      catchError(this.handleError)
    );
  }

  /**
   * PUT request with proper Angular patterns
   */
  protected put<T>(endpoint: string, data: any): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;

    return this.http.put<ApiResponse<T>>(url, data).pipe(
      map(response => response.data as T),
      catchError(this.handleError)
    );
  }

  /**
   * PATCH request with proper Angular patterns
   */
  protected patch<T>(endpoint: string, data: any): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;

    return this.http.patch<ApiResponse<T>>(url, data).pipe(
      map(response => response.data as T),
      catchError(this.handleError)
    );
  }

  /**
   * DELETE request with proper Angular patterns
   */
  protected delete<T>(endpoint: string): Observable<T> {
    const url = `${this.baseUrl}${endpoint}`;

    return this.http.delete<ApiResponse<T>>(url).pipe(
      map(response => response.data as T),
      catchError(this.handleError)
    );
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
   * Handle errors using Angular's error handling patterns
   */
  private handleError(error: any): Observable<never> {
    console.error('API Error:', error);
    return new Observable(observer => {
      observer.error(error);
    });
  }
} 