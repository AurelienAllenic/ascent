import { PrismaClient } from "@prisma/client";
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  // Remplace par l'ID réel de l'utilisateur auquel cette HomeSection appartient
  const userId = process.env.USER_ID; 

  const homeSection = await prisma.homeSection.create({
    data: {
      userId,
      imageUrl: "/assets/background.png",
      titleEn: "ASCENT",
      titleFr: "ASCENT",
      subtitleEn: "Time to improve your architecture",
      subtitleFr: "Il est temps d'améliorer votre architecture",
      contentEn: "Thanks to our experts, we offer the best of architecture",
      contentFr: "Grâce à nos experts, nous offrons le meilleur de l'architecture",
      // updatedAt se met automatiquement à now() grâce au schema
    },
  });

  console.log("HomeSection créée :", homeSection);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
