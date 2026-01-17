import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const email = "jessica.test@example.com";
  
  // Clean up if exists
  await prisma.user.deleteMany({ where: { email } });

  const user = await prisma.user.create({
    data: {
      name: "Jessica Silva",
      email: email,
      emailVerified: true,
      image: "https://api.dicebear.com/9.x/avataaars/svg?seed=Jessica&backgroundColor=ffdfbf",
      posts: {
        create: [
          {
            caption: "Adorando o novo visual! 🌸 ✨",
            imageUrl: "https://images.unsplash.com/photo-1515378960530-7c0da6231fb1?w=800&q=80", // Placeholder generic "woman in tech/life" or similar
          },
          {
            caption: "Dia de spa maravilhoso. 💆‍♀️",
            imageUrl: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80",
          }
        ]
      }
    },
  });

  console.log(`Created user: ${user.name}`);
  console.log(`ID: ${user.id}`);
  console.log(`Test URL: http://localhost:3000/u/${user.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
