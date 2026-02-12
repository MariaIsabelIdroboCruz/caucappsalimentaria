import React from "react";
import { motion } from "framer-motion";
import escudoCauca from "@/assets/escudo-cauca.png";
import secretariaLogo from "@/assets/secretaria-agricultura.png";

const ReportHeader: React.FC = () => (
  <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border">
    <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <img src={escudoCauca} alt="Escudo Cauca" className="h-10 w-auto" />
        <img src={secretariaLogo} alt="Secretaría Agricultura" className="h-10 w-auto" />
        <div className="hidden md:block ml-2">
          <p className="font-heading font-bold text-sm text-foreground leading-tight">Gobernación del Cauca</p>
          <p className="text-xs text-muted-foreground">Secretaría de Agricultura y Desarrollo Rural</p>
        </div>
      </div>
      <nav className="hidden lg:flex items-center gap-6 text-sm font-body text-muted-foreground">
        <a href="#contexto" className="hover:text-primary transition-colors">Contexto</a>
        <a href="#problema" className="hover:text-primary transition-colors">Problema</a>
        <a href="#plan" className="hover:text-primary transition-colors">Plan</a>
        <a href="#cronograma" className="hover:text-primary transition-colors">Cronograma</a>
        <a href="#riesgos" className="hover:text-primary transition-colors">Riesgos</a>
      </nav>
    </div>
  </header>
);

export default ReportHeader;
