import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdminRole } from "@/lib/auth";

function escapeCsvCell(value: string | number | boolean | Date | null | undefined): string {
  const stringValue = value instanceof Date ? value.toISOString() : String(value ?? "");
  const safeValue = /^[=+\-@\t\r]/.test(stringValue) ? `'${stringValue}` : stringValue;
  return `"${safeValue.replace(/"/g, '""')}"`;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const dateFrom = searchParams.get("dateFrom");
    const dateTo = searchParams.get("dateTo");
    const exportCsv = searchParams.get("export");

    const admin =
      exportCsv === "csv"
        ? await requireAdminRole(["OWNER"])
        : await requireAdminRole(["OWNER", "MANAGER", "VIEWER"]);
    if (!admin.ok) return admin.response;

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (dateFrom || dateTo) {
      where.createdAt = {};
      if (dateFrom) (where.createdAt as Record<string, Date>).gte = new Date(dateFrom);
      if (dateTo) (where.createdAt as Record<string, Date>).lte = new Date(dateTo + "T23:59:59");
    }
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { contact: { contains: search } },
        { company: { contains: search } },
        { task: { contains: search } },
      ];
    }

    const leads = await prisma.lead.findMany({
      where,
      include: { notes: { orderBy: { createdAt: "desc" }, take: 1 } },
      orderBy: { createdAt: "desc" },
    });

    if (exportCsv === "csv") {
      const BOM = "\uFEFF";
      const header = [
        "ID", "Дата", "Имя", "Контакт", "Компания", "Задача", "Бюджет",
        "Статус", "Источник", "utm_source", "utm_medium", "utm_campaign",
        "pageUrl", "referrer", "consentPd", "consentContact",
      ];
      const rows = leads.map((l) => [
        l.id,
        l.createdAt.toISOString(),
        l.name,
        l.contact,
        l.company || "",
        l.task,
        l.budget || "",
        l.status,
        l.source || "",
        l.utmSource || "",
        l.utmMedium || "",
        l.utmCampaign || "",
        l.pageUrl || "",
        l.referrer || "",
        String(l.consentPd),
        String(l.consentContact),
      ]);

      const csv =
        BOM +
        header.join(";") +
        "\n" +
        rows.map((r) => r.map(escapeCsvCell).join(";")).join("\n");

      await prisma.analyticsEvent.create({
        data: {
          type: "lead_exported",
          label: "admin_leads_csv_export",
          metadata: JSON.stringify({
            adminUserId: admin.user.id,
            exportedRowCount: leads.length,
            filters: {
              status: status || null,
              dateFrom: dateFrom || null,
              dateTo: dateTo || null,
              searchApplied: Boolean(search),
            },
          }),
        },
      });

      return new NextResponse(csv, {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="leads-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    return NextResponse.json({ leads });
  } catch (error) {
    console.error("Leads list error:", error);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
