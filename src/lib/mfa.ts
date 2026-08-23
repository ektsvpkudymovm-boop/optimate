import crypto from "crypto";
import { hashPassword, verifyPassword } from "./password";

const TOTP_PERIOD_SECONDS = 30;
const TOTP_DIGITS = 6;
const TOTP_WINDOW = 1;
const MFA_CHALLENGE_MAX_AGE_MS = 10 * 60 * 1000;
const MFA_SETUP_MAX_AGE_MS = 10 * 60 * 1000;
export const MFA_CHALLENGE_MAX_ATTEMPTS = 5;

const BASE32_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

type EncryptedPayload = {
  v: 1;
  iv: string;
  tag: string;
  value: string;
};

function getEncryptionKey(): Buffer {
  const raw = process.env.MFA_SECRET_ENCRYPTION_KEY?.trim();
  if (!raw) {
    throw new Error("MFA_SECRET_ENCRYPTION_KEY is required to encrypt MFA secrets.");
  }

  if (/^[a-f0-9]{64}$/i.test(raw)) {
    return Buffer.from(raw, "hex");
  }

  try {
    const decoded = Buffer.from(raw, "base64");
    if (decoded.length === 32) return decoded;
  } catch {
    // Fall through to length validation below.
  }

  if (raw.length < 32) {
    throw new Error("MFA_SECRET_ENCRYPTION_KEY must be at least 32 characters.");
  }

  return crypto.createHash("sha256").update(raw).digest();
}

export function encryptMfaSecret(secret: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", getEncryptionKey(), iv);
  const encrypted = Buffer.concat([cipher.update(secret, "utf8"), cipher.final()]);
  const payload: EncryptedPayload = {
    v: 1,
    iv: iv.toString("base64url"),
    tag: cipher.getAuthTag().toString("base64url"),
    value: encrypted.toString("base64url"),
  };

  return JSON.stringify(payload);
}

export function decryptMfaSecret(encryptedSecret: string): string {
  const payload = JSON.parse(encryptedSecret) as EncryptedPayload;
  if (payload.v !== 1) {
    throw new Error("Unsupported MFA secret version.");
  }

  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    getEncryptionKey(),
    Buffer.from(payload.iv, "base64url")
  );
  decipher.setAuthTag(Buffer.from(payload.tag, "base64url"));

  return Buffer.concat([
    decipher.update(Buffer.from(payload.value, "base64url")),
    decipher.final(),
  ]).toString("utf8");
}

export function createMfaChallengeToken(): string {
  return crypto.randomBytes(32).toString("base64url");
}

export function hashMfaChallengeToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function createMfaChallengeExpiresAt(): Date {
  return new Date(Date.now() + MFA_CHALLENGE_MAX_AGE_MS);
}

export function createMfaSetupExpiresAt(): Date {
  return new Date(Date.now() + MFA_SETUP_MAX_AGE_MS);
}

export function createTotpSecret(): string {
  return base32Encode(crypto.randomBytes(20));
}

function base32Encode(buffer: Buffer): string {
  let bits = 0;
  let value = 0;
  let output = "";

  for (const byte of buffer) {
    value = (value << 8) | byte;
    bits += 8;

    while (bits >= 5) {
      output += BASE32_ALPHABET[(value >>> (bits - 5)) & 31];
      bits -= 5;
    }
  }

  if (bits > 0) {
    output += BASE32_ALPHABET[(value << (5 - bits)) & 31];
  }

  return output;
}

function base32Decode(input: string): Buffer {
  const normalized = input.replace(/=+$/g, "").replace(/\s+/g, "").toUpperCase();
  const bytes: number[] = [];
  let bits = 0;
  let value = 0;

  for (const char of normalized) {
    const index = BASE32_ALPHABET.indexOf(char);
    if (index === -1) {
      throw new Error("Invalid Base32 value.");
    }

    value = (value << 5) | index;
    bits += 5;

    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255);
      bits -= 8;
    }
  }

  return Buffer.from(bytes);
}

function generateTotp(secret: string, timeStep: number): string {
  const counter = Buffer.alloc(8);
  counter.writeBigUInt64BE(BigInt(timeStep));

  const digest = crypto
    .createHmac("sha1", base32Decode(secret))
    .update(counter)
    .digest();
  const offset = digest[digest.length - 1] & 0xf;
  const binary =
    ((digest[offset] & 0x7f) << 24) |
    ((digest[offset + 1] & 0xff) << 16) |
    ((digest[offset + 2] & 0xff) << 8) |
    (digest[offset + 3] & 0xff);

  return String(binary % 10 ** TOTP_DIGITS).padStart(TOTP_DIGITS, "0");
}

function timingSafeEqualText(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  return aBuffer.length === bBuffer.length && crypto.timingSafeEqual(aBuffer, bBuffer);
}

export function verifyTotpCode(secret: string, code: string): boolean {
  const normalizedCode = code.replace(/\s+/g, "");
  if (!/^\d{6}$/.test(normalizedCode)) return false;

  const currentStep = Math.floor(Date.now() / 1000 / TOTP_PERIOD_SECONDS);
  for (let offset = -TOTP_WINDOW; offset <= TOTP_WINDOW; offset++) {
    if (timingSafeEqualText(generateTotp(secret, currentStep + offset), normalizedCode)) {
      return true;
    }
  }

  return false;
}

export function createOtpAuthUrl(email: string, secret: string): string {
  const issuer = "OptiMate";
  const label = `${issuer}:${email}`;
  const params = new URLSearchParams({
    secret,
    issuer,
    algorithm: "SHA1",
    digits: String(TOTP_DIGITS),
    period: String(TOTP_PERIOD_SECONDS),
  });

  return `otpauth://totp/${encodeURIComponent(label)}?${params.toString()}`;
}

export function generateRecoveryCodes(count = 10): string[] {
  return Array.from({ length: count }, () => {
    const left = crypto.randomBytes(5).toString("hex").toUpperCase();
    const right = crypto.randomBytes(5).toString("hex").toUpperCase();
    return `${left}-${right}`;
  });
}

export async function hashRecoveryCode(code: string): Promise<string> {
  return hashPassword(normalizeRecoveryCode(code));
}

export async function verifyRecoveryCode(code: string, hash: string): Promise<boolean> {
  return verifyPassword(normalizeRecoveryCode(code), hash);
}

export function normalizeRecoveryCode(code: string): string {
  return code.trim().replace(/\s+/g, "").toUpperCase();
}
