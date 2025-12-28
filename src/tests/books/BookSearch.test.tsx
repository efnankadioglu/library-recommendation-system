import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { BookSearch } from "@/components/books/BookSearch";

describe("BookSearch", () => {
  it("renders search input and button", () => {
    const onSearch = vi.fn();

    render(<BookSearch onSearch={onSearch} />);

    expect(
      screen.getByPlaceholderText(/search books by title/i)
    ).toBeInTheDocument();

    expect(screen.getByRole("button", { name: /search/i })).toBeInTheDocument();
  });

  it("updates input value when typing", () => {
    const onSearch = vi.fn();

    render(<BookSearch onSearch={onSearch} />);

    const input = screen.getByPlaceholderText(
      /search books by title/i
    ) as HTMLInputElement;

    fireEvent.change(input, { target: { value: "harry potter" } });

    expect(input.value).toBe("harry potter");
  });

  it("calls onSearch with input value on submit", () => {
    const onSearch = vi.fn();

    render(<BookSearch onSearch={onSearch} />);

    const input = screen.getByPlaceholderText(
      /search books by title/i
    ) as HTMLInputElement;

    const form = input.closest("form")!;

    fireEvent.change(input, { target: { value: "dune" } });
    fireEvent.submit(form);

    expect(onSearch).toHaveBeenCalledTimes(1);
    expect(onSearch).toHaveBeenCalledWith("dune");
  });
});
