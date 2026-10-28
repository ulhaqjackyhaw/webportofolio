'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/libs/supabase/client';
import ImageCropperModal from './ImageCropperModal';

export default function ProjectsManager() {
  const supabase = createClient();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Cropper State
  const [cropperOpen, setCropperOpen] = useState(false);
  const [cropperImageSrc, setCropperImageSrc] = useState(null);
  const [originalFile, setOriginalFile] = useState(null);

  const [formData, setFormData] = useState({
    title: '',
    type: 'image',
    img_src: '',
    tags: '',
    project_link: '',
    sort_order: 0,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('id', { ascending: true });

    if (!error && data) {
      setProjects(data);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  const handleFileSelect = (e) => {
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

  const uploadProjectBlob = async (blobOrFile) => {
    setCropperOpen(false);
    setUploading(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const fileExt = originalFile?.name?.split('.').pop() || 'jpg';
      const fileName = `project_${Date.now()}.${fileExt}`;
      const filePath = `projects/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-assets')
        .upload(filePath, blobOrFile);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('portfolio-assets')
        .getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, img_src: data.publicUrl }));
      setStatusMsg({ type: 'success', text: 'Gambar project berhasil diunggah!' });
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
      title: '',
      type: 'image',
      img_src: '',
      tags: '',
      project_link: '',
      sort_order: projects.length + 1,
    });
    setStatusMsg({ type: '', text: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData({
      title: item.title,
      type: item.type || 'image',
      img_src: item.img_src || '',
      tags: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags || '',
      project_link: item.project_link || '',
      sort_order: item.sort_order || 0,
    });
    setStatusMsg({ type: '', text: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: '', text: '' });

    if (!formData.title) {
      setStatusMsg({ type: 'error', text: 'Judul project wajib diisi.' });
      return;
    }

    const tagsArray = formData.tags
      ? formData.tags.split(',').map((t) => t.trim()).filter(Boolean)
      : [];

    const payload = {
      title: formData.title,
      type: formData.type,
      img_src: formData.img_src,
      tags: tagsArray,
      project_link: formData.project_link,
      sort_order: formData.sort_order,
    };

    try {
      if (editingId) {
        const { error } = await supabase
          .from('projects')
          .update(payload)
          .eq('id', editingId);

        if (error) throw error;
        setStatusMsg({ type: 'success', text: 'Project berhasil diperbarui!' });
      } else {
        const { error } = await supabase.from('projects').insert([payload]);
        if (error) throw error;
        setStatusMsg({ type: 'success', text: 'Project baru berhasil ditambahkan!' });
      }

      setIsModalOpen(false);
      fetchProjects();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    }
  };

  const handleDelete = async (id, title) => {
    if (!confirm(`Hapus project "${title}"?`)) return;

    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (!error) {
      fetchProjects();
    } else {
      alert(`Gagal menghapus: ${error.message}`);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-100">Kelola Projects</h2>
          <p className="text-zinc-400 text-sm">Total {projects.length} project terdaftar</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-zinc-950 font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-sky-500/10 flex items-center gap-2 self-start"
        >
          <span>+</span> Tambah Project Baru
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
        <div className="text-center py-12 text-zinc-500">Memuat data project...</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-12 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400">
          Belum ada data project di database. Anda bisa menambah manual atau menggunakan tab &quot;Impor Data Awal&quot;.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map((proj) => (
            <div
              key={proj.id}
              className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="h-44 bg-zinc-800 relative overflow-hidden flex items-center justify-center">
                  {proj.img_src ? (
                    <img
                      src={proj.img_src}
                      alt={proj.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span className="text-zinc-500 text-sm">Tanpa Gambar</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-zinc-100 text-base mb-2">{proj.title}</h3>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {proj.tags?.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-xs px-2 py-0.5 bg-zinc-800 text-zinc-300 rounded-md border border-zinc-700/60"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {proj.project_link && (
                    <a
                      href={proj.project_link}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs text-sky-400 hover:underline truncate block"
                    >
                      {proj.project_link}
                    </a>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 p-4 pt-0 border-t border-zinc-800/60 mt-3">
                <button
                  onClick={() => openEditModal(proj)}
                  className="px-3 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(proj.id, proj.title)}
                  className="px-3 py-1.5 text-xs bg-red-950/60 hover:bg-red-900 border border-red-800 text-red-300 rounded-lg transition-colors"
                >
                  Hapus
                </button>
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
                {editingId ? 'Edit Project' : 'Tambah Project Baru'}
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
                  Judul Project
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: My Hiking App"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Tags (Pisahkan dengan koma)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Flutter, API, Booking App"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Link Project / Demo / GitHub
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={formData.project_link}
                  onChange={(e) => setFormData({ ...formData, project_link: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"
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

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Gambar Project (URL / Upload)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: /images/project1.png atau URL Supabase"
                  value={formData.img_src}
                  onChange={(e) => setFormData({ ...formData, img_src: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 mb-2"
                />

                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-xs text-zinc-200 transition-colors">
                    <span>{uploading ? 'Mengunggah...' : 'Upload Gambar (Crop / Full)'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>

                {formData.img_src && (
                  <div className="mt-2 h-28 rounded-lg overflow-hidden border border-zinc-700">
                    <img
                      src={formData.img_src}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
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

      {/* Image Cropper Modal for Projects */}
      <ImageCropperModal
        isOpen={cropperOpen}
        imageSrc={cropperImageSrc}
        initialAspect={16 / 9}
        onClose={() => setCropperOpen(false)}
        onCropComplete={uploadProjectBlob}
        onUseFull={() => uploadProjectBlob(originalFile)}
      />
    </div>
  );
}

