import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(request: Request) {
  try {
    // 1. Security Check
    const apiKey = request.headers.get("x-api-key")
    if (apiKey !== process.env.INTEGRATION_API_KEY) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    // 2. Parse Body
    const body = await request.json()
    const { name, description, address, category, imageUrl, services } = body

    // 3. Basic Validation
    if (!name || !address) {
      return NextResponse.json(
        { error: "Missing required fields: name and address are mandatory." },
        { status: 400 }
      )
    }

    // 4. Create in Database (Nested Write)
    const establishment = await prisma.establishment.create({
      data: {
        name,
        description,
        address,
        category,
        imageUrl,
        services: {
          create: services?.map((service: any) => ({
            name: service.name,
            description: service.description || "",
            price: service.price,
            durationMinutes: service.durationMinutes || 30,
            imageUrl: service.imageUrl
          }))
        }
      },
      include: {
        services: true
      }
    })

    return NextResponse.json({
        success: true,
        message: "Establishment created successfully",
        data: establishment
    }, { status: 201 })

  } catch (error) {
    console.error("Integration API Error (Create Establishment):", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
