/**
 * Core type definitions for the Library Recommendation System
 */

export interface Book {
  // DynamoDB'den gelen gerçek anahtar adi budur.
  bookId: string; // <-- ID alanını 'bookId' olarak değiştirdik

  title: string;
  author: string;
  genre: string;
  description: string;
  coverImage: string;
  rating: number;
  publishedYear: number;

  isbn: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface ReadingList {
  id: string;
  userId: string;
  name: string;
  description: string;
  bookIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  bookId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export interface Recommendation {
  id: string;
  bookId: string;
  reason: string;
  confidence: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
