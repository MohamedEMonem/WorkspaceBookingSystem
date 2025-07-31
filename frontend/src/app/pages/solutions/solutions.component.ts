import { Component, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { SolutionsApiService, SolutionsStructure } from '../../network/services';
import { loading$ } from '../../network/interceptors';

interface WorkspaceSolution {
  name: string;
  description: string;
  features: string[];
  price: string;
  capacity: string;
  image?: string;
  type?: string;
}

interface ProcessedWorkspace {
  id: string;
  name: string;
  description: string;
  features: string[];
  price: string;
  capacity: string;
  image: string;
  type: string;
  solution: string;
  available: boolean;
}

@Component({
  selector: 'app-solutions',
  templateUrl: './solutions.component.html',
  styleUrls: [],
  imports: [AsyncPipe],
  standalone: true
})
export class SolutionsComponent implements OnInit {
  solutionsStructure: SolutionsStructure | null = null;
  loading$ = loading$; // Use the global loading state from interceptor
  error: string | null = null;
  activeTab: string = 'dedicated-desk';
  availableWorkspaces: ProcessedWorkspace[] = [];

  constructor(private solutionsApiService: SolutionsApiService) { }

  ngOnInit(): void {
    this.loadSolutionsStructure();
  }

  loadSolutionsStructure(): void {
    this.error = null;

    this.solutionsApiService.getSolutionsStructure().subscribe({
      next: (data: SolutionsStructure) => {
        this.solutionsStructure = data;
        console.log('Solutions structure loaded:', this.solutionsStructure);
        this.loadAvailableWorkspaces();
      },
      error: (error: any) => {
        this.error = error.message || 'Failed to load solutions structure';
        console.error('Error loading solutions structure:', error);
      }
    });
  }

  loadAvailableWorkspaces(): void {
    this.availableWorkspaces = [];

    // Process private workspace solutions
    if (this.solutionsStructure?.privateWorkspace) {
      this.solutionsStructure.privateWorkspace.forEach((solution: any, index: number) => {
        if (typeof solution === 'object' && solution.name) {
          // New API structure with full object
          this.availableWorkspaces.push({
            id: `private-${index}`,
            name: solution.name,
            description: solution.description || 'Professional workspace solution',
            features: solution.features || ['Professional amenities', '24/7 access'],
            price: solution.price || 'Contact for pricing',
            capacity: solution.capacity || '1-10 people',
            image: solution.image || this.getDefaultImage(),
            type: this.mapSolutionToType(solution.name),
            solution: solution.name,
            available: true
          });
        } else if (typeof solution === 'string') {
          // Legacy API structure with just strings
          this.availableWorkspaces.push({
            id: `private-${index}`,
            name: this.getWorkspaceName(solution),
            description: this.getWorkspaceDescription(solution),
            features: this.getWorkspaceFeatures(solution),
            price: this.getPriceForType(this.mapSolutionToType(solution)),
            capacity: this.getCapacityForType(this.mapSolutionToType(solution)),
            image: this.getWorkspaceImage(solution),
            type: this.mapSolutionToType(solution),
            solution: solution,
            available: true
          });
        }
      });
    }

    // Process additional solutions
    if (this.solutionsStructure?.additionalSolutions) {
      this.solutionsStructure.additionalSolutions.forEach((solution: any, index: number) => {
        if (typeof solution === 'object' && solution.name) {
          // New API structure
          this.availableWorkspaces.push({
            id: `additional-${index}`,
            name: solution.name,
            description: solution.description || 'Additional workspace service',
            features: solution.features || ['Premium service', 'Enhanced amenities'],
            price: solution.price || 'Contact for pricing',
            capacity: solution.capacity || 'Flexible',
            image: solution.image || this.getDefaultImage(),
            type: 'additional',
            solution: solution.name,
            available: true
          });
        } else if (typeof solution === 'string') {
          // Legacy API structure
          this.availableWorkspaces.push({
            id: `additional-${index}`,
            name: solution,
            description: `Premium ${solution} service with enhanced amenities`,
            features: ['Premium service', 'Enhanced amenities', 'Professional support'],
            price: 'Contact for pricing',
            capacity: 'Flexible',
            image: this.getDefaultImage(),
            type: 'additional',
            solution: solution,
            available: true
          });
        }
      });
    }

    // Process coworking access solutions
    if (this.solutionsStructure?.coworkingAccess) {
      this.solutionsStructure.coworkingAccess.forEach((solution: any, index: number) => {
        if (typeof solution === 'object' && solution.name) {
          // New API structure
          this.availableWorkspaces.push({
            id: `coworking-${index}`,
            name: solution.name,
            description: solution.description || 'Flexible coworking solution',
            features: solution.features || ['Flexible access', 'Shared amenities'],
            price: solution.price || 'Contact for pricing',
            capacity: solution.capacity || 'Individual',
            image: solution.image || this.getDefaultImage(),
            type: 'coworking',
            solution: solution.name,
            available: true
          });
        } else if (typeof solution === 'string') {
          // Legacy API structure
          this.availableWorkspaces.push({
            id: `coworking-${index}`,
            name: solution,
            description: `Flexible ${solution} with shared amenities`,
            features: ['Flexible access', 'Shared amenities', 'Community space'],
            price: 'Contact for pricing',
            capacity: 'Individual',
            image: this.getDefaultImage(),
            type: 'coworking',
            solution: solution,
            available: true
          });
        }
      });
    }
  }

  mapSolutionToType(solution: string): string {
    const solutionLower = solution.toLowerCase();
    if (solutionLower.includes('dedicated') || solutionLower.includes('desk')) {
      return 'dedicated-desk';
    } else if (solutionLower.includes('private') || solutionLower.includes('office')) {
      return 'private-office';
    } else if (solutionLower.includes('floor') || solutionLower.includes('full')) {
      return 'full-floor-office';
    } else {
      return 'dedicated-desk'; // default
    }
  }

  // Fallback methods for legacy API structure
  getWorkspaceName(solution: string): string {
    const names = [
      'Cairo DeskHub',
      'Alexandria Workspace',
      'Giza Business Center',
      'Mansoura DeskHub',
      'Zagazig Workspace',
      'Modern Co-Working Space'
    ];
    return names[Math.floor(Math.random() * names.length)];
  }

  getWorkspaceDescription(solution: string): string {
    const descriptions = {
      'dedicated-desk': 'Your own desk in a shared office with 24/7 keycard access.',
      'private-office': 'Move-in ready office with shared or private amenities.',
      'full-floor-office': 'Furnished, customizable office on a private floor.',
      'meeting-room': 'Professional meeting rooms for your business needs.',
      'event-space': 'Versatile event spaces for conferences and gatherings.'
    };
    
    const type = this.mapSolutionToType(solution);
    return descriptions[type as keyof typeof descriptions] || 'Professional workspace solution';
  }

  getWorkspaceFeatures(solution: string): string[] {
    const features = {
      'dedicated-desk': [
        'Monthly membership',
        'Flexible commitment terms',
        '24/7 keycard access',
        'High-speed Wi-Fi',
        'Meeting rooms included'
      ],
      'private-office': [
        'Monthly or annual membership',
        '1-20+ people',
        '24/7 access',
        'Furnished office space',
        'Professional amenities'
      ],
      'full-floor-office': [
        'Customizable floor plans',
        '50+ people capacity',
        'Private amenities',
        'Dedicated support',
        'Custom branding options'
      ]
    };
    
    const type = this.mapSolutionToType(solution);
    return features[type as keyof typeof features] || ['Professional amenities', '24/7 access'];
  }

  getPriceForType(type: string): string {
    switch (type) {
      case 'dedicated-desk':
        return 'Starting at $299/month';
      case 'private-office':
        return 'Starting at $599/month';
      case 'full-floor-office':
        return 'Contact sales';
      default:
        return 'Contact for pricing';
    }
  }

  getCapacityForType(type: string): string {
    switch (type) {
      case 'dedicated-desk':
        return '1 person';
      case 'private-office':
        return '1-20+ people';
      case 'full-floor-office':
        return '50+ people';
      default:
        return 'Flexible';
    }
  }

  getWorkspaceImage(solution: string): string {
    const images = [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400'
    ];
    return images[Math.floor(Math.random() * images.length)];
  }

  getDefaultImage(): string {
    return 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400';
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  getCurrentWorkspaceType(): any {
    const workspaceTypes = {
      'dedicated-desk': {
        title: 'Dedicated Desk',
        subtitle: 'Your own desk in a shared office',
        description: 'Good for individuals and small teams. 24/7 keycard access to your own desk in a shared office. Turnkey space includes Wi-Fi, coffee, on-site support, and more.',
        features: [
          'Monthly membership',
          'Flexible commitment terms',
          '24/7 keycard access',
          'High-speed Wi-Fi',
          'Meeting rooms included',
          'On-site support'
        ],
        icon: 'desk'
      },
      'private-office': {
        title: 'Private Office',
        subtitle: 'Move-in ready office with shared or private amenities',
        description: 'Furnished, move-in ready office for individuals and teams with access to the building\'s shared professional amenities and the ability to book meeting rooms.',
        features: [
          'Monthly or annual membership',
          '1-20+ people',
          '24/7 access',
          'Furnished office space',
          'Professional amenities',
          'Guest policy allowed'
        ],
        icon: 'office'
      },
      'full-floor-office': {
        title: 'Full Floor Office',
        subtitle: 'Furnished, customizable office on a private floor',
        description: 'Complete floor solutions for larger teams. Customizable office space with private amenities and dedicated support for enterprise-level needs.',
        features: [
          'Customizable floor plans',
          '50+ people capacity',
          'Private amenities',
          'Dedicated support',
          'Custom branding options',
          'Enterprise solutions'
        ],
        icon: 'building'
      }
    };
    
    return workspaceTypes[this.activeTab as keyof typeof workspaceTypes];
  }

  getWorkspacesByType(type: string): ProcessedWorkspace[] {
    return this.availableWorkspaces.filter(ws => ws.type === type);
  }

  getUniqueSolutions(): string[] {
    const allSolutions: string[] = [];
    
    if (this.solutionsStructure?.privateWorkspace) {
      this.solutionsStructure.privateWorkspace.forEach((solution: any) => {
        if (typeof solution === 'object' && solution.name) {
          allSolutions.push(solution.name);
        } else if (typeof solution === 'string') {
          allSolutions.push(solution);
        }
      });
    }
    if (this.solutionsStructure?.additionalSolutions) {
      this.solutionsStructure.additionalSolutions.forEach((solution: any) => {
        if (typeof solution === 'object' && solution.name) {
          allSolutions.push(solution.name);
        } else if (typeof solution === 'string') {
          allSolutions.push(solution);
        }
      });
    }
    if (this.solutionsStructure?.coworkingAccess) {
      this.solutionsStructure.coworkingAccess.forEach((solution: any) => {
        if (typeof solution === 'object' && solution.name) {
          allSolutions.push(solution.name);
        } else if (typeof solution === 'string') {
          allSolutions.push(solution);
        }
      });
    }
    
    return [...new Set(allSolutions)]; // Remove duplicates
  }

  getSolutionsByCategory(category: string): any[] {
    return this.solutionsStructure?.[category] || [];
  }

  getPrivateWorkspaceTypes(): ProcessedWorkspace[] {
    return this.availableWorkspaces.filter(ws => 
      ws.type === 'dedicated-desk' || 
      ws.type === 'private-office' || 
      ws.type === 'full-floor-office'
    );
  }

  getAdditionalSolutions(): ProcessedWorkspace[] {
    return this.availableWorkspaces.filter(ws => ws.type === 'additional');
  }

  refreshSolutions(): void {
    this.loadSolutionsStructure();
  }
} 