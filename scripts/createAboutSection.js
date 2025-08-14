const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const aboutSection = await prisma.aboutSection.create({
      data: {
        userId: "689c6f2fb6bfda1a41e84416",
        leftPartTitleEn: "A MODERN CONCEPTION OF ARCHITECTURE",
        leftPartTitleFr: "UNE CONCEPTION MODERNE DE L'ARCHITECTURE",
        rightPartContent1En: "Since 2025, Ascent is one of the first company to innovate",
        rightPartContent1Fr: "Depuis 2025, Ascent est l'une des premières entreprises à innover",
        // Champs optionnels si besoin
        rightPartContent2En: "Since 2025, Ascent is one of the first company to innovate",
        rightPartContent2Fr: "Depuis 2025, Ascent est l'une des premières entreprises à innover",
        btnTextEn: "Learn more",
        btnTextFr: "En savoir plus",
        btnLink: "/about",
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
