import React, { useState } from 'react';

/**
 * BookSearch component props
 */
interface BookSearchProps {
  onSubmit: (payload: { query: string; genre: string; rating: string; year: string }) => void;

  genreOptions: string[];
  yearOptions: number[];
}

/**
 * Modern BookSearch component with beautiful glass morphism
 *
 * @example
 * <BookSearch
 *   onSubmit={({query, genre, rating, year}) => { ... }}
 *   genreOptions={["Fiction", "Mystery"]}
 *   yearOptions={[2024, 2023]}
 * />
 */
export function BookSearch({ onSubmit, genreOptions, yearOptions }: BookSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [genre, setGenre] = useState<string>('');   
  const [rating, setRating] = useState<string>(''); 
  const [year, setYear] = useState<string>('');     

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ query: searchQuery, genre, rating, year });
  };

  return (
    <div className="glass-effect rounded-2xl p-6 border border-white/20 shadow-xl">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <div className="relative">
              <input
                type="text"
                placeholder="Search books by title, author, or genre..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="input-modern pl-12"
              />
              <svg
                className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-violet-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <button
            type="submit"
            className="btn-gradient px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Search
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Genre</label>
            <select className="input-modern" value={genre} onChange={(e) => setGenre(e.target.value)}>
              <option value="">All Genres</option>

              {/* DİNAMİK GENRE */}
              {genreOptions.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Rating</label>
            <select className="input-modern" value={rating} onChange={(e) => setRating(e.target.value)}>
              <option value="">All Ratings</option>
              <option value="4.5">4.5+ Stars</option>
              <option value="4.0">4.0+ Stars</option>
              <option value="3.5">3.5+ Stars</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Year</label>
            <select className="input-modern" value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="">All Years</option>

              {/* DİNAMİK YEAR */}
              {yearOptions.map((y) => (
                <option key={y} value={String(y)}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>
      </form>
    </div>
  );
}

