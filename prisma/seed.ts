import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding database with Beauty & Aesthetics data and Services...')

  // Limpar dados existentes
  await prisma.service.deleteMany()
  await prisma.appointment.deleteMany()
  await prisma.establishment.deleteMany()

  const establishments = [
    {
      name: 'Lumière Beauty Spa',
      description: 'Tratamentos faciais avançados e relaxamento completo para você brilhar.',
      address: 'Al. Lorena, 1500 - Jardins, SP',
      category: 'Estética Facial',
      imageUrl: 'https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?q=80&w=2070&auto=format&fit=crop',
      services: [
        { name: 'Limpeza de Pele Profunda', description: 'Remoção de impurezas e hidratação.', price: 150.00, durationMinutes: 60, imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=2070&auto=format&fit=crop' },
        { name: 'Peeling de Diamante', description: 'Renovação celular para uma pele radiante.', price: 200.00, durationMinutes: 45, imageUrl: 'https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?q=80&w=2070&auto=format&fit=crop' },
        { name: 'Massagem Relaxante', description: 'Alívio do estresse e tensão muscular.', price: 120.00, durationMinutes: 60, imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop' },
      ]
    },
    {
      name: 'Studio Bella Donna',
      description: 'Especialistas em cabelos loiros e mechas. Realce sua beleza natural.',
      address: 'Rua Amauri, 300 - Itaim Bibi, SP',
      category: 'Cabelos',
      imageUrl: 'https://images.unsplash.com/photo-1560066984-138fa6ca6bd6?q=80&w=1974&auto=format&fit=crop',
      services: [
        { name: 'Corte e Escova', description: 'Renove seu visual com nossos experts.', price: 180.00, durationMinutes: 60, imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?q=80&w=2069&auto=format&fit=crop' },
        { name: 'Mechas Criativas', description: 'Iluminação personalizada para seu tom.', price: 450.00, durationMinutes: 180, imageUrl: 'https://images.unsplash.com/photo-1522337360705-8763d84a783a?q=80&w=2074&auto=format&fit=crop' },
        { name: 'Hidratação Profunda', description: 'Tratamento intensivo para fios saudáveis.', price: 120.00, durationMinutes: 45, imageUrl: 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?q=80&w=2071&auto=format&fit=crop' },
      ]
    },
    {
      name: 'Esmalteria Chic',
      description: 'Unhas perfeitas, nail art exclusiva e um ambiente aconchegante.',
      address: 'Shopping JK Iguatemi - SP',
      category: 'Manicure',
      imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=2070&auto=format&fit=crop',
      services: [
        { name: 'Manicure Completa', description: 'Cutilagem e esmaltação importada.', price: 45.00, durationMinutes: 40, imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?q=80&w=1974&auto=format&fit=crop' },
        { name: 'Pedicure Spa', description: 'Esfoliação, hidratação e esmaltação.', price: 55.00, durationMinutes: 50, imageUrl: 'https://images.unsplash.com/photo-1519014816548-bf5fe059e98b?q=80&w=2070&auto=format&fit=crop' },
        { name: 'Unha em Gel', description: 'Alongamento natural e duradouro.', price: 180.00, durationMinutes: 120, imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?q=80&w=2070&auto=format&fit=crop' },
      ]
    },
    {
      name: 'Harmonia & Corpo',
      description: 'Massagens modeladoras, drenagem linfática e cuidados corporais.',
      address: 'Av. Brasil, 800 - Jardins, SP',
      category: 'Estética Corporal',
      imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop',
      services: [
        { name: 'Drenagem Linfática', description: 'Redução de medidas e inchaço.', price: 100.00, durationMinutes: 50, imageUrl: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?q=80&w=1974&auto=format&fit=crop' },
         { name: 'Massagem Modeladora', description: 'Modelagem do contorno corporal.', price: 110.00, durationMinutes: 50, imageUrl: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070&auto=format&fit=crop' },
      ]
    },
    {
      name: 'Brows & Lashes Design',
      description: 'Design de sobrancelhas e extensão de cílios para um olhar marcante.',
      address: 'Rua Oscar Freire, 1200 - SP',
      category: 'Olhar',
      imageUrl: 'https://images.unsplash.com/photo-1588669462316-df27d5da9686?q=80&w=1964&auto=format&fit=crop',
      services: [
        { name: 'Design de Sobrancelhas', description: 'Mapeamento facial e design personalizado.', price: 60.00, durationMinutes: 30, imageUrl: 'https://images.unsplash.com/photo-1588669462316-df27d5da9686?q=80&w=1964&auto=format&fit=crop' },
         { name: 'Extensão de Cílios Fio a Fio', description: 'Volume e alongamento natural.', price: 220.00, durationMinutes: 120, imageUrl: 'https://images.unsplash.com/photo-1588669462316-df27d5da9686?q=80&w=1964&auto=format&fit=crop' },
      ]
    },
     {
      name: 'Dermatologia Integrada',
      description: 'Cuidados médicos e estéticos para a saúde da sua pele.',
      address: 'Av. Albert Einstein, 627 - Morumbi, SP',
      category: 'Clínica',
      imageUrl: 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?q=80&w=2068&auto=format&fit=crop',
      services: [
        { name: 'Botox (Toxina Botulínica)', description: 'Suavização de linhas de expressão.', price: 1200.00, durationMinutes: 30, imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop' },
        { name: 'Preenchimento Labial', description: 'Volume e contorno para os lábios.', price: 1500.00, durationMinutes: 45, imageUrl: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?q=80&w=2070&auto=format&fit=crop' },
      ]
    },
  ]

  for (const est of establishments) {
    const { services, ...data } = est
    const createdEst = await prisma.establishment.create({
      data: data,
    })

    for (const service of services) {
        await prisma.service.create({
            data: {
                ...service,
                establishmentId: createdEst.id
            }
        })
    }
  }

  console.log('Seed completed with Services!')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
