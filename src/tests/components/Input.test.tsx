import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { Input } from "@/components/common/Input";

describe("Input component", () => {
  it("renders label and input", () => {
    render(<Input label="Email" />);

    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByRole("textbox")).toBeInTheDocument();
  });

  it("shows required asterisk when required prop is true", () => {
    render(<Input label="Username" required />);

    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("applies error styles and shows error message when error prop is provided", () => {
    render(<Input label="Password" error="Password is required" />);

    expect(screen.getByText("Password is required")).toBeInTheDocument();

    const input = screen.getByRole("textbox");
    expect(input.className).toContain("border-rose-500");
  });

  it("does not show error message when error prop is not provided", () => {
    render(<Input label="Name" />);

    expect(screen.queryByText(/required/i)).not.toBeInTheDocument();
  });

  it("passes input props correctly and handles onChange", () => {
    const handleChange = vi.fn();

    render(
      <Input
        label="Email"
        value=""
        onChange={handleChange}
        placeholder="Enter email"
      />
    );

    const input = screen.getByPlaceholderText("Enter email");

    fireEvent.change(input, { target: { value: "test@example.com" } });

    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});
