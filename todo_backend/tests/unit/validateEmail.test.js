const validateEmail = require('../../utils/validateEmail');

describe('validateEmail', () => {
  test('returns true for a valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  test('returns true for a valid email with subdomain', () => {
    expect(validateEmail('user@mail.example.co.in')).toBe(true);
  });

  test('returns false for an email missing @', () => {
    expect(validateEmail('userexample.com')).toBe(false);
  });

  test('returns false for an email missing domain', () => {
    expect(validateEmail('user@')).toBe(false);
  });

  test('returns false for an email with spaces', () => {
    expect(validateEmail('user @example.com')).toBe(false);
  });

  test('returns false for an empty string', () => {
    expect(validateEmail('')).toBe(false);
  });

  test('returns false for null input', () => {
    expect(validateEmail(null)).toBe(false);
  });

  test('returns false for undefined input', () => {
    expect(validateEmail(undefined)).toBe(false);
  });

  test('returns false for non-string input', () => {
    expect(validateEmail(12345)).toBe(false);
  });

  test('trims whitespace before validating', () => {
    expect(validateEmail('  user@example.com  ')).toBe(true);
  });
});