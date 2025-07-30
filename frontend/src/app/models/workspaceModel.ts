export interface Workspace {
  _id?: string;
  name: string;
  workspaceOwner: string; // ObjectId reference to User
  location: string;
  rating?: string;
  capacity?: number;
  description?: string;
  solution: {
    privateWorkspace: string[];
    additionalSolutions: string[];
  };
  phone: string;
  workinghours: string;
  workingdays: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreateWorkspaceRequest {
  name: string;
  workspaceOwner: string;
  location: string;
  rating?: string;
  capacity?: number;
  description?: string;
  solution: {
    privateWorkspace: string[];
    additionalSolutions: string[];
  };
  phone: string;
  workinghours: string;
  workingdays: string;
}

export interface UpdateWorkspaceRequest extends Partial<CreateWorkspaceRequest> {}

export interface WorkspaceFilterParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  search?: string;
  location?: string;
  capacity?: number;
  rating?: string;
}
