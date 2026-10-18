import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const HEX_KEY = process.env.ENCRYPTION_SECRET_KEY || '';

if (!HEX_KEY || HEX_KEY.length !== 64) {
  throw new Error('ENCRYPTION_SECRET_KEY must be a 64-character hex string (32 bytes).');
}

const KEY = Buffer.from(HEX_KEY, 'hex');

export interface EncryptedData {
  encryptedText: string;
  iv: string;
  authTag: string;
}

/**
 * Encrypts plain text using AES-256-GCM
 */
export function encrypt(text: string): EncryptedData {
  const iv = crypto.randomBytes(12); // 12-byte IV standard for GCM
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);

  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const authTag = cipher.getAuthTag().toString('hex');

  return {
    encryptedText: encrypted,
    iv: iv.toString('hex'),
    authTag: authTag,
  };
}

/**
 * Decrypts AES-256-GCM encrypted data
 */
export function decrypt(encryptedText: string, ivHex: string, authTagHex: string): string {
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);

  decipher.setAuthTag(authTag);

  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}