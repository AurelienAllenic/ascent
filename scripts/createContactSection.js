import { PrismaClient } from "@prisma/client";
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  const userId = process.env.USER_ID; // remplace par ton userId réel

  const contactSection = await prisma.contactSection.create({
    data: {
      userId,
      imageUrl: "/assets/contact/center.jpg",
      titleEn: "WE CAN TAKE CARE",
      titleFr: "NOUS NOUS OCCUPONS",
      buttonTextEn: "Learn more",
      buttonTextFr: "En savoir plus",
      buttonLink: "#contact",
      formTitle1En: "Who are you?",
      formTitle2En: "What is your project?",
      formTitle1Fr: "Qui êtes-vous ?",
      formTitle2Fr: "Quel est votre projet ?",
      submitButtonTextEn: "Send a message",
      submitButtonTextFr: "Envoyer",
      formFields: {
        create: [
          {
            fieldNameEn: "Name",
            fieldNameFr: "Nom",
            fieldTypeEn: "text",
            fieldTypeFr: "text",
            required: true,
            order: 1,
          },
          {
            fieldNameEn: "Email",
            fieldNameFr: "Email",
            fieldTypeEn: "email",
            fieldTypeFr: "email",
            required: true,
            order: 2,
          },
          {
            fieldNameEn: "Project",
            fieldNameFr: "Projet",
            fieldTypeEn: "textarea",
            fieldTypeFr: "textarea",
            required: true,
            order: 3,
          },
        ],
      },
    },
    include: { formFields: true },
  });

  console.log("ContactSection créée :", contactSection);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
