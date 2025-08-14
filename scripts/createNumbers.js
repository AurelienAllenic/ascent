import { PrismaClient } from "@prisma/client";
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  const userId = process.env.USER_ID;

  if (!userId) {
    throw new Error("USER_ID must be defined in the environment variables");
  }

  const numberSection = await prisma.numberSection.create({
    data: {
      userId,
      cards: {
        create: [
          {
            number: "100",
            unit: "K€",
            textFr: "De bénéfices cette année grâce à la confiance de nos clients",
            textEn: "Profits this year thanks to our customer's trust",
            size: "large",
          },
          {
            number: "25",
            textFr: "Employés dédiés à vos projets",
            textEn: "Employees dedicated to your projects",
            size: "small",
          },
          {
            number: "97",
            unit: "%",
            textFr: "D'évaluations positives",
            textEn: "Of positive evaluations",
            size: "medium",
          },
          {
            number: "150+",
            textFr: "Projets terminés sous notre supervision",
            textEn: "Projects completed with our supervision",
            size: "medium",
          },
        ],
      },
    },
    include: {
      cards: true,
    },
  });

  console.log("NumberSection créée avec ses cartes :", numberSection);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });