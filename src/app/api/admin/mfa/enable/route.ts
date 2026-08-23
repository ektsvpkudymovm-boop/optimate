import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminMutationRole } from "@/lib/auth";
import { mutationRateLimit } from "@/lib/rate-limit";
import {
  decryptMfaSecret,
  generateRecoveryCodes,
  hashRecoveryCode,
  verifyTotpCode,
} from "@/lib/mfa";
import { readBoundedJson } from "@/lib/request-body";

const MAX_MFA_ENABLE_BODY_BYTES = 4 * 1024;

type EnableBody = {
  setupId: string;
  code: string;
};

function parseEnableBody(body: unknown): EnableBody | null {
  if (!body || typeof body !== "object") return null;
  const { setupId, code } = body as Record<string, unknown>;
  if (typeof setupId !== "string" || typeof code !== "string") return null;
  if (!setupId || !code) return null;
  return { setupId, code };
}

export async function POST(request: NextRequest) {
  const admin = await requireAdminMutationRole(request, ["OWNER"]);
  if (!admin.ok) return admin.response;

  const limit = mutationRateLimit(request, admin.user.id);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  const json = await readBoundedJson(request, {
    maxBytes: MAX_MFA_ENABLE_BODY_BYTES,
    requireObject: true,
  });
  if (!json.ok) {
    return NextResponse.json(json.body, { status: json.status });
  }

  const parsed = parseEnableBody(json.data);
  if (!parsed) {
    return NextResponse.json(
      { error: "Provide setupId and code as strings" },
      { status: 400 }
    );
  }

  const setup = await prisma.adminMfaSetup.findFirst({
    where: { id: parsed.setupId, userId: admin.user.id },
  });

  if (!setup || setup.expiresAt < new Date()) {
    return NextResponse.json({ error: "MFA setup expired" }, { status: 400 });
  }

  const secret = decryptMfaSecret(setup.secretEncrypted);
  if (!verifyTotpCode(secret, parsed.code)) {
    await prisma.analyticsEvent.create({
      data: {
        type: "mfa_failed",
        metadata: JSON.stringify({ adminUserId: admin.user.id, stage: "enable" }),
      },
    });

    return NextResponse.json({ error: "Invalid MFA code" }, { status: 401 });
  }

  const recoveryCodes = generateRecoveryCodes(10);
  const recoveryCodeData = await Promise.all(
    recoveryCodes.map(async (code) => ({
      userId: admin.user.id,
      codeHash: await hashRecoveryCode(code),
    }))
  );

  await prisma.$transaction([
    prisma.adminRecoveryCode.deleteMany({ where: { userId: admin.user.id } }),
    prisma.adminUser.update({
      where: { id: admin.user.id },
      data: {
        mfaEnabled: true,
        mfaSecretEncrypted: setup.secretEncrypted,
        mfaEnabledAt: new Date(),
      },
    }),
    prisma.adminRecoveryCode.createMany({ data: recoveryCodeData }),
    prisma.adminMfaSetup.deleteMany({ where: { userId: admin.user.id } }),
    prisma.analyticsEvent.create({
      data: {
        type: "mfa_enabled",
        metadata: JSON.stringify({ adminUserId: admin.user.id, recoveryCodeCount: recoveryCodes.length }),
      },
    }),
  ]);

  return NextResponse.json({
    success: true,
    recoveryCodes,
  });
}
