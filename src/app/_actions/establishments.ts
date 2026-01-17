"use server"

import { prisma } from "@/lib/prisma"

export async function getEstablishments() {
  try {
    const establishments = await prisma.establishment.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    })
    return establishments
  } catch (error) {
    console.error("Erro ao buscar estabelecimentos:", error)
    return []
  }
}

export async function getEstablishmentById(id: string) {
  try {
    const establishment = await prisma.establishment.findUnique({
      where: { id },
      include: {
        services: true
      }
    })
    return establishment
  } catch (error) {
    console.error("Erro ao buscar estabelecimento:", error)
    return null
  }
}
