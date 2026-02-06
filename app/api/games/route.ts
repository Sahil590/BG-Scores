import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadToBlob, deleteFromBlob } from '@/lib/blob';

// GET /api/games - List all games
export async function GET() {
  try {
    const games = await prisma.game.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { scores: true },
        },
      },
    });
    return NextResponse.json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json(
      { error: 'Failed to fetch games' },
      { status: 500 }
    );
  }
}

// POST /api/games - Create a new game
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string;
    const imageFile = formData.get('image') as File | null;

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    let imageUrl: string | undefined;

    if (imageFile && imageFile.size > 0) {
      imageUrl = await uploadToBlob(imageFile, `games/${imageFile.name}`);
    }

    const game = await prisma.game.create({
      data: {
        name,
        imageUrl,
      },
    });

    return NextResponse.json(game, { status: 201 });
  } catch (error) {
    console.error('Error creating game:', error);
    return NextResponse.json(
      { error: 'Failed to create game' },
      { status: 500 }
    );
  }
}
