import { describe, it, expect, beforeEach } from 'vitest';
import { storageService } from '../services/storageService';

describe('storageService', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('stores and retrieves a token', () => {
    storageService.setToken('test-token');
    expect(storageService.getToken()).toBe('test-token');
  });

  it('returns null when no token is stored', () => {
    expect(storageService.getToken()).toBeNull();
  });

  it('stores and retrieves a refresh token', () => {
    storageService.setRefreshToken('refresh-token');
    expect(storageService.getRefreshToken()).toBe('refresh-token');
  });

  it('clears all tokens', () => {
    storageService.setToken('tok');
    storageService.setRefreshToken('refresh');
    storageService.clearTokens();
    expect(storageService.getToken()).toBeNull();
    expect(storageService.getRefreshToken()).toBeNull();
  });
});
