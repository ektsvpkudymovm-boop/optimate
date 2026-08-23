import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminRole } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const admin = await requireAdminRole(["OWNER", "MANAGER", "VIEWER"]);
    if (!admin.ok) return admin.response;

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get("days") || "30");
    const since = new Date();
    since.setDate(since.getDate() - days);

    const [totalLeads, newLeads, eventsByType, leadsByStatus] = await Promise.all([
      prisma.lead.count({ where: { createdAt: { gte: since } } }),
      prisma.lead.count({ where: { status: "NEW", createdAt: { gte: since } } }),
      prisma.analyticsEvent.groupBy({
        by: ["type"],
        where: { createdAt: { gte: since } },
        _count: true,
      }),
      prisma.lead.groupBy({
        by: ["status"],
        where: { createdAt: { gte: since } },
        _count: true,
      }),
    ]);

    const ctaClicks = eventsByType.find((e) => e.type === "cta_click")?._count || 0;
    const formStarts = eventsByType.find((e) => e.type === "lead_form_start")?._count || 0;
    const formSubmits = eventsByType.find((e) => e.type === "lead_submit_success" || e.type === "lead_created")?._count || 0;

    return NextResponse.json({
      summary: {
        totalLeads,
        newLeads,
        ctaClicks,
        formStarts,
        formSubmits,
        conversionCtaToLead: ctaClicks > 0 ? ((formSubmits / ctaClicks) * 100).toFixed(1) : "0",
        conversionFormToLead: formStarts > 0 ? ((formSubmits / formStarts) * 100).toFixed(1) : "0",
      },
      eventsByType: eventsByType.map((e) => ({ type: e.type, count: e._count })),
      leadsByStatus: leadsByStatus.map((e) => ({ status: e.status, count: e._count })),
      days,
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
