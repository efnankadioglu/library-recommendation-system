import { render, screen } from "@testing-library/react";
import { BookGrid } from "@/components/books/BookGrid";
import { Book } from "@/types";
import { describe, it, expect, vi } from "vitest";

// BookCard'i mock'layalım (child component test etmiyoruz)
vi.mock("@/components/books/BookCard", () => ({
  BookCard: ({ book }: { book: Book }) => (
    <div data-testid="book-card">{book.title}</div>
  ),
}));

const mockBooks: Book[] = [
  {
    bookId: "1",
    title: "Clean Code",
    author: "Robert C. Martin",
    genre: "Programming",
    description: "A Handbook of Agile Software Craftsmanship",
    coverImage: "https://example.com/cover.jpg",
    rating: 4.5,
    publishedYear: 2008,
    isbn: "978-0132350884",
  },
  {
    bookId: "2",
    title: "The Pragmatic Programmer",
    author: "Andrew Hunt",
    genre: "Programming",
    description: "Your Journey to Mastery",
    coverImage: "https://example.com/cover2.jpg",
    rating: 4.7,
    publishedYear: 1999,
    isbn: "978-0201616224",
  },
];

describe("BookGrid", () => {
  it("should show empty state when no books are provided", () => {
    render(<BookGrid books={[]} />);

    expect(screen.getByText(/No books found/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Try adjusting your search or filters/i)
    ).toBeInTheDocument();
  });

  it("should render a BookCard for each book", () => {
    render(<BookGrid books={mockBooks} />);

    const cards = screen.getAllByTestId("book-card");
    expect(cards).toHaveLength(2);

    expect(screen.getByText("Clean Code")).toBeInTheDocument();
    expect(screen.getByText("The Pragmatic Programmer")).toBeInTheDocument();
  });
});
