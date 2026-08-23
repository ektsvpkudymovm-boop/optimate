import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  const admin = await requireAdmin();
  if (!admin.ok) return admin.response;

  const recoveryRemaining = await prisma.adminRecoveryCode.count({
    where: { userId: admin.user.id, usedAt: null },
  });

  return NextResponse.json({
    success: true,
    mfaEnabled: admin.user.mfaEnabled,
    mfaEnabledAt: admin.user.mfaEnabledAt,
    recoveryRemaining,
  });
}
