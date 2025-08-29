import { PrismaClient } from "@prisma/client";
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  const userId = process.env.USER_ID;
  if (!userId) {
    throw new Error("USER_ID manquant dans les variables d'environnement");
  }

  const siteSetting = await prisma.siteSetting.create({
    data: {
      userId,
      siteTitleEn: "Ascent",
      siteTitleFr: "Ascent",
    },
  });

  console.log("SiteSetting créée :", siteSetting);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
