import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { NotFound } from "@/pages/NotFound";

describe("NotFound Page", () => {
  const setup = () =>
    render(
      <MemoryRouter>
        <NotFound />
      </MemoryRouter>
    );

  it("renders 404 title", () => {
    setup();

    expect(
      screen.getByRole("heading", { name: "404" })
    ).toBeInTheDocument();
  });

  it("renders page not found heading", () => {
    setup();

    expect(
      screen.getByRole("heading", { name: /page not found/i })
    ).toBeInTheDocument();
  });

  it("renders description text", () => {
    setup();

    expect(
      screen.getByText(/the page you're looking for/i)
    ).toBeInTheDocument();
  });

  it("renders Go Home button", () => {
    setup();

    expect(
      screen.getByRole("button", { name: /go home/i })
    ).toBeInTheDocument();
  });

  it("Go Home button links to home page", () => {
    setup();

    const link = screen.getByRole("link", { name: /go home/i });
    expect(link).toHaveAttribute("href", "/");
  });

  it("renders the svg icon", () => {
    setup();

    // SVG path kontrolü → coverage için önemli
    const svg = document.querySelector("svg");
    expect(svg).toBeInTheDocument();

    const path = svg?.querySelector("path");
    expect(path).toBeInTheDocument();
  });
});
