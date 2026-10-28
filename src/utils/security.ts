import { User } from '../types/common.types.ts';

/**
 * Sanitize plain string input against Cross-Site Scripting (XSS) and injection.
 * Strips HTML tags, script markers, and encodes dangerous characters.
 */
export const sanitizeInput = (input: string): string => {
  if (!input || typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<[^>]+>/g, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .trim();
};

/**
 * Remove sensitive credentials from user object before persisting to client-side storage.
 * In BaaS / Frontend architecture, credentials must never remain in localStorage or state.
 */
export const sanitizeUserSession = (user: User): User => {
  const sanitized = { ...user };
  delete (sanitized as Record<string, unknown>).password;
  delete (sanitized as Record<string, unknown>).secret;
  return sanitized;
};

/**
 * Mask account numbers for safe display in UI.
 * e.g., "123-4-56789-0" -> "123-*-***89-0"
 */
export const maskAccountNumber = (accountNumber: string): string => {
  if (!accountNumber) return '';
  if (accountNumber.length <= 4) return accountNumber;
  const start = accountNumber.slice(0, 3);
  const end = accountNumber.slice(-3);
  const middle = '*'.repeat(Math.max(1, accountNumber.length - 6));
  return `${start}-${middle}-${end}`;
};

/**
 * Client-side rate limiter / brute-force tracker for login attempts.
 */
interface RateLimitState {
  attempts: number;
  lockoutExpiry: number | null;
}

const RATE_LIMIT_KEY = 'ais_sec_rate_limit';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 30 * 1000; // 30 seconds

export const getLoginRateLimitState = (): RateLimitState => {
  try {
    const raw = sessionStorage.getItem(RATE_LIMIT_KEY);
    if (!raw) return { attempts: 0, lockoutExpiry: null };
    const parsed: RateLimitState = JSON.parse(raw);
    if (parsed.lockoutExpiry && Date.now() > parsed.lockoutExpiry) {
      // Lockout expired
      sessionStorage.removeItem(RATE_LIMIT_KEY);
      return { attempts: 0, lockoutExpiry: null };
    }
    return parsed;
  } catch {
    return { attempts: 0, lockoutExpiry: null };
  }
};

export const recordFailedLoginAttempt = (): { isLocked: boolean; remainingLockoutSeconds: number } => {
  const current = getLoginRateLimitState();
  const nextAttempts = current.attempts + 1;

  if (nextAttempts >= MAX_ATTEMPTS) {
    const expiry = Date.now() + LOCKOUT_DURATION_MS;
    const state: RateLimitState = { attempts: nextAttempts, lockoutExpiry: expiry };
    sessionStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(state));
    return { isLocked: true, remainingLockoutSeconds: Math.ceil(LOCKOUT_DURATION_MS / 1000) };
  }

  const state: RateLimitState = { attempts: nextAttempts, lockoutExpiry: null };
  sessionStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(state));
  return { isLocked: false, remainingLockoutSeconds: 0 };
};

export const resetLoginRateLimit = (): void => {
  sessionStorage.removeItem(RATE_LIMIT_KEY);
};

/**
 * Concurrency-safe unique ID generator using crypto.randomUUID or high-entropy entropy.
 * Prevents key collision during rapid or concurrent multi-tab submissions.
 */
export const generateUniqueId = (prefix: string): string => {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return `${prefix}-${crypto.randomUUID()}`;
  }
  const randomSuffix = Math.random().toString(36).substring(2, 10);
  return `${prefix}-${Date.now()}-${randomSuffix}`;
};
