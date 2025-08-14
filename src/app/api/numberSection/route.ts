import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const numberSection = await prisma.numberSection.findFirst({
      include: {
        cards: true, // Inclut les CardNumber associés
      },
    });

    if (!numberSection) {
      return new Response("Aucune section trouvée", { status: 404 });
    }

    return new Response(JSON.stringify(numberSection), {
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

    const numberSection = await prisma.numberSection.findFirst();
    if (!numberSection) {
      return new Response("Aucune section trouvée", { status: 404 });
    }

    const { _id, id, userId, cards, ...dataToUpdate } = body; // Exclut id, userId et cards

    // Mise à jour des données de NumberSection
    const updatedNumberSection = await prisma.numberSection.update({
      where: { id: body.id },
      data: dataToUpdate,
    });

    // Mise à jour des CardNumber associés si fournis
    if (cards && Array.isArray(cards)) {
      // Supprimer les anciennes cartes si nécessaire
      await prisma.cardNumber.deleteMany({
        where: { numberSectionId: body.id },
      });

      // Créer ou mettre à jour les nouvelles cartes
      await prisma.cardNumber.createMany({
        data: cards.map((card: any) => ({
          numberSectionId: body.id,
          number: card.number,
          unit: card.unit,
          textEn: card.textEn,
          textFr: card.textFr,
          size: card.size,
        })),
      });
    }

    // Récupérer la section mise à jour avec les cartes
    const finalNumberSection = await prisma.numberSection.findFirst({
      where: { id: body.id },
      include: { cards: true },
    });

    return new Response(JSON.stringify(finalNumberSection), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response("Erreur lors de la mise à jour", { status: 500 });
  }
}