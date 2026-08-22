import { useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX } from 'lucide-react';

export default function VideoSection() {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(true);
  const [hovered, setHovered] = useState(false);

  function togglePlay() {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying((v) => !v);
  }

  function toggleMute() {
    if (!videoRef.current) return;
    videoRef.current.muted = !muted;
    setMuted((v) => !v);
  }

  return (
    <section className="bg-[#1a1208] py-10 lg:py-20">
      <div className="page-wrap">
        {/* Section heading */}
        <div className="mb-6 text-center lg:mb-10">
          <p className="mb-2 font-mono text-[11px] uppercase tracking-[0.16em] text-[#d59a2b]">
            From the valley
          </p>
          <h2 className="font-display text-2xl text-[#f8f2e8] sm:text-3xl md:text-4xl">
            The Daljheel Story
          </h2>
        </div>

        {/* Video container */}
        <div
          className="relative mx-auto max-w-4xl overflow-hidden rounded-xl border border-[#d59a2b]/30 shadow-[0_0_60px_rgba(213,154,43,0.15)] cursor-pointer"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          onClick={togglePlay}
        >
          <video
            ref={videoRef}
            src="/Daljheel_Video.mp4"
            className="h-auto w-full object-cover"
            muted={muted}
            loop
            playsInline
            preload="metadata"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
          />

          {/* Gradient overlay */}
          <div
            className={`absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent transition-opacity duration-300 ${hovered || !playing ? 'opacity-100' : 'opacity-0'}`}
          />

          {/* Center play/pause button */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${hovered || !playing ? 'opacity-100' : 'opacity-0'}`}
          >
            <button
              type="button"
              aria-label={playing ? 'Pause video' : 'Play video'}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-[#d59a2b]/90 text-white shadow-2xl backdrop-blur-sm transition hover:scale-110 hover:bg-[#d59a2b] sm:h-20 sm:w-20"
              onClick={(e) => { e.stopPropagation(); togglePlay(); }}
            >
              {playing ? (
                <Pause className="h-6 w-6 sm:h-8 sm:w-8" />
              ) : (
                <Play className="ml-1 h-6 w-6 sm:h-8 sm:w-8" />
              )}
            </button>
          </div>

          {/* Bottom controls */}
          <div
            className={`absolute bottom-0 left-0 right-0 flex items-center justify-between px-4 pb-4 pt-8 transition-opacity duration-300 ${hovered || !playing ? 'opacity-100' : 'opacity-0'}`}
          >
            <span className="font-mono text-[11px] uppercase tracking-wider text-white/80">
              Daljheel Food Mart
            </span>
            <button
              type="button"
              aria-label={muted ? 'Unmute' : 'Mute'}
              onClick={(e) => { e.stopPropagation(); toggleMute(); }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm transition hover:bg-white/30"
            >
              {muted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        {/* Subtext */}
        <p className="mt-6 text-center text-sm leading-relaxed text-[#f8f2e8]/60 max-w-lg mx-auto">
          Experience the purity of Kashmiri saffron and premium wellness products — 
          handpicked from the valleys of Pampore.
        </p>
      </div>
    </section>
  );
}
