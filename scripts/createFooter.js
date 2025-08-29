import { PrismaClient } from "@prisma/client";
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  const userId = process.env.USER_ID;

  const footer = await prisma.footerSection.create({
    data: {
      userId,
      cguButtonTextEn: "CGU",
      cguButtonTextFr: "CGU",
      cguButtonLink: "/cgu",
      showCguButton: true,
      copyrightTextEn: "© Ascent. All rights reserved.",
      copyrightTextFr: "© Ascent. Tous droits réservés."
    },
  });

  console.log("FooterSetting créé :", footer);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
