import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from '@/components/common/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';

vi.mock('@/hooks/useAuth');

const mockUseAuth = vi.mocked(useAuth);

const baseAuth = {
  isAdmin: false,
  user: null,
  login: vi.fn(),
  logout: vi.fn(),
  signup: vi.fn(),
  confirmSignup: vi.fn(),
};


const adminUser = {
  id: '1',
  email: 'admin@test.com',
  name: 'Admin User',
  role: 'admin' as const,
  createdAt: new Date().toISOString(),
};

const normalUser = {
  ...adminUser,
  role: 'user' as const,
};

describe('ProtectedRoute – full coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows LoadingSpinner when loading', () => {
    mockUseAuth.mockReturnValue({
      ...baseAuth,
      isAuthenticated: false,
      isLoading: true,
      user: null,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    // Spinner lg size var mı → dolaylı doğrulama
    const spinner = document.querySelector('.w-12.h-12');
    expect(spinner).toBeInTheDocument();
  });

  it('redirects to /login when not authenticated', async () => {
    mockUseAuth.mockReturnValue({
      ...baseAuth,
      isAuthenticated: false,
      isLoading: false,
      user: null,
    });

    render(
      <MemoryRouter initialEntries={['/protected']}>
        <Routes>
          <Route
            path="/protected"
            element={
              <ProtectedRoute>
                <div>Protected</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText('Login Page')).toBeInTheDocument();
  });

  it('redirects to home when requireAdmin is true and user is not admin', async () => {
    mockUseAuth.mockReturnValue({
      ...baseAuth,
      isAuthenticated: true,
      isLoading: false,
      user: normalUser,
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <div>Admin Page</div>
              </ProtectedRoute>
            }
          />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText('Home Page')).toBeInTheDocument();
  });

  it('renders children for authenticated user when admin is not required', () => {
    mockUseAuth.mockReturnValue({
      ...baseAuth,
      isAuthenticated: true,
      isLoading: false,
      user: normalUser,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <div>Protected Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Protected Content')).toBeInTheDocument();
  });

  it('renders children for admin user when requireAdmin is true', () => {
    mockUseAuth.mockReturnValue({
      ...baseAuth,
      isAuthenticated: true,
      isLoading: false,
      user: adminUser,
    });

    render(
      <MemoryRouter>
        <ProtectedRoute requireAdmin>
          <div>Admin Content</div>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });
});
