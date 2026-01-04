import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { Login } from "@/pages/Login";

/* -------------------- MOCKS -------------------- */

const mockNavigate = vi.fn();
const mockLogin = vi.fn();
const mockHandleApiError = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<any>("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    login: mockLogin,
  }),
}));

vi.mock("@/utils/errorHandling", () => ({
  handleApiError: (err: unknown) => mockHandleApiError(err),
}));

/* -------------------- SETUP -------------------- */

const setup = () =>
  render(
    <MemoryRouter>
      <Login />
    </MemoryRouter>
  );

beforeEach(() => {
  vi.clearAllMocks();
});

/* -------------------- TESTS -------------------- */

describe("Login Page", () => {
  it("renders login form", () => {
    setup();

    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("you@example.com")
    ).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("••••••••")
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign in/i })
    ).toBeInTheDocument();
  });

  it("shows required validation errors on empty submit", async () => {
    setup();

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/password is required/i)
    ).toBeInTheDocument();

    expect(mockLogin).not.toHaveBeenCalled();
  });

  it("does not submit form when email is invalid", async () => {
    setup();

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "invalid-email" },
    });

    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).not.toHaveBeenCalled();
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("submits form and navigates on successful login", async () => {
    mockLogin.mockResolvedValueOnce(undefined);

    setup();

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        "test@example.com",
        "password123"
      );
    });

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("handles api error correctly", async () => {
    const error = new Error("Invalid credentials");
    mockLogin.mockRejectedValueOnce(error);

    setup();

    fireEvent.change(screen.getByPlaceholderText("you@example.com"), {
      target: { value: "test@example.com" },
    });

    fireEvent.change(screen.getByPlaceholderText("••••••••"), {
      target: { value: "wrongpassword" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign in/i }));

    await waitFor(() => {
      expect(mockHandleApiError).toHaveBeenCalledWith(error);
    });

    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
