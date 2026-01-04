import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/hooks/useAuth';

/* =======================
   MOCKS
======================= */

vi.mock('@/hooks/useAuth');

// Navigation gerçek render edilmesin, sadeleştirelim
vi.mock('@/components/layout/Navigation', () => ({
  Navigation: ({ mobile }: { mobile?: boolean }) => (
    <div>{mobile ? 'Mobile Navigation' : 'Desktop Navigation'}</div>
  ),
}));

const mockUseAuth = vi.mocked(useAuth);

/* =======================
   COMMON DATA
======================= */

const baseAuth = {
  isLoading: false,
  isAdmin: false,
  login: vi.fn(),
  logout: vi.fn(),
  signup: vi.fn(),
  confirmSignup: vi.fn(),
};

const fullUser = {
  id: '1',
  email: 'user@test.com',
  name: 'John Doe',
  role: 'user' as const,
  createdAt: new Date().toISOString(),
};

/* =======================
   TESTS
======================= */

describe('Header – full coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  /* ---------- BASIC RENDER ---------- */

  it('renders logo and desktop navigation', () => {
    mockUseAuth.mockReturnValue({
      ...baseAuth,
      isAuthenticated: false,
      user: null,
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText('LibraryAI')).toBeInTheDocument();
    expect(screen.getByText('Desktop Navigation')).toBeInTheDocument();
  });

  /* ---------- UNAUTHENTICATED ---------- */

  it('shows Login and Sign Up when not authenticated', () => {
    mockUseAuth.mockReturnValue({
      ...baseAuth,
      isAuthenticated: false,
      user: null,
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText('Login')).toBeInTheDocument();
    expect(screen.getByText('Sign Up')).toBeInTheDocument();
  });

  /* ---------- AUTHENTICATED (NAME PRESENT) ---------- */

  it('shows user name when authenticated and name exists', () => {
    mockUseAuth.mockReturnValue({
      ...baseAuth,
      isAuthenticated: true,
      user: fullUser,
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText('Hi, John Doe')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  /* ---------- AUTHENTICATED (NAME FALLBACK) ---------- */

  it('falls back to "User" when user name is missing', () => {
    mockUseAuth.mockReturnValue({
      ...baseAuth,
      isAuthenticated: true,
      user: {
        ...fullUser,
        name: '', // falsy → "User"
      },
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    expect(screen.getByText('Hi, User')).toBeInTheDocument();
  });

  /* ---------- LOGOUT ---------- */

  it('calls logout when Logout button is clicked', () => {
    const logout = vi.fn();

    mockUseAuth.mockReturnValue({
      ...baseAuth,
      isAuthenticated: true,
      user: fullUser,
      logout,
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Logout'));
    expect(logout).toHaveBeenCalledTimes(1);
  });

  /* ---------- MOBILE MENU ---------- */

  it('toggles mobile menu when hamburger button is clicked', () => {
    mockUseAuth.mockReturnValue({
      ...baseAuth,
      isAuthenticated: false,
      user: null,
    });

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );

    const toggleButton = screen.getByRole('button');

    // Başlangıç: sadece desktop navigation
    expect(screen.queryByText('Mobile Navigation')).not.toBeInTheDocument();

    // Aç
    fireEvent.click(toggleButton);
    expect(screen.getByText('Mobile Navigation')).toBeInTheDocument();

    // Kapat
    fireEvent.click(toggleButton);
    expect(screen.queryByText('Mobile Navigation')).not.toBeInTheDocument();
  });
});
