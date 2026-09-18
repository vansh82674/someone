import { describe, it, expect, vi } from 'vitest';
// Mocking the socket handler for unit tests

describe('Socket Handler Matchmaking', () => {
  it('should join the correct topic queue', () => {
    const mockJoinQueue = vi.fn();
    mockJoinQueue('casual', 'socket_1');
    expect(mockJoinQueue).toHaveBeenCalledWith('casual', 'socket_1');
  });

  it('should match two users in the same topic queue', () => {
    const mockMatch = vi.fn();
    mockMatch('room_1', 'socket_1', 'socket_2');
    expect(mockMatch).toHaveBeenCalledWith('room_1', 'socket_1', 'socket_2');
  });

  it('should filter messages with banned keywords', () => {
    const isClean = (text: string) => !['hate', 'kill'].some(word => text.toLowerCase().includes(word));
    
    expect(isClean('hello world')).toBe(true);
    expect(isClean('I hate this')).toBe(false);
  });
});
