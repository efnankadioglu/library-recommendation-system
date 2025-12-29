import { useState, useEffect } from 'react';
import { BookSearch } from '@/components/books/BookSearch';
import { BookGrid } from '@/components/books/BookGrid';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { getBooks } from '@/services/api';
import { Book } from '@/types';
import { handleApiError } from '@/utils/errorHandling';

type MaybeNumber = number | string | undefined | null;

export function Books() {
  const [books, setBooks] = useState<Book[]>([]);
  const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState('title');

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedGenre, setSelectedGenre] = useState<string>(''); 
  const [selectedRating, setSelectedRating] = useState<string>(''); 
  const [selectedYear, setSelectedYear] = useState<string>('');

  useEffect(() => {
    loadBooks();
  }, []);

  useEffect(() => {
    applyAllFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [books, searchQuery, selectedGenre, selectedRating, selectedYear, sortBy]);

  const loadBooks = async () => {
    setIsLoading(true);
    try {
      const data = await getBooks();
      setBooks(data);
      setFilteredBooks(data);
    } catch (error) {
      handleApiError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const norm = (v: string) =>
    v
      .toLowerCase()
      .trim()
      .replace(/[-_]+/g, ' ')
      .replace(/\s+/g, ' ');

  const normalizeGenreValue = (v: string) => {
    const x = norm(v);
    if (x === 'sci fi' || x === 'scifi') return 'science fiction';
    if (x === 'nonfiction') return 'non fiction';
    return x;
  };

  const getBookRating = (book: Book): number => {
    const candidate =
      (book as unknown as { rating?: MaybeNumber; averageRating?: MaybeNumber }).rating ??
      (book as unknown as { averageRating?: MaybeNumber }).averageRating;

    const n = typeof candidate === 'string' ? Number(candidate) : typeof candidate === 'number' ? candidate : 0;
    return Number.isFinite(n) ? n : 0;
  };

  const getBookYear = (book: Book): number => {
    const obj = book as unknown as {
      year?: MaybeNumber;
      publishedYear?: MaybeNumber;
      publicationYear?: MaybeNumber;
      published_date?: MaybeNumber;
    };

    const pick = obj.year ?? obj.publishedYear ?? obj.publicationYear ?? obj.published_date;
    const n = typeof pick === 'string' ? Number(pick) : typeof pick === 'number' ? pick : 0;
    return Number.isFinite(n) ? n : 0;
  };

  // dropdown seçeneklerini kitap listesinden dinamik üret
  const genreOptions = Array.from(
    new Set(
      books
        .map((b) => (b.genre ?? '').trim())
        .filter((g) => g.length > 0)
    )
  ).sort((a, b) => a.localeCompare(b));

  const yearOptions = Array.from(
    new Set(
      books
        .map((b) => getBookYear(b))
        .filter((y) => y > 0)
    )
  ).sort((a, b) => b - a); 

  const applyAllFilters = () => {
    let result = [...books];

    // 1) SEARCH
    const q = searchQuery.trim().toLowerCase();
    if (q) {
      result = result.filter((book) => {
        const title = (book.title ?? '').toLowerCase();
        const author = (book.author ?? '').toLowerCase();
        const genre = (book.genre ?? '').toLowerCase();
        return title.includes(q) || author.includes(q) || genre.includes(q);
      });
    }

    // 2) GENRE
    if (selectedGenre) {
      const wanted = normalizeGenreValue(selectedGenre);
      result = result.filter((book) => normalizeGenreValue(book.genre ?? '') === wanted);
    }

    // 3) RATING
    if (selectedRating) {
      const min = Number(selectedRating);
      result = result.filter((book) => getBookRating(book) >= min);
    }

    // 4) YEAR
    if (selectedYear) {
      const y = Number(selectedYear);
      result = result.filter((book) => getBookYear(book) === y);
    }

    // 5) SORT
    result.sort((a, b) => {
      if (sortBy === 'title') return (a.title ?? '').localeCompare(b.title ?? '');
      if (sortBy === 'author') return (a.author ?? '').localeCompare(b.author ?? '');
      if (sortBy === 'rating') return getBookRating(b) - getBookRating(a);
      if (sortBy === 'year') return getBookYear(b) - getBookYear(a);
      return 0;
    });

    setFilteredBooks(result);
  };

  const handleSort = (value: string) => {
    setSortBy(value);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="container mx-auto">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-4">
            <span className="gradient-text">Book Catalog</span>
          </h1>
          <p className="text-slate-600 text-xl">
            Browse our collection of{' '}
            <span className="font-bold text-violet-600">{books.length}</span> amazing books
          </p>
        </div>

        {/* Search + Filters */}
        <div className="mb-8">
          <BookSearch
            genreOptions={genreOptions}
            yearOptions={yearOptions}
            onSubmit={({ query, genre, rating, year }) => {
              setSearchQuery(query);
              setSelectedGenre(genre);
              setSelectedRating(rating);
              setSelectedYear(year);
            }}
          />
        </div>

        {/* Filters & Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div className="glass-effect px-4 py-2 rounded-xl border border-white/20">
            <p className="text-slate-700 font-semibold">
              Showing <span className="text-violet-600">{filteredBooks.length}</span>{' '}
              {filteredBooks.length === 1 ? 'book' : 'books'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <label className="text-sm text-slate-700 font-semibold">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
              className="input-modern px-4 py-2.5 text-sm font-medium"
            >
              <option value="title">Title</option>
              <option value="author">Author</option>
              <option value="rating">Rating</option>
              <option value="year">Year</option>
            </select>
          </div>
        </div>

        {/* Book Grid */}
        <BookGrid books={filteredBooks} />

        {filteredBooks.length > 12 && (
          <div className="mt-12 flex justify-center">
            <div className="glass-effect px-6 py-3 rounded-xl border border-white/20">
              <span className="text-slate-600 font-medium">Pagination coming soon...</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

