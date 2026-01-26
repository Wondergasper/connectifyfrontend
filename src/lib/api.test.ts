import { describe, it, expect } from 'vitest';

describe('Environment Configuration', () => {
  it('should have the correct API URL from environment', () => {
    // Vitest (via Vite) exposes env vars on import.meta.env
    // We expect the values from .env.test
    expect(import.meta.env.VITE_API_URL).toBe('http://test-api.com');
  });

  it('should have the correct WS URL from environment', () => {
    expect(import.meta.env.VITE_WS_URL).toBe('http://test-ws.com');
  });
});
