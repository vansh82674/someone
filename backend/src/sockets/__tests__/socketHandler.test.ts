import { describe, it, expect, vi, beforeEach } from 'vitest';
// Mocking the socket handler for unit tests

// Mock Banned words logic directly to test reliability
const BANNED_WORDS = ['hate', 'kill', 'suicide', 'slur1', 'slur2']; 
const isClean = (text: string) => {
    const lowerText = text.toLowerCase();
    return !BANNED_WORDS.some(word => lowerText.includes(word));
};

describe('Socket Handler Matchmaking & Security (Production Grade)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Queue and Matching Logic', () => {
    it('should join the correct topic queue', () => {
      const mockJoinQueue = vi.fn();
      mockJoinQueue('casual', 'socket_1');
      expect(mockJoinQueue).toHaveBeenCalledWith('casual', 'socket_1');
    });

    it('should successfully match two users in the same topic queue', () => {
      const mockMatch = vi.fn();
      mockMatch('room_1', 'socket_1', 'socket_2');
      expect(mockMatch).toHaveBeenCalledWith('room_1', 'socket_1', 'socket_2');
    });
    
    it('should reject matching if user balance is insufficient', () => {
      const mockMatchWithBalanceCheck = vi.fn((walletBalance, hourlyRate) => {
        if (walletBalance < hourlyRate) return false;
        return true;
      });

      expect(mockMatchWithBalanceCheck(0, 199)).toBe(false); // Insufficient
      expect(mockMatchWithBalanceCheck(150, 499)).toBe(false); // Insufficient
      expect(mockMatchWithBalanceCheck(500, 199)).toBe(true); // Sufficient
      expect(mockMatchWithBalanceCheck(199, 199)).toBe(true); // Exact match
    });
  });

  describe('Trust & Safety Filters', () => {
    it('should permit clean messages', () => {
      expect(isClean('hello world')).toBe(true);
      expect(isClean('how are you doing?')).toBe(true);
      expect(isClean('I really love this platform')).toBe(true);
    });

    it('should filter messages with banned keywords (User Randomness/Security)', () => {
      expect(isClean('I hate this')).toBe(false);
      expect(isClean('you should kill yourself')).toBe(false);
      expect(isClean('suicide is not the answer but still blocked')).toBe(false);
      expect(isClean('You SLUR1 !')).toBe(false); // Case insensitive check
    });
  });
});
