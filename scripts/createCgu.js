import { PrismaClient } from "@prisma/client";
import 'dotenv/config';

const prisma = new PrismaClient();

async function main() {
  const userId = process.env.USER_ID;
  if (!userId) {
    throw new Error("USER_ID manquant dans les variables d'environnement");
  }

  const sections = [
    {
      sectionNumber: 1,
      titleEn: "Purpose",
      titleFr: "Objet",
      contentEn: "Ascent provides a showcase website presenting architecture services. These terms define the rules for accessing and using the site.",
      contentFr: "Ascent met à disposition un site vitrine présentant des services d'architecture. Ces conditions définissent les modalités d'accès et d'utilisation du site."
    },
    {
      sectionNumber: 2,
      titleEn: "Publisher & Hosting",
      titleFr: "Éditeur et Hébergement",
      contentEn: "Publisher: Owner\nAddress: Address, City, Country\nCompany ID: SIRET\nHost: Vercel / OVH\nContact: contact@ascent.example",
      contentFr: "Éditeur: Propriétaire d'Ascent\nAdresse: Adresse, Ville, Pays\nIdentifiant: SIRET / Identifiant\nHébergeur: Vercel / OVH\nContact: contact@ascent.example"
    },
    {
      sectionNumber: 3,
      titleEn: "Access to the site",
      titleFr: "Accès au site",
      contentEn: "Access to the site is free. The user must have compatible equipment (modern browser, internet connection). Access may be interrupted for maintenance.",
      contentFr: "L'accès au site est gratuit. L'utilisateur doit disposer d'un équipement compatible (navigateur moderne, connexion internet). L'accès peut être interrompu pour maintenance."
    },
    {
      sectionNumber: 4,
      titleEn: "Intellectual Property",
      titleFr: "Propriété intellectuelle",
      contentEn: "All content on the site (texts, images, logos, videos, code, animations) is the property of the publisher or its rights holders and is protected by copyright. Any unauthorized reproduction, representation or use is prohibited.",
      contentFr: "Tous les contenus présents sur le site (textes, images, logos, vidéos, code, animations) sont la propriété de l'éditeur ou de ses ayants droit et sont protégés par le droit d'auteur. Toute reproduction, représentation ou utilisation non autorisée est interdite."
    },
    {
      sectionNumber: 5,
      titleEn: "Personal Data & Analytics",
      titleFr: "Données personnelles & suivi d'audience",
      contentEn: "The site collects only the data necessary for operation and interactions (contact form). These data are intended for the site administrator and will not be sold.\nIn the future, an analytics tool (e.g. Google Analytics or home-made solution) may be implemented to track visitor numbers and aggregated statistics. These tools will be implemented in compliance with applicable regulations (GDPR): prior information, purposes, retention periods and the ability to withdraw consent where required.\nUsers have the rights of access, rectification, erasure and objection. To exercise these rights, contact: contact@ascent.example",
      contentFr: "Le site collecte uniquement les données nécessaires au fonctionnement et aux interactions (formulaire de contact). Ces données sont destinées à l'administrateur du site et ne seront pas revendues.\nÀ l'avenir, un outil de suivi d'audience (ex : Google Analytics ou solution maison) pourra être mis en place pour suivre le nombre de visiteurs et des statistiques agrégées. Ces dispositifs seront implémentés en respectant la réglementation applicable (RGPD) : information préalable, finalités, durée de conservation et possibilité de retrait du consentement lorsque nécessaire.\nLes utilisateurs disposent des droits d'accès, de rectification, d'effacement et d'opposition. Pour exercer ces droits, contactez : contact@ascent.example"
    },
    {
      sectionNumber: 6,
      titleEn: "Contact form",
      titleFr: "Formulaire de contact",
      contentEn: "Information sent via the contact form (name, email, message) is used only to process the request. It is retained only as long as necessary to handle the request, unless otherwise required by law.",
      contentFr: "Les informations envoyées via le formulaire (nom, email, message) servent uniquement à traiter la demande. Elles sont conservées pour la durée nécessaire au traitement de la demande, sauf obligation légale contraire."
    },
    {
      sectionNumber: 7,
      titleEn: "Cookies",
      titleFr: "Cookies",
      contentEn: "The site may use: technical cookies essential for operation; analytics cookies to measure audience; marketing cookies (if any). Analytics/marketing cookies are subject to consent where required by law. A cookie banner and preference management must be available.",
      contentFr: "Le site peut utiliser : cookies techniques indispensables au fonctionnement ; cookies statistiques pour mesurer l'audience ; cookies marketing (le cas échéant). Les cookies statistiques/marketing sont soumis au consentement lorsque la loi l'exige. Un bandeau cookie et une gestion des préférences doivent être disponibles."
    },
    {
      sectionNumber: 8,
      titleEn: "Security & Liability",
      titleFr: "Sécurité et responsabilité",
      contentEn: "The publisher implements reasonable measures to secure the site. However, the publisher cannot guarantee the absence of incidents (outages, bugs, attacks). The user uses the site at their own risk.",
      contentFr: "L'éditeur met en œuvre des mesures raisonnables pour sécuriser le site. Toutefois, l'éditeur ne peut garantir l'absence d'incidents (coupures, bugs, attaques). L'utilisateur utilise le site sous sa responsabilité."
    },
    {
      sectionNumber: 9,
      titleEn: "Admin access",
      titleFr: "Accès administrateur",
      contentEn: "Access to the administration area and collected data is strictly reserved to the site owner. Credentials must remain confidential.",
      contentFr: "L'accès à l'espace de gestion et aux données collectées est strictement réservé au propriétaire du site. Les identifiants doivent rester confidentiels."
    },
    {
      sectionNumber: 10,
      titleEn: "Governing law & jurisdiction",
      titleFr: "Droit applicable & juridiction",
      contentEn: "These terms are governed by French law. In case of dispute, the competent courts will be those of the company's registered office, unless otherwise required by mandatory rules.",
      contentFr: "Les présentes conditions sont régies par le droit français. En cas de litige, les tribunaux compétents seront ceux du ressort du siège social, sauf disposition contraire impérative."
    },
    {
      sectionNumber: 11,
      titleEn: "Changes",
      titleFr: "Modifications",
      contentEn: "These terms may be amended. The online version is the one enforceable against users. The last updated date should be indicated on the page.",
      contentFr: "Les présentes CGU peuvent être modifiées. La version en ligne est celle opposable aux utilisateurs. La date de dernière mise à jour est indiquée sur la page.",
      contactTextEn: "For any questions regarding these terms or personal data, contact:",
      contactTextFr: "Pour toute question relative aux CGU ou aux données personnelles, contactez :",
      contactMail: "aurelienallenic.dev@gmail.com"
    }
  ];

  for (const section of sections) {
    const created = await prisma.cguSection.create({
      data: {
        userId,
        sectionNumber: section.sectionNumber,
        titleEn: section.titleEn,
        titleFr: section.titleFr,
        contentEn: section.contentEn,
        contentFr: section.contentFr,
        contactTextEn: section.contactTextEn,
        contactTextFr: section.contactTextFr,
        contactMail: section.contactMail
      },
    });
    console.log(`Section CGU #${section.sectionNumber} créée :`, created.id);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
