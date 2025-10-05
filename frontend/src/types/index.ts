// Book Types
export interface Book {
  id: string;
  title: string;
  author: string;
  publishedYear: number;
  genre: string;
  description?: string;
  isbn?: string;
}

export interface BookFormData {
  title: string;
  author: string;
  publishedYear: number | string;
  genre: string;
  description?: string;
  isbn?: string;
}

// User Types
export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
}

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  token: string;
}

// Auth Types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  name: string;
}

// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

// Search/Filter Types
export interface BookFilters {
  search?: string;
  genre?: string;
  author?: string;
}

// Auth GraphQL Types
export interface SignUpResponse {
  signUp: {
    access_token: string;
    user: {
      id: string;
      email: string;
      name: string;
    };
  };
}

export interface SignInResponse {
  signIn: {
    access_token: string;
    user: {
      id: string;
      email: string;
      name: string;
    };
  };
}

export interface LogoutResponse {
  logout: {
    message: string;
  };
}

// Book GraphQL Types
export interface GetBooksResponse {
  books: Book[];
}

export interface GetBookResponse {
  book: Book;
}

export interface CreateBookResponse {
  createBook: Book;
}

export interface UpdateBookResponse {
  updateBook: Book;
}

export interface DeleteBookResponse {
  deleteBook: {
    message: string;
  };
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
