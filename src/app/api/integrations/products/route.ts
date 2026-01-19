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
    const { name, description, price, imageUrl, establishmentName } = body

    // 3. Basic Validation
    if (!name || !price || !establishmentName) {
      return NextResponse.json(
        { error: "Missing required fields: name, price, and establishmentName are mandatory." },
        { status: 400 }
      )
    }

    // 4. Find Establishment
    const establishment = await prisma.establishment.findFirst({
        where: { name: establishmentName }
    })

    if (!establishment) {
        return NextResponse.json(
            { error: "Establishment with the provided name not found." },
            { status: 404 }
        )
    }

    // 5. Create Product
    const product = await prisma.product.create({
      data: {
        name,
        description: description || "",
        price: Number(price),
        imageUrl,
        establishmentId: establishment.id
      }
    })

    return NextResponse.json({
        success: true,
        message: "Product created successfully",
        data: product
    }, { status: 201 })

  } catch (error) {
    console.error("Integration API Error (Create Product):", error)
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
