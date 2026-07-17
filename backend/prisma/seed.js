require('dotenv').config();
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('../src/generated/prisma');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const empPassword = await bcrypt.hash('emp1234', 10);
  await prisma.user.create({
    data: {
      name: 'emp1',
      email: 'emp1@deskflow.com',
      password: empPassword,
      role: 'Employee'
    }
  });

  const adminPassword = await bcrypt.hash('admin1234', 10);
  await prisma.user.create({
    data: {
      name: 'admin',
      email: 'admin@deskflow.com',
      password: adminPassword,
      role: 'Admin'
    }
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });