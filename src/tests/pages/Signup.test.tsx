import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import { Signup } from '@/pages/Signup';

/* -------------------------------------------------------------------------- */
/*                                   Mocks                                    */
/* -------------------------------------------------------------------------- */

const mockSignup = vi.fn();
const mockConfirmSignup = vi.fn();
const mockNavigate = vi.fn();

vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    signup: mockSignup,
    confirmSignup: mockConfirmSignup,
  }),
}));

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>(
    'react-router-dom'
  );
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('aws-amplify/auth', () => ({
  signOut: vi.fn(),
}));

vi.mock('@/utils/errorHandling', () => ({
  handleApiError: vi.fn(),
}));

/* -------------------------------------------------------------------------- */
/*                                  Helpers                                   */
/* -------------------------------------------------------------------------- */

const setup = () =>
  render(
    <BrowserRouter>
      <Signup />
    </BrowserRouter>
  );

beforeEach(() => {
  vi.clearAllMocks();
});

/* -------------------------------------------------------------------------- */
/*                                   Tests                                    */
/* -------------------------------------------------------------------------- */

describe('Signup Page', () => {
  /* ----------------------------- Initial Render ---------------------------- */

  it('renders signup form correctly', () => {
    setup();

    expect(screen.getByPlaceholderText(/john doe/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/you@example.com/i)).toBeInTheDocument();
    expect(screen.getAllByPlaceholderText('••••••••')).toHaveLength(2);
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /sign up/i })
    ).toBeInTheDocument();
  });

  /* ----------------------------- Validation -------------------------------- */

  it('does not submit form when fields are empty', async () => {
    setup();

    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(mockSignup).not.toHaveBeenCalled();
    });
  });

  it('does not submit form when email is invalid', async () => {
    setup();

    fireEvent.change(screen.getByPlaceholderText(/john doe/i), {
      target: { value: 'John Doe' },
    });

    fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), {
      target: { value: 'invalid-email' },
    });

    fireEvent.change(screen.getAllByPlaceholderText('••••••••')[0], {
      target: { value: 'Password1' },
    });

    fireEvent.change(screen.getAllByPlaceholderText('••••••••')[1], {
      target: { value: 'Password1' },
    });

    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(mockSignup).not.toHaveBeenCalled();
    });
  });

  it('does not submit form when passwords do not match', async () => {
    setup();

    fireEvent.change(screen.getByPlaceholderText(/john doe/i), {
      target: { value: 'John Doe' },
    });

    fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), {
      target: { value: 'john@example.com' },
    });

    fireEvent.change(screen.getAllByPlaceholderText('••••••••')[0], {
      target: { value: 'Password1' },
    });

    fireEvent.change(screen.getAllByPlaceholderText('••••••••')[1], {
      target: { value: 'Password2' },
    });

    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(mockSignup).not.toHaveBeenCalled();
    });
  });

  /* --------------------------- Signup Success ------------------------------ */

  it('moves to verification step after successful signup', async () => {
    mockSignup.mockResolvedValueOnce(undefined);

    setup();

    fireEvent.change(screen.getByPlaceholderText(/john doe/i), {
      target: { value: 'John Doe' },
    });

    fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), {
      target: { value: 'john@example.com' },
    });

    fireEvent.change(screen.getAllByPlaceholderText('••••••••')[0], {
      target: { value: 'Password1' },
    });

    fireEvent.change(screen.getAllByPlaceholderText('••••••••')[1], {
      target: { value: 'Password1' },
    });

    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await waitFor(() => {
      expect(mockSignup).toHaveBeenCalled();
    });

    // Verification step'in EN SAĞLAM göstergesi
    expect(
      await screen.findByPlaceholderText(/123456/i)
    ).toBeInTheDocument();
  });

  /* --------------------------- Verification -------------------------------- */

  it('does not confirm when verification code is empty', async () => {
    mockSignup.mockResolvedValueOnce(undefined);

    setup();

    fireEvent.change(screen.getByPlaceholderText(/john doe/i), {
      target: { value: 'John Doe' },
    });

    fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), {
      target: { value: 'john@example.com' },
    });

    fireEvent.change(screen.getAllByPlaceholderText('••••••••')[0], {
      target: { value: 'Password1' },
    });

    fireEvent.change(screen.getAllByPlaceholderText('••••••••')[1], {
      target: { value: 'Password1' },
    });

    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await screen.findByPlaceholderText(/123456/i);

    fireEvent.click(screen.getByRole('button', { name: /verify/i }));

    await waitFor(() => {
      expect(mockConfirmSignup).not.toHaveBeenCalled();
    });
  });

  it('confirms signup and redirects to login', async () => {
    mockSignup.mockResolvedValueOnce(undefined);
    mockConfirmSignup.mockResolvedValueOnce(undefined);

    setup();

    fireEvent.change(screen.getByPlaceholderText(/john doe/i), {
      target: { value: 'John Doe' },
    });

    fireEvent.change(screen.getByPlaceholderText(/you@example.com/i), {
      target: { value: 'john@example.com' },
    });

    fireEvent.change(screen.getAllByPlaceholderText('••••••••')[0], {
      target: { value: 'Password1' },
    });

    fireEvent.change(screen.getAllByPlaceholderText('••••••••')[1], {
      target: { value: 'Password1' },
    });

    fireEvent.click(screen.getByRole('checkbox'));
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));

    await screen.findByPlaceholderText(/123456/i);

    fireEvent.change(screen.getByPlaceholderText(/123456/i), {
      target: { value: '123456' },
    });

    fireEvent.click(screen.getByRole('button', { name: /verify/i }));

    await waitFor(() => {
      expect(mockConfirmSignup).toHaveBeenCalledWith(
        'john@example.com',
        '123456'
      );
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });
});
