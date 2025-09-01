import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET : récupérer la première ContactSection avec ses champs
export async function GET() {
  try {
    const contactSection = await prisma.contactSection.findFirst({
      include: { formFields: true },
    });

    if (!contactSection) {
      return new Response("Aucune section trouvée", { status: 404 });
    }

    return new Response(JSON.stringify(contactSection), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response("Erreur serveur", { status: 500 });
  }
}

// PUT : mettre à jour une ContactSection et ses champs
export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const { id, formFields, ...dataToUpdate } = body;

    if (!id) return new Response("ID manquant", { status: 400 });

    // Mettre à jour la section
    const updatedContactSection = await prisma.contactSection.update({
      where: { id },
      data: {
        ...dataToUpdate,
        updatedAt: new Date(),
        // Pour mettre à jour les formFields, tu peux gérer les ajouts / modifications ici si besoin
      },
      include: { formFields: true },
    });

    return new Response(JSON.stringify(updatedContactSection), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response("Erreur lors de la mise à jour", { status: 500 });
  }
}
