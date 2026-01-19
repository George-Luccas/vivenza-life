import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: Request) {
  try {
    const apiKey = request.headers.get("x-api-key")

    if (apiKey !== process.env.INTEGRATION_API_KEY) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const bookings = await prisma.appointment.findMany({
      orderBy: {
        date: 'desc'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true
          }
        },
        service: {
          select: {
            id: true,
            name: true,
            price: true,
            durationMinutes: true
          }
        },
        establishment: {
          select: {
            id: true,
            name: true,
            address: true
          }
        }
      }
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error("Integration API Error:", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
