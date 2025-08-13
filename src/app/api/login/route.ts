import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json() as { email: string; password: string };

    if (!email || !password) return new Response('Email ou mot de passe manquant', { status: 400 });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return new Response('Utilisateur non trouvé', { status: 404 });

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return new Response('Mot de passe incorrect', { status: 401 });

    const token = jwt.sign({ userId: user.id, email: user.email }, JWT_SECRET!, { expiresIn: '1h' });

    return new Response(JSON.stringify({ token, email: user.email }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error(err);
    return new Response('Erreur serveur', { status: 500 });
  }
}
