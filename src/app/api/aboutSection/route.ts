import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const aboutSection = await prisma.aboutSection.findFirst();

    if (!aboutSection) {
      return new Response("Aucune section trouvée", { status: 404 });
    }

    return new Response(JSON.stringify(aboutSection), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response("Erreur serveur", { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    console.log("body =>", body);

    const aboutSection = await prisma.aboutSection.findFirst();
    if (!aboutSection) {
      return new Response("Aucune section trouvée", { status: 404 });
    }

    // Exclut id et userId pour éviter de les modifier
    const { id, userId, ...dataToUpdate } = body;

    const updatedAboutSection = await prisma.aboutSection.update({
      where: { id: aboutSection.id }, // utilise l'id existant
      data: {
        ...dataToUpdate,
        updatedAt: new Date(),
      },
    });

    return new Response(JSON.stringify(updatedAboutSection), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response("Erreur lors de la mise à jour", { status: 500 });
  }
}
