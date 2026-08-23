import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { leadSchema } from "@/lib/validation";
import { getClientIp, publicLeadRateLimit } from "@/lib/rate-limit";
import { readBoundedJson } from "@/lib/request-body";
import crypto from "crypto";

const MAX_LEAD_BODY_BYTES = 16 * 1024;

function optionalString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function getUtm(body: Record<string, unknown>): Record<string, unknown> {
  return body.utm && typeof body.utm === "object" && !Array.isArray(body.utm)
    ? (body.utm as Record<string, unknown>)
    : {};
}

export async function POST(request: NextRequest) {
  try {
    const limit = publicLeadRateLimit(request);
    if (!limit.allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const json = await readBoundedJson(request, {
      maxBytes: MAX_LEAD_BODY_BYTES,
      requireObject: true,
    });
    if (!json.ok) {
      return NextResponse.json(json.body, { status: json.status });
    }

    const body = json.data as Record<string, unknown>;
    const parsed = leadSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { errors: parsed.error.issues },
        { status: 400 }
      );
    }

    const data = parsed.data;
    if (data.honeypot) {
      return NextResponse.json({ success: true });
    }

    const ip = getClientIp(request);
    const ipHash = crypto
      .createHash("sha256")
      .update(ip + (process.env.SESSION_SECRET || "salt"))
      .digest("hex")
      .slice(0, 16);

    const utm = getUtm(body);

    const lead = await prisma.lead.create({
      data: {
        name: data.name,
        contact: data.contact,
        company: data.company || null,
        task: data.task,
        budget: data.budget || null,
        consentPd: Boolean(data.consentPd),
        consentContact: Boolean(data.consentContact),
        consentAt: new Date(),
        pageUrl: optionalString(body.pageUrl),
        referrer: optionalString(body.referrer),
        userAgent: request.headers.get("user-agent") || null,
        ipHash,
        utmSource: optionalString(utm.source),
        utmMedium: optionalString(utm.medium),
        utmCampaign: optionalString(utm.campaign),
        utmContent: optionalString(utm.content),
        utmTerm: optionalString(utm.term),
      },
    });

    await prisma.analyticsEvent.create({
      data: {
        type: "lead_created",
        leadId: lead.id,
        path: optionalString(body.pageUrl),
        label: "contact_form",
        ipHash,
        userAgent: request.headers.get("user-agent") || null,
      },
    });

    return NextResponse.json({ success: true, id: lead.id }, { status: 201 });
  } catch (error) {
    console.error("Lead creation error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
