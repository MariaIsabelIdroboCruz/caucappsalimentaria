import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronDown, Brain, BarChart3, Users, Target, MapPin, Shield,
  Flag, Calendar, FileText, Lightbulb, TrendingUp, Database, Cpu,
  Network, Sparkles, X, Activity, ClipboardList, Clock, BookOpen,
  Scale, Globe, Layers, CheckCircle2, AlertTriangle, ArrowRight,
} from "lucide-react";
import heroCauca from "@/assets/hero-cauca-report.jpg";
import escudoCauca from "@/assets/escudo-cauca.png";
import secretariaLogo from "@/assets/secretaria-agricultura.png";
import ReportHeader from "./ReportHeader";
import ReportFooter from "./ReportFooter";
import CaucaMap from "./CaucaMap";
import GanttChart from "./GanttChart";

// ─── Animation variants ────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const stagger = { visible: { transition: { staggerChildren: 0.12 } } };
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
    {icon}{label}
  </div>
);

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="font-heading font-extrabold text-3xl md:text-4xl text-foreground mb-3 leading-tight">{children}</h2>
);

const SectionSummary: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-muted-foreground font-body text-base leading-relaxed mb-8 max-w-3xl border-l-4 border-primary/30 pl-4">
    {children}
  </p>
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
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="mt-2 bg-accent/10 border border-accent/30 rounded-xl p-4 text-sm font-body text-foreground relative">
              <button onClick={() => setOpen(false)} className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"><X size={14} /></button>
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
    <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-primary-foreground mb-4`}>{icon}</div>
    <p className="font-heading font-black text-3xl text-foreground">{value}</p>
    <p className="text-muted-foreground text-sm mt-1 font-body">{label}</p>
  </motion.div>
);

const HeroStat: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <motion.div variants={scaleIn} className="text-center px-4 py-3">
    <p className="font-heading font-black text-3xl md:text-4xl text-primary">{value}</p>
    <p className="text-muted-foreground text-xs md:text-sm mt-1 font-body">{label}</p>
  </motion.div>
);

const Accordion: React.FC<{ title: string; icon?: React.ReactNode; children: React.ReactNode; defaultOpen?: boolean; accent?: string }> = ({ title, icon, children, defaultOpen = false, accent = "border-primary/30" }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className={`bg-card rounded-2xl border border-border overflow-hidden shadow-sm border-l-4 ${accent}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-6 py-4 hover:bg-muted/50 transition-colors">
        <div className="flex items-center gap-3">
          {icon && <span className="text-primary">{icon}</span>}
          <span className="font-heading font-bold text-lg text-foreground">{title}</span>
        </div>
        <ChevronDown size={20} className={`text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
            <div className="px-6 pb-6 border-t border-border pt-4">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── MAIN COMPONENT ─────────────────────────────
const InteractiveReport: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <ReportHeader />

      {/* ═══ 1. HERO / PORTADA ═══ */}
      <section id="hero" className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        <img src={heroCauca} alt="Cauca" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/75 to-foreground/20" />
        <motion.div initial="hidden" animate="visible" variants={stagger} className="relative z-10 text-center px-6 max-w-5xl">
          <motion.div variants={fadeUp} className="flex items-center justify-center gap-8 mb-10">
            <img src={escudoCauca} alt="Escudo Cauca" className="h-16 md:h-20 w-auto drop-shadow-lg" />
            <img src={secretariaLogo} alt="Secretaría Agricultura" className="h-16 md:h-20 w-auto drop-shadow-lg" />
          </motion.div>
          <motion.div variants={fadeUp} className="h-1 w-24 bg-primary rounded mx-auto mb-6" />
          <motion.h1 variants={fadeUp} className="font-heading font-black text-4xl md:text-6xl text-primary-foreground leading-tight mb-6">
            Construcción de la Política Pública de{" "}
            <span className="text-accent">Seguridad y Soberanía Alimentaria</span>{" "}
            en el Cauca
          </motion.h1>
          <motion.p variants={fadeUp} className="text-xl text-primary-foreground/80 font-body mb-4">
            Plan de Acción Pre-Fases y Cronograma de Implementación
          </motion.p>
          <motion.p variants={fadeUp} className="text-sm text-primary-foreground/60 font-body mb-8">
            Secretaría de Agricultura y Desarrollo Rural · Febrero 2026
          </motion.p>
          <motion.div variants={fadeUp} className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <span className="bg-primary text-primary-foreground px-5 py-2 rounded-full font-heading font-semibold text-sm shadow-md">Febrero 2026 — Enero 2027</span>
            <span className="bg-secondary text-primary-foreground px-5 py-2 rounded-full font-heading font-semibold text-sm shadow-md">Fase III — Factibilidad</span>
            <span className="bg-accent text-accent-foreground px-5 py-2 rounded-full font-heading font-semibold text-sm shadow-md">$943.381.615</span>
          </motion.div>
          <motion.div variants={fadeUp}>
            <a
              href="#cifras-clave"
              className="inline-flex items-center gap-3 bg-primary/20 backdrop-blur-md border border-primary/50 text-primary-foreground px-8 py-3 rounded-full font-heading font-bold text-base hover:bg-primary/40 transition-all shadow-lg hover:shadow-primary/30"
            >
              <Sparkles size={18} className="text-accent" />
              Explorar con IA
              <ChevronDown size={18} className="animate-bounce" />
            </a>
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ CIFRAS CLAVE ═══ */}
      <div id="cifras-clave" className="bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.p variants={fadeUp} className="text-center font-heading font-bold text-sm uppercase tracking-widest text-primary mb-8">
              Cifras Clave del Proyecto
            </motion.p>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 divide-x divide-border">
              <HeroStat value="7,560" label="Encuestas totales" />
              <HeroStat value="420" label="Encuestadores" />
              <HeroStat value="9" label="Zonas operativas" />
              <HeroStat value="12" label="Meses de duración" />
              <HeroStat value="42" label="Municipios" />
              <HeroStat value="466K" label="Personas objetivo" />
              <HeroStat value="20" label="Talleres diferenciales" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* ═══ 2. CONTEXTO ═══ */}
      <Section id="contexto">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
          <SectionTag icon={<FileText size={16} />} label="Sección 2 — Contexto del Proyecto" />
          <SectionTitle>Contexto del Proyecto</SectionTitle>
          <SectionSummary>
            Visión general del proyecto: objetivo general, presupuesto total de $943.381.615, duración de 12 meses (Feb 2026–Ene 2027), Fase III (Factibilidad), con enfoque diferencial por ciclos de vida, género, étnico y campesino.
          </SectionSummary>
          <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-heading font-bold text-lg text-foreground mb-3 flex items-center gap-2">
                <Target size={18} className="text-primary" /> Objetivo General
              </h3>
              <p className="text-muted-foreground font-body leading-relaxed text-sm">
                Generar una estrategia para la garantía progresiva del Derecho Humano a la Alimentación Adecuada en el Departamento del Cauca, mediante un diagnóstico participativo, la formulación de la política pública y su seguimiento institucional, con enfoque diferencial étnico, de género, ciclo de vida y campesino.
              </p>
            </div>
            <div className="bg-card rounded-2xl border border-border p-6">
              <h3 className="font-heading font-bold text-lg text-foreground mb-3 flex items-center gap-2">
                <Users size={18} className="text-primary" /> Enfoques Diferenciales
              </h3>
              <div className="flex flex-wrap gap-2 mb-4">
                {["Ciclos de Vida", "Género", "Étnico", "Campesino"].map(e => (
                  <span key={e} className="bg-slide-green-light text-primary px-4 py-2 rounded-full font-heading font-semibold text-sm">{e}</span>
                ))}
              </div>
              <p className="text-xs text-muted-foreground font-body">
                Articulación Nación – Departamento – Municipios con cobertura urbana y rural.
              </p>
              <AIBadge text="Modelos predictivos para monitorear avances" detail="Implementar modelos de series temporales (ARIMA/Prophet) con datos DANE para proyectar indicadores de inseguridad alimentaria por subregión, generando alertas tempranas cuando se identifiquen tendencias de deterioro y permitiendo ajustar las intervenciones en tiempo real." />
            </div>
          </motion.div>
        </motion.div>
      </Section>

      {/* ═══ 3. ANTECEDENTES ═══ */}
      <div className="bg-muted/50">
        <Section id="antecedentes">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
            <SectionTag icon={<Database size={16} />} label="Sección 3 — Antecedentes" />
            <SectionTitle>Antecedentes</SectionTitle>
            <SectionSummary>
              Contexto histórico de inseguridad alimentaria en el Cauca, basado en datos del DANE, brechas rurales/étnicas y la contribución de este proceso a la construcción de política pública departamental.
            </SectionSummary>
            <motion.div variants={fadeUp} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {[
                  { icon: "📊", text: "El Cauca registra inseguridad alimentaria grave en el 2,8% de su población, con marcadas brechas entre zonas urbanas y rurales (DANE 2023)." },
                  { icon: "🌿", text: "Las comunidades étnicas e indígenas presentan mayor vulnerabilidad, con acceso limitado a alimentos nutritivos y a servicios de salud nutricional." },
                  { icon: "🏛️", text: "Históricamente, las acciones institucionales han sido fragmentadas y sin política pública departamental que las articule bajo una visión de largo plazo." },
                  { icon: "📋", text: "La construcción de esta política pública responde al Plan de Desarrollo Departamental 2024-2027 'La Fuerza del Pueblo', meta 149, y a los compromisos internacionales ODS 2." },
                ].map((item, i) => (
                  <motion.div key={i} variants={fadeUp} className="flex items-start gap-4 bg-card rounded-xl border border-border p-4">
                    <span className="text-2xl shrink-0">{item.icon}</span>
                    <p className="text-foreground font-body text-sm leading-relaxed">{item.text}</p>
                  </motion.div>
                ))}
              </div>
              <div className="space-y-4">
                <motion.div variants={scaleIn} className="bg-secondary/10 border-l-4 border-secondary rounded-r-2xl p-6">
                  <p className="font-heading font-bold text-secondary text-lg mb-2">⚠ Alerta Departamental</p>
                  <p className="text-foreground font-body text-sm leading-relaxed">
                    Sin política pública articulada, las acciones permanecen aisladas y sin seguimiento sistemático. La meta es reducir la inseguridad alimentaria grave del <strong>2,8% al 1,8%</strong> mediante intervenciones territoriales diferenciadas.
                  </p>
                </motion.div>
                <motion.div variants={scaleIn} className="bg-primary/5 border border-primary/20 rounded-2xl p-6">
                  <h4 className="font-heading font-bold text-foreground mb-3">Contribución a Política Pública</h4>
                  <ul className="space-y-2 text-sm font-body text-muted-foreground">
                    <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span>Línea de base territorial con metodología FIES/CARI</li>
                    <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span>Diagnóstico participativo con 9 zonas operativas</li>
                    <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span>Articulación con CDSAN y Asamblea Departamental</li>
                    <li className="flex items-start gap-2"><span className="text-primary mt-1">•</span>Marco técnico para ordenanza departamental SAN</li>
                  </ul>
                </motion.div>
                <AIBadge text="IA para análisis geo-espacial de brechas" detail="Utilizar modelos de clustering geoespacial (K-means sobre datos GPS de hogares encuestados) para identificar zonas de alta concentración de inseguridad alimentaria dentro de cada subregión, combinando capas de datos DANE con imágenes satelitales de cobertura agrícola para priorizar intervenciones." />
              </div>
            </motion.div>
          </motion.div>
        </Section>
      </div>

      {/* ═══ 4. JUSTIFICACIÓN Y MARCO NORMATIVO ═══ */}
      <Section id="marco">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
          <SectionTag icon={<Scale size={16} />} label="Sección 4 — Justificación y Marco Normativo" />
          <SectionTitle>Justificación y Marco Normativo Ampliado</SectionTitle>
          <SectionSummary>
            Fundamento legal, constitucional e internacional que respalda la formulación de la política pública de seguridad y soberanía alimentaria en el Departamento del Cauca.
          </SectionSummary>

          {/* Justificación */}
          <motion.div variants={fadeUp} className="bg-primary/5 border border-primary/20 rounded-2xl p-6 mb-6">
            <h3 className="font-heading font-bold text-xl text-primary mb-4 flex items-center gap-2">
              <Lightbulb size={20} /> Justificación
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                "Alineación directa con el Plan de Desarrollo Departamental 2024-2027 'La Fuerza del Pueblo' (meta 149).",
                "Cumplimiento progresivo del Derecho Humano a la Alimentación Adecuada.",
                "Articulación con lineamientos internacionales del PMA y FAO (metodologías CARI, FIES, Directrices Voluntarias 2004).",
                "Respuesta a las realidades territoriales del Cauca con enfoque diferencial (étnico, de género, ciclos de vida y campesino).",
                "Fortalecimiento de la producción local y reducción de la inseguridad alimentaria grave (de 2,8% a 1,8% según línea base).",
                "Alcance: garantizar progresivamente el Derecho Humano a la Alimentación Adecuada con cobertura urbana y rural.",
              ].map((t, i) => (
                <div key={i} className="flex items-start gap-3 text-sm font-body text-foreground">
                  <CheckCircle2 size={16} className="text-primary mt-0.5 shrink-0" />
                  <span>{t}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Accordions Marco */}
          <motion.div variants={stagger} className="space-y-3">
            <Accordion title="3.1 Fundamento Constitucional" icon={<BookOpen size={18} />} defaultOpen={true} accent="border-primary/30">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { art: "Art. 65", desc: "Protección especial a la producción de alimentos y desarrollo agropecuario." },
                  { art: "Art. 64", desc: "Acceso progresivo a la tierra y servicios rurales." },
                  { art: "Art. 49", desc: "Salud como derecho fundamental — incluye control sanitario de alimentos." },
                  { art: "Art. 366", desc: "Bienestar general y mejora de la calidad de vida — prioriza nutrición." },
                ].map((a, i) => (
                  <div key={i} className="bg-slide-green-light rounded-xl p-4 flex gap-3">
                    <span className="font-heading font-black text-primary text-sm min-w-[60px]">{a.art}</span>
                    <span className="text-sm font-body text-foreground">{a.desc}</span>
                  </div>
                ))}
              </div>
            </Accordion>

            <Accordion title="3.2 Marco Legal Nacional" icon={<Scale size={18} />} accent="border-secondary/30">
              <div className="space-y-2">
                {[
                  { norm: "Ley 2294/2023", desc: "Plan Nacional de Desarrollo 2022-2026: Sistema Nacional para la Garantía Progresiva del DHA." },
                  { norm: "Ley 2046/2020", desc: "Participación de pequeños productores en compras públicas." },
                  { norm: "Ley 2120/2021", desc: "Entornos alimentarios saludables y etiquetado frontal." },
                  { norm: "Ley 101/1993", desc: "Desarrollo agropecuario y pesquero." },
                  { norm: "Ley 9/1979", desc: "Código Sanitario Nacional." },
                  { norm: "Ley 2536/2025", desc: "Medidas estructurales contra el hambre." },
                  { norm: "Ley 100/1993", desc: "Sistema de Seguridad Social Integral (nutrición y salud)." },
                  { norm: "CONPES 113/2008", desc: "Política Nacional de Seguridad Alimentaria y Nutricional." },
                ].map((n, i) => (
                  <div key={i} className="flex items-center gap-3 bg-muted rounded-xl px-4 py-3 hover:bg-slide-green-light transition-colors">
                    <span className="font-heading font-bold text-sm text-primary min-w-[130px]">{n.norm}</span>
                    <span className="text-sm text-foreground font-body">{n.desc}</span>
                  </div>
                ))}
              </div>
            </Accordion>

            <Accordion title="3.3 Marco Internacional" icon={<Globe size={18} />} accent="border-accent/40">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { org: "PIDESC – Art. 11", desc: "Derecho a una alimentación adecuada como derecho económico, social y cultural." },
                  { org: "Directrices FAO (2004)", desc: "Directrices Voluntarias sobre el Derecho a la Alimentación y Marco Estratégico Mundial CFS." },
                  { org: "PMA", desc: "Mandato humanitario con principios de neutralidad e imparcialidad en seguridad alimentaria." },
                  { org: "ODS 2 — Hambre Cero", desc: "Agenda 2030 para el Desarrollo Sostenible — Meta 2.1 y 2.2." },
                ].map((n, i) => (
                  <div key={i} className="bg-accent/10 rounded-xl p-4 border border-accent/20">
                    <p className="font-heading font-bold text-sm text-accent-foreground mb-1">{n.org}</p>
                    <p className="text-xs font-body text-muted-foreground">{n.desc}</p>
                  </div>
                ))}
              </div>
            </Accordion>

            <Accordion title="3.4 Marco Territorial del Cauca" icon={<MapPin size={18} />} accent="border-primary/30">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { doc: "Plan Desarrollo 2024-2027", desc: "'La Fuerza del Pueblo' — Meta 149: Formulación política pública SAN." },
                  { doc: "POD del Cauca", desc: "Plan de Ordenamiento Departamental con enfoque territorial diferencial." },
                ].map((d, i) => (
                  <div key={i} className="bg-slide-green-light rounded-xl p-4">
                    <p className="font-heading font-bold text-sm text-primary mb-1">{d.doc}</p>
                    <p className="text-xs font-body text-foreground">{d.desc}</p>
                  </div>
                ))}
              </div>
            </Accordion>
          </motion.div>
          <div className="mt-4">
            <AIBadge text="Compliance legal automatizado" detail="Implementar un sistema de verificación automática que mapee cada actividad del plan de acción contra el marco normativo (Ley 715, CONPES 113, PMA-FAO), generando reportes de cumplimiento en tiempo real y alertando sobre desviaciones normativas antes de que se materialicen." />
          </div>
        </motion.div>
      </Section>

      {/* ═══ 5. POBLACIÓN OBJETIVO – 9 ZONAS ═══ */}
      <div className="bg-muted/50">
        <Section id="poblacion">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
            <SectionTag icon={<MapPin size={16} />} label="Sección 5 — Población Objetivo" />
            <SectionTitle>Población Objetivo — 7 Subregiones / 9 Zonas</SectionTitle>
            <SectionSummary>
              Se intervendrán las 7 subregiones del Cauca, organizadas en 9 zonas operativas para facilitar la ejecución de 1 taller diferencial por zona. Haz clic en cada zona del mapa para ver municipios y actores a convocar.
            </SectionSummary>
            <motion.div variants={stagger} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <StatCard value="1.59M" label="Población Afectada" icon={<Users size={24} />} />
              <StatCard value="466K" label="Con Inseg. Alimentaria" icon={<AlertTriangle size={24} />} color="bg-secondary" />
              <StatCard value="9" label="Zonas Operativas" icon={<Layers size={24} />} />
              <StatCard value="20" label="Talleres Participativos" icon={<Users size={24} />} color="bg-accent" />
            </motion.div>
            <motion.div variants={fadeUp}>
              <CaucaMap />
            </motion.div>
          </motion.div>
        </Section>
      </div>

      {/* ═══ 6. CRONOGRAMA GANTT ═══ */}
      <Section id="cronograma">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
          <SectionTag icon={<Calendar size={16} />} label="Sección 6 — Cronograma" />
          <SectionTitle>Cronograma Detallado — Actividad 1: Diagnóstico (4 meses)</SectionTitle>
          <SectionSummary>
            Gantt interactivo con las tres fases del diagnóstico: Primera Fase Cuantitativa, Segunda Fase Cualitativa y Tercera Fase de Procesamiento. Pasa el cursor sobre las barras para ver fechas y actores.
          </SectionSummary>
          <GanttChart />
        </motion.div>
      </Section>

      {/* ═══ 7. EQUIPO Y RESPONSABILIDADES ═══ */}
      <div className="bg-muted/50">
        <Section id="equipo">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
            <SectionTag icon={<Users size={16} />} label="Sección 7 — Equipo y Responsabilidades" />
            <SectionTitle>Perfiles del Equipo y Responsabilidades</SectionTitle>
            <SectionSummary>
              Matriz de perfiles profesionales asignados a cada fase del proyecto, con dedicación horaria y responsabilidades clave para garantizar la ejecución técnica del diagnóstico y la política pública.
            </SectionSummary>
            <motion.div variants={fadeUp} className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-primary text-primary-foreground">
                    <th className="px-4 py-3 text-left font-heading font-semibold rounded-tl-xl">Perfil</th>
                    <th className="px-4 py-3 text-left font-heading font-semibold">Fase(s)</th>
                    <th className="px-4 py-3 text-left font-heading font-semibold">Responsabilidades Clave</th>
                    <th className="px-4 py-3 text-center font-heading font-semibold rounded-tr-xl">Dedicación</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Politólogo/a – Coordinador/a", "0, 1, 2, 3", "Liderazgo técnico, articulación institucional, coordinación CDSAN", "100%"],
                    ["Nutricionista/Dietista", "1, 2", "Diseño y validación de instrumento de encuesta FIES/CARI, análisis alimentario", "100%"],
                    ["Profesional Enfoque Género", "1, 2", "Transversalización género en metodología, talleres diferenciales, análisis cualitativo", "50%"],
                    ["Trabajador/a Social", "1, 2", "Acercamiento comunitario, facilitación talleres, relatorías y sistematización", "100%"],
                    ["Ingeniero/a de Sistemas", "1, 3", "Diseño encuesta digital, bases de datos, procesamiento estadístico y geoespacial", "100%"],
                    ["Gestión Documental", "0, 2, 3", "Organización archivo técnico, redacción informe diagnóstico, gestión documental", "50%"],
                    ["Enlace Étnico-Afro", "1, 2", "Acercamiento consejos comunitarios, facilitación talleres Pacífico y Norte", "100%"],
                    ["Enlace Indígena", "1, 2", "Articulación con cabildos, facilitación talleres zonas indígenas", "100%"],
                    ["Enlace Campesino", "1, 2", "Coordinación con organizaciones campesinas en 9 zonas", "100%"],
                    ["420 Encuestadores", "1 – Cuantitativa", "Aplicación de 7.560 encuestas en 42 municipios del Cauca", "Por evento"],
                  ].map(([perfil, fase, resp, ded], i) => (
                    <tr key={i} className={`border-b border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/30"} hover:bg-slide-green-light transition-colors`}>
                      <td className="px-4 py-3 font-heading font-semibold text-foreground">{perfil}</td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {fase.split(", ").map(f => (
                            <span key={f} className="bg-primary/10 text-primary px-2 py-0.5 rounded-full text-xs font-heading font-semibold">F{f}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground font-body text-xs">{resp}</td>
                      <td className="px-4 py-3 text-center font-heading font-bold text-primary text-sm">{ded}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
            <AIBadge text="IA para coordinación y optimización de equipo" detail="Usar algoritmos de optimización de recursos para asignar perfiles profesionales a las 9 zonas, considerando expertise, disponibilidad y carga de trabajo, maximizando la cobertura territorial y minimizando tiempos de desplazamiento." />
          </motion.div>
        </Section>
      </div>

      {/* ═══ 8. RIESGOS Y MITIGACIÓN ═══ */}
      <Section id="riesgos">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
          <SectionTag icon={<Shield size={16} />} label="Sección 8 — Riesgos y Mitigación" />
          <SectionTitle>Riesgos y Mitigación</SectionTitle>
          <SectionSummary>
            Identificación de los principales riesgos operativos, técnicos e institucionales del proyecto, con sus respectivas medidas de mitigación para garantizar la ejecución exitosa.
          </SectionSummary>
          <motion.div variants={fadeUp} className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-secondary text-primary-foreground">
                  <th className="px-4 py-3 text-left font-heading font-semibold rounded-tl-xl">#</th>
                  <th className="px-4 py-3 text-left font-heading font-semibold">Riesgo</th>
                  <th className="px-4 py-3 text-center font-heading font-semibold">Probabilidad</th>
                  <th className="px-4 py-3 text-center font-heading font-semibold">Impacto</th>
                  <th className="px-4 py-3 text-left font-heading font-semibold rounded-tr-xl">Medida de Mitigación</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["1", "Restricciones de acceso territorial por orden público", "Alta", "Alto", "Coordinación con autoridades locales, rutas alternas, protocolos de seguridad"],
                  ["2", "Baja participación comunitaria en talleres", "Media", "Alto", "Acercamiento previo con líderes, convocatoria con 15 días de anticipación, incentivos simbólicos"],
                  ["3", "Demoras en contratación de encuestadores (420)", "Media", "Alto", "Proceso de selección iniciado en Feb 2026, banco de hojas de vida preaprobadas"],
                  ["4", "Problemas técnicos en encuesta digital", "Baja", "Medio", "Prueba piloto en 2 municipios, versión offline disponible, soporte técnico permanente"],
                  ["5", "Resistencia institucional al proceso", "Media", "Medio", "Acercamiento institucional previo (ICBF, ICA, Secretarías), socialización plan de acción"],
                  ["6", "Presupuesto insuficiente para logística en zona Pacífico", "Alta", "Alto", "Presupuesto diferenciado para zonas de difícil acceso, gestión con PMA/FAO"],
                  ["7", "Incumplimiento de plazos en fases", "Media", "Alto", "Cronograma con holguras, reuniones semanales de seguimiento, alertas tempranas CDSAN"],
                  ["8", "Pérdida o deterioro de datos de encuesta", "Baja", "Alto", "Respaldo automático en nube, validación diaria, supervisión campo permanente"],
                  ["9", "Cambios en la administración departamental", "Baja", "Alto", "Ordenanza que institucionalice el proceso, transferencia metodológica documentada"],
                  ["10", "Fatiga participativa en comunidades", "Media", "Medio", "Rotación de metodologías, talleres de máximo 4 horas, resultados devueltos a comunidades"],
                ].map(([num, riesgo, prob, imp, mit], i) => {
                  const probColor = prob === "Alta" ? "text-secondary bg-secondary/10" : prob === "Media" ? "text-accent-foreground bg-accent/20" : "text-primary bg-primary/10";
                  const impColor = imp === "Alto" ? "text-secondary bg-secondary/10" : imp === "Medio" ? "text-accent-foreground bg-accent/20" : "text-primary bg-primary/10";
                  return (
                    <tr key={i} className={`border-b border-border ${i % 2 === 0 ? "bg-card" : "bg-muted/30"} hover:bg-slide-red-light transition-colors`}>
                      <td className="px-4 py-3 font-heading font-bold text-muted-foreground">{num}</td>
                      <td className="px-4 py-3 font-body text-foreground text-xs">{riesgo}</td>
                      <td className="px-4 py-3 text-center"><span className={`px-2 py-1 rounded-full text-xs font-heading font-semibold ${probColor}`}>{prob}</span></td>
                      <td className="px-4 py-3 text-center"><span className={`px-2 py-1 rounded-full text-xs font-heading font-semibold ${impColor}`}>{imp}</span></td>
                      <td className="px-4 py-3 text-muted-foreground font-body text-xs">{mit}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </motion.div>
          <AIBadge text="Sistema IA de alertas tempranas de riesgos" detail="Implementar un sistema de monitoreo en tiempo real que cruce datos de avance semanal con umbrales predefinidos por riesgo, generando alertas automáticas al coordinador y al CDSAN cuando se detecten desviaciones que puedan comprometer el cronograma o la calidad del diagnóstico." />
        </motion.div>
      </Section>

      {/* ═══ 9. INDICADORES DE ÉXITO ═══ */}
      <div className="bg-muted/50">
        <Section id="indicadores">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
            <SectionTag icon={<TrendingUp size={16} />} label="Sección 9 — Indicadores de Éxito" />
            <SectionTitle>Indicadores de Éxito</SectionTitle>
            <SectionSummary>
              Métricas clave para el seguimiento y evaluación del proyecto, alineadas con los objetivos específicos del diagnóstico participativo, la formulación de la política y su transferencia institucional.
            </SectionSummary>
            <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {[
                { num: "01", label: "Encuestas aplicadas", meta: "7.560", actual: "0", pct: 0, icon: <ClipboardList size={20} />, color: "bg-primary" },
                { num: "02", label: "Talleres diferenciales realizados", meta: "9 / 9", actual: "0", pct: 0, icon: <Users size={20} />, color: "bg-secondary" },
                { num: "03", label: "Municipios cubiertos con diagnóstico", meta: "42 / 42", actual: "0", pct: 0, icon: <MapPin size={20} />, color: "bg-primary" },
                { num: "04", label: "Inseguridad alimentaria grave (meta)", meta: "1,8%", actual: "2,8% (línea base)", pct: 64, icon: <Target size={20} />, color: "bg-secondary" },
                { num: "05", label: "Informe diagnóstico aprobado por CDSAN", meta: "1 informe", actual: "En proceso", pct: 10, icon: <FileText size={20} />, color: "bg-accent" },
                { num: "06", label: "Documento técnico política pública", meta: "1 documento", actual: "Pendiente fase 2", pct: 0, icon: <BookOpen size={20} />, color: "bg-primary" },
                { num: "07", label: "Actores participantes en talleres", meta: "≥900 personas", actual: "0", pct: 0, icon: <Users size={20} />, color: "bg-secondary" },
                { num: "08", label: "Ejecución presupuestal", meta: "≥90%", actual: "0%", pct: 0, icon: <BarChart3 size={20} />, color: "bg-accent" },
              ].map((ind, i) => (
                <motion.div key={i} variants={fadeUp} className="bg-card rounded-2xl border border-border p-5 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4 mb-3">
                    <div className={`w-10 h-10 ${ind.color} rounded-xl flex items-center justify-center text-primary-foreground shrink-0`}>
                      {ind.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline justify-between gap-2 mb-1">
                        <p className="font-heading font-bold text-sm text-foreground">{ind.label}</p>
                        <span className="font-heading font-black text-lg text-primary shrink-0">{ind.meta}</span>
                      </div>
                      <p className="text-xs text-muted-foreground font-body">Estado: {ind.actual}</p>
                    </div>
                  </div>
                  <div className="bg-border rounded-full h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${ind.pct}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.1 }}
                      className={`h-full ${ind.color} rounded-full`}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 text-right font-heading font-semibold">{ind.pct}%</p>
                </motion.div>
              ))}
            </motion.div>
            <div className="mt-4 text-center">
              <AIBadge text="Dashboard IA de seguimiento en tiempo real" detail="Integrar un dashboard automatizado que consolide los indicadores del proyecto con fuentes de datos en tiempo real (encuestas digitales, asistencia a talleres, geolocalización de encuestadores), generando reportes automáticos para el CDSAN con visualizaciones interactivas de avance por zona." />
            </div>
          </motion.div>
        </Section>
      </div>

      {/* ═══ 10. CONCLUSIÓN Y SIGUIENTES PASOS ═══ */}
      <div className="bg-primary/5 border-y-4 border-primary">
        <Section id="conclusion">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={stagger}>
            <SectionTag icon={<Flag size={16} />} label="Sección 10 — Conclusión y Siguientes Pasos" />
            <SectionTitle>🎯 Conclusión y Siguientes Pasos</SectionTitle>
            <SectionSummary>
              Orden de ejecución: Contratación → Alistamiento → Diagnóstico. El proyecto está listo para iniciar en febrero 2026. Se requiere la activación inmediata del equipo y la coordinación con el CDSAN.
            </SectionSummary>

            {/* Pasos */}
            <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
              {[
                {
                  paso: "Paso 1",
                  titulo: "Contratación del Equipo",
                  tiempo: "Febrero 2026 — Semana 1-2",
                  color: "bg-primary",
                  icon: <Users size={24} />,
                  items: [
                    "Contratación coordinador/a y equipo técnico (9 perfiles)",
                    "Proceso de selección de 420 encuestadores",
                    "Firma de contratos y actas de inicio",
                    "Reunión de arranque con todo el equipo",
                  ],
                },
                {
                  paso: "Paso 2",
                  titulo: "Alistamiento",
                  tiempo: "Febrero 2026 — Semana 2-4",
                  color: "bg-accent",
                  icon: <ClipboardList size={24} />,
                  items: [
                    "Socialización plan de acción ante CDSAN",
                    "Acercamiento institucional (ICBF, ICA, Secretarías)",
                    "Diseño y validación de encuesta digital",
                    "Definición de rutas y logística por zona",
                  ],
                },
                {
                  paso: "Paso 3",
                  titulo: "Diagnóstico",
                  tiempo: "Marzo – Junio 2026",
                  color: "bg-secondary",
                  icon: <Activity size={24} />,
                  items: [
                    "Aplicación de 7.560 encuestas en 42 municipios",
                    "9 talleres diferenciales (1 por zona operativa)",
                    "Procesamiento y análisis cuanti-cualitativo",
                    "Presentación informe diagnóstico al CDSAN",
                  ],
                },
              ].map((p, i) => (
                <motion.div key={i} variants={scaleIn} className="bg-card rounded-2xl border border-border p-6 hover:shadow-xl transition-all">
                  <div className={`${p.color} text-primary-foreground rounded-xl px-4 py-3 flex items-center gap-3 mb-4`}>
                    {p.icon}
                    <div>
                      <p className="font-heading font-bold text-base">{p.titulo}</p>
                      <p className="text-xs opacity-80">{p.tiempo}</p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {p.items.map((item, j) => (
                      <li key={j} className="flex items-start gap-2 text-sm font-body text-foreground">
                        <ArrowRight size={14} className="text-primary mt-0.5 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              ))}
            </motion.div>

            {/* Llamado a acción */}
            <motion.div variants={fadeUp} className="bg-primary rounded-3xl p-8 text-center shadow-2xl">
              <div className="flex items-center justify-center gap-4 mb-6">
                <img src={escudoCauca} alt="Escudo" className="h-14 w-auto brightness-200" />
                <img src={secretariaLogo} alt="Secretaría" className="h-14 w-auto brightness-200" />
              </div>
              <h3 className="font-heading font-black text-2xl md:text-3xl text-primary-foreground mb-3">
                ¡Iniciar en Febrero 2026!
              </h3>
              <p className="text-primary-foreground/80 font-body mb-6 max-w-2xl mx-auto">
                La Secretaría de Agricultura y Desarrollo Rural del Cauca hace un llamado urgente a la acción institucional coordinada para garantizar el inicio del proceso de construcción de la Política Pública de Seguridad y Soberanía Alimentaria en el mes de febrero de 2026.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <div className="bg-primary-foreground/10 rounded-2xl px-6 py-3 text-primary-foreground text-center">
                  <p className="font-heading font-black text-2xl">$943M</p>
                  <p className="text-xs opacity-70">Presupuesto disponible</p>
                </div>
                <div className="bg-primary-foreground/10 rounded-2xl px-6 py-3 text-primary-foreground text-center">
                  <p className="font-heading font-black text-2xl">12 meses</p>
                  <p className="text-xs opacity-70">Feb 2026 – Ene 2027</p>
                </div>
                <div className="bg-primary-foreground/10 rounded-2xl px-6 py-3 text-primary-foreground text-center">
                  <p className="font-heading font-black text-2xl">42 municipios</p>
                  <p className="text-xs opacity-70">Cobertura departamental</p>
                </div>
              </div>
            </motion.div>

            <div className="text-center mt-6">
              <AIBadge text="IA para transferencia metodológica y escalabilidad" detail="Diseñar un modelo de IA que documente automáticamente las lecciones aprendidas del proceso, genere recomendaciones para la formulación de la política pública basadas en los hallazgos del diagnóstico, y facilite la transferencia metodológica a otros departamentos del país." />
            </div>
          </motion.div>
        </Section>
      </div>

      <ReportFooter />
    </div>
  );
};

export default InteractiveReport;
