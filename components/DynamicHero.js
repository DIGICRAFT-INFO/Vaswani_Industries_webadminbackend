'use client';
import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, ArrowRight, Flame, Box, BatteryCharging, SunMedium } from 'lucide-react';

function ButtonRenderer({ buttons = [] }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center flex-wrap">
      {buttons.filter(b => b.text).map((btn, i) => {
        const cls = btn.style === 'outline'
          ? 'btn-outline-teal border-white/40 text-white hover:bg-white/10 text-base px-8 py-4'
          : btn.style === 'dark'
          ? 'btn-dark text-base px-8 py-4'
          : 'btn-teal text-base px-8 py-4';
        const Tag = btn.url?.startsWith('http') ? 'a' : Link;
        const props = btn.url?.startsWith('http')
          ? { href: btn.url, target: btn.openNewTab ? '_blank' : undefined, rel: 'noopener noreferrer' }
          : { href: btn.url || '#' };
        return (
          <Tag key={i} {...props} className={`inline-flex items-center gap-2 ${cls}`}>
            {btn.text}
            {btn.style === 'primary' && <ArrowRight size={18} />}
          </Tag>
        );
      })}
    </div>
  );
}

export default function DynamicHero({ section, stats }) {
  const images   = section?.images || [];
  const hasSlide = images.length > 1;
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent(c => (c + 1) % images.length), [images.length]);
  const prev = useCallback(() => setCurrent(c => (c - 1 + images.length) % images.length), [images.length]);

  // Auto-advance slideshow
  useEffect(() => {
    if (!hasSlide) return;
    const t = setInterval(next, 5000);
    return () => clearInterval(t);
  }, [hasSlide, next]);

  const bgImage = images.length > 0
    ? images[current]?.url
    : '/Web-slider-factory1.webp';

  return (
    <section className="relative min-h-[100vh] flex items-center justify-center overflow-hidden bg-gray-950">
      {/* Background */}
      <div className="absolute inset-0 transition-all duration-700">
        <img
          key={bgImage}
          src={bgImage}
          alt={images[current]?.alt || section?.title || ''}
          className="w-full h-full object-cover opacity-50 transition-opacity duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-gray-950/40 via-gray-950/20 to-[#0a0a0a]" />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-5xl mx-auto animate-slide-up">
        {section?.miniTitle && (
          <div className="inline-flex items-center gap-2 border border-teal-400/60 bg-teal-500/10 backdrop-blur-sm text-teal-300 text-xs font-bold tracking-[0.2em] uppercase px-5 py-2 rounded-full mb-8">
            <span className="w-1.5 h-1.5 bg-teal-400 rounded-full animate-pulse" />
            {section.miniTitle}
          </div>
        )}
        {section?.title && (
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white leading-[1.1] mb-6 tracking-tight">
            {section.title}
          </h1>
        )}
        {section?.subtitle && (
          <p className="text-teal-300 text-sm md:text-base font-semibold tracking-wide uppercase mb-4">
            {section.subtitle}
          </p>
        )}
        {section?.paragraph && (
          <p className="text-gray-300 text-base md:text-xl leading-relaxed max-w-3xl mx-auto mb-4">
            {section.paragraph}
          </p>
        )}
        {section?.paragraph2 && (
          <p className="text-gray-400 text-sm md:text-lg leading-relaxed max-w-3xl mx-auto mb-10">
            {section.paragraph2}
          </p>
        )}
        {!section?.paragraph2 && section?.paragraph && <div className="mb-4" />}
        {section?.buttons?.length > 0 && <ButtonRenderer buttons={section.buttons} />}
      </div>

      {/* Slide controls */}
      {hasSlide && (
        <>
          {/* Prev / Next buttons */}
          <button onClick={prev} className="absolute left-4 md:left-8 z-20 w-11 h-11 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white transition-all">
            <ChevronLeft size={20} />
          </button>
          <button onClick={next} className="absolute right-4 md:right-8 z-20 w-11 h-11 bg-white/10 hover:bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white transition-all">
            <ChevronRight size={20} />
          </button>

          {/* Dots */}
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-2 z-20">
            {images.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)}
                className={`rounded-full transition-all duration-300 ${i === current ? 'w-8 h-2.5 bg-teal-400' : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/60'}`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
        </>
      )}

      {/* Scroll indicator (no slide) - hidden, stats blend into hero */}

      {/* Stats Bar - blended into hero bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-20">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 grid grid-cols-4 gap-2 sm:gap-4 md:gap-6 text-center">
          {(stats || [
            { value: '90000', unit: 'MT', label: 'Production and Capacity of Sponge Iron' },
            { value: '150000', unit: 'MT', label: 'Production and Capacity of Billets' },
            { value: '11.5', unit: 'MW', label: 'Production and Capacity of Power' },
            { value: '66.25', unit: 'MW', label: 'Production and Capacity of Solar' },
          ]).map((stat, i) => {
            const icons = [Flame, Box, BatteryCharging, SunMedium];
            const Icon = icons[i % icons.length];
            return (
              <div key={i} className="flex flex-col items-center gap-1 sm:gap-2">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-teal-500/10 border border-teal-500/20 flex items-center justify-center">
                  <Icon size={16} className="text-teal-400 sm:hidden" /><Icon size={20} className="text-teal-400 hidden sm:block" />
                </div>
                <div><span className="text-lg sm:text-2xl md:text-3xl font-black text-teal-400">{stat.value}</span><span className="text-[8px] sm:text-sm font-bold text-gray-400 ml-0.5">{stat.unit}</span></div>
                <p className="text-[8px] sm:text-[11px] text-gray-400 font-medium leading-tight">{stat.label}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
