import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { analyticsEventRateLimit, getClientIp } from "@/lib/rate-limit";
import { readBoundedJson } from "@/lib/request-body";
import crypto from "crypto";

const MAX_EVENT_BODY_BYTES = 8 * 1024;

function getEventClientIdentifier(body: Record<string, unknown>): string | undefined {
  const sessionId = body.sessionId;
  if (typeof sessionId === "string" && sessionId.trim()) return `session:${sessionId}`;

  const visitorId = body.visitorId;
  if (typeof visitorId === "string" && visitorId.trim()) return `visitor:${visitorId}`;

  return undefined;
}

export async function POST(request: NextRequest) {
  try {
    const json = await readBoundedJson(request, {
      maxBytes: MAX_EVENT_BODY_BYTES,
      requireObject: true,
    });
    if (!json.ok) {
      return NextResponse.json(json.body, { status: json.status });
    }

    const eventBody = json.data as Record<string, unknown>;
    if (typeof eventBody.type !== "string" || !eventBody.type.trim()) {
      return NextResponse.json({ error: "type required" }, { status: 400 });
    }

    const limit = analyticsEventRateLimit(request, getEventClientIdentifier(eventBody));
    if (!limit.allowed) {
      return NextResponse.json({ error: "Too many requests" }, { status: 429 });
    }

    const ip = getClientIp(request);
    const ipHash = crypto
      .createHash("sha256")
      .update(ip + (process.env.SESSION_SECRET || "salt"))
      .digest("hex")
      .slice(0, 16);

    await prisma.analyticsEvent.create({
      data: {
        type: eventBody.type,
        path: typeof eventBody.path === "string" ? eventBody.path : null,
        label: typeof eventBody.label === "string" ? eventBody.label : null,
        metadata: eventBody.metadata ? JSON.stringify(eventBody.metadata) : null,
        sessionId: typeof eventBody.sessionId === "string" ? eventBody.sessionId : null,
        visitorId: typeof eventBody.visitorId === "string" ? eventBody.visitorId : null,
        ipHash,
        userAgent: request.headers.get("user-agent") || null,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Event creation error:", error);
    return NextResponse.json(
      { error: "Internal error" },
      { status: 500 }
    );
  }
}
