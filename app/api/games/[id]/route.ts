import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadToBlob, deleteFromBlob } from '@/lib/blob';

// GET /api/games/[id] - Get a single game
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const game = await prisma.game.findUnique({
      where: { id: params.id },
      include: {
        scores: {
          include: {
            player: true,
          },
          orderBy: { playedAt: 'desc' },
        },
      },
    });

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(game);
  } catch (error) {
    console.error('Error fetching game:', error);
    return NextResponse.json(
      { error: 'Failed to fetch game' },
      { status: 500 }
    );
  }
}

// PATCH /api/games/[id] - Update a game
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string | null;
    const imageFile = formData.get('image') as File | null;

    const updateData: { name?: string; imageUrl?: string } = {};

    if (name) updateData.name = name;

    if (imageFile && imageFile.size > 0) {
      // Delete old image if exists
      const existingGame = await prisma.game.findUnique({
        where: { id: params.id },
      });

      if (existingGame?.imageUrl) {
        await deleteFromBlob(existingGame.imageUrl);
      }

      updateData.imageUrl = await uploadToBlob(imageFile, `games/${imageFile.name}`);
    }

    const game = await prisma.game.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(game);
  } catch (error) {
    console.error('Error updating game:', error);
    return NextResponse.json(
      { error: 'Failed to update game' },
      { status: 500 }
    );
  }
}

// DELETE /api/games/[id] - Delete a game
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const game = await prisma.game.findUnique({
      where: { id: params.id },
    });

    if (!game) {
      return NextResponse.json(
        { error: 'Game not found' },
        { status: 404 }
      );
    }

    // Delete image from blob storage
    if (game.imageUrl) {
      await deleteFromBlob(game.imageUrl);
    }

    await prisma.game.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Game deleted successfully' });
  } catch (error) {
    console.error('Error deleting game:', error);
    return NextResponse.json(
      { error: 'Failed to delete game' },
      { status: 500 }
    );
  }
}
