'use client';

import { useState, useEffect } from 'react';

interface Game {
  id: string;
  name: string;
}

interface Player {
  id: string;
  name: string;
}

interface Score {
  id: string;
  score: number;
  isWinner: boolean;
  playedAt: string;
  game: Game;
  player: Player;
}

export default function ScoresPage() {
  const [scores, setScores] = useState<Score[]>([]);
  const [games, setGames] = useState<Game[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    gameId: '',
    playerId: '',
    score: '',
    isWinner: false,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [scoresRes, gamesRes, playersRes] = await Promise.all([
        fetch('/api/scores'),
        fetch('/api/games'),
        fetch('/api/players'),
      ]);

      const [scoresData, gamesData, playersData] = await Promise.all([
        scoresRes.json(),
        gamesRes.json(),
        playersRes.json(),
      ]);

      setScores(scoresData);
      setGames(gamesData);
      setPlayers(playersData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/scores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          score: parseInt(formData.score),
        }),
      });

      if (res.ok) {
        setFormData({ gameId: '', playerId: '', score: '', isWinner: false });
        setShowForm(false);
        fetchData();
      }
    } catch (error) {
      console.error('Failed to create score:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this score?')) return;

    try {
      const res = await fetch(`/api/scores/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Failed to delete score:', error);
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Scores</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={games.length === 0 || players.length === 0}
        >
          {showForm ? 'Cancel' : '+ Add Score'}
        </button>
      </div>

      {games.length === 0 || players.length === 0 ? (
        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-8">
          <p>You need to add at least one game and one player before recording scores.</p>
        </div>
      ) : null}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2 font-medium">Game</label>
              <select
                value={formData.gameId}
                onChange={(e) => setFormData({ ...formData, gameId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                required
              >
                <option value="">Select a game</option>
                {games.map((game) => (
                  <option key={game.id} value={game.id}>
                    {game.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block mb-2 font-medium">Player</label>
              <select
                value={formData.playerId}
                onChange={(e) => setFormData({ ...formData, playerId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
                required
              >
                <option value="">Select a player</option>
                {players.map((player) => (
                  <option key={player.id} value={player.id}>
                    {player.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Score</label>
            <input
              type="number"
              value={formData.score}
              onChange={(e) => setFormData({ ...formData, score: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
              required
            />
          </div>
          <div className="mb-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isWinner}
                onChange={(e) => setFormData({ ...formData, isWinner: e.target.checked })}
                className="mr-2"
              />
              <span className="font-medium">Winner</span>
            </label>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Record Score
          </button>
        </form>
      )}

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Game
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Player
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Score
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Winner
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Played
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {scores.map((score) => (
              <tr key={score.id}>
                <td className="px-6 py-4 whitespace-nowrap">{score.game.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{score.player.name}</td>
                <td className="px-6 py-4 whitespace-nowrap font-semibold">{score.score}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {score.isWinner ? (
                    <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded">🏆 Winner</span>
                  ) : (
                    <span className="text-gray-400">-</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(score.playedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={() => handleDelete(score.id)}
                    className="text-red-600 hover:text-red-800 text-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {scores.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          No scores yet. Record your first game!
        </div>
      )}
    </div>
  );
}
