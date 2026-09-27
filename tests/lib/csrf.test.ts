// tests/lib/csrf.test.ts

import { verifyOrigin } from '../lib/csr

describe('verifyOrigin', () => {
  const allowedOrigins = ['https://example.com', 'http://localhost:3000'];

  it('should return true if the origin is in the allowed list', () => {
    const request = { headers: { origin: 'https://example.com' } };
    expect(verifyOrigin(request, allowedOrigins)).toBe(true);
  });

  it('should return false if the origin is not in the allowed list', () => {
    const request = { headers: { origin: 'http://unknown.com' } };
    expect(verifyOrigin(request, allowedOrigins)).toBe(false);
  });

  it('should return true if no Origin header is present and the default is allowed', () => {
    process.env.ALLOWED_ORIGIN = 'https://default.example.com';
    const request = { headers: {} };
    expect(verifyOrigin(request, [])).toBe(true);
  });

  it('should return false if no Origin header is present and none are allowed', () => {
    const request = { headers: {} };
    expect(verifyOrigin(request, [])).toBe(false);
  });
});