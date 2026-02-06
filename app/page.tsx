import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">🎲 BG Scores</h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Track your board game scores with ease
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <Link
          href="/games"
          className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 transition-colors"
        >
          <div className="text-4xl mb-3">🎮</div>
          <h2 className="text-2xl font-semibold mb-2">Games</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your board game collection
          </p>
        </Link>

        <Link
          href="/players"
          className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 transition-colors"
        >
          <div className="text-4xl mb-3">👥</div>
          <h2 className="text-2xl font-semibold mb-2">Players</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Keep track of all players
          </p>
        </Link>

        <Link
          href="/scores"
          className="p-6 border-2 border-gray-200 dark:border-gray-700 rounded-lg hover:border-blue-500 transition-colors"
        >
          <div className="text-4xl mb-3">📊</div>
          <h2 className="text-2xl font-semibold mb-2">Scores</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Record and view game scores
          </p>
        </Link>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-3">Getting Started</h3>
        <ol className="list-decimal list-inside space-y-2 text-gray-700 dark:text-gray-300">
          <li>Add your board games in the Games section</li>
          <li>Register players who will be playing</li>
          <li>Record scores after each game session</li>
          <li>View statistics and track winners!</li>
        </ol>
      </div>
    </div>
  );
}
