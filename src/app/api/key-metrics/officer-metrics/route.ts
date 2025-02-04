import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // Get total office spend
    const totalSpend = await prisma.purchaseRequest.aggregate({
      _sum: {
        overallTotal: true,
      },
    });

    // Get count of purchase requests
    const purchaseRequestCount = await prisma.purchaseRequest.count();

    // Get count of office quotations
    const officeQuotationsCount = await prisma.quotation.count();

    // Get count of supplier quotations
    const supplierQuotationsCount = await prisma.supplierQuotation.count();

    // Get spending data by procurement mode
    const spendingData = await prisma.purchaseRequest.groupBy({
      by: ['procurementMode', 'date'],
      _sum: {
        overallTotal: true,
      },
    });

    return NextResponse.json({
      totalSpend: totalSpend._sum.overallTotal || 0,
      purchaseRequestCount,
      officeQuotationsCount,
      supplierQuotationsCount,
      spendingData,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch metrics" }, { status: 500 });
  }
} 