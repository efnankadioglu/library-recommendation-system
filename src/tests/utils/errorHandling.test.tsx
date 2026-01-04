import { describe, it, expect, vi, beforeEach } from 'vitest';
import { handleApiError, showSuccess } from '@/utils/errorHandling';

/* -------------------------------------------------------------------------- */
/*                                   GLOBAL MOCKS                             */
/* -------------------------------------------------------------------------- */

beforeEach(() => {
  vi.spyOn(window, 'alert').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
  vi.spyOn(console, 'log').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

/* -------------------------------------------------------------------------- */
/*                                   TESTS                                    */
/* -------------------------------------------------------------------------- */

describe('handleApiError', () => {
  it('shows error message when Error object is passed', () => {
    const error = new Error('Something went wrong');

    handleApiError(error);

    expect(window.alert).toHaveBeenCalledWith(
      'Error: Something went wrong'
    );

    expect(console.error).toHaveBeenCalledWith(
      'API Error:',
      error
    );
  });

  it('shows error message when string is passed', () => {
    handleApiError('Custom error message');

    expect(window.alert).toHaveBeenCalledWith(
      'Error: Custom error message'
    );

    expect(console.error).toHaveBeenCalledWith(
      'API Error:',
      'Custom error message'
    );
  });

  it('shows default message for unknown error types', () => {
    const unknownError = { status: 500 };

    handleApiError(unknownError);

    expect(window.alert).toHaveBeenCalledWith(
      'Error: An unexpected error occurred'
    );

    expect(console.error).toHaveBeenCalledWith(
      'API Error:',
      unknownError
    );
  });
});

describe('showSuccess', () => {
  it('shows success alert and logs message', () => {
    showSuccess('Operation completed');

    expect(window.alert).toHaveBeenCalledWith(
      'Success: Operation completed'
    );

    expect(console.log).toHaveBeenCalledWith(
      'Success:',
      'Operation completed'
    );
  });
});
