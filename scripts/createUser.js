import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  console.log(process.env.DATABASE_URL);

  if (!email || !password) {
    throw new Error('❌ ADMIN_EMAIL ou ADMIN_PASSWORD manquant dans .env');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email, // ici TS sait que c'est un string
      password: hashedPassword
    }
  });

  console.log('✅ Utilisateur créé :', user);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
