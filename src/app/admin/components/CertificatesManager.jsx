'use client';
/* eslint-disable @next/next/no-img-element */

import React, { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/libs/supabase/client';

export default function CertificatesManager() {
  const supabase = createClient();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    img_src: '',
    sort_order: 0,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  const fetchCertificates = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('certificates')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('id', { ascending: true });

    if (!error && data) {
      setCertificates(data);
    }
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setStatusMsg({ type: '', text: '' });

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `cert_${Date.now()}.${fileExt}`;
      const filePath = `certificates/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('portfolio-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('portfolio-assets')
        .getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, img_src: data.publicUrl }));
      setStatusMsg({ type: 'success', text: 'Foto sertifikat berhasil diunggah!' });
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
      name: '',
      img_src: '',
      sort_order: certificates.length + 1,
    });
    setStatusMsg({ type: '', text: '' });
    setIsModalOpen(true);
  };

  const openEditModal = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name,
      img_src: item.img_src || '',
      sort_order: item.sort_order || 0,
    });
    setStatusMsg({ type: '', text: '' });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: '', text: '' });

    if (!formData.name) {
      setStatusMsg({ type: 'error', text: 'Nama sertifikat wajib diisi.' });
      return;
    }

    try {
      if (editingId) {
        const { error } = await supabase
          .from('certificates')
          .update(formData)
          .eq('id', editingId);

        if (error) throw error;
        setStatusMsg({ type: 'success', text: 'Sertifikat berhasil diperbarui!' });
      } else {
        const { error } = await supabase.from('certificates').insert([formData]);
        if (error) throw error;
        setStatusMsg({ type: 'success', text: 'Sertifikat baru berhasil ditambahkan!' });
      }

      setIsModalOpen(false);
      fetchCertificates();
    } catch (err) {
      setStatusMsg({ type: 'error', text: err.message });
    }
  };

  const handleDelete = async (id, name) => {
    if (!confirm(`Hapus sertifikat "${name}"?`)) return;

    const { error } = await supabase.from('certificates').delete().eq('id', id);
    if (!error) {
      fetchCertificates();
    } else {
      alert(`Gagal menghapus: ${error.message}`);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl font-bold text-zinc-100">Kelola Certificates</h2>
          <p className="text-zinc-400 text-sm">Total {certificates.length} sertifikat terdaftar</p>
        </div>
        <button
          onClick={openAddModal}
          className="px-4 py-2 bg-sky-500 hover:bg-sky-400 text-zinc-950 font-semibold rounded-xl text-sm transition-colors shadow-lg shadow-sky-500/10 flex items-center gap-2 self-start"
        >
          <span>+</span> Tambah Sertifikat Baru
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
        <div className="text-center py-12 text-zinc-500">Memuat data sertifikat...</div>
      ) : certificates.length === 0 ? (
        <div className="text-center py-12 bg-zinc-900 border border-zinc-800 rounded-2xl text-zinc-400">
          Belum ada data sertifikat di database. Anda bisa menambah manual atau menggunakan tab &quot;Impor Data Awal&quot;.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden flex flex-col justify-between"
            >
              <div>
                <div className="h-44 bg-zinc-800 relative overflow-hidden flex items-center justify-center p-2">
                  {cert.img_src ? (
                    <img
                      src={cert.img_src}
                      alt={cert.name}
                      className="w-full h-full object-contain rounded-lg"
                    />
                  ) : (
                    <span className="text-zinc-500 text-sm">Tanpa Gambar</span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-zinc-100 text-base">{cert.name}</h3>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 p-4 pt-0 border-t border-zinc-800/60 mt-3">
                <button
                  onClick={() => openEditModal(cert)}
                  className="px-3 py-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(cert.id, cert.name)}
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
                {editingId ? 'Edit Sertifikat' : 'Tambah Sertifikat Baru'}
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
                  Nama Sertifikat
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Cloud & Gen AI di AWS"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
                  Gambar Sertifikat (URL / Upload)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: /images/1.png atau URL Supabase"
                  value={formData.img_src}
                  onChange={(e) => setFormData({ ...formData, img_src: e.target.value })}
                  className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 mb-2"
                />

                <div className="flex items-center gap-3">
                  <label className="cursor-pointer px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 rounded-lg text-xs text-zinc-200 transition-colors">
                    <span>{uploading ? 'Mengunggah...' : 'Upload File Sertifikat'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>

                {formData.img_src && (
                  <div className="mt-2 h-32 rounded-lg overflow-hidden border border-zinc-700 p-1 bg-zinc-800 flex items-center justify-center">
                    <img
                      src={formData.img_src}
                      alt="Preview"
                      className="w-full h-full object-contain"
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
    </div>
  );
}

