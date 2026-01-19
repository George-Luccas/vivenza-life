"use server"

import { prisma } from "@/lib/prisma"

export async function getMarketplaceProducts() {
  try {
    const products = await prisma.product.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        establishment: {
          select: {
            name: true,
            id: true
          }
        }
      }
    })
    return products
  } catch (error) {
    console.error("Erro ao buscar produtos do marketplace:", error)
    return []
  }
}
