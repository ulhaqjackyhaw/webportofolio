'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/libs/supabase/client';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setErrorMsg(error.message);
      } else if (data.session) {
        router.push('/admin');
        router.refresh();
      }
    } catch (err) {
      setErrorMsg('Terjadi kesalahan saat login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-block text-sky-400 hover:text-sky-300 text-sm mb-3">
            &larr; Kembali ke Portofolio
          </Link>
          <h1 className="text-2xl font-bold text-zinc-100">Admin Login</h1>
          <p className="text-zinc-400 text-sm mt-1">Masuk untuk mengelola portofolio Anda</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-950/60 border border-red-800 text-red-300 text-sm rounded-lg">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full px-4 py-2.5 bg-zinc-800/80 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 bg-zinc-800/80 border border-zinc-700 rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-sky-500 hover:bg-sky-400 text-zinc-950 font-semibold rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-lg shadow-sky-500/20"
          >
            {loading ? 'Memproses...' : 'Masuk ke Dashboard'}
          </button>
        </form>
      </div>
    </div>
  );
}

