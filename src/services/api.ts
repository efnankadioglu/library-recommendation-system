import { Book, ReadingList, Review, Recommendation } from '@/types';
import { mockBooks, mockReadingLists } from './mockData';
import { fetchAuthSession } from 'aws-amplify/auth';

/**
 * ============================================================================
 * API SERVICE LAYER - BACKEND COMMUNICATION
 * ============================================================================
 *
 * ⚠️ IMPORTANT: This file currently uses MOCK DATA for MOST API calls.
 *
 * In Week 2 we are starting to connect the frontend to the REAL AWS backend.
 * For now, ONLY getBooks() is connected to your API Gateway endpoint.
 *
 * TO IMPLEMENT FULL AWS BACKEND:
 * Follow the step-by-step guide in IMPLEMENTATION_GUIDE.md
 *
 * Quick Reference:
 * - Week 2: Implement Books API (getBooks, getBook, createBook, etc.)
 * - Week 2: Implement Reading Lists API
 * - Week 3: Add Cognito authentication headers
 * - Week 4: Implement AI recommendations with Bedrock
 *
 * ============================================================================
 * IMPLEMENTATION CHECKLIST:
 * ============================================================================
 *
 * [x] Week 1: Set up AWS account and first Lambda function
 * [x] Week 2: Create DynamoDB tables (Books, ReadingLists)
 * [x] Week 2: Deploy Lambda function for Books API
 * [x] Week 2: Deploy API Gateway endpoint: GET /books
 * [x] Week 2: Set VITE_API_BASE_URL in .env file
 * [x] Week 3: Set up Cognito User Pool
 * [x] Week 3: Install aws-amplify: npm install aws-amplify
 * [x] Week 3: Configure Amplify in src/main.tsx
 * [x] Week 3: Update AuthContext with Cognito functions
 * [x] Week 3: Implement getAuthHeaders() function below
 * [ ] Week 3: Add Cognito authorizer to API Gateway
 * [ ] Week 4: Deploy Bedrock recommendations Lambda
 * [ ] Week 4: Update getRecommendations() function
 * [ ] Week 4: Remove all mock data returns
 * [ ] Week 4: Delete src/services/mockData.ts
 *
 * ============================================================================
 */

// ✅ Artık API_BASE_URL aktif (env’den geliyor)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

/**
 * TODO (Week 3): Implement this function
 *
 * This function gets the JWT token from Cognito and adds it to API requests.
 *
 * Implementation:
 * 1. Import: import { fetchAuthSession } from 'aws-amplify/auth';
 * 2. Get session: const session = await fetchAuthSession();
 * 3. Extract token: const token = session.tokens?.idToken?.toString();
 * 4. Return headers with Authorization: Bearer {token}
 *
 * See IMPLEMENTATION_GUIDE.md - Week 3, Day 5-7 for complete code.
 */

async function getAuthHeaders(): Promise<Record<string, string>> {
  try {
    const session = await fetchAuthSession();
    // Token varsa al, yoksa boş string ata
    const token = session.tokens?.idToken?.toString() || '';
    
    return {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    };
  } catch (error) {
    console.error('Auth headers error:', error);
    return {
      'Content-Type': 'application/json',
    };
  }
}

/**
 * Get all books from the catalog
 *
 * ✅ Week 2: This is now connected to your REAL AWS backend.
 *
 * Implementation:
 * - Lambda: library-get-books
 * - API Gateway: GET /books
 * - Base URL: VITE_API_BASE_URL (set in .env)
 *
 * Expected response: Array of Book objects from DynamoDB
 */
export async function getBooks(): Promise<Book[]> {
  const response = await fetch(`${API_BASE_URL}/books`);

  if (!response.ok) {
    // İstersen burada console.error ile detay da yazabilirsin
    throw new Error('Failed to fetch books');
  }

  // API Gateway + Lambda'dan gelen JSON Book[]
  return response.json();
}

/**
 * Get a single book by ID
 *
 * TODO: Replace with real API call in Week 2, Day 3-4
 *
 * Implementation steps:
 * 1. Deploy Lambda function: library-get-book
 * 2. Create API Gateway endpoint: GET /books/{id}
 * 3. Replace mock code below with:
 *
 * const response = await fetch(`${API_BASE_URL}/books/${id}`);
 * if (response.status === 404) return null;
 * if (!response.ok) throw new Error('Failed to fetch book');
 * return response.json();
 */
// export async function getBook(id: string): Promise<Book | null> {
//   const response = await fetch(`${API_BASE_URL}/books/${id}`);

//   if (response.status === 404) return null;

//   if (!response.ok) {
//     throw new Error('Failed to fetch book');
//   }

//   return response.json();
// }

export async function getBook(id: string): Promise<Book | null> {
  const response = await fetch(`${API_BASE_URL}/books/${id}`);

  if (response.status === 404) return null;
  if (!response.ok) throw new Error('Failed to fetch book');

  // 1. Önce AWS'nin tüm yanıt paketini alıyoruz
  const result = await response.json();

  // 2. Eğer Lambda'dan 'body' gelmişse onu çıkartıyoruz, yoksa sonucu dönüyoruz
  // Lambda bazen body'yi string olarak gönderir, bu yüzden JSON.parse yapmamız gerekebilir.
  const bookData =
    typeof result.body === 'string' ? JSON.parse(result.body) : result.body || result;

  return bookData;
}

/**
 * Create a new book (admin only)
 *
 * TODO: Replace with real API call in Week 2, Day 5-7
 */
// export async function createBook(book: Omit<Book, 'id'>): Promise<Book> {
//   // Şimdilik MOCK
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const newBook: Book = {
//         ...book,
//         bookId: Date.now().toString(),
//       };
//       resolve(newBook);
//     }, 500);
//   });
// }

export async function createBook(book: Omit<Book, 'bookId'>): Promise<Book> {
  const authHeaders = await getAuthHeaders(); // Token'ı alıyoruz
  
  const response = await fetch(`${API_BASE_URL}/books`, {
    method: 'POST',
    headers: authHeaders, // Artık içinde Authorization var!
    body: JSON.stringify(book),
  });

  if (!response.ok) {
    throw new Error('Yeni kitap eklenirken bir hata oluştu. Lütfen AWS bağlantısını kontrol et!');
  }

  // 2. AWS'den gelen yanıtı (zarfı) alıyoruz
  const result = await response.json();

  // 3. Zarfın içindeki gerçek kitap verisini (body) çıkarıyoruz
  const newBook = result.body
    ? typeof result.body === 'string'
      ? JSON.parse(result.body)
      : result.body
    : result;

  console.log('Yeni kitap başarıyla eklendi:', newBook);
  return newBook as Book;
}

/**
 * Update an existing book (admin only)
 * TODO: Replace with PUT /books/:id API call
 */
export async function updateBook(id: string, book: Partial<Book>): Promise<Book> {
  // Şimdilik MOCK
  return new Promise((resolve) => {
    setTimeout(() => {
      const existingBook = mockBooks.find((b) => b.bookId === id);
      const updatedBook: Book = {
        ...existingBook!,
        ...book,
        bookId: id,
      };
      resolve(updatedBook);
    }, 500);
  });
}

/**
 * Delete a book (admin only)
 * TODO: Replace with DELETE /books/:id API call
 */
// export async function deleteBook(): Promise<void> {
//   // Şimdilik MOCK
//   return new Promise((resolve) => {
//     setTimeout(() => resolve(), 300);
//   });
// }
export async function deleteBook(id: string): Promise<void> {
  const authHeaders = await getAuthHeaders(); // Token'ı alıyoruz
  
  const response = await fetch(`${API_BASE_URL}/books/${id}`, {
    method: 'DELETE',
    headers: authHeaders, // Artık içinde Authorization var!
  });

  if (!response.ok) {
    throw new Error('Kitap silinirken AWS tarafında bir hata oluştu');
  }

  console.log(`${id} ID'li kitap AWS'den silindi.`);
}

/**
 * Get AI-powered book recommendations using Amazon Bedrock
 *
 * TODO: Replace with real API call in Week 4, Day 1-2
 */
export async function getRecommendations(): Promise<Recommendation[]> {
  // Şimdilik MOCK
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockRecommendations: Recommendation[] = [
        {
          id: '1',
          bookId: '1',
          reason:
            'Based on your interest in philosophical fiction, this book explores themes of choice and regret.',
          confidence: 0.92,
        },
        {
          id: '2',
          bookId: '2',
          reason:
            'If you enjoy science-based thrillers, this space adventure combines humor with hard science.',
          confidence: 0.88,
        },
      ];
      resolve(mockRecommendations);
    }, 1000);
  });
}

/**
 * Get user's reading lists
 *
 * TODO: Replace with real API call in Week 2, Day 5-7
 */
export async function getReadingLists(): Promise<ReadingList[]> {
  // Şimdilik MOCK
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockReadingLists), 500);
  });
}

/**
 * Create a new reading list
 *
 * TODO: Replace with real API call in Week 2, Day 5-7
 */
export async function createReadingList(
  list: Omit<ReadingList, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ReadingList> {
  // Şimdilik MOCK
  return new Promise((resolve) => {
    setTimeout(() => {
      const newList: ReadingList = {
        ...list,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      resolve(newList);
    }, 500);
  });
}

/**
 * Update a reading list
 * TODO: Replace with PUT /reading-lists/:id API call
 */
export async function updateReadingList(
  id: string,
  list: Partial<ReadingList>
): Promise<ReadingList> {
  // Şimdilik MOCK
  return new Promise((resolve) => {
    setTimeout(() => {
      const existingList = mockReadingLists.find((l) => l.id === id);
      const updatedList: ReadingList = {
        ...existingList!,
        ...list,
        id,
        updatedAt: new Date().toISOString(),
      };
      resolve(updatedList);
    }, 500);
  });
}

/**
 * Delete a reading list
 * TODO: Replace with DELETE /reading-lists/:id API call
 */
export async function deleteReadingList(): Promise<void> {
  // Şimdilik MOCK
  return new Promise((resolve) => {
    setTimeout(() => resolve(), 300);
  });
}

/**
 * Get reviews for a book
 * TODO: Replace with GET /books/:id/reviews API call
 */
export async function getReviews(bookId: string): Promise<Review[]> {
  // Şimdilik MOCK
  return new Promise((resolve) => {
    setTimeout(() => {
      const mockReviews: Review[] = [
        {
          id: '1',
          bookId,
          userId: '1',
          rating: 5,
          comment: 'Absolutely loved this book! A must-read.',
          createdAt: '2024-11-01T10:00:00Z',
        },
      ];
      resolve(mockReviews);
    }, 500);
  });
}

/**
 * Create a new review
 * TODO: Replace with POST /books/:bookId/reviews API call
 */
export async function createReview(review: Omit<Review, 'id' | 'createdAt'>): Promise<Review> {
  // Şimdilik MOCK
  return new Promise((resolve) => {
    setTimeout(() => {
      const newReview: Review = {
        ...review,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      resolve(newReview);
    }, 500);
  });
}
