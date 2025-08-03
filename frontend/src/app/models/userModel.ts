export interface User {
  _id?: string;
  name: string;
  email: string;
  phone: string;
  gender: 'male' | 'female';
  birthday?: Date;
  role: 'admin' | 'owner' | 'user';
  history?: any[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  name: string;
  phone: string;
  gender: 'male' | 'female';
  birthday?: Date;
  role?: 'admin' | 'owner' | 'user';
  password: string;
  adminKey?: string; // Required for admin role
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  phone?: string;
  gender?: 'male' | 'female';
  birthday?: Date;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}
