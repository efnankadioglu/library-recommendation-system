import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { Navigation } from '@/components/layout/Navigation';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

vi.mock('@/hooks/useAuth');

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom'
  );

  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const mockUseAuth = vi.mocked(useAuth);
const mockNavigate = vi.mocked(useNavigate);

describe('Navigation – full coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all navigation links', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isAdmin: false,
      isLoading: false,
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
      signup: vi.fn(),
      confirmSignup: vi.fn(),
    });

    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );

    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Books')).toBeInTheDocument();
    expect(screen.getByText('Recommendations')).toBeInTheDocument();
    expect(screen.getByText('Reading Lists')).toBeInTheDocument();
    expect(screen.getByText('Admin')).toBeInTheDocument();
  });

  it('applies desktop active classes for active route', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isAdmin: true,
      isLoading: false,
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
      signup: vi.fn(),
      confirmSignup: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/books']}>
        <Navigation />
      </MemoryRouter>
    );

    const booksLink = screen.getByText('Books');
    expect(booksLink.className).toContain('text-violet-600');
    expect(booksLink.className).toContain('after:bg-gradient-to-r');
  });

  it('applies mobile classes when mobile prop is true', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isAdmin: true,
      isLoading: false,
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
      signup: vi.fn(),
      confirmSignup: vi.fn(),
    });

    render(
      <MemoryRouter initialEntries={['/']}>
        <Navigation mobile />
      </MemoryRouter>
    );

    const homeLink = screen.getByText('Home');
    expect(homeLink.className).toContain('border-l-4');
    expect(homeLink.className).toContain('bg-violet-50');
  });

  it('redirects to /login when clicking admin link while unauthenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isAdmin: false,
      isLoading: false,
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
      signup: vi.fn(),
      confirmSignup: vi.fn(),
    });

    const navigate = vi.fn();
    mockNavigate.mockReturnValue(navigate);

    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Admin'));

    expect(navigate).toHaveBeenCalledWith('/login');
  });

  it('does not redirect when clicking admin link while authenticated', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isAdmin: true,
      isLoading: false,
      user: null,
      login: vi.fn(),
      logout: vi.fn(),
      signup: vi.fn(),
      confirmSignup: vi.fn(),
    });

    const navigate = vi.fn();
    mockNavigate.mockReturnValue(navigate);

    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Admin'));

    expect(navigate).not.toHaveBeenCalled();
  });
});
