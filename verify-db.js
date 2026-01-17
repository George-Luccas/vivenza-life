
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.$connect();
    console.log('Successfully connected to the database');
    const userCount = await prisma.user.count();
    console.log(`User count: ${userCount}`);
    const establishmentCount = await prisma.establishment.count();
    console.log(`Establishment count: ${establishmentCount}`);
  } catch (e) {
    console.error('Error connecting to database:', e);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
