import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminMutationRole, requireAdminRole } from "@/lib/auth";
import { statusSchema } from "@/lib/validation";
import { mutationRateLimit } from "@/lib/rate-limit";
import { readBoundedJson } from "@/lib/request-body";

const MAX_LEAD_STATUS_BODY_BYTES = 4 * 1024;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdminRole(["OWNER", "MANAGER", "VIEWER"]);
    if (!admin.ok) return admin.response;

    const { id } = await params;
    const lead = await prisma.lead.findUnique({
      where: { id },
      include: {
        notes: { orderBy: { createdAt: "desc" }, include: { author: true } },
        events: { orderBy: { createdAt: "desc" }, take: 20 },
      },
    });

    if (!lead) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ lead });
  } catch (error) {
    console.error("Lead detail error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await requireAdminMutationRole(request, ["OWNER", "MANAGER"]);
    if (!admin.ok) return admin.response;

    const limit = mutationRateLimit(request, admin.user.id);
    if (!limit.allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const { id } = await params;
    const json = await readBoundedJson(request, {
      maxBytes: MAX_LEAD_STATUS_BODY_BYTES,
      requireObject: true,
    });
    if (!json.ok) {
      return NextResponse.json(json.body, { status: json.status });
    }

    const body = json.data as Record<string, unknown>;

    if (body.status) {
      const parsed = statusSchema.safeParse({ status: body.status });
      if (!parsed.success) {
        return NextResponse.json({ error: "Invalid status" }, { status: 400 });
      }

      const lead = await prisma.lead.findUnique({ where: { id } });
      if (!lead) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
      }

      const nextStatus = parsed.data.status;

      await prisma.lead.update({
        where: { id },
        data: { status: nextStatus },
      });

      await prisma.analyticsEvent.create({
        data: {
          type: "status_changed",
          leadId: id,
          label: nextStatus,
          metadata: JSON.stringify({
            adminUserId: admin.user.id,
            from: lead.status,
            to: nextStatus,
          }),
        },
      });
    }

    const updated = await prisma.lead.findUnique({ where: { id } });
    return NextResponse.json({ lead: updated });
  } catch (error) {
    console.error("Lead update error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
