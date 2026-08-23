import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { createSession } from "@/lib/auth";
import {
  decryptMfaSecret,
  hashMfaChallengeToken,
  MFA_CHALLENGE_MAX_ATTEMPTS,
  verifyRecoveryCode,
  verifyTotpCode,
} from "@/lib/mfa";
import { adminMfaVerifyRateLimit } from "@/lib/rate-limit";
import { readBoundedJson } from "@/lib/request-body";

const MAX_MFA_VERIFY_BODY_BYTES = 4 * 1024;

type VerifyBody = {
  challengeId: string;
  challengeToken: string;
  code: string;
};

function parseVerifyBody(body: unknown): VerifyBody | null {
  if (!body || typeof body !== "object") return null;
  const { challengeId, challengeToken, code } = body as Record<string, unknown>;
  if (
    typeof challengeId !== "string" ||
    typeof challengeToken !== "string" ||
    typeof code !== "string"
  ) {
    return null;
  }

  if (!challengeId || !challengeToken || !code) return null;
  return { challengeId, challengeToken, code };
}

async function recordMfaFailure(userId: string | null, reason: string) {
  await prisma.analyticsEvent.create({
    data: {
      type: "mfa_failed",
      metadata: JSON.stringify({ adminUserId: userId, reason }),
    },
  });
}

export async function POST(request: NextRequest) {
  const json = await readBoundedJson(request, {
    maxBytes: MAX_MFA_VERIFY_BODY_BYTES,
    requireObject: true,
  });
  if (!json.ok) {
    return NextResponse.json(json.body, { status: json.status });
  }

  const parsed = parseVerifyBody(json.data);
  if (!parsed) {
    return NextResponse.json(
      { error: "Provide challengeId, challengeToken and code as strings" },
      { status: 400 }
    );
  }

  const limit = adminMfaVerifyRateLimit(request, parsed.challengeId);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const challenge = await prisma.adminMfaChallenge.findUnique({
    where: { id: parsed.challengeId },
    include: { user: { include: { recoveryCodes: { where: { usedAt: null } } } } },
  });

  if (
    !challenge ||
    challenge.consumedAt ||
    challenge.expiresAt < new Date() ||
    challenge.attempts >= MFA_CHALLENGE_MAX_ATTEMPTS ||
    challenge.tokenHash !== hashMfaChallengeToken(parsed.challengeToken) ||
    !challenge.user.mfaEnabled ||
    !challenge.user.mfaSecretEncrypted
  ) {
    await recordMfaFailure(challenge?.userId ?? null, "invalid_challenge");
    return NextResponse.json({ error: "Invalid MFA code" }, { status: 401 });
  }

  const secret = decryptMfaSecret(challenge.user.mfaSecretEncrypted);
  const totpValid = verifyTotpCode(secret, parsed.code);
  let recoveryCodeId: string | null = null;

  if (!totpValid) {
    for (const recoveryCode of challenge.user.recoveryCodes) {
      if (await verifyRecoveryCode(parsed.code, recoveryCode.codeHash)) {
        recoveryCodeId = recoveryCode.id;
        break;
      }
    }
  }

  if (!totpValid && !recoveryCodeId) {
    await prisma.adminMfaChallenge.update({
      where: { id: challenge.id },
      data: { attempts: { increment: 1 } },
    });
    await recordMfaFailure(challenge.userId, "invalid_code");
    return NextResponse.json({ error: "Invalid MFA code" }, { status: 401 });
  }

  await prisma.$transaction([
    prisma.adminMfaChallenge.update({
      where: { id: challenge.id },
      data: { consumedAt: new Date() },
    }),
    ...(recoveryCodeId
      ? [
          prisma.adminRecoveryCode.update({
            where: { id: recoveryCodeId },
            data: { usedAt: new Date() },
          }),
          prisma.analyticsEvent.create({
            data: {
              type: "mfa_recovery_code_used",
              metadata: JSON.stringify({ adminUserId: challenge.userId }),
            },
          }),
        ]
      : []),
    prisma.analyticsEvent.create({
      data: {
        type: "mfa_success",
        metadata: JSON.stringify({
          adminUserId: challenge.userId,
          method: recoveryCodeId ? "recovery_code" : "totp",
        }),
      },
    }),
  ]);

  await createSession(challenge.userId);

  await prisma.analyticsEvent.create({
    data: {
      type: "admin_login",
      label: "admin_login",
      metadata: JSON.stringify({ adminUserId: challenge.userId, via: "mfa" }),
    },
  });

  return NextResponse.json({
    success: true,
    recoveryCodeUsed: Boolean(recoveryCodeId),
    user: {
      id: challenge.user.id,
      email: challenge.user.email,
      role: challenge.user.role,
    },
  });
}
