import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/scores/[id] - Get a single score
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const score = await prisma.score.findUnique({
      where: { id: params.id },
      include: {
        game: true,
        player: true,
      },
    });

    if (!score) {
      return NextResponse.json(
        { error: 'Score not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(score);
  } catch (error) {
    console.error('Error fetching score:', error);
    return NextResponse.json(
      { error: 'Failed to fetch score' },
      { status: 500 }
    );
  }
}

// PATCH /api/scores/[id] - Update a score
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { score, isWinner } = body;

    const updateData: { score?: number; isWinner?: boolean } = {};

    if (score !== undefined) updateData.score = parseInt(score);
    if (isWinner !== undefined) updateData.isWinner = isWinner;

    const updatedScore = await prisma.score.update({
      where: { id: params.id },
      data: updateData,
      include: {
        game: true,
        player: true,
      },
    });

    return NextResponse.json(updatedScore);
  } catch (error) {
    console.error('Error updating score:', error);
    return NextResponse.json(
      { error: 'Failed to update score' },
      { status: 500 }
    );
  }
}

// DELETE /api/scores/[id] - Delete a score
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.score.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Score deleted successfully' });
  } catch (error) {
    console.error('Error deleting score:', error);
    return NextResponse.json(
      { error: 'Failed to delete score' },
      { status: 500 }
    );
  }
}
