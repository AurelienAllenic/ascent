import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Récupérer toutes les sections CGU
export async function GET() {
  try {
    const cguSections = await prisma.cguSection.findMany({
      orderBy: { sectionNumber: "asc" },
    });

    if (!cguSections.length) {
      return new Response("Aucune section CGU trouvée", { status: 404 });
    }

    return new Response(JSON.stringify(cguSections), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response("Erreur serveur", { status: 500 });
  }
}

// Créer une nouvelle section CGU
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, sectionNumber, titleEn, titleFr, contentEn, contentFr } = body;

    if (!userId || sectionNumber == null || !titleEn || !titleFr || !contentEn || !contentFr) {
      return new Response("Champs manquants", { status: 400 });
    }

    const newCguSection = await prisma.cguSection.create({
      data: {
        userId,
        sectionNumber,
        titleEn,
        titleFr,
        contentEn,
        contentFr,
      },
    });

    return new Response(JSON.stringify(newCguSection), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response("Erreur lors de la création de la section CGU", { status: 500 });
  }
}

// Mettre à jour une section CGU existante
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, sectionNumber, titleEn, titleFr, contentEn, contentFr } = body;

    if (!id) return new Response("ID manquant", { status: 400 });

    const existingSection = await prisma.cguSection.findUnique({ where: { id } });
    if (!existingSection) return new Response("Section non trouvée", { status: 404 });

    const updatedSection = await prisma.cguSection.update({
      where: { id },
      data: { sectionNumber, titleEn, titleFr, contentEn, contentFr },
    });

    return new Response(JSON.stringify(updatedSection), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response("Erreur lors de la mise à jour", { status: 500 });
  }
}
