import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { PrismaClient } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { email } = (await req.json()) as { email: string };

    if (!email) {
      return NextResponse.json({ error: "Email manquant" }, { status: 400 });
    }

    // Vérifie si l'utilisateur existe
    const user = await prisma.user.findUnique({ where: { email } });

    // On renvoie toujours OK pour éviter de révéler si l'utilisateur existe
    if (!user) {
      return NextResponse.json({ message: "Email envoyé si l'adresse existe." });
    }

    // Génère un token de reset
    const token = crypto.randomBytes(32).toString("hex");
    const tokenExpiry = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes

    // Stocke le token et sa date d'expiration dans la base
    await prisma.user.update({
      where: { email },
      data: { resetToken: token, resetTokenExp: tokenExpiry },
    });

    // Configure le transporteur Nodemailer
    const transporter = nodemailer.createTransport({
      service: "gmail", // ou ton fournisseur SMTP
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`;

    // Envoie l'email
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Réinitialisation de votre mot de passe",
      html: `
        <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
        <p>Cliquez sur ce lien pour choisir un nouveau mot de passe :</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>Le lien expire dans 10 minutes.</p>
      `,
    });

    return NextResponse.json({ message: "Email envoyé si l'adresse existe." });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
