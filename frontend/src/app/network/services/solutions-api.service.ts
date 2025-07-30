import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { API_ENDPOINTS, ApiResponse } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class SolutionsApiService {
  constructor(private httpService: HttpService) {}

  /**
   * Get all solutions structure
   */
  getSolutionsStructure(): Observable<ApiResponse<any>> {
    return this.httpService.get<any>(API_ENDPOINTS.SOLUTIONS.GET_ALL);
  }

  /**
   * Get workspaces by subsolution
   */
  getWorkspacesBySubsolution(subsolution: string): Observable<ApiResponse<any>> {
    const endpoint = API_ENDPOINTS.SOLUTIONS.GET_BY_SUBSOLUTION.replace(':subsolution', subsolution);
    return this.httpService.get<any>(endpoint);
  }
} 