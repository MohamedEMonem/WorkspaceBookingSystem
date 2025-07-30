import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from '../http.service';
import { API_ENDPOINTS, ApiResponse, PaginatedResponse } from '../constants';
import { Booking, CreateBookingRequest, UpdateBookingRequest, BookingFilterParams, BookingStats } from '../../models/bookingModel';

@Injectable({
  providedIn: 'root'
})
export class BookingApiService {
  constructor(private httpService: HttpService) {}

  /**
   * Create new booking
   */
  createBooking(bookingData: CreateBookingRequest): Observable<ApiResponse<Booking>> {
    return this.httpService.post<Booking>(API_ENDPOINTS.BOOKINGS.CREATE, bookingData);
  }

  /**
   * Get user's bookings
   */
  getMyBookings(params?: BookingFilterParams): Observable<ApiResponse<Booking[]>> {
    return this.httpService.get<Booking[]>(API_ENDPOINTS.BOOKINGS.MY_BOOKINGS, params);
  }

  /**
   * Update booking
   */
  updateBooking(bookingId: string, bookingData: UpdateBookingRequest): Observable<ApiResponse<Booking>> {
    const endpoint = API_ENDPOINTS.BOOKINGS.UPDATE.replace(':id', bookingId);
    return this.httpService.put<Booking>(endpoint, bookingData);
  }

  /**
   * Cancel booking
   */
  cancelBooking(bookingId: string): Observable<ApiResponse<Booking>> {
    const endpoint = API_ENDPOINTS.BOOKINGS.DELETE.replace(':id', bookingId);
    return this.httpService.delete<Booking>(endpoint);
  }

  /**
   * Get all bookings (owner/admin only)
   */
  getAllBookings(params?: BookingFilterParams): Observable<ApiResponse<Booking[]>> {
    return this.httpService.get<Booking[]>(API_ENDPOINTS.BOOKINGS.ALL, params);
  }

  /**
   * Confirm booking (owner/admin only)
   */
  confirmBooking(bookingId: string): Observable<ApiResponse<Booking>> {
    const endpoint = API_ENDPOINTS.BOOKINGS.CONFIRM.replace(':id', bookingId);
    return this.httpService.patch<Booking>(endpoint, {});
  }

  /**
   * Cancel any booking with reason (owner/admin only)
   */
  cancelAnyBooking(bookingId: string, reason?: string): Observable<ApiResponse<Booking>> {
    const endpoint = API_ENDPOINTS.BOOKINGS.CANCEL.replace(':id', bookingId);
    return this.httpService.patch<Booking>(endpoint, { cancellationReason: reason });
  }

  /**
   * Get booking analytics (admin only)
   */
  getBookingAnalytics(params?: any): Observable<ApiResponse<BookingStats>> {
    return this.httpService.get<BookingStats>(API_ENDPOINTS.BOOKINGS.ANALYTICS, params);
  }

  /**
   * Modify booking (admin only)
   */
  modifyBooking(bookingId: string, bookingData: UpdateBookingRequest): Observable<ApiResponse<Booking>> {
    const endpoint = API_ENDPOINTS.BOOKINGS.MODIFY.replace(':id', bookingId);
    return this.httpService.patch<Booking>(endpoint, bookingData);
  }

  /**
   * Delete booking permanently (admin only)
   */
  deleteBooking(bookingId: string): Observable<ApiResponse<{ message: string }>> {
    const endpoint = API_ENDPOINTS.BOOKINGS.ADMIN_DELETE.replace(':id', bookingId);
    return this.httpService.delete<{ message: string }>(endpoint);
  }

  /**
   * Get bookings by status
   */
  getBookingsByStatus(status: string, params?: any): Observable<ApiResponse<Booking[]>> {
    return this.getMyBookings({ ...params, status });
  }

  /**
   * Get upcoming bookings
   */
  getUpcomingBookings(params?: any): Observable<ApiResponse<Booking[]>> {
    return this.getMyBookings({ ...params, status: 'confirmed' });
  }

  /**
   * Get past bookings
   */
  getPastBookings(params?: any): Observable<ApiResponse<Booking[]>> {
    return this.getMyBookings({ ...params, status: 'completed' });
  }
} 