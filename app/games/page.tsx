'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Game {
  id: string;
  name: string;
  imageUrl: string | null;
  createdAt: string;
  _count?: {
    scores: number;
  };
}

export default function GamesPage() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', image: null as File | null });

  useEffect(() => {
    fetchGames();
  }, []);

  const fetchGames = async () => {
    try {
      const res = await fetch('/api/games');
      const data = await res.json();
      setGames(data);
    } catch (error) {
      console.error('Failed to fetch games:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append('name', formData.name);
    if (formData.image) {
      form.append('image', formData.image);
    }

    try {
      const res = await fetch('/api/games', {
        method: 'POST',
        body: form,
      });

      if (res.ok) {
        setFormData({ name: '', image: null });
        setShowForm(false);
        fetchGames();
      }
    } catch (error) {
      console.error('Failed to create game:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this game?')) return;

    try {
      const res = await fetch(`/api/games/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchGames();
      }
    } catch (error) {
      console.error('Failed to delete game:', error);
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Games</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {showForm ? 'Cancel' : '+ Add Game'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="mb-4">
            <label className="block mb-2 font-medium">Game Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Game Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, image: e.target.files?.[0] || null })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Create Game
          </button>
        </form>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {games.map((game) => (
          <div key={game.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            {game.imageUrl && (
              <div className="mb-4 relative h-48">
                <Image
                  src={game.imageUrl}
                  alt={game.name}
                  fill
                  className="object-cover rounded"
                />
              </div>
            )}
            <h3 className="text-xl font-semibold mb-2">{game.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              {game._count?.scores || 0} games played
            </p>
            <button
              onClick={() => handleDelete(game.id)}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      {games.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          No games yet. Add your first game!
        </div>
      )}
    </div>
  );
}
