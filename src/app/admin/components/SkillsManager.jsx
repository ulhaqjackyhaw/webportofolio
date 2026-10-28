'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/libs/supabase/client';

const CATEGORIES = [
  'Programming Language',
  'Framework & Library',
  'Markup & Styling',
  'Database',
  'Database Tools & ORM',
  'Cloud Services & BaaS',
  'UI/UX & Multimedia',
  'Package Manager',
];

export default function SkillsManager() {
  const supabase = createClient();
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    category: 'Programming Language',
    label: '',
    desc: '',
    img_src: '',
    progress: 50,
    sort_order: 0,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const fetchSkills = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('skills')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('id', { ascending: true });

    if (!error && data) {
      setSkills(data);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `skill_${Date.now()}.${fileExt}`;
      const filePath = `skills/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-assets')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage
        .from('portfolio-assets')
        .getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, img_src: data.publicUrl }));
      setStatusMsg({ type: 'success', text: 'Gambar berhasil diunggah!' });
    } catch (err) {
      setStatusMsg({
        type: 'error',
        text: `Gagal upload gambar: ${err.message}. Pastikan bucket 'portfolio-assets' sudah dibuat di Supabase Storage.`,
      });
    } finally {
      setUploading(false);
    }
  };

  const openAddModal = () => {
    setEditingId(null);
    setFormData({
      category: 'Programming Language',
      label: '',
      desc: '',
      img_src: '',
      progress: 50,
      sort_order: skills.length + 1,
    });
    setStatusMsg({ type: '', text: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData({
      category: item.category,
      label: item.label,
      desc: item.desc,
      img_src: item.img_src,
      progress: item.progress || 0,
      sort_order: item.sort_order || 0,
    });
    setStatusMsg({ type: '', text: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: '', text: '' });

    if (!formData.label || !formData.category) {
      setStatusMsg({ type: 'error', text: 'Nama skill dan kategori wajib diisi.' });
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('skills')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
        setStatusMsg({ type: 'success', text: 'Skill berhasil diperbarui!' });
      } else {
        const { error } = await supabase.from('skills').insert([formData]);
        if (error) throw error;
        setStatusMsg({ type: 'success', text: 'Skill baru berhasil ditambahkan!' });
      }

      setIsModalOpen(false);
      fetchSkills();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    }
  };

  const handleDelete = async (id, label) => {
    if (!confirm(`Hapus skill "${label}"?`)) return;

    const { error } = await supabase.from('skills').delete().eq('id', id);
    if (!error) {
      fetchSkills();
    } else {
      alert(`Gagal menghapus: ${error.message}`);
    }
  };

  // Group skills by category
  const groupedSkills = skills.reduce((acc, curr) => {
    acc[curr.category] = acc[curr.category] || [];
    acc[curr.category].push(curr);
    return acc;
  }, {});

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-100">Kelola Skills & Tech Stack</h2>
          <p className="text-zinc-400 text-sm">Total {skills.length} skills terdaftar</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-zinc-950 font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-sky-500/10 flex items-center gap-2 self-start"
        >
          <span>+</span> Tambah Skill Baru
        </button>
      </div>

      {statusMsg.text && (
        <div
          className={`mb-4 p-3 rounded-lg text-sm border ${
            statusMsg.type === 'error'
              ? 'bg-red-950/60 border-red-800 text-red-300'
              : 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
          }`}
        >
          {statusMsg.text}
        </div>
      )}

      {loading ? (
        <div className="text-center py-12 text-zinc-500">Memuat data skills...</div>
      ) : skills.length === 0 ? (
        <div className="text-center py-12 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400">
          Belum ada data skill di database. Anda bisa menambah manual atau menggunakan tab &quot;Impor Data Awal&quot;.
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedSkills).map(([category, items]) => (
            <div key={category} className="bg-zinc-900/70 border border-zinc-800/80 rounded-2xl p-5">
              <h3 className="text-base font-semibold text-sky-400 mb-3">{category}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map((skill) => (
                  <div
                    key={skill.id}
                    className="flex items-center justify-between p-3 bg-zinc-800/60 border border-zinc-700/50 rounded-xl hover:border-zinc-600 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      {skill.img_src ? (
                        <img
                          src={skill.img_src}
                          alt={skill.label}
                          className="w-8 h-8 object-contain rounded"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded bg-zinc-700 flex items-center justify-center text-xs font-bold text-zinc-300">
                          {skill.label.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium text-sm text-zinc-200">{skill.label}</h4>
                        <p className="text-xs text-zinc-400">
                          {skill.desc} &bull; <span className="text-sky-400">{skill.progress}%</span>
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditModal(skill)}
                        className="px-2.5 py-1 text-xs bg-zinc-700 hover:bg-zinc-600 text-zinc-200 rounded-lg transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(skill.id, skill.label)}
                        className="px-2.5 py-1 text-xs bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 rounded-lg transition-colors"
                      >
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add/Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-zinc-100">
                {editingId ? 'Edit Skill' : 'Tambah Skill Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-zinc-400 hover:text-zinc-200 text-xl font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Kategori
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Nama Skill (Label)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Java, Docker, PostgreSQL"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Deskripsi Singkat
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Programming Language, Framework, ORM"
                  value={formData.desc}
                  onChange={(e) => setFormData({ ...formData, desc: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Progress ({formData.progress}%)
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.progress}
                    onChange={(e) =>
                      setFormData({ ...formData, progress: parseInt(e.target.value) || 0 })
                    }
                    className="w-full accent-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1">
                    Urutan (Sort Order)
                  </label>
                  <input
                    type="number"
                    value={formData.sort_order}
                    onChange={(e) =>
                      setFormData({ ...formData, sort_order: parseInt(e.target.value) || 0 })
                    }
                    className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Gambar Icon (Path lokal atau Upload)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: /images/java.svg atau URL Supabase"
                  value={formData.img_src}
                  onChange={(e) => setFormData({ ...formData, img_src: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 mb-2"
                />

                <div className="flex items-center gap-2">
                  <label className="cursor-pointer px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-xs text-zinc-200 transition-colors">
                    <span>{uploading ? 'Mengunggah...' : 'Upload File Icon'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                  {formData.img_src && (
                    <img
                      src={formData.img_src}
                      alt="Preview"
                      className="w-6 h-6 object-contain"
                    />
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-sm transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-zinc-950 font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-sky-500/10"
                >
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

