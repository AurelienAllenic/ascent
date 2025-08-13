import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json() as { email: string; password: string };

    if (!email || !password) {
      return new Response('Email ou mot de passe manquant', { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return new Response('Utilisateur non trouvé', { status: 404 });
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      return new Response('Mot de passe incorrect', { status: 401 });
    }

    return new Response(JSON.stringify({ message: 'Connexion réussie', email: user.email }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    console.error(err);
    return new Response('Erreur serveur', { status: 500 });
  }
}
