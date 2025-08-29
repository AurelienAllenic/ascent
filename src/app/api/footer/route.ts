import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const footer = await prisma.footerSection.findFirst();

    if (!footer) {
      return new Response("Aucun footer trouvé", { status: 404 });
    }

    return new Response(JSON.stringify(footer), {
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
    const { id, userId, ...dataToUpdate } = body;

    const existingFooter = await prisma.footerSection.findUnique({
      where: { id },
    });

    if (!existingFooter) {
      return new Response("Footer non trouvé", { status: 404 });
    }

    const updatedFooter = await prisma.footerSection.update({
      where: { id },
      data: dataToUpdate,
    });

    return new Response(JSON.stringify(updatedFooter), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response("Erreur lors de la mise à jour", { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, cguButtonTextEn, cguButtonTextFr, cguButtonLink, showCguButton } = body;

    const newFooter = await prisma.footerSection.create({
      data: {
        userId,
        cguButtonTextEn,
        cguButtonTextFr,
        cguButtonLink,
        showCguButton,
      },
    });

    return new Response(JSON.stringify(newFooter), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response("Erreur lors de la création du footer", { status: 500 });
  }
}
