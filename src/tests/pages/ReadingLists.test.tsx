import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { ReadingLists } from "@/pages/ReadingLists";

/* ---------------- MOCKS ---------------- */

vi.mock("@/services/api", () => ({
  getReadingLists: vi.fn(),
  getBooks: vi.fn(),
  createReadingList: vi.fn(),
  deleteReadingList: vi.fn(),
  updateReadingList: vi.fn(),
}));

vi.mock("@/utils/errorHandling", () => ({
  handleApiError: vi.fn(),
  showSuccess: vi.fn(),
}));

vi.mock("@/utils/formatters", () => ({
  formatDate: vi.fn(() => "01.01.2024"),
}));

vi.mock("@/components/common/LoadingSpinner", () => ({
  LoadingSpinner: () => <div data-testid="spinner" />,
}));

import {
  getReadingLists,
  getBooks,
  createReadingList,
  deleteReadingList,
  updateReadingList,
} from "@/services/api";
import { showSuccess } from "@/utils/errorHandling";

/* ---------------- DATA ---------------- */

const books = [
  { bookId: "b1", title: "Atomic Habits" },
  { bookId: "b2", title: "Clean Code" },
];

const list = {
  id: "1",
  name: "My List",
  description: "Test desc",
  bookIds: ["b1"],
  createdAt: "2024-01-01",
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(window, "alert").mockImplementation(() => {});
  vi.spyOn(window, "confirm").mockReturnValue(true);
});

/* ---------------- TESTS ---------------- */

describe("ReadingLists", () => {
  it("shows loading spinner initially", async () => {
    (getReadingLists as any).mockResolvedValue([]);
    (getBooks as any).mockResolvedValue([]);

    render(<ReadingLists />);

    expect(screen.getByTestId("spinner")).toBeInTheDocument();

    await waitFor(() =>
      expect(getReadingLists).toHaveBeenCalled()
    );
  });

  it("renders empty state", async () => {
    (getReadingLists as any).mockResolvedValue([]);
    (getBooks as any).mockResolvedValue([]);

    render(<ReadingLists />);

    expect(
      await screen.findByText(/no reading lists yet/i)
    ).toBeInTheDocument();
  });

  it("renders a reading list card", async () => {
    (getReadingLists as any).mockResolvedValue([list]);
    (getBooks as any).mockResolvedValue(books);

    render(<ReadingLists />);

    expect(await screen.findByText("My List")).toBeInTheDocument();
    expect(screen.getByText("1 Books Collected")).toBeInTheDocument();
  });

  it("opens and closes create list modal", async () => {
    (getReadingLists as any).mockResolvedValue([]);
    (getBooks as any).mockResolvedValue([]);

    render(<ReadingLists />);

    fireEvent.click(
      await screen.findByRole("button", { name: /create new list/i })
    );

    expect(
      screen.getByText(/create new reading list/i)
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByRole("button", { name: /cancel/i })
    );

    await waitFor(() =>
      expect(
        screen.queryByText(/create new reading list/i)
      ).not.toBeInTheDocument()
    );
  });

  it("does not create list if name is empty", async () => {
    (getReadingLists as any).mockResolvedValue([]);
    (getBooks as any).mockResolvedValue([]);

    render(<ReadingLists />);

    fireEvent.click(
      await screen.findByRole("button", { name: /create new list/i })
    );

    fireEvent.click(
      screen.getByRole("button", { name: /create list/i })
    );

    expect(window.alert).toHaveBeenCalled();
    expect(createReadingList).not.toHaveBeenCalled();
  });

  it("creates a new reading list successfully", async () => {
    (getReadingLists as any).mockResolvedValue([]);
    (getBooks as any).mockResolvedValue([]);
    (createReadingList as any).mockResolvedValue(list);

    render(<ReadingLists />);

    fireEvent.click(
      await screen.findByRole("button", { name: /create new list/i })
    );

    fireEvent.change(
      screen.getByPlaceholderText("Summer 2024 Collection"),
      { target: { value: "My List" } }
    );

    fireEvent.click(
      screen.getByRole("button", { name: /create list/i })
    );

    await waitFor(() =>
      expect(showSuccess).toHaveBeenCalledWith(
        "Reading list created successfully!"
      )
    );
  });

  it("adds a book to list", async () => {
    (getReadingLists as any).mockResolvedValue([
      { ...list, bookIds: [] },
    ]);
    (getBooks as any).mockResolvedValue(books);

    render(<ReadingLists />);

    fireEvent.change(await screen.findByRole("combobox"), {
      target: { value: "b1" },
    });

    await waitFor(() =>
      expect(updateReadingList).toHaveBeenCalled()
    );
  });

  it("prevents duplicate book add", async () => {
    (getReadingLists as any).mockResolvedValue([list]);
    (getBooks as any).mockResolvedValue(books);

    render(<ReadingLists />);

    fireEvent.change(await screen.findByRole("combobox"), {
      target: { value: "b1" },
    });

    expect(window.alert).toHaveBeenCalled();
  });

  it("removes book from list", async () => {
    (getReadingLists as any).mockResolvedValue([list]);
    (getBooks as any).mockResolvedValue(books);

    render(<ReadingLists />);

    fireEvent.click(
        await screen.findByLabelText("remove-book-b1")
    );

    await waitFor(() =>
        expect(updateReadingList).toHaveBeenCalledTimes(1)
    );

    expect(showSuccess).toHaveBeenCalledWith(
        "Book removed from list"
    );
  });

  it("deletes reading list", async () => {
    (getReadingLists as any).mockResolvedValue([list]);
    (getBooks as any).mockResolvedValue(books);

    render(<ReadingLists />);

    fireEvent.click(
        await screen.findByLabelText("delete-reading-list")
    );

    await waitFor(() =>
        expect(deleteReadingList).toHaveBeenCalledWith("1")
    );

    expect(showSuccess).toHaveBeenCalledWith("List deleted");
    });
});
