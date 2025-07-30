import { Component, OnInit } from '@angular/core';
import { SolutionsApiService } from '../../network/services/solutions-api.service';
import { ApiResponse } from '../../network/constants';

@Component({
  selector: 'app-solutions',
  templateUrl: './solutions.component.html',
  styleUrls: []
})
export class SolutionsComponent implements OnInit {
  solutionsStructure: any = null;
  loading: boolean = false;
  error: string | null = null;

  constructor(private solutionsApiService: SolutionsApiService) { }

  ngOnInit(): void {
    this.loadSolutionsStructure();
  }

  loadSolutionsStructure(): void {
    this.loading = true;
    this.error = null;

    this.solutionsApiService.getSolutionsStructure().subscribe({
      next: (response: ApiResponse<any>) => {
        this.solutionsStructure = response.data || {};
        this.loading = false;
        console.log('Solutions structure loaded:', this.solutionsStructure);
      },
      error: (error: any) => {
        this.error = error.message || 'Failed to load solutions structure';
        this.loading = false;
        console.error('Error loading solutions structure:', error);
      }
    });
  }

  refreshSolutions(): void {
    this.loadSolutionsStructure();
  }
} 