import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSession, requireAdmin, verifyPassword } from "@/lib/auth";
import { assertSafeAdminRuntimeEnv } from "@/lib/admin-env";
import {
  createMfaChallengeExpiresAt,
  createMfaChallengeToken,
  hashMfaChallengeToken,
} from "@/lib/mfa";
import {
  adminLoginFailureRateLimit,
  adminLoginRateLimit,
  recordAdminLoginFailure,
} from "@/lib/rate-limit";
import { readBoundedJson } from "@/lib/request-body";

const MAX_ADMIN_AUTH_BODY_BYTES = 4 * 1024;

type LoginBody = {
  email: string;
  password: string;
};

function parseLoginBody(body: unknown): LoginBody | null {
  if (!body || typeof body !== "object") return null;

  const { email, password } = body as Record<string, unknown>;
  if (typeof email !== "string" || typeof password !== "string") return null;

  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !password) return null;

  return { email: normalizedEmail, password };
}

export async function GET() {
  assertSafeAdminRuntimeEnv();

  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  return NextResponse.json({
    success: true,
    user: { id: admin.user.id, email: admin.user.email, role: admin.user.role },
  });
}

export async function POST(request: NextRequest) {
  try {
    assertSafeAdminRuntimeEnv();

    const initialLimit = adminLoginRateLimit(request);
    if (!initialLimit.allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const json = await readBoundedJson(request, {
      maxBytes: MAX_ADMIN_AUTH_BODY_BYTES,
      requireObject: true,
    });
    if (!json.ok) {
      return NextResponse.json(json.body, { status: json.status });
    }

    const credentials = parseLoginBody(json.data);
    if (!credentials) {
      return NextResponse.json(
        { error: "Provide email and password as strings" },
        { status: 400 }
      );
    }

    const credentialLimit = adminLoginFailureRateLimit(request, credentials.email);
    if (credentialLimit && !credentialLimit.allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const user = await prisma.adminUser.findUnique({
      where: { email: credentials.email },
    });
    if (!user) {
      recordAdminLoginFailure(request, credentials.email);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const valid = await verifyPassword(credentials.password, user.passwordHash);
    if (!valid) {
      recordAdminLoginFailure(request, credentials.email);
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (user.mfaEnabled) {
      const challengeToken = createMfaChallengeToken();
      const challenge = await prisma.adminMfaChallenge.create({
        data: {
          tokenHash: hashMfaChallengeToken(challengeToken),
          userId: user.id,
          expiresAt: createMfaChallengeExpiresAt(),
        },
      });

      return NextResponse.json({
        success: true,
        mfaRequired: true,
        challengeId: challenge.id,
        challengeToken,
      });
    }

    await createSession(user.id);

    await prisma.analyticsEvent.create({
      data: {
        type: "admin_login",
        label: "admin_login",
        metadata: JSON.stringify({ adminUserId: user.id }),
      },
    });

    return NextResponse.json({
      success: true,
      user: { id: user.id, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error("Auth error:", error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
