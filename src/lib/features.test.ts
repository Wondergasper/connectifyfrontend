import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { api } from './api';

describe('API Feature Integration', () => {
  // Mock global fetch
  const fetchMock = vi.fn();

  beforeEach(() => {
    global.fetch = fetchMock;
    fetchMock.mockReset();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Wallet - Add Funds', () => {
    it('should send correct payload with paymentMethod', async () => {
      // Mock successful response
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ balance: 1000, currency: 'NGN' }),
      });

      const fundsData = {
        amount: 5000,
        paymentMethod: 'paystack'
      };

      await api.wallet.addFunds(fundsData);

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, options] = fetchMock.mock.calls[0];

      expect(url).toContain('/wallet/add-funds');
      expect(options.method).toBe('POST');
      expect(JSON.parse(options.body)).toEqual(fundsData);
    });
  });

  describe('Auth - Forgot Password', () => {
    it('should send email for password reset', async () => {
      fetchMock.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ data: 'Email sent' }),
      });

      const email = 'user@example.com';
      await api.auth.forgotPassword(email);

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, options] = fetchMock.mock.calls[0];

      expect(url).toContain('/auth/forgot-password');
      expect(options.method).toBe('POST');
      expect(JSON.parse(options.body)).toEqual({ email });
    });
  });
});
