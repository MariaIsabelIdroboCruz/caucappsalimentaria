import React, { useState, useEffect } from "react";
import { FileDown, Loader2, Menu, X } from "lucide-react";
import secretariaLogo from "@/assets/secretaria-agricultura.png";

const NAV_LINKS = [
  { href: "#contexto",    label: "Contexto" },
  { href: "#antecedentes", label: "Antecedentes" },
  { href: "#marco",       label: "Marco Legal" },
  { href: "#poblacion",   label: "Población" },
  { href: "#cronograma",  label: "Cronograma" },
];

const ReportHeader: React.FC = () => {
  const [printing, setPrinting] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("");
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for shadow + active section
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);

      const sections = NAV_LINKS.map(l => l.href.slice(1));
      let current = "";
      for (const id of sections) {
        const el = document.getElementById(id);
        if (el && el.getBoundingClientRect().top < 120) current = id;
      }
      setActiveSection(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on nav click
  const handleNavClick = () => setMobileOpen(false);

  const handleExportPDF = () => {
    setPrinting(true);
    setTimeout(() => { window.print(); setPrinting(false); }, 300);
  };

  return (
    <>
      {/* Skip to content — accessibility */}
      <a
        href="#contexto"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[100] focus:bg-primary focus:text-primary-foreground focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold"
      >
        Saltar al contenido
      </a>

      <header
        className={`sticky top-0 z-50 bg-background/90 backdrop-blur-lg border-b border-border print:hidden transition-shadow duration-200 ${
          scrolled ? "shadow-md" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          {/* Logo + brand */}
          <a href="#hero" className="flex items-center gap-3 shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-lg">
            <img src={secretariaLogo} alt="Secretaría de Agricultura y Desarrollo Rural" className="h-9 w-auto" />
            <div className="hidden md:block">
              <p className="font-heading font-bold text-sm text-foreground leading-tight">Gobernación del Cauca</p>
              <p className="text-xs text-muted-foreground">Secretaría de Agricultura y Desarrollo Rural</p>
            </div>
          </a>

          {/* Desktop nav */}
          <nav aria-label="Navegación principal" className="hidden lg:flex items-center gap-1 text-sm font-body">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 rounded-full transition-all font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  activeSection === link.href.slice(1)
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportPDF}
              disabled={printing}
              aria-label="Exportar documento PDF"
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-60 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
            >
              {printing ? <Loader2 size={15} className="animate-spin" /> : <FileDown size={15} />}
              <span className="hidden sm:inline">{printing ? "Preparando…" : "Exportar PDF"}</span>
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileOpen(o => !o)}
              aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              className="lg:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {mobileOpen && (
          <nav
            id="mobile-nav"
            aria-label="Menú móvil"
            className="lg:hidden border-t border-border bg-background/95 backdrop-blur-md px-4 py-3 flex flex-col gap-1 animate-in slide-in-from-top-2 duration-150"
          >
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={handleNavClick}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                  activeSection === link.href.slice(1)
                    ? "bg-primary text-primary-foreground"
                    : "text-foreground hover:bg-muted"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>
        )}
      </header>
    </>
  );
};

export default ReportHeader;
