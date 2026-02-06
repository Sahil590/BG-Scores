import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadToBlob, deleteFromBlob } from '@/lib/blob';

// GET /api/players - List all players
export async function GET() {
  try {
    const players = await prisma.player.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { scores: true },
        },
      },
    });
    return NextResponse.json(players);
  } catch (error) {
    console.error('Error fetching players:', error);
    return NextResponse.json(
      { error: 'Failed to fetch players' },
      { status: 500 }
    );
  }
}

// POST /api/players - Create a new player
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const avatarFile = formData.get('avatar') as File | null;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    let avatarUrl: string | undefined;

    if (avatarFile && avatarFile.size > 0) {
      avatarUrl = await uploadToBlob(avatarFile, `players/${avatarFile.name}`);
    }

    const player = await prisma.player.create({
      data: {
        name,
        avatarUrl,
      },
    });

    return NextResponse.json(player, { status: 201 });
  } catch (error) {
    console.error('Error creating player:', error);
    return NextResponse.json(
      { error: 'Failed to create player' },
      { status: 500 }
    );
  }
}
