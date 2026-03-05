import React, { useState, useEffect } from "react";
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
import logoGobernacion from "@/assets/logo-gobernacion-cauca.jpg";
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

// ─── Reading Progress Bar ───────────────────────
const ReadingProgress: React.FC = () => {
  const [progress, setProgress] = React.useState(0);
  useEffect(() => {
    const onScroll = () => {
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-border/40 print:hidden">
      <motion.div
        className="h-full bg-primary origin-left"
        style={{ scaleX: progress / 100 }}
        transition={{ type: "spring", stiffness: 200, damping: 30 }}
      />
    </div>
  );
};

// ─── MAIN COMPONENT ─────────────────────────────
const InteractiveReport: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <ReadingProgress />
      <ReportHeader />

      {/* ═══ 1. HERO / PORTADA ═══ */}
      <section
        id="hero"
        aria-label="Portada del proyecto"
        className="relative min-h-[92vh] flex items-center justify-center overflow-hidden"
      >
        <img
          src={heroCauca}
          alt="Paisaje del Departamento del Cauca, Colombia"
          className="absolute inset-0 w-full h-full object-cover"
          loading="eager"
        />
        {/* Dark gradient — stronger at bottom for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/20" />

        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative z-10 text-center px-6 max-w-4xl w-full"
        >
          {/* Logo institucional sobre fondo semi-transparente */}
          <motion.div variants={fadeUp} className="flex justify-center mb-8">
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl px-6 py-3 shadow-2xl inline-block">
              <img
                src={logoGobernacion}
                alt="Gobernación del Cauca — Secretaría de Agricultura y Desarrollo Rural"
                className="h-14 md:h-16 w-auto object-contain"
              />
            </div>
          </motion.div>

          {/* Divider */}
          <motion.div variants={fadeUp} className="h-[2px] w-16 bg-primary rounded mx-auto mb-7" />

          <motion.h1
            variants={fadeUp}
            className="font-heading font-black text-4xl md:text-5xl lg:text-6xl text-white leading-tight mb-5 drop-shadow-lg"
          >
            Construcción de la Política Pública de{" "}
            <span className="text-accent drop-shadow-md">Seguridad y Soberanía Alimentaria</span>{" "}
            en el Cauca
          </motion.h1>

          <motion.p variants={fadeUp} className="text-lg md:text-xl text-white/90 font-body mb-3 leading-relaxed drop-shadow">
            Plan de Acción Pre-Fases y Cronograma de Implementación
          </motion.p>
          <motion.p variants={fadeUp} className="text-sm text-white/65 font-body mb-10 tracking-wide">
            Secretaría de Agricultura y Desarrollo Rural · Febrero 2026
          </motion.p>

          {/* Scroll CTA */}
          <motion.a
            variants={fadeUp}
            href="#cifras-clave"
            aria-label="Ver cifras clave del proyecto"
            className="inline-flex flex-col items-center gap-2 text-white/70 hover:text-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white rounded-lg p-2"
          >
            <span className="text-xs font-heading font-semibold uppercase tracking-widest">Explorar</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            >
              <ChevronDown size={24} />
            </motion.div>
          </motion.a>
        </motion.div>
      </section>

      {/* ═══ CIFRAS CLAVE ═══ */}
      <div id="cifras-clave" className="bg-card border-y border-border">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.p variants={fadeUp} className="text-center font-heading font-bold text-sm uppercase tracking-widest text-primary mb-8">
              Cifras Clave del Proyecto
            </motion.p>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-6">
              {[
                { value: "7.560", label: "Encuestas totales" },
                { value: "420",   label: "Encuestadores" },
                { value: "9",     label: "Zonas" },
                { value: "12",    label: "Meses de duración" },
                { value: "42",    label: "Municipios" },
                { value: "466K",  label: "Personas objeto" },
                { value: "20",    label: "Talleres diferenciales" },
              ].map((s, i) => (
                <motion.div
                  key={i}
                  variants={scaleIn}
                  className="text-center px-3 py-4 rounded-xl hover:bg-muted/50 transition-colors"
                >
                  <p className="font-heading font-black text-3xl md:text-4xl text-primary leading-none">{s.value}</p>
                  <p className="text-muted-foreground text-xs md:text-sm mt-2 font-body leading-snug">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>


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
          <SectionTag icon={<MapPin size={16} />} label="Sección 5 — Población Objeto" />
          <SectionTitle>Población Objeto — 7 Subregiones / 9 Zonas</SectionTitle>
          <SectionSummary>
            Se intervendrán las 7 subregiones del Cauca, organizadas en 9 zonas para facilitar la ejecución de 1 taller diferencial por zona. Haz clic en cada zona del mapa para ver municipios y actores a convocar.
          </SectionSummary>
          <motion.div variants={stagger} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
            <StatCard value="1.59M" label="Población Afectada" icon={<Users size={24} />} />
            <StatCard value="466K" label="Con Inseg. Alimentaria" icon={<AlertTriangle size={24} />} color="bg-secondary" />
            <StatCard value="9" label="Zonas" icon={<Layers size={24} />} />
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

      <ReportFooter />
    </div>
  );
};

export default InteractiveReport;
