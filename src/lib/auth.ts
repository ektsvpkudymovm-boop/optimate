import { prisma } from "./db";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { validateAdminEnv } from "./admin-env";
import { hashPassword, verifyPassword } from "./password";

const SESSION_COOKIE = "admin_session";
const CSRF_COOKIE = "admin_csrf";
const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days
export const ADMIN_ROLES = ["OWNER", "MANAGER", "VIEWER"] as const;
export type AdminRole = (typeof ADMIN_ROLES)[number];

export { hashPassword, verifyPassword };

export function createSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function createCsrfToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function unauthorizedAdminResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function forbiddenAdminResponse() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function setAdminCsrfCookie(token = createCsrfToken()): Promise<string> {
  const store = await cookies();
  store.set(CSRF_COOKIE, token, {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  return token;
}

export async function clearAdminCsrfCookie() {
  const store = await cookies();
  store.set(CSRF_COOKIE, "", {
    httpOnly: false,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

function timingSafeEqualText(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);
  return aBuffer.length === bBuffer.length && crypto.timingSafeEqual(aBuffer, bBuffer);
}

function hasAllowedOrigin(request: NextRequest): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;

  try {
    const requestOrigin = new URL(request.url).origin;
    const originValue = new URL(origin).origin;
    const allowedOrigins = new Set([requestOrigin]);

    if (process.env.APP_URL) {
      allowedOrigins.add(new URL(process.env.APP_URL).origin);
    }

    return allowedOrigins.has(originValue);
  } catch {
    return false;
  }
}

export function verifyAdminCsrf(request: NextRequest): boolean {
  if (!hasAllowedOrigin(request)) return false;

  const cookieToken = request.cookies.get(CSRF_COOKIE)?.value;
  const headerToken = request.headers.get("x-csrf-token");
  if (!cookieToken || !headerToken) return false;

  return timingSafeEqualText(cookieToken, headerToken);
}

export async function createSession(userId: string): Promise<string> {
  const token = createSessionToken();
  const tokenHash = hashToken(token);
  const expiresAt = new Date(Date.now() + SESSION_MAX_AGE * 1000);

  await prisma.adminSession.create({
    data: { tokenHash, userId, expiresAt },
  });

  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });

  await setAdminCsrfCookie();

  return token;
}

export async function getCurrentAdmin() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const tokenHash = hashToken(token);
  const session = await prisma.adminSession.findUnique({
    where: { tokenHash },
    include: { user: true },
  });

  if (!session || session.expiresAt < new Date() || !session.user) {
    if (session) {
      await prisma.adminSession.delete({ where: { id: session.id } });
    }
    return null;
  }

  return session.user;
}

export const getSessionUser = getCurrentAdmin;

export async function destroySession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (token) {
    const tokenHash = hashToken(token);
    await prisma.adminSession.deleteMany({ where: { tokenHash } });
  }
  store.delete(SESSION_COOKIE);
  await clearAdminCsrfCookie();
}

export async function requireAdmin() {
  const user = await getCurrentAdmin();
  if (!user) {
    return { ok: false as const, response: unauthorizedAdminResponse() };
  }
  return { ok: true as const, user };
}

function normalizeAdminRole(role: string): AdminRole | null {
  return ADMIN_ROLES.find((allowedRole) => allowedRole === role) ?? null;
}

export async function requireAdminRole(allowedRoles: readonly AdminRole[]) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin;

  const role = normalizeAdminRole(admin.user.role);
  if (!role || !allowedRoles.includes(role)) {
    return { ok: false as const, response: forbiddenAdminResponse() };
  }

  return admin;
}

export async function requireAdminMutation(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin.ok) return admin;

  if (!verifyAdminCsrf(request)) {
    return { ok: false as const, response: forbiddenAdminResponse() };
  }

  return admin;
}

export async function requireAdminMutationRole(
  request: NextRequest,
  allowedRoles: readonly AdminRole[]
) {
  const admin = await requireAdminMutation(request);
  if (!admin.ok) return admin;

  const role = normalizeAdminRole(admin.user.role);
  if (!role || !allowedRoles.includes(role)) {
    return { ok: false as const, response: forbiddenAdminResponse() };
  }

  return admin;
}

export async function seedAdmin() {
  const { email, password } = validateAdminEnv();
  const passwordHash = await hashPassword(password);

  const existing = await prisma.adminUser.findUnique({ where: { email } });
  if (existing) {
    await prisma.adminUser.update({
      where: { email },
      data: { passwordHash, role: "OWNER" },
    });
    console.log(`Admin user seeded: ${email}`);
    return;
  }

  await prisma.adminUser.create({
    data: { email, passwordHash, role: "OWNER" },
  });
  console.log(`Admin user seeded: ${email}`);
}
