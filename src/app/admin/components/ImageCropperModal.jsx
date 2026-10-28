'use client';

import React, { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

async function getCroppedImg(imageSrc, pixelCrop) {
  const image = await new Promise((resolve, reject) => {
    const img = new Image();
    img.addEventListener('load', () => resolve(img));
    img.addEventListener('error', (err) => reject(err));
    img.setAttribute('crossOrigin', 'anonymous');
    img.src = imageSrc;
  });

  const canvas = document.createElement('canvas');
  canvas.width = Math.max(1, Math.round(pixelCrop.width));
  canvas.height = Math.max(1, Math.round(pixelCrop.height));
  const ctx = canvas.getContext('2d');

  ctx.drawImage(
    image,
    pixelCrop.x,
    pixelCrop.y,
    pixelCrop.width,
    pixelCrop.height,
    0,
    0,
    canvas.width,
    canvas.height
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Gagal memproses crop gambar'));
          return;
        }
        resolve(blob);
      },
      'image/jpeg',
      0.92
    );
  });
}

export default function ImageCropperModal({
  isOpen,
  imageSrc,
  initialAspect = 16 / 9,
  onClose,
  onCropComplete,
  onUseFull,
}) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [aspect, setAspect] = useState(initialAspect);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [processing, setProcessing] = useState(false);

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onZoomChange = (zoom) => {
    setZoom(zoom);
  };

  const handleCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleApplyCrop = async () => {
    if (!croppedAreaPixels || !imageSrc) return;
    setProcessing(true);
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedBlob);
    } catch (e) {
      alert('Gagal memotong gambar: ' + e.message);
    } finally {
      setProcessing(false);
    }
  };

  if (!isOpen || !imageSrc) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-zinc-100">Sesuaikan Ukuran Gambar (Crop)</h3>
            <p className="text-xs text-zinc-400">Pilih rasio crop atau gunakan ukuran penuh (Full)</p>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white text-xl font-bold px-2 py-1"
          >
            &times;
          </button>
        </div>

        {/* Cropper Container */}
        <div className="relative w-full h-80 sm:h-96 bg-zinc-950">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect || undefined}
            onCropChange={onCropChange}
            onCropComplete={handleCropComplete}
            onZoomChange={onZoomChange}
          />
        </div>

        {/* Controls */}
        <div className="p-4 bg-zinc-900 space-y-4 border-t border-zinc-800">
          {/* Aspect Ratio Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-zinc-400 mr-2">Rasio:</span>
            <button
              type="button"
              onClick={() => setAspect(1 / 1)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                aspect === 1 / 1
                  ? 'bg-sky-500 text-zinc-950 font-bold'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              1:1 (Persegi / Profil)
            </button>
            <button
              type="button"
              onClick={() => setAspect(16 / 9)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                aspect === 16 / 9
                  ? 'bg-sky-500 text-zinc-950 font-bold'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              16:9 (Landscape / Project)
            </button>
            <button
              type="button"
              onClick={() => setAspect(4 / 3)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                aspect === 4 / 3
                  ? 'bg-sky-500 text-zinc-950 font-bold'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              4:3 (Sertifikat)
            </button>
            <button
              type="button"
              onClick={() => setAspect(null)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                aspect === null
                  ? 'bg-sky-500 text-zinc-950 font-bold'
                  : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
              }`}
            >
              Bebas (Free)
            </button>
          </div>

          {/* Zoom Slider */}
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400">Zoom:</span>
            <input
              type="range"
              min={1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={(e) => setZoom(Number(e.target.value))}
              className="w-full accent-sky-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              type="button"
              onClick={onUseFull}
              disabled={processing}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-amber-400 hover:text-amber-300 rounded-xl text-xs sm:text-sm font-medium transition-colors border border-amber-400/30"
            >
              Gunakan Full (Tanpa Crop)
            </button>

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                disabled={processing}
                className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs sm:text-sm transition-colors"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleApplyCrop}
                disabled={processing}
                className="px-5 py-2 bg-sky-500 hover:bg-sky-400 text-zinc-950 font-semibold rounded-xl text-xs sm:text-sm transition-colors shadow-lg shadow-sky-500/20 disabled:opacity-50"
              >
                {processing ? 'Memproses...' : 'Terapkan Crop & Upload'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

