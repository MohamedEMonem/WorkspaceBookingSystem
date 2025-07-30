import { Component, OnInit } from '@angular/core';
import { WorkspaceApiService } from '../../network/services/workspace-api.service';
import { Workspace } from '../../models/workspaceModel';

@Component({
  selector: 'app-workspaces',
  templateUrl: './workspaces.component.html',
  styleUrls: ['./workspaces.component.css']
})
export class WorkspacesComponent implements OnInit {
  workspaces: Workspace[] = [];
  loading: boolean = false;
  error: string | null = null;

  constructor(private workspaceApiService: WorkspaceApiService) { }

  ngOnInit(): void {
    this.loadWorkspaces();
  }

  loadWorkspaces(): void {
    this.loading = true;
    this.error = null;

    this.workspaceApiService.getAllWorkspaces().subscribe({
      next: (response) => {
        console.log('response', response);
        this.workspaces = response.data || [];
        this.loading = false;
        console.log('Workspaces loaded:', this.workspaces);
      },
      error: (error) => {
        this.error = error.message || 'Failed to load workspaces';
        this.loading = false;
        console.error('Error loading workspaces:', error);
      }
    });
  }

  refreshWorkspaces(): void {
    this.loadWorkspaces();
  }
}
