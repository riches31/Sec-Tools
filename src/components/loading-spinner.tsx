import { Loader } from 'lucide-react';

export default function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="text-center">
        <Loader className="w-12 h-12 text-cyan-500 animate-spin mx-auto mb-4" />
        <p className="text-slate-300 text-lg">Loading tool...</p>
      </div>
    </div>
  );
}
