export interface Booking {
  user: string; // ObjectId reference to User
  space: string; // ObjectId reference to Workspace
  date: Date;
  from: string;
  to: string;
  status: 'confirmed' | 'cancelled' | 'pending';
  cancellationReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
  
  // Populated fields (when populated by backend)
  userDetails?: any;
  spaceDetails?: any;
}

export interface CreateBookingRequest {
  space: string;
  date: string;
  from: string;
  to: string;
}

export interface UpdateBookingRequest {
  date?: string;
  from?: string;
  to?: string;
  status?: 'confirmed' | 'cancelled' | 'pending';
  cancellationReason?: string;
}

export interface BookingFilterParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  status?: string;
  date?: string;
  user?: string;
  space?: string;
}

export interface BookingStats {
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  pendingBookings: number;
}
