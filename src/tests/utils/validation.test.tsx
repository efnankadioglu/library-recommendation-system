import { describe, it, expect } from 'vitest';
import {
  validateEmail,
  validatePassword,
  validateRequired,
} from '@/utils/validation';

/* -------------------------------------------------------------------------- */
/*                              validateEmail                                 */
/* -------------------------------------------------------------------------- */

describe('validateEmail', () => {
  it('returns true for valid email addresses', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.co')).toBe(true);
    expect(validateEmail('user+alias@sub.domain.com')).toBe(true);
  });

  it('returns false for invalid email addresses', () => {
    expect(validateEmail('')).toBe(false);
    expect(validateEmail('plainaddress')).toBe(false);
    expect(validateEmail('missing@domain')).toBe(false);
    expect(validateEmail('missing.domain@')).toBe(false);
    expect(validateEmail('missing@.com')).toBe(false);
    expect(validateEmail('space in@email.com')).toBe(false);
  });
});

/* -------------------------------------------------------------------------- */
/*                            validatePassword                                 */
/* -------------------------------------------------------------------------- */

describe('validatePassword', () => {
  it('returns false if password is shorter than 8 characters', () => {
    expect(validatePassword('Aa1')).toBe(false);
    expect(validatePassword('Aa1234')).toBe(false);
  });

  it('returns false if password has no uppercase letter', () => {
    expect(validatePassword('password1')).toBe(false);
  });

  it('returns false if password has no lowercase letter', () => {
    expect(validatePassword('PASSWORD1')).toBe(false);
  });

  it('returns false if password has no number', () => {
    expect(validatePassword('Password')).toBe(false);
  });

  it('returns true for valid strong passwords', () => {
    expect(validatePassword('Password1')).toBe(true);
    expect(validatePassword('StrongPass9')).toBe(true);
    expect(validatePassword('A1b2c3d4')).toBe(true);
  });
});

/* -------------------------------------------------------------------------- */
/*                           validateRequired                                   */
/* -------------------------------------------------------------------------- */

describe('validateRequired', () => {
  it('returns false for empty or whitespace-only values', () => {
    expect(validateRequired('')).toBe(false);
    expect(validateRequired('   ')).toBe(false);
    expect(validateRequired('\n\t')).toBe(false);
  });

  it('returns true for non-empty values', () => {
    expect(validateRequired('a')).toBe(true);
    expect(validateRequired(' test ')).toBe(true);
    expect(validateRequired('0')).toBe(true);
  });
});
