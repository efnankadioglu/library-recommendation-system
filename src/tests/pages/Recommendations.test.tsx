import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Recommendations } from "@/pages/Recommendations";

/* -------------------- MOCKS -------------------- */

vi.mock("@/services/api", () => ({
  getRecommendations: vi.fn(),
}));

vi.mock("@/utils/errorHandling", () => ({
  handleApiError: vi.fn(),
}));

vi.mock("@/components/common/LoadingSpinner", () => ({
  LoadingSpinner: () => <div data-testid="spinner" />,
}));

import { getRecommendations } from "@/services/api";
import { handleApiError } from "@/utils/errorHandling";

/* -------------------- SETUP -------------------- */

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(window, "alert").mockImplementation(() => {});
});

/* -------------------- TESTS -------------------- */

describe("Recommendations", () => {
  it("renders initial empty hint text", () => {
    render(<Recommendations />);

    expect(
      screen.getByText(/a book is a dream that you hold in your hand/i)
    ).toBeInTheDocument();
  });

  it("shows alert if query is empty", () => {
    render(<Recommendations />);

    fireEvent.click(
      screen.getByRole("button", { name: /get ai recommendations/i })
    );

    expect(window.alert).toHaveBeenCalledWith(
      "Please enter a query"
    );
  });

  it("fills textarea when example query is clicked", () => {
    render(<Recommendations />);

    const example = screen.getByText(
      "I love mystery novels with strong female protagonists"
    );

    fireEvent.click(example);

    expect(
      screen.getByDisplayValue(
        "I love mystery novels with strong female protagonists"
      )
    ).toBeInTheDocument();
  });

  it("shows loading spinner while fetching recommendations", async () => {
    (getRecommendations as any).mockResolvedValue("AI response");

    render(<Recommendations />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "test query" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /get ai recommendations/i })
    );

    expect(screen.getByTestId("spinner")).toBeInTheDocument();

    await waitFor(() =>
      expect(getRecommendations).toHaveBeenCalled()
    );
  });

  it("renders AI response on success", async () => {
    (getRecommendations as any).mockResolvedValue(
      "Here are some great book recommendations"
    );

    render(<Recommendations />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "science fiction" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /get ai recommendations/i })
    );

    expect(
      await screen.findByText(/recommended for you/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/here are some great book recommendations/i)
    ).toBeInTheDocument();
  });

  it("shows login-required message for Turkish backend response", async () => {
    (getRecommendations as any).mockResolvedValue(
      "Şu an öneri oluşturulamıyor"
    );

    render(<Recommendations />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "fantasy" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /get ai recommendations/i })
    );

    expect(
      await screen.findByText(/hello, book lover/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: /login/i })
    ).toBeInTheDocument();
  });

  it("shows login-required message for unauthorized error", async () => {
    (getRecommendations as any).mockRejectedValue(
      new Error("401 Unauthorized")
    );

    render(<Recommendations />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "romance" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /get ai recommendations/i })
    );

    expect(
      await screen.findByText(/hello, book lover/i)
    ).toBeInTheDocument();
  });

  it("calls handleApiError for non-auth errors", async () => {
    (getRecommendations as any).mockRejectedValue(
      new Error("500 Internal Server Error")
    );

    render(<Recommendations />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "history" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /get ai recommendations/i })
    );

    await waitFor(() =>
      expect(handleApiError).toHaveBeenCalled()
    );
  });
});
