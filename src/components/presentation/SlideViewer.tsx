import React, { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight, Maximize, Minimize, Grid3X3 } from "lucide-react";

interface SlideViewerProps {
  slides: React.ReactNode[];
}

const SlideViewer: React.FC<SlideViewerProps> = ({ slides }) => {
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);

  const updateScale = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const scaleX = rect.width / 1920;
    const scaleY = rect.height / 1080;
    setScale(Math.min(scaleX, scaleY));
  }, []);

  useEffect(() => {
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, [updateScale, isFullscreen, showGrid]);

  useEffect(() => {
    const onFS = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFS);
    return () => document.removeEventListener("fullscreenchange", onFS);
  }, []);

  const goTo = useCallback(
    (i: number) => {
      setCurrent(Math.max(0, Math.min(slides.length - 1, i)));
      setShowGrid(false);
    },
    [slides.length]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goTo(current + 1);
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        goTo(current - 1);
      }
      if (e.key === "Escape" && isFullscreen) {
        document.exitFullscreen();
      }
      if (e.key === "g" || e.key === "G") {
        setShowGrid((p) => !p);
      }
      if (e.key === "f" || e.key === "F") {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        } else {
          document.exitFullscreen();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, goTo, isFullscreen]);

  if (showGrid) {
    return (
      <div className="min-h-screen bg-foreground p-8">
        <div className="flex items-center justify-between mb-8 px-4">
          <h2 className="text-primary-foreground font-heading text-2xl font-bold">
            Vista General — {slides.length} Slides
          </h2>
          <button
            onClick={() => setShowGrid(false)}
            className="text-primary-foreground/70 hover:text-primary-foreground transition-colors font-body"
          >
            ← Volver a presentación
          </button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 px-4">
          {slides.map((slide, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`relative group cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                i === current
                  ? "border-slide-green shadow-lg shadow-slide-green/20"
                  : "border-primary-foreground/10 hover:border-primary-foreground/30"
              }`}
            >
              <div className="w-full aspect-video relative overflow-hidden">
                <div
                  className="absolute origin-top-left"
                  style={{
                    width: 1920,
                    height: 1080,
                    transform: `scale(${0.2})`,
                  }}
                >
                  {slide}
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-foreground/80 text-primary-foreground text-sm py-1 px-3 font-body">
                Slide {i + 1}
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-foreground flex flex-col items-center justify-center relative select-none"
    >
      {/* Slide container */}
      <div className="flex-1 w-full flex items-center justify-center relative overflow-hidden">
        <div
          className="absolute"
          style={{
            width: 1920,
            height: 1080,
            left: "50%",
            top: "50%",
            marginLeft: -960,
            marginTop: -540,
            transform: `scale(${scale})`,
            transformOrigin: "center center",
          }}
        >
          {slides[current]}
        </div>
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-foreground/90 backdrop-blur-sm rounded-full px-5 py-2.5 border border-primary-foreground/10">
        <button
          onClick={() => goTo(current - 1)}
          disabled={current === 0}
          className="text-primary-foreground/60 hover:text-primary-foreground disabled:opacity-30 transition-colors"
        >
          <ChevronLeft size={22} />
        </button>
        <span className="text-primary-foreground/80 font-body text-sm min-w-[60px] text-center">
          {current + 1} / {slides.length}
        </span>
        <button
          onClick={() => goTo(current + 1)}
          disabled={current === slides.length - 1}
          className="text-primary-foreground/60 hover:text-primary-foreground disabled:opacity-30 transition-colors"
        >
          <ChevronRight size={22} />
        </button>
        <div className="w-px h-5 bg-primary-foreground/20 mx-1" />
        <button
          onClick={() => setShowGrid(true)}
          className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
          title="Grid View (G)"
        >
          <Grid3X3 size={18} />
        </button>
        <button
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen();
            } else {
              document.exitFullscreen();
            }
          }}
          className="text-primary-foreground/60 hover:text-primary-foreground transition-colors"
          title="Fullscreen (F)"
        >
          {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
        </button>
      </div>
    </div>
  );
};

export default SlideViewer;
