import { NextRequest, NextResponse } from "next/server";
import { destroySession, requireAdminMutation } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { mutationRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const admin = await requireAdminMutation(request);
  if (!admin.ok) return admin.response;

  const limit = mutationRateLimit(request, admin.user.id);
  if (!limit.allowed) {
    return NextResponse.json({ error: "Too many requests" }, { status: 429 });
  }

  try {
    await prisma.analyticsEvent.create({
      data: {
        type: "admin_logout",
        label: "admin_logout",
        metadata: JSON.stringify({ adminUserId: admin.user.id }),
      },
    });

    await destroySession();
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: true });
  }
}
