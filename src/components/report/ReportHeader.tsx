import React from "react";
import { FileDown, Loader2 } from "lucide-react";
import secretariaLogo from "@/assets/secretaria-agricultura.png";

const ReportHeader: React.FC = () => {
  const [printing, setPrinting] = React.useState(false);

  const handleExportPDF = () => {
    setPrinting(true);
    setTimeout(() => {
      window.print();
      setPrinting(false);
    }, 300);
  };

  return (
    <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border print:hidden">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img src={secretariaLogo} alt="Secretaría Agricultura" className="h-10 w-auto" />
          <div className="hidden md:block ml-2">
            <p className="font-heading font-bold text-sm text-foreground leading-tight">Gobernación del Cauca</p>
            <p className="text-xs text-muted-foreground">Secretaría de Agricultura y Desarrollo Rural</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <nav className="hidden lg:flex items-center gap-6 text-sm font-body text-muted-foreground">
            <a href="#contexto" className="hover:text-primary transition-colors">Contexto</a>
            <a href="#problema" className="hover:text-primary transition-colors">Problema</a>
            <a href="#plan" className="text-primary font-semibold hover:text-primary/80 transition-colors bg-primary/10 px-3 py-1 rounded-full">Plan de Acción</a>
            <a href="#cronograma" className="hover:text-primary transition-colors">Cronograma</a>
            <a href="#riesgos" className="hover:text-primary transition-colors">Riesgos</a>
          </nav>
          <button
            onClick={handleExportPDF}
            disabled={printing}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60 shadow-sm"
          >
            {printing ? (
              <Loader2 size={15} className="animate-spin" />
            ) : (
              <FileDown size={15} />
            )}
            <span className="hidden sm:inline">{printing ? "Preparando…" : "Exportar PDF"}</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default ReportHeader;

