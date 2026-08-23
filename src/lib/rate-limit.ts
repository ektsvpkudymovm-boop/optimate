import { type NextRequest } from "next/server";

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

type RateLimitResult = {
  allowed: boolean;
  resetAt: number;
  remaining: number;
};

interface RateLimitStore {
  get(key: string): RateLimitEntry | undefined;
  set(key: string, entry: RateLimitEntry): void;
  deleteExpired(now: number): void;
}

class MemoryRateLimitStore implements RateLimitStore {
  private readonly entries = new Map<string, RateLimitEntry>();

  get(key: string): RateLimitEntry | undefined {
    return this.entries.get(key);
  }

  set(key: string, entry: RateLimitEntry): void {
    this.entries.set(key, entry);
  }

  deleteExpired(now: number): void {
    for (const [key, entry] of this.entries.entries()) {
      if (now > entry.resetAt) {
        this.entries.delete(key);
      }
    }
  }
}

const rateLimitStore: RateLimitStore = new MemoryRateLimitStore();

const MINUTE = 60 * 1000;
const TRUST_PROXY = process.env.TRUST_PROXY === "true";

function normalizeIdentifier(value: string): string {
  return value.trim().toLowerCase().slice(0, 200);
}

export function getClientIp(request: NextRequest): string {
  if (!TRUST_PROXY) {
    return "direct";
  }

  const forwardedFor = request.headers.get("x-forwarded-for");
  const firstForwardedIp = forwardedFor?.split(",")[0]?.trim();

  // TRUST_PROXY requires a reverse proxy that strips incoming forwarded headers
  // and overwrites them with the real client address.
  return (
    firstForwardedIp ||
    request.headers.get("x-real-ip")?.trim() ||
    request.headers.get("cf-connecting-ip")?.trim() ||
    "direct"
  );
}

export function rateLimit(
  key: string,
  maxRequests: number = 5,
  windowMs: number = MINUTE
): boolean {
  return rateLimitDetailed(key, maxRequests, windowMs).allowed;
}

export function rateLimitDetailed(
  key: string,
  maxRequests: number,
  windowMs: number
): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, resetAt: now + windowMs, remaining: maxRequests - 1 };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, resetAt: entry.resetAt, remaining: 0 };
  }

  entry.count++;
  return {
    allowed: true,
    resetAt: entry.resetAt,
    remaining: Math.max(maxRequests - entry.count, 0),
  };
}

function peekRateLimit(key: string, maxRequests: number): RateLimitResult {
  const now = Date.now();
  const entry = rateLimitStore.get(key);

  if (!entry || now > entry.resetAt) {
    return { allowed: true, resetAt: now, remaining: maxRequests };
  }

  if (entry.count >= maxRequests) {
    return { allowed: false, resetAt: entry.resetAt, remaining: 0 };
  }

  return {
    allowed: true,
    resetAt: entry.resetAt,
    remaining: Math.max(maxRequests - entry.count, 0),
  };
}

export function adminLoginRateLimit(request: NextRequest, email?: string): RateLimitResult {
  const ip = getClientIp(request);
  const requestLimit = rateLimitDetailed(`admin-login:request:ip:${ip}`, 30, 15 * MINUTE);
  if (!requestLimit.allowed) return requestLimit;

  return adminLoginFailureRateLimit(request, email) ?? requestLimit;
}

export function adminLoginFailureRateLimit(
  request: NextRequest,
  email?: string
): RateLimitResult | null {
  const ip = getClientIp(request);
  const ipFailureLimit = peekRateLimit(`admin-login:failure:ip:${ip}`, 10);
  if (!ipFailureLimit.allowed) return ipFailureLimit;

  if (email) {
    const emailFailureLimit = peekRateLimit(
      `admin-login:failure:email:${normalizeIdentifier(email)}`,
      5
    );
    if (!emailFailureLimit.allowed) return emailFailureLimit;
  }

  return null;
}

export function recordAdminLoginFailure(request: NextRequest, email?: string) {
  const ip = getClientIp(request);
  rateLimitDetailed(`admin-login:failure:ip:${ip}`, 10, 15 * MINUTE);

  if (email) {
    rateLimitDetailed(`admin-login:failure:email:${normalizeIdentifier(email)}`, 5, 15 * MINUTE);
  }
}

export function publicLeadRateLimit(request: NextRequest): RateLimitResult {
  return rateLimitDetailed(`lead:ip:${getClientIp(request)}`, 5, 10 * MINUTE);
}

export function analyticsEventRateLimit(
  request: NextRequest,
  clientIdentifier?: string
): RateLimitResult {
  const ipLimit = rateLimitDetailed(`analytics:event:ip:${getClientIp(request)}`, 60, MINUTE);
  if (!ipLimit.allowed || !clientIdentifier) return ipLimit;

  const clientLimit = rateLimitDetailed(
    `analytics:event:client:${normalizeIdentifier(clientIdentifier)}`,
    120,
    MINUTE
  );

  return clientLimit.allowed ? ipLimit : clientLimit;
}

export function mutationRateLimit(request: NextRequest, adminId: string): RateLimitResult {
  const ipLimit = rateLimitDetailed(`admin-mutation:ip:${getClientIp(request)}`, 120, MINUTE);
  if (!ipLimit.allowed) return ipLimit;

  const adminLimit = rateLimitDetailed(`admin-mutation:user:${adminId}`, 120, MINUTE);
  return adminLimit.allowed ? ipLimit : adminLimit;
}

export function adminMfaVerifyRateLimit(
  request: NextRequest,
  challengeId?: string
): RateLimitResult {
  const ipLimit = rateLimitDetailed(`admin-mfa:verify:ip:${getClientIp(request)}`, 20, 15 * MINUTE);
  if (!ipLimit.allowed || !challengeId) return ipLimit;

  const challengeLimit = rateLimitDetailed(
    `admin-mfa:verify:challenge:${normalizeIdentifier(challengeId)}`,
    7,
    15 * MINUTE
  );

  return challengeLimit.allowed ? ipLimit : challengeLimit;
}

// Cleanup old entries periodically
setInterval(() => {
  rateLimitStore.deleteExpired(Date.now());
}, 60000);
