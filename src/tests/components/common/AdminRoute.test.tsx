import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { AdminRoute } from '@/components/common/AdminRoute';
import { useAuth } from '@/hooks/useAuth';

vi.mock('@/hooks/useAuth');

const mockUseAuth = vi.mocked(useAuth);

const mockAdminUser = {
  id: '1',
  email: 'admin@test.com',
  name: 'Admin User',
  role: 'admin' as const,
  createdAt: new Date().toISOString(),
};

const baseAuth = {
  user: mockAdminUser,
  login: vi.fn(),
  logout: vi.fn(),
  signup: vi.fn(),
  confirmSignup: vi.fn(),
};

describe('AdminRoute – full coverage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns null while loading', () => {
    mockUseAuth.mockReturnValue({
      ...baseAuth,
      isAuthenticated: false,
      isLoading: true,
      isAdmin: false,
    });

    const { container } = render(
      <MemoryRouter initialEntries={['/admin']}>
        <AdminRoute>
          <div>Admin</div>
        </AdminRoute>
      </MemoryRouter>
    );

    expect(container.firstChild).toBeNull();
  });

  it('redirects to /login when not authenticated', async () => {
    mockUseAuth.mockReturnValue({
      ...baseAuth,
      isAuthenticated: false,
      isLoading: false,
      isAdmin: false,
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <div>Admin</div>
              </AdminRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(await screen.findByText('Login Page')).toBeInTheDocument();
  });

  it('alerts ONCE and redirects to home when authenticated but not admin (covers lines 17–22)', async () => {
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    mockUseAuth.mockReturnValue({
      ...baseAuth,
      isAuthenticated: true,
      isLoading: false,
      isAdmin: false,
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Routes>
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <div>Admin</div>
              </AdminRoute>
            }
          />
          <Route path="/" element={<div>Home Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    // 🔥 useEffect async çalışır → waitFor şart
    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledTimes(1);
    });

    expect(await screen.findByText('Home Page')).toBeInTheDocument();

    alertSpy.mockRestore();
  });

  it('renders children when user is admin', () => {
    mockUseAuth.mockReturnValue({
      ...baseAuth,
      isAuthenticated: true,
      isLoading: false,
      isAdmin: true,
    });

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AdminRoute>
          <div>Admin Content</div>
        </AdminRoute>
      </MemoryRouter>
    );

    expect(screen.getByText('Admin Content')).toBeInTheDocument();
  });
});
