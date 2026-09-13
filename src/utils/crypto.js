/**
 * crypto.js — Security Utility Module
 *
 * Password hashing using Web Crypto API (PBKDF2, 100k iterations, SHA-256).
 * Input sanitization for XSS prevention.
 * Zero external dependencies — browser-native cryptography only.
 */

// ─── Constants ───────────────────────────────────────────────────────────────

const PBKDF2_ITERATIONS = 100_000;
const HASH_ALGORITHM = 'SHA-256';
const SALT_BYTE_LENGTH = 16;
const KEY_LENGTH_BITS = 256;

// ─── Salt Generation ─────────────────────────────────────────────────────────

/**
 * Generate a cryptographically secure random salt.
 * @returns {string} 32-character hex string (16 bytes)
 */
export function generateSalt() {
  const buffer = new Uint8Array(SALT_BYTE_LENGTH);
  crypto.getRandomValues(buffer);
  return Array.from(buffer)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// ─── Hex Helpers ─────────────────────────────────────────────────────────────

function hexToUint8Array(hex) {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

function uint8ArrayToHex(buffer) {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

// ─── Password Hashing (PBKDF2) ──────────────────────────────────────────────

/**
 * Hash a password using PBKDF2 with the given salt.
 * Uses Web Crypto API — async, non-blocking, hardware-accelerated.
 *
 * @param {string} password - The plaintext password to hash
 * @param {string} salt - A hex-encoded salt string (from generateSalt)
 * @returns {Promise<string>} The derived key as a 64-character hex string
 */
export async function hashPassword(password, salt) {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  const saltBuffer = hexToUint8Array(salt);

  // Import the password as a CryptoKey
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    passwordBuffer,
    'PBKDF2',
    false,
    ['deriveBits']
  );

  // Derive bits using PBKDF2
  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBuffer,
      iterations: PBKDF2_ITERATIONS,
      hash: HASH_ALGORITHM,
    },
    keyMaterial,
    KEY_LENGTH_BITS
  );

  return uint8ArrayToHex(derivedBits);
}

/**
 * Verify a password against a stored hash and salt.
 *
 * @param {string} password - The plaintext password to verify
 * @param {string} storedHash - The previously computed PBKDF2 hash (hex)
 * @param {string} salt - The salt used during the original hash (hex)
 * @returns {Promise<boolean>} True if the password matches
 */
export async function verifyPassword(password, storedHash, salt) {
  const computedHash = await hashPassword(password, salt);

  // Constant-time comparison to prevent timing attacks
  if (computedHash.length !== storedHash.length) return false;
  let result = 0;
  for (let i = 0; i < computedHash.length; i++) {
    result |= computedHash.charCodeAt(i) ^ storedHash.charCodeAt(i);
  }
  return result === 0;
}

// ─── Input Sanitization ─────────────────────────────────────────────────────

/**
 * Sanitize a general text input — strips HTML tags, trims whitespace,
 * collapses internal whitespace, and enforces a max length.
 *
 * @param {string} str - Raw user input
 * @param {number} maxLength - Maximum allowed characters (default: 200)
 * @returns {string} Sanitized string
 */
export function sanitizeInput(str, maxLength = 200) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/<[^>]*>/g, '')       // Strip HTML tags
    .replace(/[<>"'`]/g, '')       // Remove dangerous characters
    .replace(/\s+/g, ' ')         // Collapse whitespace
    .trim()
    .slice(0, maxLength);
}

/**
 * Sanitize and normalize an email address.
 *
 * @param {string} email - Raw email input
 * @returns {string} Cleaned, lowercased email
 */
export function sanitizeEmail(email) {
  if (typeof email !== 'string') return '';
  return email
    .replace(/<[^>]*>/g, '')       // Strip HTML tags
    .replace(/[<>"'`\s]/g, '')     // Remove dangerous chars and whitespace
    .toLowerCase()
    .trim()
    .slice(0, 254);                // RFC 5321 max email length
}

// ─── Rate Limiting ──────────────────────────────────────────────────────────

const RATE_LIMIT_KEY = 'zenith_login_attempts';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

/**
 * Check if login attempts are currently locked out.
 * @returns {{ locked: boolean, remainingMs: number, attempts: number }}
 */
export function checkRateLimit() {
  try {
    const raw = sessionStorage.getItem(RATE_LIMIT_KEY);
    if (!raw) return { locked: false, remainingMs: 0, attempts: 0 };

    const data = JSON.parse(raw);
    const now = Date.now();

    // If lockout window has expired, reset
    if (data.lockedUntil && now >= data.lockedUntil) {
      sessionStorage.removeItem(RATE_LIMIT_KEY);
      return { locked: false, remainingMs: 0, attempts: 0 };
    }

    if (data.lockedUntil && now < data.lockedUntil) {
      return {
        locked: true,
        remainingMs: data.lockedUntil - now,
        attempts: data.attempts,
      };
    }

    return { locked: false, remainingMs: 0, attempts: data.attempts || 0 };
  } catch {
    return { locked: false, remainingMs: 0, attempts: 0 };
  }
}

/**
 * Record a failed login attempt. Engages lockout after MAX_ATTEMPTS.
 */
export function recordFailedAttempt() {
  try {
    const raw = sessionStorage.getItem(RATE_LIMIT_KEY);
    const data = raw ? JSON.parse(raw) : { attempts: 0 };
    data.attempts = (data.attempts || 0) + 1;

    if (data.attempts >= MAX_ATTEMPTS) {
      data.lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
    }

    sessionStorage.setItem(RATE_LIMIT_KEY, JSON.stringify(data));
  } catch {
    // Fail silently — rate limiting is defense-in-depth
  }
}

/**
 * Reset the rate limiter on successful login.
 */
export function resetRateLimit() {
  try {
    sessionStorage.removeItem(RATE_LIMIT_KEY);
  } catch {
    // Fail silently
  }
}

// ─── Password Strength Validation ───────────────────────────────────────────

/**
 * Validate password meets minimum strength requirements.
 * @param {string} password
 * @returns {{ valid: boolean, message: string }}
 */
export function validatePasswordStrength(password) {
  if (!password || password.length < 8) {
    return { valid: false, message: 'Password must be at least 8 characters.' };
  }
  if (!/\d/.test(password)) {
    return { valid: false, message: 'Password must contain at least one number.' };
  }
  if (!/[a-zA-Z]/.test(password)) {
    return { valid: false, message: 'Password must contain at least one letter.' };
  }
  return { valid: true, message: '' };
}
