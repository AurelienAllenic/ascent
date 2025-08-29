import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    let siteSetting;
    if (userId) {
      siteSetting = await prisma.siteSetting.findFirst({ where: { userId } });
    } else {
      siteSetting = await prisma.siteSetting.findFirst();
    }

    if (!siteSetting) {
      return new Response(JSON.stringify({ error: "Site settings not found" }), { 
        status: 404,
        headers: { "Content-Type": "application/json" }
      });
    }

    return new Response(JSON.stringify(siteSetting), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response("Erreur serveur", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, siteTitleEn, siteTitleFr } = body;

    if (!userId || !siteTitleEn || !siteTitleFr) {
      return new Response("Champs manquants", { status: 400 });
    }

    const existing = await prisma.siteSetting.findFirst({ where: { userId } });
    let result;

    if (existing) {
      result = await prisma.siteSetting.update({
        where: { id: existing.id },
        data: { siteTitleEn, siteTitleFr, updatedAt: new Date() },
      });
    } else {
      result = await prisma.siteSetting.create({
        data: { userId, siteTitleEn, siteTitleFr },
      });
    }

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error(err);
    return new Response("Erreur lors de la création/mise à jour", { status: 500 });
  }
}
