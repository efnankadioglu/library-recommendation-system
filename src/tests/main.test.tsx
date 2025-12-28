import { describe, it, expect, vi, beforeEach } from "vitest";

/* ---------------- MOCKS ---------------- */

// Mock App
vi.mock("../App", () => ({
  default: () => <div>Mock App</div>,
}));

// Spy for Amplify.configure
const configureSpy = vi.fn();

vi.mock("aws-amplify", () => ({
  Amplify: {
    configure: configureSpy,
  },
}));

// Mock createRoot
const renderSpy = vi.fn();

vi.mock("react-dom/client", () => ({
  createRoot: vi.fn(() => ({
    render: renderSpy,
  })),
}));

/* ---------------- TEST ---------------- */

describe("main.tsx bootstrap", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // root element mock
    document.body.innerHTML = `<div id="root"></div>`;
  });

  it("configures Amplify and renders the App", async () => {
    // import AFTER mocks
    await import("../main");

    expect(configureSpy).toHaveBeenCalledTimes(1);

    expect(configureSpy).toHaveBeenCalledWith(
      expect.objectContaining({
        Auth: {
          Cognito: expect.objectContaining({
            userPoolId: expect.any(String),
            userPoolClientId: expect.any(String),
          }),
        },
      })
    );

    expect(renderSpy).toHaveBeenCalledTimes(1);
  });
});
