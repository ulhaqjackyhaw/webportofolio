'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/libs/supabase/client';
import Link from 'next/link';

import SkillsManager from './components/SkillsManager';
import ProjectsManager from './components/ProjectsManager';
import CertificatesManager from './components/CertificatesManager';
import InitialDataSeeder from './components/InitialDataSeeder';

export default function AdminDashboard() {
  const router = useRouter();
  const supabase = createClient();
  const [activeTab, setActiveTab] = useState('skills');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (!data.user) {
        router.push('/login');
      } else {
        setUser(data.user);
      }
      setLoading(false);
    };

    checkUser();
  }, [router, supabase]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-400 flex items-center justify-center">
        Memeriksa autentikasi...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col">
      {/* Top Navigation Bar */}
      <header className="border-b border-zinc-800 bg-zinc-900/80 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-lg font-bold text-zinc-100">
              Admin <span className="text-sky-400">Dashboard</span>
            </h1>
            <span className="hidden sm:inline-block text-xs px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
              {user?.email}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              target="_blank"
              className="text-xs sm:text-sm px-3 py-1.5 rounded-lg border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white transition-colors"
            >
              Lihat Website &rarr;
            </Link>
            <button
              onClick={handleLogout}
              className="text-xs sm:text-sm px-3 py-1.5 rounded-lg bg-red-950/60 hover:bg-red-900 text-red-300 border border-red-800 transition-colors"
            >
              Keluar
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-zinc-800 pb-3 mb-8">
          <button
            onClick={() => setActiveTab('skills')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'skills'
                ? 'bg-sky-500 text-zinc-950 font-semibold shadow-lg shadow-sky-500/20'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            🛠️ Skills ({' '})
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'projects'
                ? 'bg-sky-500 text-zinc-950 font-semibold shadow-lg shadow-sky-500/20'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            🚀 Projects
          </button>
          <button
            onClick={() => setActiveTab('certificates')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'certificates'
                ? 'bg-sky-500 text-zinc-950 font-semibold shadow-lg shadow-sky-500/20'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            📜 Certificates
          </button>
          <button
            onClick={() => setActiveTab('seed')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              activeTab === 'seed'
                ? 'bg-amber-500 text-zinc-950 font-semibold shadow-lg shadow-amber-500/20'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
            }`}
          >
            ⚡ Impor Data Awal
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'skills' && <SkillsManager />}
          {activeTab === 'projects' && <ProjectsManager />}
          {activeTab === 'certificates' && <CertificatesManager />}
          {activeTab === 'seed' && <InitialDataSeeder />}
        </div>
      </main>
    </div>
  );
}

