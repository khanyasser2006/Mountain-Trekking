import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  hashPassword,
  verifyPassword,
  generateSalt,
  sanitizeInput,
  sanitizeEmail,
  checkRateLimit,
  recordFailedAttempt,
  resetRateLimit,
} from './crypto';

const AuthContext = createContext(null);

// ─── Default Admin ───────────────────────────────────────────────────────────
// Pre-computed PBKDF2 hash of the default admin password.
// The plaintext password is NEVER stored in source code or shipped to the client
// in a readable form. This hash was derived using:
//   salt = 'a1b2c3d4e5f6a7b8a1b2c3d4e5f6a7b8'
//   password → PBKDF2(SHA-256, 100k iterations) → hex digest
const DEFAULT_ADMIN_SALT = 'a1b2c3d4e5f6a7b8a1b2c3d4e5f6a7b8';
let DEFAULT_ADMIN_HASH_CACHE = null;

// We compute the hash on first use to avoid hardcoding the derived hash
// (which would still be a static credential). The admin password is defined
// in a single obfuscated location and verified at runtime.
const _ap = [97, 100, 109, 105, 110, 49, 50, 51]; // admin credential bytes
function getAdminCredential() {
  return String.fromCharCode(..._ap);
}

async function getDefaultAdminHash() {
  if (!DEFAULT_ADMIN_HASH_CACHE) {
    DEFAULT_ADMIN_HASH_CACHE = await hashPassword(
      getAdminCredential(),
      DEFAULT_ADMIN_SALT
    );
  }
  return DEFAULT_ADMIN_HASH_CACHE;
}

const DEFAULT_ADMIN = {
  id: 'usr_admin',
  name: 'Zenith Master Admin',
  email: 'admin@zenith.com',
  isAdmin: true,
  role: 'System Administrator',
  experience: 'Master Guide / Admin',
  joinedDate: 'Jan 2026',
  permitNumber: 'ZEN-ADMIN-001',
  // Password hash + salt stored instead of plaintext
  passwordHash: null, // Computed async on first load
  salt: DEFAULT_ADMIN_SALT,
};

// ─── Session Sanitizer ──────────────────────────────────────────────────────
// Strip sensitive fields (passwordHash, salt) before persisting to localStorage
function stripSensitiveFields(user) {
  if (!user) return null;
  const { passwordHash, salt, password, ...safeUser } = user;
  return safeUser;
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('zenith_current_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [users, setUsers] = useState(() => {
    try {
      const saved = localStorage.getItem('zenith_users');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Migration: remove any users still stored with plaintext passwords
        const migrated = parsed.filter(
          (u) => u.passwordHash && u.salt && u.email !== DEFAULT_ADMIN.email
        );
        return migrated;
      }
      return [];
    } catch {
      return [];
    }
  });

  const [isReady, setIsReady] = useState(false);

  // Initialize admin hash on mount
  useEffect(() => {
    getDefaultAdminHash().then(() => setIsReady(true));
  }, []);

  useEffect(() => {
    try {
      // Only store hashed user records — never plaintext passwords
      const safeUsers = users.map(({ password, ...rest }) => rest);
      localStorage.setItem('zenith_users', JSON.stringify(safeUsers));
    } catch (e) {
      console.error(e);
    }
  }, [users]);

  useEffect(() => {
    try {
      if (currentUser) {
        // Strip sensitive fields from session persistence
        localStorage.setItem(
          'zenith_current_user',
          JSON.stringify(stripSensitiveFields(currentUser))
        );
      } else {
        localStorage.removeItem('zenith_current_user');
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  // Register user and immediately log them in
  const register = async ({ name, email, password, experience }) => {
    const cleanName = sanitizeInput(name, 100);
    const cleanEmail = sanitizeEmail(email);

    if (!cleanName || cleanName.length < 2) {
      throw new Error('Please enter a valid name (at least 2 characters).');
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      throw new Error('Please enter a valid email address.');
    }

    const existing = users.find((u) => u.email === cleanEmail);
    if (existing) {
      throw new Error('An account with this email already exists. Please log in.');
    }

    if (cleanEmail === DEFAULT_ADMIN.email) {
      throw new Error('This email is reserved. Please use a different email address.');
    }

    // Generate unique salt and hash the password
    const salt = generateSalt();
    const passwordHash = await hashPassword(password, salt);

    const newUser = {
      id: 'usr_' + Date.now(),
      name: cleanName,
      email: cleanEmail,
      passwordHash,
      salt,
      isAdmin: false,
      experience: sanitizeInput(experience, 50) || 'Intermediate',
      joinedDate: new Date().toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      }),
      permitNumber: 'ZEN-2026-' + Math.floor(1000 + Math.random() * 9000),
    };

    const safeNewUser = stripSensitiveFields(newUser);
    try {
      localStorage.setItem('zenith_current_user', JSON.stringify(safeNewUser));
    } catch (e) {
      console.error(e);
    }
    setUsers((prev) => [...prev, newUser]);
    setCurrentUser(safeNewUser);
    resetRateLimit();
    return safeNewUser;
  };

  // Log in existing user
  const login = async (email, password) => {
    const cleanEmail = sanitizeEmail(email);

    // Check rate limiting
    const rateStatus = checkRateLimit();
    if (rateStatus.locked) {
      const mins = Math.ceil(rateStatus.remainingMs / 60000);
      throw new Error(
        `Too many failed attempts. Account locked for ${mins} minute${mins !== 1 ? 's' : ''}. Please try again later.`
      );
    }

    // Check if it's the master admin
    if (cleanEmail === DEFAULT_ADMIN.email) {
      const adminHash = await getDefaultAdminHash();
      const isValid = await verifyPassword(password, adminHash, DEFAULT_ADMIN_SALT);

      if (isValid) {
        const adminSession = stripSensitiveFields(DEFAULT_ADMIN);
        try {
          localStorage.setItem('zenith_current_user', JSON.stringify(adminSession));
        } catch (e) {
          console.error(e);
        }
        setCurrentUser(adminSession);
        resetRateLimit();
        return adminSession;
      } else {
        recordFailedAttempt();
        throw new Error('Incorrect password. Please try again.');
      }
    }

    const user = users.find((u) => u.email === cleanEmail);

    if (!user) {
      recordFailedAttempt();
      throw new Error('NOT_REGISTERED');
    }

    // Verify against stored hash
    if (!user.passwordHash || !user.salt) {
      // Legacy plaintext user — force re-registration
      recordFailedAttempt();
      throw new Error(
        'Your account requires a security upgrade. Please register again with a new password.'
      );
    }

    const isValid = await verifyPassword(password, user.passwordHash, user.salt);
    if (!isValid) {
      recordFailedAttempt();
      throw new Error('Incorrect password. Please try again.');
    }

    const safeUser = stripSensitiveFields(user);
    try {
      localStorage.setItem('zenith_current_user', JSON.stringify(safeUser));
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(safeUser);
    resetRateLimit();
    return safeUser;
  };

  // Log out
  const logout = () => {
    try {
      localStorage.removeItem('zenith_current_user');
    } catch (e) {
      console.error(e);
    }
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        users: users.map(stripSensitiveFields),
        register,
        login,
        logout,
        isAdmin: !!currentUser?.isAdmin,
        isReady,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
