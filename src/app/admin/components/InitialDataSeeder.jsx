'use client';

import React, { useState } from 'react';
import { createClient } from '@/libs/supabase/client';

const initialSkills = [
  // Programming Language
  { category: 'Programming Language', label: 'JavaScript', desc: 'Programming Language', img_src: '/images/javascript.svg', progress: 52, sort_order: 1 },
  { category: 'Programming Language', label: 'PHP', desc: 'Programming Language', img_src: '/images/php.svg', progress: 45, sort_order: 2 },
  { category: 'Programming Language', label: 'Java', desc: 'Programming Language', img_src: '/images/java.svg', progress: 35, sort_order: 3 },
  { category: 'Programming Language', label: 'C++', desc: 'Programming Language', img_src: '/images/cpp.svg', progress: 40, sort_order: 4 },
  { category: 'Programming Language', label: 'C', desc: 'Programming Language', img_src: '/images/c.png', progress: 38, sort_order: 5 },
  { category: 'Programming Language', label: 'Dart', desc: 'Programming Language', img_src: '/images/dart.svg', progress: 35, sort_order: 6 },
  { category: 'Programming Language', label: 'Python', desc: 'Programming Language', img_src: '/images/python.svg', progress: 30, sort_order: 7 },
  // Framework & Library
  { category: 'Framework & Library', label: 'Flutter', desc: 'Framework', img_src: '/images/flutter.svg', progress: 40, sort_order: 8 },
  { category: 'Framework & Library', label: 'React Js', desc: 'Library', img_src: '/images/react.svg', progress: 40, sort_order: 9 },
  { category: 'Framework & Library', label: 'Next Js', desc: 'Library', img_src: '/images/nextjs.svg', progress: 40, sort_order: 10 },
  { category: 'Framework & Library', label: 'Laravel', desc: 'Framework', img_src: '/images/laravel.png', progress: 40, sort_order: 11 },
  { category: 'Framework & Library', label: 'Bootstrap', desc: 'Framework', img_src: '/images/bootstrap.png', progress: 30, sort_order: 12 },
  { category: 'Framework & Library', label: 'jQuery', desc: 'Library', img_src: '/images/jquery.jpeg', progress: 28, sort_order: 13 },
  { category: 'Framework & Library', label: 'Flask', desc: 'Framework', img_src: '/images/flask.png', progress: 25, sort_order: 14 },
  // Markup & Styling
  { category: 'Markup & Styling', label: 'HTML', desc: 'Markup Language', img_src: '/images/html.png', progress: 50, sort_order: 15 },
  { category: 'Markup & Styling', label: 'CSS', desc: 'Styling Language', img_src: '/images/css.png', progress: 45, sort_order: 16 },
  { category: 'Markup & Styling', label: 'TailwindCSS', desc: 'CSS Framework', img_src: '/images/tailwindcss.svg', progress: 27, sort_order: 17 },
  // Database
  { category: 'Database', label: 'MySQL', desc: 'Relational Database', img_src: '/images/mysql.png', progress: 35, sort_order: 18 },
  { category: 'Database', label: 'PostgreSQL', desc: 'Relational Database', img_src: '/images/postgresql.svg', progress: 30, sort_order: 19 },
  // Database Tools & ORM
  { category: 'Database Tools & ORM', label: 'Prisma ORM', desc: 'ORM', img_src: '/images/prisma.svg', progress: 30, sort_order: 20 },
  // Cloud Services & BaaS
  { category: 'Cloud Services & BaaS', label: 'Firebase', desc: 'BaaS (Backend-as-a-Service)', img_src: '/images/firebase.png', progress: 30, sort_order: 21 },
  { category: 'Cloud Services & BaaS', label: 'Supabase', desc: 'BaaS (Backend-as-a-Service)', img_src: '/images/supabase.svg', progress: 25, sort_order: 22 },
  { category: 'Cloud Services & BaaS', label: 'Vercel', desc: 'Hosting Platform', img_src: '/images/vercel.svg', progress: 25, sort_order: 23 },
  // UI/UX & Multimedia
  { category: 'UI/UX & Multimedia', label: 'Figma', desc: 'UI/UX Design Tool', img_src: '/images/figma.jpg', progress: 35, sort_order: 24 },
  { category: 'UI/UX & Multimedia', label: 'Capcut', desc: 'Video Editing', img_src: '/images/capcut.png', progress: 30, sort_order: 25 },
  { category: 'UI/UX & Multimedia', label: 'Canva', desc: 'Graphic Design', img_src: '/images/canva.png', progress: 30, sort_order: 26 },
  { category: 'UI/UX & Multimedia', label: 'Adobe Premiere Pro', desc: 'Video Editing', img_src: '/images/premiere.png', progress: 25, sort_order: 27 },
  // Package Manager
  { category: 'Package Manager', label: 'Node Package Manager', desc: 'Package Manager', img_src: '/images/npm.svg', progress: 28, sort_order: 28 },
  { category: 'Package Manager', label: 'pip', desc: 'Python Package Manager', img_src: '/images/python.svg', progress: 30, sort_order: 29 },
  { category: 'Package Manager', label: 'Pub', desc: 'Dart/Flutter Package Manager', img_src: '/images/flutter.svg', progress: 30, sort_order: 30 },
];

const initialProjects = [
  {
    type: 'image',
    img_src: '/images/project2.png',
    title: 'My Hiking App',
    tags: ['Flutter', 'API', 'Booking App'],
    project_link: 'https://ulhaqjackyhaw.github.io/myhikinglanding/',
    sort_order: 1,
  },
  {
    type: 'image',
    img_src: '/images/project1.png',
    title: 'My Hiking Admin Web',
    tags: ['Web Admin', 'API', 'Management'],
    project_link: 'https://github.com/ulhaqjackyhaw/myhiking-backend-api',
    sort_order: 2,
  },
  {
    type: 'image',
    img_src: '/images/project3.png',
    title: 'Pill Inspector AI | General Detection',
    tags: ['Flask', 'Machine Learnig', 'API'],
    project_link: 'https://github.com/ulhaqjackyhaw/Pill-InsectorAI',
    sort_order: 3,
  },
  {
    type: 'image',
    img_src: '/images/cooming.png',
    title: 'Fire Detection Monitoring',
    tags: ['Mobile App', 'API', 'IOT'],
    project_link: 'https://github.com/ulhaqjackyhaw/FireDetectionMonitoring',
    sort_order: 4,
  },
  {
    type: 'image',
    img_src: '/images/project5.png',
    title: 'Sistem Presensi Siswa',
    tags: ['Laravel', 'Yolo'],
    project_link: 'https://github.com/ulhaqjackyhaw/Sistem-Presensi-Siswa',
    sort_order: 5,
  },
];

const initialCertificates = [
  { name: 'Cloud & Gen AI di AWS', img_src: '/images/1.png', sort_order: 1 },
  { name: 'Pemrograman JavaScript', img_src: '/images/2.png', sort_order: 2 },
  { name: 'Database Design', img_src: '/images/4.png', sort_order: 3 },
  { name: 'Database Pemrograman with SQL', img_src: '/images/3.png', sort_order: 4 },
];

export default function InitialDataSeeder() {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleImport = async () => {
    if (!confirm('Impor data awal portofolio ke Supabase? Data yang sama mungkin akan bertambah jika sudah ada.')) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      // 1. Insert Skills
      const { error: skillErr } = await supabase.from('skills').insert(initialSkills);
      if (skillErr) throw new Error(`Skills error: ${skillErr.message}`);

      // 2. Insert Projects
      const { error: projErr } = await supabase.from('projects').insert(initialProjects);
      if (projErr) throw new Error(`Projects error: ${projErr.message}`);

      // 3. Insert Certificates
      const { error: certErr } = await supabase.from('certificates').insert(initialCertificates);
      if (certErr) throw new Error(`Certificates error: ${certErr.message}`);

      setResult({
        type: 'success',
        text: 'Semua data awal (30 Skills, 5 Projects, 4 Certificates) berhasil diimpor ke database Supabase!',
      });
    } catch (err) {
      setResult({
        type: 'error',
        text: err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-w-xl">
      <h3 className="text-lg font-bold text-zinc-100 mb-2">Impor Data Awal Portofolio</h3>
      <p className="text-zinc-400 text-sm mb-6">
        Tombol ini akan otomatis mengisi database Supabase Anda dengan data yang saat ini sudah ada di web portofolio (30 skill, 5 project, dan 4 sertifikat), sehingga Anda tidak perlu mengetik ulang satu per satu.
      </p>

      {result && (
        <div
          className={`mb-5 p-4 rounded-xl text-sm border ${
            result.type === 'error'
              ? 'bg-red-950/60 border-red-800 text-red-300'
              : 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
          }`}
        >
          {result.text}
        </div>
      )}

      <button
        onClick={handleImport}
        disabled={loading}
        className="px-5 py-2.5 bg-sky-500 hover:bg-sky-400 text-zinc-950 font-semibold rounded-xl text-sm transition-colors disabled:opacity-50 shadow-lg shadow-sky-500/20"
      >
        {loading ? 'Mengimpor Data...' : 'Impor Semua Data Awal Sekarang'}
      </button>
    </div>
  );
}

