'use client';
import { useState, useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';

export default function NewsImageLightbox({ images, title }) {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState(0);

  // Close on Escape key
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open]);

  // Prevent body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const prev = (e) => { e.stopPropagation(); setCurrent(c => (c - 1 + images.length) % images.length); };
  const next = (e) => { e.stopPropagation(); setCurrent(c => (c + 1) % images.length); };

  const openAt = (i) => { setCurrent(i); setOpen(true); };

  return (
    <>
      {/* Thumbnail Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {images.map((src, i) => (
          <button key={i} onClick={() => openAt(i)}
            className="group relative w-full h-48 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-teal-500">
            <img src={src} alt={`${title} — Photo ${i + 2}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
              <ZoomIn size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity drop-shadow-lg" />
            </div>
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {open && (
        <div
          className="fixed inset-0 z-[999] bg-black/95 flex items-center justify-center"
          onClick={() => setOpen(false)}
        >
          {/* Close button */}
          <button
            onClick={() => setOpen(false)}
            className="absolute top-4 right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10"
          >
            <X size={20} />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 text-white/60 text-sm font-bold z-10">
            {current + 1} / {images.length}
          </div>

          {/* Prev button */}
          {images.length > 1 && (
            <button onClick={prev}
              className="absolute left-4 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10">
              <ChevronLeft size={22} />
            </button>
          )}

          {/* Main image */}
          <div className="max-w-5xl max-h-[85vh] w-full px-20" onClick={e => e.stopPropagation()}>
            <img
              src={images[current]}
              alt={`${title} — Photo ${current + 2}`}
              className="w-full h-full max-h-[85vh] object-contain rounded-xl"
            />
          </div>

          {/* Next button */}
          {images.length > 1 && (
            <button onClick={next}
              className="absolute right-4 w-11 h-11 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors z-10">
              <ChevronRight size={22} />
            </button>
          )}

          {/* Dot indicators */}
          {images.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map((_, i) => (
                <button key={i} onClick={e => { e.stopPropagation(); setCurrent(i); }}
                  className={`rounded-full transition-all ${i === current ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/40 hover:bg-white/70'}`} />
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}
