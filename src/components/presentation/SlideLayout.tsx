import React from "react";
import escudoCauca from "@/assets/escudo-cauca.png";
import logoAgricultura from "@/assets/logo-agricultura.png";

interface SlideLayoutProps {
  children: React.ReactNode;
  slideNumber?: number;
  totalSlides?: number;
  variant?: "cover" | "default" | "section";
}

const SlideLayout: React.FC<SlideLayoutProps> = ({
  children,
  slideNumber,
  totalSlides,
  variant = "default",
}) => {
  if (variant === "cover") {
    return (
      <div className="slide-content w-[1920px] h-[1080px] relative overflow-hidden bg-foreground">
        {children}
      </div>
    );
  }

  if (variant === "section") {
    return (
      <div className="slide-content w-[1920px] h-[1080px] relative overflow-hidden bg-slide-green flex flex-col">
        {/* Top bar */}
        <div className="h-[6px] w-full bg-slide-red" />
        <div className="flex-1 flex items-center justify-center p-20">
          {children}
        </div>
        <Footer slideNumber={slideNumber} totalSlides={totalSlides} />
      </div>
    );
  }

  return (
    <div className="slide-content w-[1920px] h-[1080px] relative overflow-hidden bg-primary-foreground flex flex-col">
      {/* Header bar */}
      <div className="h-[80px] bg-slide-green flex items-center px-16 shrink-0">
        <img src={escudoCauca} alt="Escudo Cauca" className="h-[56px] w-auto mr-6" />
        <div className="h-[40px] w-[2px] bg-primary-foreground/30 mr-6" />
        <span className="text-primary-foreground font-heading font-semibold text-[22px] tracking-wide">
          Gobernación del Cauca — Secretaría de Agricultura y Desarrollo Rural
        </span>
      </div>
      <div className="h-[4px] bg-slide-red shrink-0" />
      {/* Content area */}
      <div className="flex-1 px-16 py-10 overflow-hidden">
        {children}
      </div>
      <Footer slideNumber={slideNumber} totalSlides={totalSlides} />
    </div>
  );
};

const Footer: React.FC<{ slideNumber?: number; totalSlides?: number }> = ({
  slideNumber,
  totalSlides,
}) => (
  <div className="h-[56px] bg-foreground flex items-center justify-between px-16 shrink-0">
    <div className="flex items-center gap-4">
      <img src={escudoCauca} alt="Escudo" className="h-[36px] w-auto brightness-200" />
      <img src={logoAgricultura} alt="Agricultura" className="h-[36px] w-auto brightness-200" />
    </div>
    <span className="text-primary-foreground/70 text-[16px] font-body">
      Política Pública de Seguridad y Soberanía Alimentaria — Cauca 2026
    </span>
    {slideNumber && totalSlides && (
      <span className="text-primary-foreground/50 text-[16px] font-body">
        {slideNumber} / {totalSlides}
      </span>
    )}
  </div>
);

export default SlideLayout;
