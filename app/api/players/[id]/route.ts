import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { uploadToBlob, deleteFromBlob } from '@/lib/blob';

// GET /api/players/[id] - Get a single player
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const player = await prisma.player.findUnique({
      where: { id: params.id },
      include: {
        scores: {
          include: {
            game: true,
          },
          orderBy: { playedAt: 'desc' },
        },
      },
    });

    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(player);
  } catch (error) {
    console.error('Error fetching player:', error);
    return NextResponse.json(
      { error: 'Failed to fetch player' },
      { status: 500 }
    );
  }
}

// PATCH /api/players/[id] - Update a player
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const formData = await request.formData();
    const name = formData.get('name') as string | null;
    const avatarFile = formData.get('avatar') as File | null;

    const updateData: { name?: string; avatarUrl?: string } = {};

    if (name) updateData.name = name;

    if (avatarFile && avatarFile.size > 0) {
      // Delete old avatar if exists
      const existingPlayer = await prisma.player.findUnique({
        where: { id: params.id },
      });

      if (existingPlayer?.avatarUrl) {
        await deleteFromBlob(existingPlayer.avatarUrl);
      }

      updateData.avatarUrl = await uploadToBlob(avatarFile, `players/${avatarFile.name}`);
    }

    const player = await prisma.player.update({
      where: { id: params.id },
      data: updateData,
    });

    return NextResponse.json(player);
  } catch (error) {
    console.error('Error updating player:', error);
    return NextResponse.json(
      { error: 'Failed to update player' },
      { status: 500 }
    );
  }
}

// DELETE /api/players/[id] - Delete a player
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const player = await prisma.player.findUnique({
      where: { id: params.id },
    });

    if (!player) {
      return NextResponse.json(
        { error: 'Player not found' },
        { status: 404 }
      );
    }

    // Delete avatar from blob storage
    if (player.avatarUrl) {
      await deleteFromBlob(player.avatarUrl);
    }

    await prisma.player.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Player deleted successfully' });
  } catch (error) {
    console.error('Error deleting player:', error);
    return NextResponse.json(
      { error: 'Failed to delete player' },
      { status: 500 }
    );
  }
}
