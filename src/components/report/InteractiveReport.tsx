import React, { useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown, Brain, BarChart3, Users, Target, MapPin, Shield, MessageSquare, Flag, Calendar, FileText, Lightbulb, TrendingUp, Database, Cpu, Network, Sparkles, X } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import heroCauca from "@/assets/hero-cauca-report.jpg";
import escudoCauca from "@/assets/escudo-cauca.png";
import secretariaLogo from "@/assets/secretaria-agricultura.png";
import ReportHeader from "./ReportHeader";
import ReportFooter from "./ReportFooter";
import CaucaMap from "./CaucaMap";

// ─── Animation variants ────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};

// ─── Reusable Components ────────────────────────

const Section: React.FC<{ id?: string; children: React.ReactNode; className?: string }> = ({ id, children, className = "" }) => (
  <section id={id} className={`max-w-7xl mx-auto px-6 py-16 ${className}`}>
    {children}
  </section>
);

const SectionTag: React.FC<{ icon: React.ReactNode; label: string }> = ({ icon, label }) => (
  <div className="flex items-center gap-2 text-primary font-heading font-semibold text-sm uppercase tracking-wider mb-3">
    {icon}
    {label}
  </div>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-foreground mb-6 leading-tight">{children}</h2>
);

const AIBadge: React.FC<{ text: string; detail?: string }> = ({ text, detail }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="mt-4">
      <button
        onClick={() => detail && setOpen(!open)}
        className={`inline-flex items-center gap-2 bg-gradient-to-r from-accent/20 to-accent/10 border border-accent rounded-full px-4 py-1.5 text-sm font-heading font-semibold text-accent-foreground transition-all hover:shadow-md hover:from-accent/30 ${detail ? "cursor-pointer" : "cursor-default"}`}
      >
        <Sparkles size={14} className="text-accent" />
        <span>IA: {text}</span>
        {detail && <ChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""}`} />}
      </button>
      <AnimatePresence>
        {open && detail && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2 bg-accent/10 border border-accent/30 rounded-xl p-4 text-sm font-body text-foreground relative">
              <button onClick={() => setOpen(false)} className="absolute top-2 right-2 text-muted-foreground hover:text-foreground">
                <X size={14} />
              </button>
              <div className="flex items-start gap-2">
                <Cpu size={16} className="text-accent mt-0.5 shrink-0" />
                <p>{detail}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const StatCard: React.FC<{ value: string; label: string; icon: React.ReactNode; color?: string }> = ({ value, label, icon, color = "bg-primary" }) => (
  <motion.div variants={scaleIn} className="bg-card rounded-2xl border border-border p-6 shadow-sm hover:shadow-lg transition-shadow">
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-primary-foreground mb-4`}>
      {icon}
    </div>
    <p className="font-heading font-black text-3xl text-foreground">{value}</p>
    <p className="text-muted-foreground text-sm mt-1 font-body">{label}</p>
  </motion.div>
);

const ExpandableCard: React.FC<{ title: string; children: React.ReactNode; defaultOpen?: boolean }> = ({ title, children, defaultOpen = false }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors">
        <span className="font-heading font-bold text-lg text-foreground">{title}</span>
        <ChevronDown size={20} className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && <div className="px-6 pb-6 border-t border-border pt-4">{children}</div>}
    </div>
  );
};

// ─── Phases Flow Diagram ────────────────────────
const PhaseNode: React.FC<{ phase: string; title: string; team: string; color: string; isLast?: boolean }> = ({ phase, title, team, color, isLast }) => (
  <div className="flex flex-col items-center">
    <div className={`${color} text-primary-foreground rounded-2xl px-6 py-4 text-center min-w-[180px] shadow-lg`}>
      <p className="font-heading font-bold text-sm opacity-80">{phase}</p>
      <p className="font-heading font-semibold text-base mt-1">{title}</p>
      <p className="text-xs opacity-70 mt-1">{team}</p>
    </div>
    {!isLast && <div className="w-0.5 h-8 bg-border" />}
  </div>
);

// ─── MAIN COMPONENT ─────────────────────────────
const InteractiveReport: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <ReportHeader />

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <img src={heroCauca} alt="Cauca" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/70 to-foreground/30" />
        <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10 text-center px-6 max-w-4xl">
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-6 mb-10">
            <img src={escudoCauca} alt="Escudo" className="h-16 md:h-20 w-auto" />
            <img src={secretariaLogo} alt="Secretaría" className="h-16 md:h-20 w-auto" />
          </motion.div>
          <motion.div variants={fadeUp} className="h-1 w-20 bg-primary rounded mx-auto mb-6" />
          <motion.h1 variants={fadeUp} className="font-heading font-black text-4xl md:text-6xl text-primary-foreground leading-tight mb-6">
            Construcción de la Política Pública de{" "}
            <span className="text-accent">Seguridad y Soberanía Alimentaria</span>
            {" "}en el Cauca
          </motion.h1>
          <motion.p variants={fadeUp} className="text-xl text-primary-foreground/70 font-body mb-8">
            Plan de Acción Pre-Fases y Cronograma de Implementación
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4">
            <span className="bg-primary text-primary-foreground px-5 py-2 rounded-full font-heading font-semibold text-sm">
              Febrero 2026
            </span>
            <span className="text-primary-foreground/50 text-sm font-body">
              Fase III — Factibilidad
            </span>
          </motion.div>
          <motion.a variants={fadeUp} href="#contexto" className="inline-flex items-center gap-2 mt-12 text-primary-foreground/60 hover:text-primary-foreground transition-colors animate-bounce">
            <span className="text-sm font-body">Explorar Informe</span>
            <ChevronDown size={20} />
          </motion.a>
        </motion.div>
      </section>

      {/* ═══ CONTEXTO ═══ */}
      <Section id="contexto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
          <SectionTag icon={<FileText size={16} />} label="Sección 1" />
          <SectionTitle>Contexto del Proyecto</SectionTitle>
          <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <StatCard value="$943M" label="Presupuesto Total" icon={<BarChart3 size={24} />} />
            <StatCard value="12" label="Meses de Duración" icon={<Calendar size={24} />} color="bg-secondary" />
            <StatCard value="42" label="Municipios Cubiertos" icon={<MapPin size={24} />} />
            <StatCard value="Fase III" label="Factibilidad" icon={<Target size={24} />} color="bg-accent" />
          </motion.div>
          <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-heading font-bold text-lg text-foreground mb-3">Objetivo General</h3>
              <p className="text-muted-foreground font-body leading-relaxed">
                Generar estrategia para la garantía progresiva del derecho a la alimentación en el Departamento del Cauca, con enfoque diferencial étnico, de género, ciclo de vida y campesino.
              </p>
            </div>
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-heading font-bold text-lg text-foreground mb-3">Enfoques Diferenciales</h3>
              <div className="flex flex-wrap gap-2">
                {["Ciclos de Vida", "Género", "Étnico", "Campesino"].map(e => (
                  <span key={e} className="bg-slide-green-light text-primary px-4 py-2 rounded-full font-heading font-semibold text-sm">{e}</span>
                ))}
              </div>
              <AIBadge text="Modelos predictivos para monitorear avances" detail="Implementar modelos de series temporales (ARIMA/Prophet) con datos DANE para proyectar indicadores de inseguridad alimentaria por subregión, generando alertas tempranas cuando se identifiquen tendencias de deterioro y permitiendo ajustar las intervenciones en tiempo real." />
            </div>
          </motion.div>
        </motion.div>
      </Section>

      {/* ═══ ANTECEDENTES ═══ */}
      <div className="bg-muted/50">
        <Section>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
            <SectionTag icon={<Database size={16} />} label="Sección 2" />
            <SectionTitle>Antecedentes</SectionTitle>
            <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {[
                  "El Cauca presenta altos índices de inseguridad alimentaria, especialmente en zonas rurales y comunidades étnicas (DANE)",
                  "Brechas significativas entre población urbana y rural en acceso a alimentos nutritivos",
                  "Ausencia de una política pública departamental que articule esfuerzos institucionales",
                  "Contribución directa al Plan de Desarrollo Departamental 2024-2027",
                ].map((t, i) => (
                  <motion.div key={i} variants={fadeUp} className="flex items-start gap-3 bg-card rounded-xl border border-border p-4">
                    <span className="w-2 h-2 rounded-full bg-primary mt-2 shrink-0" />
                    <p className="text-foreground font-body text-sm">{t}</p>
                  </motion.div>
                ))}
              </div>
              <motion.div variants={scaleIn} className="bg-secondary/10 border-l-4 border-secondary rounded-r-2xl p-6">
                <p className="font-heading font-bold text-secondary text-lg mb-2">⚠ Alerta</p>
                <p className="text-foreground font-body text-sm leading-relaxed">
                  Sin política pública, las acciones permanecen fragmentadas y sin seguimiento articulado. Se requiere un diagnóstico integral con datos DANE actualizados y enfoque territorial diferenciado.
                </p>
                <AIBadge text="IA para análisis geo-espacial de brechas" detail="Utilizar modelos de clustering geoespacial (K-means sobre datos GPS de hogares encuestados) para identificar zonas de alta concentración de inseguridad alimentaria dentro de cada subregión, combinando capas de datos DANE con imágenes satelitales de cobertura agrícola para priorizar intervenciones." />
              </motion.div>
            </motion.div>
          </motion.div>
        </Section>
      </div>

      {/* ═══ JUSTIFICACIÓN Y MARCO LEGAL ═══ */}
      <Section>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
          <SectionTag icon={<FileText size={16} />} label="Sección 3" />
          <SectionTitle>Justificación y Marco Legal</SectionTitle>
          <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="font-heading font-bold text-xl text-foreground mb-4">Justificación</h3>
              <ul className="space-y-3">
                {[
                  "Alineación con el Plan de Desarrollo 2024-2027",
                  "Cumplimiento del derecho humano a la alimentación",
                  "Articulación con lineamientos PMA-FAO",
                  "Respuesta a realidades territoriales con enfoque diferencial",
                ].map((t, i) => (
                  <li key={i} className="flex items-start gap-3 text-foreground font-body text-sm">
                    <span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-heading font-bold text-xl text-secondary mb-4">Marco Normativo</h3>
              <div className="space-y-3">
                {[
                  { norm: "Ley 715/2001", desc: "Competencias departamentales" },
                  { norm: "CONPES 113/2008", desc: "Política Nacional SAN" },
                  { norm: "PMA-FAO", desc: "Metodologías CARI/FIES" },
                  { norm: "Derechos Humanos", desc: "Derecho a alimentación" },
                  { norm: "Plan Desarrollo", desc: "Cauca 2024-2027" },
                ].map((n, i) => (
                  <motion.div key={i} variants={fadeUp} className="flex items-center gap-3 bg-slide-green-light rounded-xl px-4 py-3">
                    <span className="font-heading font-bold text-sm text-primary min-w-[140px]">{n.norm}</span>
                    <span className="text-sm text-foreground font-body">{n.desc}</span>
                  </motion.div>
                ))}
              </div>
              <AIBadge text="Compliance legal automatizado" detail="Implementar un sistema de verificación automática que mapee cada actividad del plan de acción contra el marco normativo (Ley 715, CONPES 113, PMA-FAO), generando reportes de cumplimiento en tiempo real y alertando sobre desviaciones normativas antes de que se materialicen." />
            </div>
          </motion.div>
        </motion.div>
      </Section>

      {/* ═══ ÁRBOL DE PROBLEMAS ═══ */}
      <div className="bg-muted/50">
        <Section id="problema">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
            <SectionTag icon={<Network size={16} />} label="Sección 4" />
            <SectionTitle>Análisis del Problema — Árbol de Problemas</SectionTitle>
            <motion.div variants={fadeUp} className="flex flex-col items-center gap-2 mb-8">
              {/* Effects */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
                {[
                  "Brechas sociales y desigualdad alimentaria",
                  "Políticas sin enfoque diferencial",
                  "Desarticulación institucional",
                ].map((e, i) => (
                  <motion.div key={i} variants={scaleIn} className="bg-secondary/10 border border-secondary rounded-xl p-4 text-center group hover:bg-secondary hover:text-primary-foreground transition-colors cursor-default">
                    <span className="text-xs font-heading font-semibold text-secondary group-hover:text-primary-foreground uppercase tracking-wide">↑ Efecto</span>
                    <p className="text-sm mt-1 font-body">{e}</p>
                  </motion.div>
                ))}
              </div>
              <div className="w-0.5 h-6 bg-secondary" />
              {/* Central */}
              <motion.div variants={scaleIn} className="bg-secondary text-primary-foreground rounded-2xl px-8 py-5 text-center max-w-2xl shadow-xl">
                <span className="text-xs font-heading uppercase tracking-wider opacity-80">Problema Central</span>
                <p className="text-lg font-heading font-bold mt-2">
                  Limitada garantía del derecho a la alimentación en el Departamento del Cauca
                </p>
              </motion.div>
              <div className="w-0.5 h-6 bg-primary" />
              {/* Causes */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
                {[
                  "Limitada información diagnóstica territorial",
                  "Ausencia de política pública departamental SAN",
                  "Débil seguimiento y evaluación de acciones",
                ].map((c, i) => (
                  <motion.div key={i} variants={scaleIn} className="bg-slide-green-light border border-primary rounded-xl p-4 text-center group hover:bg-primary hover:text-primary-foreground transition-colors cursor-default">
                    <span className="text-xs font-heading font-semibold text-primary group-hover:text-primary-foreground uppercase tracking-wide">↓ Causa</span>
                    <p className="text-sm mt-1 font-body">{c}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </Section>
      </div>

      {/* ═══ PARTICIPANTES ═══ */}
      <Section>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
          <SectionTag icon={<Users size={16} />} label="Sección 5" />
          <SectionTitle>Participantes y Análisis de Actores</SectionTitle>
          <motion.div variants={fadeUp} className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-primary text-primary-foreground">
                  <th className="px-4 py-3 text-left font-heading font-semibold rounded-tl-xl">Actor</th>
                  <th className="px-4 py-3 text-left font-heading font-semibold">Rol</th>
                  <th className="px-4 py-3 text-left font-heading font-semibold rounded-tr-xl">Contribución</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Gobernación del Cauca", "Ejecutor principal", "Liderazgo y financiamiento"],
                  ["Asamblea Departamental", "Aprobador", "Aprobación ordenanza"],
                  ["PMA / FAO", "Cooperante técnico", "Metodologías CARI/FIES"],
                  ["Enlace Afro", "Participante diferencial", "Enfoque étnico afrodescendiente"],
                  ["Enlace Indígena", "Participante diferencial", "Enfoque étnico indígena"],
                  ["Enlace Campesino", "Participante diferencial", "Enfoque campesino territorial"],
                  ["Enlace Género", "Participante diferencial", "Enfoque de género"],
                  ["Adultos Mayores", "Beneficiario", "Priorización ciclo de vida"],
                  ["Jóvenes", "Beneficiario", "Participación activa"],
                ].map(([a, r, c], i) => (
                  <tr key={i} className={`border-b border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/30"} hover:bg-slide-green-light transition-colors`}>
                    <td className="px-4 py-3 font-heading font-semibold text-foreground">{a}</td>
                    <td className="px-4 py-3 text-muted-foreground font-body">{r}</td>
                    <td className="px-4 py-3 text-muted-foreground font-body">{c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </motion.div>
      </Section>

      {/* ═══ POBLACIÓN ═══ */}
      <div className="bg-muted/50">
        <Section>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
            <SectionTag icon={<MapPin size={16} />} label="Sección 6" />
            <SectionTitle>Población Objetivo</SectionTitle>
            <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              <StatCard value="1.59M" label="Población Afectada" icon={<Users size={24} />} />
              <StatCard value="466K" label="Con Inseg. Alimentaria" icon={<Target size={24} />} color="bg-secondary" />
              <StatCard value="42" label="Municipios" icon={<MapPin size={24} />} />
              <StatCard value="7" label="Subregiones" icon={<Network size={24} />} color="bg-accent" />
            </motion.div>
            <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-heading font-bold text-lg mb-4">Subregiones del Cauca</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {["Sur", "Macizo", "Pacífico", "Norte", "Centro", "Piedemonte", "Oriente"].map(s => (
                    <span key={s} className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-heading font-semibold">{s}</span>
                  ))}
                </div>
                <p className="text-muted-foreground text-sm font-body">
                  <strong>50.7%</strong> población femenina — Priorización por vulnerabilidad y acceso alimentario
                </p>
                <AIBadge text="Heatmaps IA para focalización territorial" detail="Generar mapas de calor dinámicos cruzando datos de encuestas FIES con variables socioeconómicas (NBI, conflicto armado, acceso vial) para identificar los municipios y veredas con mayor urgencia de intervención alimentaria." />
              </div>
              <div>
                <h3 className="font-heading font-bold text-lg mb-4">Caracterización Demográfica</h3>
                <div className="space-y-2">
                  {[
                    { grupo: "0-14 años", pob: "103.726", pct: 22 },
                    { grupo: "15-29 años", pob: "112.340", pct: 24 },
                    { grupo: "30-49 años", pob: "118.950", pct: 26 },
                    { grupo: "50-64 años", pob: "78.420", pct: 17 },
                    { grupo: "65+ años", pob: "52.564", pct: 11 },
                  ].map((d, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="text-sm font-heading font-semibold min-w-[90px]">{d.grupo}</span>
                      <div className="flex-1 bg-border rounded-full h-6 overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: `${d.pct}%` }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.8, delay: i * 0.1 }}
                          className="h-full bg-primary rounded-full flex items-center justify-end pr-2"
                        >
                          <span className="text-xs text-primary-foreground font-bold">{d.pct}%</span>
                        </motion.div>
                      </div>
                      <span className="text-xs text-muted-foreground min-w-[70px]">{d.pob}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
            {/* Interactive Map */}
            <motion.div variants={fadeUp} className="mt-8">
              <CaucaMap />
            </motion.div>
          </motion.div>
        </Section>
      </div>

      {/* ═══ OBJETIVOS ═══ */}
      <Section>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
          <SectionTag icon={<Target size={16} />} label="Sección 7" />
          <SectionTitle>Objetivos — Árbol de Objetivos</SectionTitle>
          <motion.div variants={fadeUp} className="flex flex-col items-center gap-4 mb-8">
            <div className="bg-primary text-primary-foreground rounded-2xl px-8 py-5 text-center max-w-2xl shadow-xl">
              <span className="text-xs font-heading uppercase tracking-wider opacity-80">Objetivo General</span>
              <p className="text-lg font-heading font-bold mt-2">
                Generar estrategia para la garantía progresiva del derecho a la alimentación en el Cauca
              </p>
            </div>
            <div className="flex gap-8">
              <div className="w-0.5 h-8 bg-primary" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
              {[
                { num: "1", title: "Diagnóstico", desc: "Elaborar diagnóstico aprobado por CISAN" },
                { num: "2", title: "Formulación", desc: "Construir documento técnico de política pública" },
                { num: "3", title: "Seguimiento", desc: "Aprobación y transferencia metodológica" },
              ].map((o, i) => (
                <motion.div key={i} variants={scaleIn} className="bg-slide-green-light border-2 border-primary rounded-xl p-5 text-center hover:shadow-lg transition-shadow">
                  <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-3 font-heading font-bold">
                    {o.num}
                  </div>
                  <h4 className="font-heading font-bold text-lg text-primary mb-2">{o.title}</h4>
                  <p className="text-sm font-body text-foreground">{o.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
          <motion.div variants={fadeUp} className="bg-accent/20 border border-accent rounded-xl px-6 py-4 flex items-center gap-4 max-w-2xl mx-auto">
            <span className="text-2xl">📊</span>
            <div>
              <span className="font-heading font-bold text-sm">Meta Indicador:</span>
              <span className="text-sm ml-2 font-body">Reducir inseguridad alimentaria grave al <strong>1.8%</strong></span>
            </div>
          </motion.div>
          <div className="text-center"><AIBadge text="Machine Learning para proyección de indicadores" detail="Entrenar modelos de regresión con datos históricos DANE para proyectar la trayectoria de la meta del 1.8% de inseguridad grave, simulando diferentes escenarios de intervención y su impacto esperado." /></div>
        </motion.div>
      </Section>

      {/* ═══ ALTERNATIVA ═══ */}
      <div className="bg-muted/50">
        <Section>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
            <SectionTag icon={<Lightbulb size={16} />} label="Sección 8" />
            <SectionTitle>Alternativa Seleccionada</SectionTitle>
            <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="md:col-span-2 bg-card border border-border rounded-2xl p-6">
                <div className="bg-primary text-primary-foreground rounded-xl px-5 py-2 inline-block mb-4">
                  <span className="font-heading font-bold text-sm">Alternativa 1 — Construcción Participativa</span>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm font-body"><span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" /><strong>Localización:</strong>&nbsp;7 subregiones del Cauca</li>
                  <li className="flex items-start gap-2 text-sm font-body"><span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" /><strong>Cadena de Valor:</strong>&nbsp;Insumos → Procesos → Outputs → Política Pública</li>
                  <li className="flex items-start gap-2 text-sm font-body"><span className="w-2 h-2 rounded-full bg-primary mt-1.5 shrink-0" /><strong>Costo Total:</strong>&nbsp;$943.381.615</li>
                </ul>
              </div>
              <div className="bg-card border border-border rounded-2xl p-6">
                <h3 className="font-heading font-bold text-lg mb-4">Desglose</h3>
                {[
                  { act: "Diagnóstico", val: "$571M", pct: 61 },
                  { act: "Elaboración", val: "$228M", pct: 24 },
                  { act: "Seguimiento", val: "$73M", pct: 8 },
                ].map((d, i) => (
                  <div key={i} className="mb-3">
                    <div className="flex justify-between text-sm font-heading font-semibold mb-1">
                      <span>{d.act}</span><span className="text-primary">{d.val}</span>
                    </div>
                    <div className="bg-border rounded-full h-3 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${d.pct}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, delay: i * 0.15 }}
                        className="h-full bg-primary rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </Section>
      </div>

      {/* ═══ PLAN DE ACCIÓN ═══ */}
      <Section id="plan">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
          <SectionTag icon={<Flag size={16} />} label="Sección 9" />
          <SectionTitle>Plan de Acción General</SectionTitle>
          <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="bg-card rounded-2xl border border-border p-6 mb-6">
                <ul className="space-y-2 text-sm font-body">
                  <li><strong>Período:</strong> Febrero 2026 — Enero 2027</li>
                  <li><strong>Propósito:</strong> Hoja de ruta para sincronizar equipo</li>
                  <li><strong>Estructura:</strong> Fase 0 a Fase 5</li>
                </ul>
              </div>
              <h3 className="font-heading font-bold text-lg mb-3">Equipo Requerido</h3>
              <div className="flex flex-wrap gap-2">
                {["Politología", "Nutrición", "Género", "Trabajo Social", "Ingeniería", "Gestión Documental", "Enlaces", "Encuestadores"].map(p => (
                  <span key={p} className="bg-slide-green-light text-primary px-3 py-1.5 rounded-full text-xs font-heading font-semibold">{p}</span>
                ))}
              </div>
              <AIBadge text="IA para coordinación de equipo" detail="Usar algoritmos de optimización de recursos para asignar perfiles profesionales a las 7 subregiones, considerando expertise, disponibilidad y carga de trabajo, maximizando la cobertura territorial y minimizando tiempos de desplazamiento." />
            </div>
            <div className="space-y-3">
              {[
                { phase: "Fase 0", title: "Alistamiento", time: "Feb 2026", color: "bg-primary" },
                { phase: "Fase 1", title: "Diagnóstico", time: "Mar-Jun 2026", color: "bg-primary" },
                { phase: "Fase 2", title: "Elaboración Doc. Técnico", time: "Jul-Sep 2026", color: "bg-accent" },
                { phase: "Fase 3", title: "Validación CISAN", time: "Oct 2026", color: "bg-accent" },
                { phase: "Fase 4", title: "Aprobación Asamblea", time: "Nov-Dic 2026", color: "bg-secondary" },
                { phase: "Fase 5", title: "Transferencia", time: "Ene 2027", color: "bg-secondary" },
              ].map((f, i) => (
                <motion.div key={i} variants={fadeUp} className="flex items-center gap-3">
                  <div className={`${f.color} text-primary-foreground rounded-xl px-4 py-2 min-w-[90px] text-center font-heading font-bold text-sm`}>
                    {f.phase}
                  </div>
                  <div>
                    <span className="font-heading font-semibold text-sm">{f.title}</span>
                    <span className="text-muted-foreground text-xs ml-2">{f.time}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </Section>

      {/* ═══ PRIMEROS 4 MESES ═══ */}
      <div className="bg-muted/50">
        <Section>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
            <SectionTag icon={<Calendar size={16} />} label="Sección 10" />
            <SectionTitle>Foco: Primeros 4 Meses — Contratación y Alistamiento</SectionTitle>
            <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div variants={scaleIn} className="bg-primary text-primary-foreground rounded-2xl p-6 shadow-lg">
                <h3 className="font-heading font-bold text-lg mb-3">Fase 0 — Feb 2026</h3>
                <ul className="space-y-2 text-sm">
                  <li>✓ Reunión de arranque</li>
                  <li>✓ Validación CARI/FIES</li>
                  <li>✓ Diseño instrumentos</li>
                  <li>✓ Capacitación 420 encuestadores</li>
                  <li>✓ Piloto de prueba</li>
                </ul>
              </motion.div>
              <motion.div variants={scaleIn} className="bg-accent/20 border-2 border-accent rounded-2xl p-6">
                <h3 className="font-heading font-bold text-lg mb-3">Contratación Equipo</h3>
                <ul className="space-y-2 text-sm">
                  <li>📋 Perfiles profesionales clave</li>
                  <li>📋 Logística de contratación</li>
                  <li>📋 420 encuestadores (bachiller mín.)</li>
                  <li>📋 Supervisores de campo</li>
                  <li>📋 Equipo técnico central</li>
                </ul>
              </motion.div>
              <motion.div variants={scaleIn} className="bg-slide-green-light border-2 border-primary rounded-2xl p-6">
                <h3 className="font-heading font-bold text-lg text-primary mb-3">Fase 1 — Mar a May</h3>
                <ul className="space-y-2 text-sm">
                  <li>🔍 Inicio diagnóstico integral</li>
                  <li>🔍 Encuestas en 42 municipios</li>
                  <li>🔍 7.560 encuestas programadas</li>
                  <li>🔍 Talleres participativos</li>
                  <li>🔍 Análisis información secundaria</li>
                </ul>
              </motion.div>
            </motion.div>
            <div className="h-2 bg-gradient-to-r from-primary via-accent to-secondary rounded-full" />
            <p className="text-center text-muted-foreground text-sm mt-2 font-body">Feb → May 2026</p>
          </motion.div>
        </Section>
      </div>

      {/* ═══ DIAGNÓSTICO ═══ */}
      <Section>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
          <SectionTag icon={<BarChart3 size={16} />} label="Sección 11" />
          <SectionTitle>Actividad 1: Diagnóstico (4 Meses — $571M)</SectionTitle>
          <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ExpandableCard title="📊 Componente Cuantitativo" defaultOpen>
              <ul className="space-y-2 text-sm font-body">
                <li>• <strong>7.560 encuestas</strong> en 42 municipios</li>
                <li>• 10 encuestadores por municipio × 3 días</li>
                <li>• 6 encuestas diarias mínimo por encuestador</li>
                <li>• Metodologías CARI/FIES/IPC aprobadas por CISAN</li>
              </ul>
              <AIBadge text="Dashboard IA para monitoreo en tiempo real" detail="Dashboard con visualización en tiempo real del avance de las 7.560 encuestas por municipio, con indicadores de calidad de datos (completitud, consistencia) y alertas automáticas cuando un municipio presenta rezagos en la recolección." />
            </ExpandableCard>
            <ExpandableCard title="🗣️ Componente Cualitativo" defaultOpen>
              <ul className="space-y-2 text-sm font-body">
                <li>• <strong>14 talleres</strong> (2 por subregión)</li>
                <li>• 100 participantes por taller</li>
                <li>• Enfoques: familia, consumo, prácticas alimentación</li>
                <li>• Almuerzo completo incluido</li>
              </ul>
              <AIBadge text="NLP para análisis cualitativo automatizado" detail="Aplicar procesamiento de lenguaje natural (NLP) a las transcripciones de los 14 talleres para identificar patrones temáticos, sentimientos predominantes y necesidades emergentes, acelerando el análisis cualitativo de semanas a horas." />
            </ExpandableCard>
          </motion.div>
        </motion.div>
      </Section>

      {/* ═══ CRONOGRAMA GANTT ═══ */}
      <div className="bg-muted/50">
        <Section id="cronograma">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
            <SectionTag icon={<Calendar size={16} />} label="Sección 12" />
            <SectionTitle>Cronograma Detallado — Actividad 1 (Gantt)</SectionTitle>
            <motion.div variants={fadeUp} className="bg-card rounded-2xl border border-border p-6 overflow-x-auto">
              {/* Month headers */}
              <div className="flex mb-4 min-w-[600px]">
                {["Feb", "Mar", "Abr", "May", "Jun"].map(m => (
                  <div key={m} className="flex-1 text-center font-heading font-semibold text-xs text-muted-foreground border-b border-border pb-2">
                    {m} 2026
                  </div>
                ))}
              </div>
              <div className="space-y-2 min-w-[600px]">
                <p className="font-heading font-bold text-sm text-primary mb-2">FASE 1 — Cuantitativa</p>
                {[
                  { label: "Análisis info. secundaria", start: 0, dur: 3 },
                  { label: "Acercamiento institucional", start: 3, dur: 3 },
                  { label: "Definición herramienta", start: 6, dur: 2 },
                  { label: "Aprobación CISAN", start: 8, dur: 2 },
                  { label: "Desarrollo encuesta digital", start: 10, dur: 3 },
                  { label: "Logística y capacitación", start: 13, dur: 3 },
                  { label: "Aplicación encuestas", start: 16, dur: 4 },
                ].map((item, i) => (
                  <div key={i} className="flex items-center h-8 group">
                    <span className="w-[180px] text-xs font-body truncate pr-2 text-foreground shrink-0">{item.label}</span>
                    <div className="flex-1 relative h-6">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(item.dur / 20) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: i * 0.08 }}
                        className="absolute h-full rounded-md bg-primary group-hover:bg-primary/80 transition-colors"
                        style={{ left: `${(item.start / 20) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
                <div className="border-t border-border pt-2 mt-2">
                  <p className="font-heading font-bold text-sm text-secondary mb-2">FASE 2 — Cualitativa</p>
                </div>
                {[
                  { label: "Info. secundaria cualitativa", start: 6, dur: 3 },
                  { label: "Acercamiento actores", start: 9, dur: 4 },
                  { label: "Construcción talleres", start: 13, dur: 2 },
                  { label: "Realización 14 talleres", start: 15, dur: 5 },
                ].map((item, i) => (
                  <div key={`q-${i}`} className="flex items-center h-8 group">
                    <span className="w-[180px] text-xs font-body truncate pr-2 text-foreground shrink-0">{item.label}</span>
                    <div className="flex-1 relative h-6">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(item.dur / 20) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: i * 0.08 }}
                        className="absolute h-full rounded-md bg-secondary group-hover:bg-secondary/80 transition-colors"
                        style={{ left: `${(item.start / 20) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </Section>
      </div>

      {/* ═══ FLUJO DE FASES (from uploaded diagram) ═══ */}
      <Section>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
          <SectionTag icon={<Network size={16} />} label="Sección 13" />
          <SectionTitle>Flujo de Fases y Responsables</SectionTitle>
          <motion.div variants={fadeUp} className="flex flex-col items-center gap-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0">
              {/* Left track */}
              <div className="flex flex-col items-center gap-0">
                <PhaseNode phase="F0" title="Diseño de formulario" team="Ingeniería + Nutrición" color="bg-primary" />
                <PhaseNode phase="F1" title="Aplicación en campo" team="Encuestadores" color="bg-primary" />
                <PhaseNode phase="F1" title="Análisis de datos" team="Ingeniería + Nutrición" color="bg-primary" isLast />
              </div>
              {/* Right track */}
              <div className="flex flex-col items-center gap-0">
                <PhaseNode phase="F0" title="Diseño de talleres" team="Trabajo Social" color="bg-accent" />
                <PhaseNode phase="F1" title="Talleres participativos" team="Trabajo Social + Enlaces" color="bg-accent" />
                <PhaseNode phase="F1" title="Análisis cualitativo" team="Trabajo Social + Género" color="bg-accent" isLast />
              </div>
            </div>
            <div className="w-0.5 h-8 bg-border" />
            <PhaseNode phase="F2" title="Formulación de política" team="Politología + Nutrición" color="bg-primary" />
            <PhaseNode phase="F2" title="Mesas de concertación" team="TODOS + Enlaces" color="bg-primary" />
            <PhaseNode phase="F2" title="Documento final" team="Politología" color="bg-primary" />
            <PhaseNode phase="F3" title="Aprobación Asamblea" team="Politología + Coordinación" color="bg-secondary" />
            <PhaseNode phase="F4" title="Socialización" team="Trabajo Social + Enlaces" color="bg-secondary" />
            <PhaseNode phase="F4" title="Seguimiento inicial" team="Nutrición" color="bg-secondary" />
            <PhaseNode phase="F5" title="Transferencia y cierre" team="Gestión Documental + Ing." color="bg-foreground" isLast />
          </motion.div>
        </motion.div>
      </Section>

      {/* ═══ PERFILES ═══ */}
      <div className="bg-muted/50">
        <Section>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
            <SectionTag icon={<Users size={16} />} label="Sección 14" />
            <SectionTitle>Perfiles del Equipo y Responsabilidades</SectionTitle>
            <motion.div variants={fadeUp} className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="px-4 py-3 text-left font-heading font-semibold rounded-tl-xl">Perfil</th>
                    <th className="px-4 py-3 text-left font-heading font-semibold">F1 Diagnóstico</th>
                    <th className="px-4 py-3 text-left font-heading font-semibold">F2 Formulación</th>
                    <th className="px-4 py-3 text-left font-heading font-semibold rounded-tr-xl">F3 Seguimiento</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Nutrición", "Lidera análisis cuantitativo", "Apoya formulación SAN", "Validación indicadores"],
                    ["Politología", "Análisis institucional", "Lidera formulación", "Transferencia política"],
                    ["Género", "Enfoque diferencial", "Transversalización", "Indicadores de género"],
                    ["Trabajo Social", "Talleres participativos", "Validación comunitaria", "Socialización"],
                    ["Ingeniería", "Plataforma encuestas", "Sistematización", "Soporte técnico"],
                    ["Gestión Documental", "Archivo y trazabilidad", "Edición documento", "Publicación"],
                    ["420 Encuestadores", "Aplicación terreno", "—", "—"],
                  ].map(([p, f1, f2, f3], i) => (
                    <tr key={i} className={`border-b border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/30"} hover:bg-slide-green-light transition-colors`}>
                      <td className="px-4 py-3 font-heading font-semibold text-foreground">{p}</td>
                      <td className="px-4 py-3 text-muted-foreground font-body">{f1}</td>
                      <td className="px-4 py-3 text-muted-foreground font-body">{f2}</td>
                      <td className="px-4 py-3 text-muted-foreground font-body">{f3}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          </motion.div>
        </Section>
      </div>

      {/* ═══ RIESGOS ═══ */}
      <Section id="riesgos">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
          <SectionTag icon={<Shield size={16} />} label="Sección 15" />
          <SectionTitle>Riesgos y Mitigación</SectionTitle>
          <motion.div variants={fadeUp} className="space-y-3 mb-6">
            {[
              { risk: "Consensos difíciles entre actores", prob: "Alta", impact: "Alto", mit: "Diálogos interculturales previos" },
              { risk: "Cambios políticos institucionales", prob: "Moderada", impact: "Alto", mit: "Trazabilidad con actas formales" },
              { risk: "Baja participación comunidades", prob: "Moderada", impact: "Alto", mit: "Convocatoria anticipada (15 días)" },
              { risk: "Retrasos en contratación", prob: "Alta", impact: "Medio", mit: "Gestión anticipada desde enero" },
              { risk: "Dificultades logísticas rurales", prob: "Alta", impact: "Medio", mit: "Coordinación con alcaldías" },
            ].map((r, i) => (
              <motion.div key={i} variants={fadeUp} className="bg-card rounded-xl border border-border p-4 flex flex-col md:flex-row md:items-center gap-3 hover:shadow-md transition-shadow">
                <div className="flex-1">
                  <p className="font-heading font-semibold text-sm text-foreground">{r.risk}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className={`px-3 py-1 rounded-full text-xs font-heading font-bold ${r.prob === "Alta" ? "bg-secondary/10 text-secondary" : "bg-accent/20 text-accent-foreground"}`}>
                    {r.prob}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-heading font-bold ${r.impact === "Alto" ? "bg-secondary/10 text-secondary" : "bg-accent/20 text-accent-foreground"}`}>
                    {r.impact}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground font-body md:max-w-[200px]">✅ {r.mit}</p>
              </motion.div>
            ))}
          </motion.div>
          <div className="bg-slide-green-light rounded-xl px-6 py-4 flex items-center gap-3">
            <span className="text-xl">🔄</span>
            <span className="text-sm font-body"><strong>Monitoreo quincenal</strong> en Comité Técnico</span>
          </div>
          <AIBadge text="Alertas predictivas de riesgo con IA" detail="Sistema de monitoreo continuo que analiza indicadores de riesgo (participación en reuniones, cumplimiento de hitos, cambios institucionales) y genera alertas predictivas al Comité Técnico cuando la probabilidad de materialización de un riesgo supera el 60%." />
        </motion.div>
      </Section>

      {/* ═══ INDICADORES ═══ */}
      <div className="bg-muted/50">
        <Section>
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
            <SectionTag icon={<TrendingUp size={16} />} label="Sección 16" />
            <SectionTitle>Indicadores de Éxito</SectionTitle>
            <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <StatCard value="≥90%" label="Actividades Ejecutadas" icon={<BarChart3 size={24} />} />
              <StatCard value="100%" label="Entregables Aprobados" icon={<Target size={24} />} color="bg-primary" />
              <StatCard value="42/42" label="Cobertura Municipal" icon={<MapPin size={24} />} />
              <StatCard value="→1.8%" label="Inseg. Grave (Meta)" icon={<TrendingUp size={24} />} color="bg-secondary" />
            </motion.div>
            <motion.div variants={fadeUp} className="bg-accent/20 border border-accent rounded-xl px-6 py-4 text-center">
              <p className="text-sm font-body">📈 Indicadores de <strong>corto, mediano y largo plazo</strong> integrados en la política pública</p>
            </motion.div>
            <div className="text-center"><AIBadge text="Dashboard IA para métricas en tiempo real" detail="Panel de control ejecutivo con KPIs actualizados automáticamente: porcentaje de municipios cubiertos, tasa de ejecución presupuestal, avance por fase, y semáforos de alerta temprana para cada indicador de éxito." /></div>
          </motion.div>
        </Section>
      </div>

      {/* ═══ COMUNICACIÓN ═══ */}
      <Section>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
          <SectionTag icon={<MessageSquare size={16} />} label="Sección 17" />
          <SectionTitle>Protocolo de Comunicación</SectionTitle>
          <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-heading font-bold text-lg mb-4">Reuniones</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4 bg-card border border-border rounded-xl p-4">
                  <div className="w-14 h-14 rounded-xl bg-primary flex items-center justify-center shrink-0">
                    <span className="text-primary-foreground font-heading font-bold text-sm">2x/mes</span>
                  </div>
                  <div>
                    <p className="font-heading font-bold text-sm">Comité Técnico</p>
                    <p className="text-xs text-muted-foreground">Seguimiento quincenal</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 bg-card border border-border rounded-xl p-4">
                  <div className="w-14 h-14 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    <span className="text-primary-foreground font-heading font-bold text-sm">1x/mes</span>
                  </div>
                  <div>
                    <p className="font-heading font-bold text-sm">CISAN</p>
                    <p className="text-xs text-muted-foreground">Comité Intersectorial</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <h3 className="font-heading font-bold text-lg mb-4">Canales Digitales</h3>
              <div className="space-y-3">
                {[
                  { tool: "Microsoft Teams", use: "Comunicación diaria" },
                  { tool: "SharePoint", use: "Repositorio documental" },
                  { tool: "Correo Institucional", use: "Comunicaciones formales" },
                  { tool: "Actas Digitales", use: "Registro decisiones" },
                ].map((c, i) => (
                  <div key={i} className="flex items-center gap-3 bg-slide-green-light rounded-xl px-4 py-3">
                    <span className="font-heading font-bold text-xs text-primary min-w-[120px]">{c.tool}</span>
                    <span className="text-xs text-foreground font-body">{c.use}</span>
                  </div>
                ))}
              </div>
              <AIBadge text="Chatbots para reportes semanales" detail="Implementar un asistente conversacional en Teams que genere automáticamente reportes semanales de avance, permita consultar el estado de cualquier actividad y envíe recordatorios inteligentes de compromisos pendientes a cada miembro del equipo." />
            </div>
          </motion.div>
        </motion.div>
      </Section>

      {/* ═══ CONCLUSIÓN ═══ */}
      <div className="bg-foreground text-primary-foreground py-20">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
            <SectionTag icon={<Flag size={16} />} label="Sección 18" />
            <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-primary-foreground mb-8">
              Conclusión y Siguientes Pasos
            </h2>
            <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              {[
                { num: "1", title: "Contratación Equipo", time: "Febrero 2026", color: "bg-primary" },
                { num: "2", title: "Alistamiento", time: "Feb — Mar 2026", color: "bg-accent" },
                { num: "3", title: "Diagnóstico", time: "Mar — Jun 2026", color: "bg-secondary" },
              ].map((s, i) => (
                <motion.div key={i} variants={scaleIn} className={`${s.color} text-primary-foreground rounded-2xl p-6 text-center shadow-xl`}>
                  <div className="w-12 h-12 rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-3">
                    <span className="font-heading font-black text-xl">{s.num}</span>
                  </div>
                  <h3 className="font-heading font-bold text-lg mb-1">{s.title}</h3>
                  <p className="text-sm opacity-80">{s.time}</p>
                </motion.div>
              ))}
            </motion.div>
            <motion.div variants={fadeUp} className="bg-primary-foreground/10 border border-primary-foreground/20 rounded-2xl px-8 py-6 text-center">
              <p className="font-heading font-bold text-xl text-primary-foreground">
                🏛️ Meta: Aprobación en Asamblea Departamental — Diciembre 2026 a Febrero 2027
              </p>
              <p className="text-primary-foreground/60 text-sm mt-2 font-body">
                Iniciar en febrero 2026 es crítico para cumplir el cronograma establecido
              </p>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <ReportFooter />
    </div>
  );
};

export default InteractiveReport;
