
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding test data for Estela Butique...')

  // 1. Check if 'Estela Butique' exists or create it
  let establishment = await prisma.establishment.findFirst({
    where: { name: 'Estela Butique' }
  })

  if (!establishment) {
    console.log('Creating Estela Butique...')
    establishment = await prisma.establishment.create({
      data: {
        name: 'Estela Butique',
        category: 'Moda Feminina',
        address: 'Rua das Flores, 123',
        description: 'Moda feminina elegante e exclusiva.',
        imageUrl: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&auto=format&fit=crop&q=60',
        services: {
            create: [
                {
                    name: "Consultoria de Estilo",
                    description: "Análise completa de perfil e sugestão de looks.",
                    price: 150.00,
                    durationMinutes: 60,
                    imageUrl: "https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&auto=format&fit=crop&q=60"
                }
            ]
        }
      }
    })
  } else {
    console.log('Estela Butique already exists.')
  }

  // 2. Add sample products
  const products = [
    {
      name: 'Vestido Florido Verão',
      description: 'Vestido leve e fresco, ideal para dias quentes. Tecido de alta qualidade.',
      price: 199.90,
      imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=60',
      establishmentId: establishment.id
    },
    {
      name: 'Blusa de Seda',
      description: 'Blusa elegante em seda pura, toque macio e caimento perfeito.',
      price: 129.50,
      imageUrl: 'https://images.unsplash.com/photo-1518622358385-8ea7d0794bf6?w=800&auto=format&fit=crop&q=60',
      establishmentId: establishment.id
    },
    {
      name: 'Calça Alfaiataria',
      description: 'Calça corte reto, tecido premium, ideal para look office.',
      price: 249.00,
      imageUrl: 'https://images.unsplash.com/photo-1506629082955-511b1aa00272?w=800&auto=format&fit=crop&q=60',
      establishmentId: establishment.id
    },
    {
        name: 'Bolsa de Couro',
        description: 'Bolsa transversal em couro legítimo, design moderno e versátil.',
        price: 350.00,
        imageUrl: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=60',
        establishmentId: establishment.id
      }
  ]

  console.log(`Adding ${products.length} products to Estela Butique...`)

  for (const product of products) {
    await prisma.product.create({
      data: product
    })
  }

  console.log('Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
