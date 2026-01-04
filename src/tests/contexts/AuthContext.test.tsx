import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

import { AuthProvider, AuthContext } from '@/contexts/AuthContext';
import type { AuthContextType } from '@/contexts/AuthContext';

vi.mock('aws-amplify/auth', () => ({
  signIn: vi.fn(),
  signOut: vi.fn(),
  signUp: vi.fn(),
  getCurrentUser: vi.fn(),
  fetchUserAttributes: vi.fn(),
  confirmSignUp: vi.fn(),
  fetchAuthSession: vi.fn(),
}));

import {
  signIn,
  signOut,
  signUp,
  getCurrentUser,
  fetchUserAttributes,
  confirmSignUp,
  fetchAuthSession,
} from 'aws-amplify/auth';

const mockSignIn = signIn as any;
const mockSignOut = signOut as any;
const mockSignUp = signUp as any;
const mockGetCurrentUser = getCurrentUser as any;
const mockFetchUserAttributes = fetchUserAttributes as any;
const mockConfirmSignUp = confirmSignUp as any;
const mockFetchAuthSession = fetchAuthSession as any;

function Consumer() {
  const ctx = React.useContext(AuthContext) as AuthContextType;

  return (
    <div>
      <div data-testid="authenticated">{String(ctx.isAuthenticated)}</div>
      <div data-testid="loading">{String(ctx.isLoading)}</div>
      <div data-testid="admin">{String(ctx.isAdmin)}</div>

      <button
        onClick={async () => {
          try {
            await ctx.login('a@b.com', 'pass');
          } catch {}
        }}
      >
        login
      </button>

      <button
        onClick={async () => {
          try {
            await ctx.logout();
          } catch {}
        }}
      >
        logout
      </button>

      <button
        onClick={async () => {
          try {
            await ctx.signup('a@b.com', 'pass', 'Name');
          } catch {}
        }}
      >
        signup
      </button>

      <button
        onClick={async () => {
          try {
            await ctx.confirmSignup('a@b.com', '123456');
          } catch {}
        }}
      >
        confirm
      </button>
    </div>
  );
}

const renderAuth = () =>
  render(
    <AuthProvider>
      <Consumer />
    </AuthProvider>
  );

let consoleErrorSpy: any;

beforeEach(() => {
  vi.clearAllMocks();
  vi.stubGlobal('alert', vi.fn());
  consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  consoleErrorSpy.mockRestore();
});

describe('AuthContext – full coverage', () => {
  it('loads authenticated admin user on mount', async () => {
    mockGetCurrentUser.mockResolvedValue({ userId: '1', username: 'admin' });
    mockFetchUserAttributes.mockResolvedValue({
      email: 'admin@test.com',
      name: 'Admin',
    });
    mockFetchAuthSession.mockResolvedValue({
      tokens: {
        accessToken: {
          toString: () =>
            `x.${btoa(
              JSON.stringify({ 'cognito:groups': ['Admin'] })
            )}.y`,
        },
      },
    });

    renderAuth();

    await waitFor(() =>
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true')
    );
    expect(screen.getByTestId('admin')).toHaveTextContent('true');
  });

  it('handles unauthenticated mount error', async () => {
    mockGetCurrentUser.mockRejectedValue(new Error('no user'));

    renderAuth();

    await waitFor(() =>
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false')
    );
  });

  it('logs in user successfully', async () => {
    mockSignIn.mockResolvedValue({ isSignedIn: true });
    mockGetCurrentUser.mockResolvedValue({ userId: '2', username: 'user' });
    mockFetchUserAttributes.mockResolvedValue({
      email: 'user@test.com',
      name: 'User',
    });
    mockFetchAuthSession.mockResolvedValue({ tokens: {} });

    renderAuth();

    await userEvent.click(screen.getByText('login'));

    await waitFor(() =>
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true')
    );
  });

  it('handles login error WITHOUT changing auth state', async () => {
    mockGetCurrentUser.mockRejectedValue(new Error('no user'));

    renderAuth();

    await waitFor(() =>
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false')
    );

    const before = screen.getByTestId('authenticated').textContent;

    mockSignIn.mockRejectedValue(new Error('login failed'));

    await userEvent.click(screen.getByText('login'));

    await waitFor(() =>
      expect(screen.getByTestId('authenticated').textContent).toBe(before)
    );
  });

  it('logs out user successfully', async () => {
    mockGetCurrentUser.mockResolvedValue({ userId: '3', username: 'user' });
    mockFetchUserAttributes.mockResolvedValue({
      email: 'user@test.com',
      name: 'User',
    });
    mockFetchAuthSession.mockResolvedValue({ tokens: {} });

    renderAuth();

    await waitFor(() =>
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true')
    );

    mockSignOut.mockResolvedValue(undefined);

    await userEvent.click(screen.getByText('logout'));

    await waitFor(() =>
      expect(screen.getByTestId('authenticated')).toHaveTextContent('false')
    );
  });

  it('handles logout error WITHOUT clearing auth state', async () => {
    mockGetCurrentUser.mockResolvedValue({ userId: '4', username: 'user' });
    mockFetchUserAttributes.mockResolvedValue({
      email: 'user@test.com',
      name: 'User',
    });
    mockFetchAuthSession.mockResolvedValue({ tokens: {} });

    renderAuth();

    await waitFor(() =>
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true')
    );

    const before = screen.getByTestId('authenticated').textContent;

    mockSignOut.mockRejectedValue(new Error('logout failed'));

    await userEvent.click(screen.getByText('logout'));

    await waitFor(() =>
      expect(screen.getByTestId('authenticated').textContent).toBe(before)
    );
  });

  it('signs up successfully', async () => {
    mockSignUp.mockResolvedValue(undefined);

    renderAuth();

    await userEvent.click(screen.getByText('signup'));

    await waitFor(() => expect(mockSignUp).toHaveBeenCalled());
  });

  it('handles signup error', async () => {
    mockSignUp.mockRejectedValue(new Error('signup failed'));

    renderAuth();

    await userEvent.click(screen.getByText('signup'));

    await waitFor(() => expect(mockSignUp).toHaveBeenCalled());
  });

  it('confirms signup', async () => {
    mockConfirmSignUp.mockResolvedValue(undefined);

    renderAuth();

    await userEvent.click(screen.getByText('confirm'));

    await waitFor(() => expect(mockConfirmSignUp).toHaveBeenCalled());
  });

  it('covers decodeJwtPayload returning null and resolveIsAdmin returning false', async () => {
    mockGetCurrentUser.mockResolvedValue({ userId: '5', username: 'user' });
    mockFetchUserAttributes.mockResolvedValue({
      email: 'user@test.com',
      name: 'User',
    });

    mockFetchAuthSession.mockResolvedValue({
      tokens: {
        accessToken: {
          toString: () => 'invalid.token.value',
        },
      },
    });

    renderAuth();

    await waitFor(() =>
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true')
    );
    expect(screen.getByTestId('admin')).toHaveTextContent('false');
  });

  it('covers resolveIsAdmin catch branch (fetchAuthSession throws)', async () => {
    mockGetCurrentUser.mockResolvedValue({ userId: '6', username: 'user' });
    mockFetchUserAttributes.mockResolvedValue({
      email: 'user@test.com',
      name: 'User',
    });

    mockFetchAuthSession.mockRejectedValue(new Error('session error'));

    renderAuth();

    await waitFor(() =>
      expect(screen.getByTestId('authenticated')).toHaveTextContent('true')
    );
    expect(screen.getByTestId('admin')).toHaveTextContent('false');
  });
});
