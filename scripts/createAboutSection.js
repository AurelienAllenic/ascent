const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const aboutSection = await prisma.aboutSection.create({
      data: {
        userId: "689c6f2fb6bfda1a41e84416",
        leftPartTitleEn: "Our Vision",
        leftPartTitleFr: "Notre Vision",
        rightPartContent1En: "A modern conception of architecture",
        rightPartContent1Fr: "Une conception moderne de l'architecture",
        // Champs optionnels si besoin
        rightPartContent2En: "Additional content in English",
        rightPartContent2Fr: "Contenu additionnel en français",
        btnTextEn: "Learn more",
        btnTextFr: "En savoir plus",
        btnLink: "/about", // lien du bouton
      },
    });

    console.log('About section created:', aboutSection);
  } catch (error) {
    console.error('Error creating About section:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
