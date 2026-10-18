import { AlertCircle, CheckCircle2 } from 'lucide-react';
import Googlecard from '@/components/gsc';
import BingConnectCard from '@/components/binge';

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string; error?: string }>;
}) {
  const { status, error } = await searchParams;

  return (
    <div className="max-w-5xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8 text-white">Settings & Integrations</h1>

      {/* Success Banner for Google */}
      {status === 'gsc_connected' && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500/50 rounded-lg flex items-center gap-3 text-green-400">
          <CheckCircle2 className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">Google Search Console successfully connected and tokens encrypted.</p>
        </div>
      )}

      {/* Error Banner for Google */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-lg flex items-center gap-3 text-red-400">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">
            {error === 'gsc_access_denied' && 'Access denied. You must grant permission to connect.'}
            {error === 'token_exchange_failed' && 'Failed to exchange tokens with Google. Try again.'}
            {error === 'server_error' && 'An internal server error occurred.'}
          </p>
        </div>
      )}

      {/* Integration Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Googlecard status={status} />
        <BingConnectCard />
      </div>
    </div>
  );
}