import crypto from 'crypto';

// Generate random token
export const generateToken = (): string => {
    return crypto.randomBytes(32).toString('hex');
};

// Generate token expiry (1 hour from now)
export const generateTokenExpiry = (): Date => {
    return new Date(Date.now() + 60 * 60 * 1000); // 1 hour
};