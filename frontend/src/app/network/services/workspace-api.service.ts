import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { API_ENDPOINTS, ApiResponse, PaginatedResponse } from '../constants';
import { Workspace, CreateWorkspaceRequest, UpdateWorkspaceRequest, WorkspaceFilterParams } from '../../models/workspaceModel';

@Injectable({
  providedIn: 'root'
})
export class WorkspaceApiService {
  constructor(private httpService: HttpService) {}

  /**
   * Get all workspaces
   */
  getAllWorkspaces(params?: WorkspaceFilterParams): Observable<ApiResponse<Workspace[]>> {
    console.log('getAllWorkspaces', params);
    return this.httpService.get<Workspace[]>(API_ENDPOINTS.WORKSPACES.GET_ALL, params);
  }

  /**
   * Get workspace by ID
   */
  getWorkspaceById(workspaceId: string): Observable<ApiResponse<Workspace>> {
    const endpoint = API_ENDPOINTS.WORKSPACES.GET_BY_ID.replace(':id', workspaceId);
    return this.httpService.get<Workspace>(endpoint);
  }

  /**
   * Create new workspace
   */
  createWorkspace(workspaceData: CreateWorkspaceRequest): Observable<ApiResponse<Workspace>> {
    return this.httpService.post<Workspace>(API_ENDPOINTS.WORKSPACES.CREATE, workspaceData);
  }

  /**
   * Update workspace
   */
  updateWorkspace(workspaceId: string, workspaceData: UpdateWorkspaceRequest): Observable<ApiResponse<Workspace>> {
    const endpoint = API_ENDPOINTS.WORKSPACES.UPDATE.replace(':id', workspaceId);
    return this.httpService.put<Workspace>(endpoint, workspaceData);
  }

  /**
   * Patch workspace
   */
  patchWorkspace(workspaceId: string, workspaceData: Partial<UpdateWorkspaceRequest>): Observable<ApiResponse<Workspace>> {
    const endpoint = API_ENDPOINTS.WORKSPACES.PATCH.replace(':id', workspaceId);
    return this.httpService.patch<Workspace>(endpoint, workspaceData);
  }

  /**
   * Delete workspace
   */
  deleteWorkspace(workspaceId: string): Observable<ApiResponse<{ message: string }>> {
    const endpoint = API_ENDPOINTS.WORKSPACES.DELETE.replace(':id', workspaceId);
    return this.httpService.delete<{ message: string }>(endpoint);
  }

  /**
   * Get workspaces by owner
   */
  getWorkspacesByOwner(ownerId: string, params?: any): Observable<ApiResponse<Workspace[]>> {
    // This would need to be implemented in the backend
    // For now, we'll filter from all workspaces
    return this.getAllWorkspaces({ ...params, ownerId });
  }

  /**
   * Search workspaces by location
   */
  searchWorkspacesByLocation(location: string, params?: any): Observable<ApiResponse<Workspace[]>> {
    return this.getAllWorkspaces({ ...params, location });
  }

  /**
   * Filter workspaces by capacity
   */
  filterWorkspacesByCapacity(capacity: number, params?: any): Observable<ApiResponse<Workspace[]>> {
    return this.getAllWorkspaces({ ...params, capacity });
  }

  /**
   * Get workspaces by rating
   */
  getWorkspacesByRating(rating: string, params?: any): Observable<ApiResponse<Workspace[]>> {
    return this.getAllWorkspaces({ ...params, rating });
  }
} 