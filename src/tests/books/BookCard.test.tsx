import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { BookCard } from "@/components/books/BookCard";
import type { Book } from "@/types";

// useNavigate mock
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockBook: Book = {
  bookId: "1",
  title: "Clean Code",
  author: "Robert C. Martin",
  genre: "Programming",
  description: "A Handbook of Agile Software Craftsmanship",
  coverImage: "https://example.com/cover.jpg",
  rating: 4.5,
  publishedYear: 2008,
  isbn: "978-0132350884",
};

describe("BookCard", () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  test("renders book information correctly", () => {
    render(<BookCard book={mockBook} />);

    expect(screen.getByText("Clean Code")).toBeInTheDocument();
    expect(screen.getByText("Robert C. Martin")).toBeInTheDocument();
    expect(screen.getByText("Programming")).toBeInTheDocument();
    expect(screen.getByText("2008")).toBeInTheDocument();
  });

  test("navigates to book detail when card is clicked", () => {
    render(<BookCard book={mockBook} />);

    const card = screen.getByText("Clean Code").closest("div");
    fireEvent.click(card!);

    expect(mockNavigate).toHaveBeenCalledWith("/books/1");
  });

  test("navigates to book detail when View Details button is clicked", () => {
    render(<BookCard book={mockBook} />);

    const button = screen.getByRole("button", { name: /view details/i });
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith("/books/1");
  });

  test("shows fallback image when image fails to load", () => {
    render(<BookCard book={mockBook} />);

    const img = screen.getByAltText("Clean Code") as HTMLImageElement;

    fireEvent.error(img);

    expect(img.src).toContain("via.placeholder.com");
  });

  test("renders formatted rating", () => {
    render(<BookCard book={mockBook} />);

    expect(screen.getByText("4.5")).toBeInTheDocument();
  });
});
