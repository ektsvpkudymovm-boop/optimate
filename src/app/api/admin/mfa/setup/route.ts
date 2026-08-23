import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminMutationRole } from "@/lib/auth";
import { mutationRateLimit } from "@/lib/rate-limit";
import {
  createMfaSetupExpiresAt,
  createOtpAuthUrl,
  createTotpSecret,
  encryptMfaSecret,
} from "@/lib/mfa";

export async function POST(request: NextRequest) {
  const admin = await requireAdminMutationRole(request, ["OWNER"]);
  if (!admin.ok) return admin.response;

  const limit = mutationRateLimit(request, admin.user.id);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  if (admin.user.mfaEnabled) {
    return NextResponse.json(
      { error: "MFA is already enabled" },
      { status: 409 }
    );
  }

  try {
    const secret = createTotpSecret();
    const encryptedSecret = encryptMfaSecret(secret);

    await prisma.adminMfaSetup.deleteMany({ where: { userId: admin.user.id } });
    const setup = await prisma.adminMfaSetup.create({
      data: {
        userId: admin.user.id,
        secretEncrypted: encryptedSecret,
        expiresAt: createMfaSetupExpiresAt(),
      },
    });

    await prisma.analyticsEvent.create({
      data: {
        type: "mfa_setup_started",
        metadata: JSON.stringify({ adminUserId: admin.user.id, setupId: setup.id }),
      },
    });

    return NextResponse.json({
      success: true,
      setupId: setup.id,
      secret,
      otpauthUrl: createOtpAuthUrl(admin.user.email, secret),
      expiresAt: setup.expiresAt,
    });
  } catch {
    return NextResponse.json(
      { error: "MFA setup is not available" },
      { status: 500 }
    );
  }
}
