'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';

interface Player {
  id: string;
  name: string;
  avatarUrl: string | null;
  createdAt: string;
  _count?: {
    scores: number;
  };
}

export default function PlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', avatar: null as File | null });

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const res = await fetch('/api/players');
      const data = await res.json();
      setPlayers(data);
    } catch (error) {
      console.error('Failed to fetch players:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const form = new FormData();
    form.append('name', formData.name);
    if (formData.avatar) {
      form.append('avatar', formData.avatar);
    }

    try {
      const res = await fetch('/api/players', {
        method: 'POST',
        body: form,
      });

      if (res.ok) {
        setFormData({ name: '', avatar: null });
        setShowForm(false);
        fetchPlayers();
      }
    } catch (error) {
      console.error('Failed to create player:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this player?')) return;

    try {
      const res = await fetch(`/api/players/${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        fetchPlayers();
      }
    } catch (error) {
      console.error('Failed to delete player:', error);
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Players</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {showForm ? 'Cancel' : '+ Add Player'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <div className="mb-4">
            <label className="block mb-2 font-medium">Player Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2 font-medium">Player Avatar</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData({ ...formData, avatar: e.target.files?.[0] || null })}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add Player
          </button>
        </form>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {players.map((player) => (
          <div key={player.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
            {player.avatarUrl && (
              <div className="mb-4 relative h-32 w-32 mx-auto">
                <Image
                  src={player.avatarUrl}
                  alt={player.name}
                  fill
                  className="object-cover rounded-full"
                />
              </div>
            )}
            <h3 className="text-xl font-semibold text-center mb-2">{player.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center mb-4">
              {player._count?.scores || 0} games played
            </p>
            <div className="text-center">
              <button
                onClick={() => handleDelete(player.id)}
                className="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {players.length === 0 && (
        <div className="text-center text-gray-500 py-12">
          No players yet. Add your first player!
        </div>
      )}
    </div>
  );
}
