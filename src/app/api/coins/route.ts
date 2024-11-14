import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email');

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { totalCoins: true, usedCoins: true }
  });

  return NextResponse.json(user);
}

export async function POST(request: Request) {
  const { email } = await request.json();

  const user = await prisma.user.update({
    where: { email },
    data: {
      usedCoins: { increment: 1 }
    }
  });

  return NextResponse.json(user);
}
