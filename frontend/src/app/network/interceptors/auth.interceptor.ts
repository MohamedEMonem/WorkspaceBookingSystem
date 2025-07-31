import { HttpInterceptorFn } from '@angular/common/http';
import { STORAGE_KEYS } from '../constants';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  // Get token from localStorage
  const token = localStorage.getItem(STORAGE_KEYS.USER_TOKEN);
  
  if (token) {
    // Clone the request and add the authorization header
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
  
  return next(req);
}; 