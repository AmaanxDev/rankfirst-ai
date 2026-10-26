'use client';

import { useState } from 'react';
import { KeyRound, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

export default function BingConnectCard() {
  const [apiKey, setApiKey] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectedSites, setConnectedSites] = useState<string[] | null>(null);

  async function handleConnect(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/bing/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to verify key');
      }

      setConnectedSites(data.sites);
    } catch (err) { setError(err instanceof Error ? err.message : "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="border border-gray-800 rounded-xl p-6 shadow-sm bg-gray-900/50">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-white">Bing Webmaster Tools</h2>
          <p className="text-sm text-gray-400 mt-1">
            Enter your Bing Webmaster API Key to import search query rankings and metrics.
          </p>
        </div>
        <div className="p-2 bg-teal-900/30 rounded-lg">
          <span className="font-bold text-teal-400">B</span>
        </div>
      </div>

      {connectedSites ? (
        <div className="mt-4 p-4 bg-green-500/10 border border-green-500/50 rounded-lg flex items-center gap-3 text-green-400 text-sm">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <span>
            Connected! Found <strong>{connectedSites.length}</strong> site(s) in Bing Webmaster Tools.
          </span>
        </div>
      ) : (
        <form onSubmit={handleConnect} className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Bing Webmaster API Key
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Paste Bing API Key here..."
                required
                className="w-full pl-9 pr-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-sm text-white placeholder-gray-600 focus:outline-none focus:border-teal-500"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-400 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading || !apiKey.trim()}
            className="w-full py-2 bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {loading ? 'Verifying Key...' : 'Connect Bing'}
          </button>
        </form>
      )}
    </div>
  );
}

