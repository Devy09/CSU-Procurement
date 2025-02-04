import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  
  try {
    const purchaseRequest = await prisma.purchaseRequest.findUnique({
      where: {
        id: id,
      },
      include: {
        items: true,
        createdBy: {
          select: {
            name: true,
            designation: true,
            saino: true,
            alobsno: true,
          },
        },
      },
    })
    
    if (!purchaseRequest) {
      return new NextResponse("Not found", { status: 404 })
    }
    
    return NextResponse.json(purchaseRequest)
  } catch (error) {
    console.error('API Error:', error)
    return new NextResponse("Internal error", { status: 500 })
  }
}