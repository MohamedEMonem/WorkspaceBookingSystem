// Base URL for API
export const BASE_URL = 'http://localhost:5000';

// API Endpoints
export const API_ENDPOINTS = {
  // User endpoints
  USERS: {
    BASE: '/users',
    LOGIN: '/users/login',
    SIGNUP: '/users/signup',
    ME: '/users/me',
    VERIFY_INVITE: '/users/verify-invite',
    SIGNUP_WITH_INVITE: '/users/signup-with-invite',
    LOGOUT: '/users/logout',
    LOGOUT_ALL: '/users/logout-all',
    TOKEN_STATS: '/users/admin/token-stats',
    ADMIN_INVITE: '/users/admin/invite',
  },

  // Workspace endpoints
  WORKSPACES: {
    BASE: '/workspaces',
    GET_ALL: '/workspaces',
    GET_BY_ID: '/workspaces/:id',
    CREATE: '/workspaces',
    UPDATE: '/workspaces/:id',
    PATCH: '/workspaces/:id',
    DELETE: '/workspaces/:id',
  },

  // Booking endpoints
  BOOKINGS: {
    BASE: '/booking',
    CREATE: '/booking',
    MY_BOOKINGS: '/booking/my-bookings',
    UPDATE: '/booking/:id',
    DELETE: '/booking/:id',
    ALL: '/booking/all',
    CONFIRM: '/booking/:id/confirm',
    CANCEL: '/booking/:id/cancel',
    ANALYTICS: '/booking/analytics',
    MODIFY: '/booking/:id/modify',
    ADMIN_DELETE: '/booking/:id/admin-delete',
  },

  // Solutions endpoints
  SOLUTIONS: {
    BASE: '/sloutions',
    GET_ALL: '/sloutions/structure',
    GET_BY_SUBSOLUTION: '/sloutions/:subsolution',
  },

  // Dashboard endpoints (ignored as requested)
  DASHBOARD: {
    BASE: '/users/dashboard',
  },
};

// HTTP Methods
export const HTTP_METHODS = {
  GET: 'GET',
  POST: 'POST',
  PUT: 'PUT',
  PATCH: 'PATCH',
  DELETE: 'DELETE',
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Network error occurred',
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Access forbidden',
  NOT_FOUND: 'Resource not found',
  VALIDATION_ERROR: 'Validation error',
  SERVER_ERROR: 'Internal server error',
  TIMEOUT_ERROR: 'Request timeout',
};

// Request Configuration
export const REQUEST_TIMEOUT = 30000; // 30 seconds
export const RETRY_ATTEMPTS = 3;
export const RETRY_DELAY = 1000; // 1 second

// Pagination
export const DEFAULT_PAGE = 1;
export const DEFAULT_LIMIT = 10;
export const MAX_LIMIT = 100;

// File Upload
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];

// Local Storage Keys
export const STORAGE_KEYS = {
  USER_TOKEN: 'user_token',
  USER_DATA: 'user_data',
  REFRESH_TOKEN: 'refresh_token',
  THEME: 'app_theme',
  LANGUAGE: 'app_language',
};

// API Response Interface
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

// Paginated Response Interface
export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
} 