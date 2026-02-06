import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/scores - List all scores
export async function GET() {
  try {
    const scores = await prisma.score.findMany({
      orderBy: { playedAt: 'desc' },
      include: {
        game: true,
        player: true,
      },
    });
    return NextResponse.json(scores);
  } catch (error) {
    console.error('Error fetching scores:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scores' },
      { status: 500 }
    );
  }
}

// POST /api/scores - Create a new score
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { gameId, playerId, score, isWinner } = body;

    if (!gameId || !playerId || score === undefined) {
      return NextResponse.json(
        { error: 'gameId, playerId, and score are required' },
        { status: 400 }
      );
    }

    const newScore = await prisma.score.create({
      data: {
        gameId,
        playerId,
        score: parseInt(score),
        isWinner: isWinner || false,
      },
      include: {
        game: true,
        player: true,
      },
    });

    return NextResponse.json(newScore, { status: 201 });
  } catch (error) {
    console.error('Error creating score:', error);
    return NextResponse.json(
      { error: 'Failed to create score' },
      { status: 500 }
    );
  }
}
