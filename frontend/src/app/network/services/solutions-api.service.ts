import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseApiService } from './base-api.service';
import { API_ENDPOINTS } from '../constants';

export interface SolutionsStructure {
  privateWorkspace?: string[];
  additionalSolutions?: string[];
  coworkingAccess?: string[];
  [key: string]: string[] | undefined;
}

@Injectable({
  providedIn: 'root'
})
export class SolutionsApiService extends BaseApiService {
  
  /**
   * Get all solutions structure using Angular patterns
   */
  getSolutionsStructure(): Observable<SolutionsStructure> {
    return this.get<SolutionsStructure>(API_ENDPOINTS.SOLUTIONS.GET_ALL);
  }

  /**
   * Get workspaces by subsolution using Angular patterns
   */
  getWorkspacesBySubsolution(subsolution: string): Observable<any[]> {
    const endpoint = API_ENDPOINTS.SOLUTIONS.GET_BY_SUBSOLUTION.replace(':subsolution', subsolution);
    return this.get<any[]>(endpoint);
  }
} 