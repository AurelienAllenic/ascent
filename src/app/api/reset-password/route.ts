import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json() as { token: string; password: string };
    if (!token || !password) return NextResponse.json({ error: "Token ou mot de passe manquant" }, { status: 400 });

    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExp: { gte: new Date() },
      },
    });

    if (!user) return NextResponse.json({ error: "Token invalide ou expiré" }, { status: 400 });

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword, resetToken: null, resetTokenExp: null },
    });

    return NextResponse.json({ message: "Mot de passe changé avec succès" });
  } catch (err) {
    console.error(err);
    // <-- toujours renvoyer un JSON
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
