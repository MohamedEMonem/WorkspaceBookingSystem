import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';
import { STORAGE_KEYS } from '../constants';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        // Handle unauthorized access
        handleUnauthorized();
      }
      
      return throwError(() => error);
    })
  );
};

function handleUnauthorized(): void {
  // Clear stored tokens
  localStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
  localStorage.removeItem(STORAGE_KEYS.USER_DATA);

  // Redirect to login page
  window.location.href = '/login';
} 