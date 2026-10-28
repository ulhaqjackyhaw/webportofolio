'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/libs/supabase/client';
import ImageCropperModal from './ImageCropperModal';

const defaultProfile = {
  full_name: 'Dhiya Ulhaq',
  title: 'Software Developer',
  status_text: 'Available for work',
  avatar_url: '/images/Ulhaq.png',
  cv_url: 'https://drive.google.com/file/d/1UScmjE3fVCfuYrAn2zqOCuxV65H-qsMx/view?usp=drive_link',
  about_text:
    '👋 Hello!, I am Dhiya Ulhaq, Third-year Informatics Engineering student at Politeknik Negeri Semarang with a strong focus on mobile development, IoT, and web development. Possesses a passion for innovation and a proven track record in developing successful mobile app, web projects, and IoT. Actively involved in project base learning, demonstrating strong problem-solving skills, teamwork, adaptability, and a continuous learning mindset.',
  github_url: 'https://github.com/ulhaqjackyhaw',
  linkedin_url: 'https://www.linkedin.com/in/dhiyaulhaq100',
  instagram_url: 'https://www.instagram.com/dhy_lhq',
  email: 'ulhaqjackyhaw@gmail.com',
};

export default function ProfileManager() {
  const supabase = createClient();
  const [profile, setProfile] = useState(defaultProfile);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingCV, setUploadingCV] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // Cropper State
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperImageSrc, setCropperImageSrc] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .eq('id', 1)
        .maybeSingle();

      if (!error && data) {
        setProfile({ ...defaultProfile, ...data });
      }
    } catch {
      // fallback to default
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Handle Avatar file pick -> open cropper
  const handleAvatarFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setOriginalFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setCropperImageSrc(reader.result);
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Upload cropped avatar or full avatar
  const uploadAvatarBlob = async (blobOrFile) => {
    setCropperOpen(false);
    setUploadingAvatar(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const fileExt = originalFile?.name?.split('.')?.pop() || 'jpg';
      const fileName = `avatar_${Date.now()}.${fileExt}`;
      const filePath = `profile/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-assets')
        .upload(filePath, blobOrFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('portfolio-assets')
        .getPublicUrl(filePath);

      setProfile((prev) => ({ ...prev, avatar_url: data.publicUrl }));
      setStatusMsg({ type: 'success', text: 'Foto profil berhasil diunggah!' });
    } catch (err) {
      setStatusMsg({
        type: 'error',
        text: `Gagal upload foto profil: ${err.message}. Pastikan bucket 'portfolio-assets' sudah dibuat di Supabase Storage.`,
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  // Handle CV Document upload
  const handleCVUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingCV(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `CV_DhiyaUlhaq_${Date.now()}.${fileExt}`;
      const filePath = `cv/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('portfolio-assets')
        .getPublicUrl(filePath);

      setProfile((prev) => ({ ...prev, cv_url: data.publicUrl }));
      setStatusMsg({ type: 'success', text: 'File CV berhasil diunggah!' });
    } catch (err) {
      setStatusMsg({
        type: 'error',
        text: `Gagal upload file CV: ${err.message}. Pastikan bucket 'portfolio-assets' sudah dibuat di Supabase Storage.`,
      });
    } finally {
      setUploadingCV(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const payload = {
        id: 1,
        full_name: profile.full_name,
        title: profile.title,
        status_text: profile.status_text,
        avatar_url: profile.avatar_url,
        cv_url: profile.cv_url,
        about_text: profile.about_text,
        github_url: profile.github_url,
        linkedin_url: profile.linkedin_url,
        instagram_url: profile.instagram_url,
        email: profile.email,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('profile')
        .upsert(payload, { onConflict: 'id' });

      if (error) throw error;
      setStatusMsg({
        type: 'success',
        text: 'Profil, CV, Deskripsi Tentang Diri, dan Kontak berhasil disimpan!',
      });
    } catch (err) {
      setStatusMsg({
        type: 'error',
        text: `Gagal menyimpan: ${err.message}. Jika tabel 'profile' belum ada, silakan jalankan SQL pembuatannya di Supabase.`,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-center py-12 text-zinc-500">Memuat data profil...</div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-zinc-100">Kelola Profil, CV, Tentang Diri & Kontak</h2>
        <p className="text-zinc-400 text-sm">
          Perubahan di halaman ini akan langsung memperbarui foto, tombol CV, deskripsi, dan link kontak di website portofolio Anda.
        </p>
      </div>

      {statusMsg.text && (
        <div
          className={`mb-6 p-4 rounded-xl text-sm border ${
            statusMsg.type === 'error'
              ? 'bg-red-950/60 border-red-800 text-red-300'
              : 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
          }`}
        >
          {statusMsg.text}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-8">
        {/* Section 1: Foto Profil & CV */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-base font-bold text-sky-400 mb-4 flex items-center gap-2">
            <span>👤</span> Foto Profil & File CV
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            {/* Avatar */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                Foto Profil (Hero Avatar)
              </label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-zinc-800 border-2 border-sky-500/40 shrink-0">
                  <img
                    src={profile.avatar_url || '/images/Ulhaq.png'}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <label className="cursor-pointer px-3.5 py-2 bg-sky-500 hover:bg-sky-400 text-zinc-950 rounded-xl text-xs font-semibold transition-colors inline-block mb-1 shadow-lg shadow-sky-500/10">
                    <span>{uploadingAvatar ? 'Mengunggah...' : 'Ganti Foto (Crop)'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarFileSelect}
                      disabled={uploadingAvatar}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-zinc-500">
                    Bisa di-crop 1:1, 16:9, atau ukuran penuh (Full).
                  </p>
                </div>
              </div>
            </div>

            {/* File CV */}
            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-2">
                File CV (Curriculum Vitae)
              </label>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <label className="cursor-pointer px-3.5 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 rounded-xl text-xs font-medium transition-colors">
                    <span>{uploadingCV ? 'Mengunggah...' : 'Upload File CV (PDF)'}</span>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleCVUpload}
                      disabled={uploadingCV}
                      className="hidden"
                    />
                  </label>
                  {profile.cv_url && (
                    <a
                      href={profile.cv_url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-sky-400 hover:underline truncate max-w-[200px]"
                    >
                      Lihat CV Aktif &rarr;
                    </a>
                  )}
                </div>
                <input
                  type="text"
                  placeholder="Atau masukkan Link CV / Google Drive"
                  value={profile.cv_url}
                  onChange={(e) => setProfile({ ...profile, cv_url: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800/80 border border-zinc-700 rounded-xl text-zinc-200 text-xs focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Info Nama & Tagline */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-base font-bold text-sky-400 mb-4 flex items-center gap-2">
            <span>✨</span> Informasi Header / Hero
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Nama Lengkap
              </label>
              <input
                type="text"
                value={profile.full_name}
                onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Profesi / Tagline
              </label>
              <input
                type="text"
                value={profile.title}
                onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Status Badge
              </label>
              <input
                type="text"
                value={profile.status_text}
                onChange={(e) => setProfile({ ...profile, status_text: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Tentang Diri (About Me) */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-base font-bold text-sky-400 mb-4 flex items-center gap-2">
            <span>📖</span> Deskripsi Tentang Diri (About Me)
          </h3>
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Paragraf Deskripsi Diri
            </label>
            <textarea
              rows={6}
              value={profile.about_text}
              onChange={(e) => setProfile({ ...profile, about_text: e.target.value })}
              placeholder="Tuliskan deskripsi ringkas tentang latar belakang, keahlian, dan minat Anda..."
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 leading-relaxed"
            />
            <p className="text-xs text-zinc-500 mt-1">
              Teks ini ditampilkan di bagian kartu &quot;About&quot; portofolio Anda.
            </p>
          </div>
        </div>

        {/* Section 4: Kontak & Social Links */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <h3 className="text-base font-bold text-sky-400 mb-4 flex items-center gap-2">
            <span>🌐</span> Kontak & Media Sosial
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                GitHub URL
              </label>
              <input
                type="url"
                value={profile.github_url}
                onChange={(e) => setProfile({ ...profile, github_url: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                LinkedIn URL
              </label>
              <input
                type="url"
                value={profile.linkedin_url}
                onChange={(e) => setProfile({ ...profile, linkedin_url: e.target.value })}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Instagram URL
              </label>
              <input
                type="url"
                value={profile.instagram_url}
                onChange={(e) => setProfile({ ...profile, instagram_url: e.target.value })}
                placeholder="https://instagram.com/..."
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Email Kontak
              </label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                placeholder="nama@email.com"
                className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-zinc-950 font-bold rounded-xl text-sm transition-colors shadow-lg shadow-sky-500/20 disabled:opacity-50"
          >
            {saving ? 'Menyimpan Perubahan...' : 'Simpan Semua Pengaturan Profil'}
          </button>
        </div>
      </form>

      {/* Image Cropper Modal for Avatar */}
      <ImageCropperModal
        isOpen={cropperOpen}
        imageSrc={cropperImageSrc}
        initialAspect={1 / 1}
        onClose={() => setCropperOpen(false)}
        onCropComplete={uploadAvatarBlob}
        onUseFull={() => uploadAvatarBlob(originalFile)}
      />
    </div>
  );
}

