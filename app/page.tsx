'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LoginButton } from './_components/buttons/LoginButton';
import { ErrorBanner } from './_components/ErrorBanner';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.toLowerCase() }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      router.push('/dashboard');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="glass-card p-10 rounded-2xl w-full max-w-md mx-4 animate-in fade-in zoom-in duration-500">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2 tracking-tight">
            <span className="text-gradient">Login</span>
          </h1>
          <p className="text-gray-400">Aura VMS Assignment</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300 mb-2">
              Access ID
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="writer or manager"
              className="w-full px-4 py-3 rounded-xl bg-surface/50 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              autoFocus
            />
          </div>

          {error && (
            <ErrorBanner error={error} />
          )}

          <LoginButton loading={loading} />
        </form>
        
        <div className="mt-6 text-center text-xs text-gray-500">
          Use 'writer' or 'manager' to log in
        </div>
      </div>
    </main>
  );
}
