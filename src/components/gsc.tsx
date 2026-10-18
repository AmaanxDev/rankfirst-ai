import Link from 'next/link';
import { ShieldAlert } from 'lucide-react';

export default function Googlecard({ status }: { status?: string }) {
  return (
    <div className="border border-gray-800 rounded-xl p-6 shadow-sm bg-gray-900/50 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-white">Google Search Console</h2>
            <p className="text-sm text-gray-400 mt-1">
              Connect your GSC account to import real-time search queries and ranking data.
            </p>
          </div>
          <div className="p-2 bg-blue-900/30 rounded-lg">
            <span className="font-bold text-blue-400">G</span>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <ShieldAlert className="w-4 h-4" />
          <span>Read-only access</span>
        </div>
        
        <Link 
          href="/api/gsc/auth"
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            status === 'gsc_connected'
              ? 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-700'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {status === 'gsc_connected' ? 'Connected (Reconnect)' : 'Connect GSC'}
        </Link>
      </div>
    </div>
  );
}