// src/tests/hooks/useAuth.test.tsx

import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { AuthContext } from '@/contexts/AuthContext';
import { useAuth } from '@/hooks/useAuth';

/* ---------------- test component ---------------- */
const Consumer = () => {
  const auth = useAuth();
  return <div data-testid="ok">{String(!!auth)}</div>;
};

/* ---------------- tests ---------------- */
describe('useAuth hook', () => {
  it('throws error when used outside AuthProvider', () => {
    expect(() => render(<Consumer />)).toThrow(
      'useAuth must be used within an AuthProvider'
    );
  });

  it('returns context when used inside AuthProvider', () => {
    const mockContext: any = {
      user: null,
      isAuthenticated: false,
      isAdmin: false,
      isLoading: false,
      login: async () => {},
      logout: async () => {},
      signup: async () => {},
      confirmSignup: async () => {},
    };

    const { getByTestId } = render(
      <AuthContext.Provider value={mockContext}>
        <Consumer />
      </AuthContext.Provider>
    );

    expect(getByTestId('ok')).toHaveTextContent('true');
  });
});
