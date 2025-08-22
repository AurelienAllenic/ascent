import { PrismaClient } from "@prisma/client";
import { ObjectId } from "mongodb";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const homeSection = await prisma.homeSection.findFirst();

    if (!homeSection) {
      return new Response("Aucune section trouvée", { status: 404 });
    }

    return new Response(JSON.stringify(homeSection), {
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

    const homeSection = await prisma.homeSection.findFirst();
    if (!homeSection) {
      return new Response("Aucune section trouvée", { status: 404 });
    }

    const { _id, id, userId, ...dataToUpdate } = body; // exclut id et userId

    const updatedHomeSection = await prisma.homeSection.update({
      where: { id: body.id },
      data: dataToUpdate,
    });

    return new Response(JSON.stringify(updatedHomeSection), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response("Erreur lors de la mise à jour", { status: 500 });
  }
}

