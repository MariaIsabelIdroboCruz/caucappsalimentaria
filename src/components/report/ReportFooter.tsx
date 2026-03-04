import React from "react";
import escudoCauca from "@/assets/escudo-cauca.png";
import secretariaLogo from "@/assets/secretaria-agricultura.png";

const ReportFooter: React.FC = () => (
  <footer className="bg-foreground text-primary-foreground py-12 mt-20">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-4">
          <img src={secretariaLogo} alt="Secretaría" className="h-12 w-auto brightness-200" />
        </div>
        <div className="text-center md:text-right">
          <p className="font-heading font-semibold text-lg">Política Pública de Seguridad y Soberanía Alimentaria</p>
          <p className="text-primary-foreground/60 text-sm mt-1">Departamento del Cauca — Febrero 2026</p>
        </div>
      </div>
      <div className="border-t border-primary-foreground/20 mt-8 pt-6 text-center text-primary-foreground/40 text-xs">
        © 2026 Gobernación del Cauca. Todos los derechos reservados.
      </div>
    </div>
  </footer>
);

export default ReportFooter;
