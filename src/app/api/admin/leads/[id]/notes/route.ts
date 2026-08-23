import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminMutationRole } from "@/lib/auth";
import { noteSchema } from "@/lib/validation";
import { mutationRateLimit } from "@/lib/rate-limit";
import { readBoundedJson } from "@/lib/request-body";

const MAX_LEAD_NOTE_BODY_BYTES = 16 * 1024;

export async function POST(
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
      maxBytes: MAX_LEAD_NOTE_BODY_BYTES,
      requireObject: true,
    });
    if (!json.ok) {
      return NextResponse.json(json.body, { status: json.status });
    }

    const body = json.data;
    const parsed = noteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Text required" }, { status: 400 });
    }

    const lead = await prisma.lead.findUnique({ where: { id } });
    if (!lead) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const note = await prisma.leadNote.create({
      data: {
        leadId: id,
        authorId: admin.user.id,
        text: parsed.data.text,
      },
    });

    await prisma.analyticsEvent.create({
      data: {
        type: "note_added",
        leadId: id,
        label: "lead_note_created",
        metadata: JSON.stringify({ adminUserId: admin.user.id }),
      },
    });

    return NextResponse.json({ note }, { status: 201 });
  } catch (error) {
    console.error("Note creation error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
