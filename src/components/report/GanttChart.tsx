import React, { useState } from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } },
};
const stagger = {
  visible: { transition: { staggerChildren: 0.12 } },
};

// ─── Types ──────────────────────────────────
type GanttTask = {
  id: string;
  label: string;
  start: number;      // week offset (0-indexed)
  dur: number;        // duration in weeks
  dias: string;       // human-readable date range
  hito: boolean;
  dependsOn?: string; // id of predecessor task
};

type GanttPhase = {
  key: string;
  title: string;
  dateRange: string;
  totalDays: string;
  icon: string;
  colorBar: string;
  colorBg: string;
  colorRing: string;
  colorDot: string;
  tasks: GanttTask[];
  summary: string[];
};

// ─── Data ──────────────────────────────────
const phases: GanttPhase[] = [
  {
    key: "cuantitativa",
    title: "FASE 1 — Cuantitativa",
    dateRange: "Feb 2 — May 22",
    totalDays: "90 días",
    icon: "📊",
    colorBar: "bg-primary",
    colorBg: "bg-primary/80",
    colorRing: "ring-primary/30",
    colorDot: "text-primary",
    summary: ["7.560 encuestas", "420 encuestadores", "42 municipios"],
    tasks: [
      { id: "c1", label: "Análisis información secundaria", start: 0, dur: 3, dias: "Feb 2–20 · 15 días", hito: false },
      { id: "c2", label: "Acercamiento institucional", start: 2, dur: 3, dias: "Feb 16 – Mar 6 · 18 días", hito: false, dependsOn: "c1" },
      { id: "c3", label: "Definición herramienta encuesta", start: 4, dur: 2, dias: "Mar 2–13 · 10 días", hito: false, dependsOn: "c2" },
      { id: "c4", label: "Socialización del plan de acción", start: 5, dur: 2, dias: "Mar 9–20 · 10 días", hito: true, dependsOn: "c3" },
      { id: "c5", label: "Desarrollo encuesta digital", start: 6, dur: 2, dias: "Mar 16–27 · 10 días", hito: false, dependsOn: "c4" },
      { id: "c6", label: "Prueba piloto (2 municipios)", start: 8, dur: 1, dias: "Mar 30 – Abr 3 · 5 días", hito: true, dependsOn: "c5" },
      { id: "c7", label: "Ajustes post-piloto", start: 9, dur: 1, dias: "Abr 6–10 · 5 días", hito: false, dependsOn: "c6" },
      { id: "c8", label: "Logística y contratación 420 enc.", start: 7, dur: 3, dias: "Mar 23 – Abr 10 · 15 días", hito: false, dependsOn: "c4" },
      { id: "c9", label: "Capacitación encuestadores", start: 10, dur: 2, dias: "Abr 13–24 · 10 días", hito: false, dependsOn: "c7" },
      { id: "c10", label: "Aplicación encuestas — 7.560", start: 12, dur: 4, dias: "Abr 27 – May 22 · 20 días", hito: false, dependsOn: "c9" },
      { id: "c11", label: "Supervisión y control calidad", start: 12, dur: 4, dias: "Abr 27 – May 22 · 20 días", hito: false, dependsOn: "c9" },
    ],
  },
  {
    key: "cualitativa",
    title: "FASE 2 — Cualitativa",
    dateRange: "Abr 6 — Jun 12",
    totalDays: "75 días",
    icon: "🗣️",
    colorBar: "bg-secondary",
    colorBg: "bg-secondary/80",
    colorRing: "ring-secondary/30",
    colorDot: "text-secondary",
    summary: ["14 talleres", "1.400 participantes", "7 subregiones"],
    tasks: [
      { id: "q1", label: "Revisión info. secundaria cualitativa", start: 8, dur: 2, dias: "Abr 6–17 · 10 días", hito: false },
      { id: "q2", label: "Acercamiento líderes y actores", start: 9, dur: 3, dias: "Abr 13 – May 1 · 15 días", hito: false, dependsOn: "q1" },
      { id: "q3", label: "Diseño metodológico talleres", start: 10, dur: 2, dias: "Abr 20 – May 1 · 10 días", hito: false, dependsOn: "q1" },
      { id: "q4", label: "Logística talleres (7 sedes × 2)", start: 11, dur: 2, dias: "May 4–15 · 10 días", hito: false, dependsOn: "q3" },
      { id: "q5", label: "Talleres Sur y Macizo", start: 13, dur: 1.5, dias: "May 18–27 · 8 días", hito: true, dependsOn: "q4" },
      { id: "q6", label: "Talleres Pacífico y Norte", start: 14.5, dur: 1.5, dias: "May 28 – Jun 5 · 7 días", hito: true, dependsOn: "q5" },
      { id: "q7", label: "Talleres Centro, Oriente, Bota", start: 16, dur: 1.5, dias: "Jun 5–12 · 7 días", hito: true, dependsOn: "q6" },
      { id: "q8", label: "Relatorías y sistematización", start: 13, dur: 5, dias: "May 18 – Jun 12 · 22 días", hito: false, dependsOn: "q4" },
    ],
  },
  {
    key: "procesamiento",
    title: "FASE 3 — Procesamiento",
    dateRange: "May 11 — Jun 26",
    totalDays: "45 días",
    icon: "⚙️",
    colorBar: "bg-accent",
    colorBg: "bg-accent/70",
    colorRing: "ring-accent/30",
    colorDot: "text-accent",
    summary: ["Consolidación datos", "Análisis estadístico", "Informe diagnóstico"],
    tasks: [
      { id: "p1", label: "Limpieza y validación datos", start: 14, dur: 2, dias: "May 11–22 · 10 días", hito: false },
      { id: "p2", label: "Procesamiento estadístico", start: 15, dur: 2, dias: "May 18–29 · 10 días", hito: false, dependsOn: "p1" },
      { id: "p3", label: "Análisis cruzado cuanti-cuali", start: 16, dur: 2, dias: "Jun 1–12 · 10 días", hito: false, dependsOn: "p2" },
      { id: "p4", label: "Redacción informe diagnóstico", start: 17, dur: 2, dias: "Jun 8–19 · 10 días", hito: false, dependsOn: "p3" },
      { id: "p5", label: "Presentación CDSAN", start: 19, dur: 2, dias: "Jun 15–26 · 10 días", hito: true, dependsOn: "p4" },
    ],
  },
];

const TOTAL_WEEKS = 21;
const MONTHS = [
  { mes: "Feb 2026", semanas: 4 },
  { mes: "Mar 2026", semanas: 4 },
  { mes: "Abr 2026", semanas: 5 },
  { mes: "May 2026", semanas: 4 },
  { mes: "Jun 2026", semanas: 4 },
];

type ViewMode = "general" | "cuantitativa" | "cualitativa" | "procesamiento" | "calendario";

// ─── Calendar Data ──────────────────────────
type CalendarDay = {
  day: number;
  tasks: { label: string; phase: string; colorClass: string }[];
};

const calendarMonths = [
  { name: "Febrero 2026", year: 2026, month: 1, startDay: 0 }, // Sun=0, Mon=1... Feb 1 2026 = Sunday
  { name: "Marzo 2026", year: 2026, month: 2, startDay: 0 },
  { name: "Abril 2026", year: 2026, month: 3, startDay: 3 },
  { name: "Mayo 2026", year: 2026, month: 4, startDay: 5 },
  { name: "Junio 2026", year: 2026, month: 5, startDay: 1 },
];

// Map tasks to actual calendar days
type CalendarTaskEntry = {
  label: string;
  startDate: [number, number]; // [month(0-indexed), day]
  endDate: [number, number];
  phase: string;
  colorBg: string;
  hito: boolean;
};

const calendarTasks: CalendarTaskEntry[] = [
  // Cuantitativa
  { label: "Análisis info. secundaria", startDate: [1, 2], endDate: [1, 20], phase: "cuantitativa", colorBg: "bg-primary/20", hito: false },
  { label: "Acercamiento institucional", startDate: [1, 16], endDate: [2, 6], phase: "cuantitativa", colorBg: "bg-primary/20", hito: false },
  { label: "Definición herramienta", startDate: [2, 2], endDate: [2, 13], phase: "cuantitativa", colorBg: "bg-primary/20", hito: false },
  { label: "Socialización del plan de acción", startDate: [2, 9], endDate: [2, 20], phase: "cuantitativa", colorBg: "bg-primary/30", hito: true },
  { label: "Encuesta digital", startDate: [2, 16], endDate: [2, 27], phase: "cuantitativa", colorBg: "bg-primary/20", hito: false },
  { label: "Prueba piloto", startDate: [2, 30], endDate: [3, 3], phase: "cuantitativa", colorBg: "bg-primary/30", hito: true },
  { label: "Ajustes post-piloto", startDate: [3, 6], endDate: [3, 10], phase: "cuantitativa", colorBg: "bg-primary/20", hito: false },
  { label: "Contratación 420 enc.", startDate: [2, 23], endDate: [3, 10], phase: "cuantitativa", colorBg: "bg-primary/20", hito: false },
  { label: "Capacitación", startDate: [3, 13], endDate: [3, 24], phase: "cuantitativa", colorBg: "bg-primary/20", hito: false },
  { label: "Aplicación encuestas", startDate: [3, 27], endDate: [4, 22], phase: "cuantitativa", colorBg: "bg-primary/25", hito: false },
  // Cualitativa
  { label: "Rev. info cualitativa", startDate: [3, 6], endDate: [3, 17], phase: "cualitativa", colorBg: "bg-secondary/20", hito: false },
  { label: "Acercamiento líderes", startDate: [3, 13], endDate: [4, 1], phase: "cualitativa", colorBg: "bg-secondary/20", hito: false },
  { label: "Diseño talleres", startDate: [3, 20], endDate: [4, 1], phase: "cualitativa", colorBg: "bg-secondary/20", hito: false },
  { label: "Logística talleres", startDate: [4, 4], endDate: [4, 15], phase: "cualitativa", colorBg: "bg-secondary/20", hito: false },
  { label: "Talleres Sur/Macizo", startDate: [4, 18], endDate: [4, 27], phase: "cualitativa", colorBg: "bg-secondary/30", hito: true },
  { label: "Talleres Pac./Norte", startDate: [4, 28], endDate: [5, 5], phase: "cualitativa", colorBg: "bg-secondary/30", hito: true },
  { label: "Talleres Centro/Or.", startDate: [5, 5], endDate: [5, 12], phase: "cualitativa", colorBg: "bg-secondary/30", hito: true },
  // Procesamiento
  { label: "Limpieza datos", startDate: [4, 11], endDate: [4, 22], phase: "procesamiento", colorBg: "bg-accent/20", hito: false },
  { label: "Proc. estadístico", startDate: [4, 18], endDate: [4, 29], phase: "procesamiento", colorBg: "bg-accent/20", hito: false },
  { label: "Análisis cruzado", startDate: [5, 1], endDate: [5, 12], phase: "procesamiento", colorBg: "bg-accent/20", hito: false },
  { label: "Redacción informe", startDate: [5, 8], endDate: [5, 19], phase: "procesamiento", colorBg: "bg-accent/20", hito: false },
  { label: "Presentación CDSAN", startDate: [5, 15], endDate: [5, 26], phase: "procesamiento", colorBg: "bg-accent/30", hito: true },
];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay(); // 0=Sun
}

function getTasksForDay(month: number, day: number, phaseFilter?: string): { label: string; colorBg: string; hito: boolean }[] {
  return calendarTasks.filter(t => {
    if (phaseFilter && t.phase !== phaseFilter) return false;
    const [sm, sd] = t.startDate;
    const [em, ed] = t.endDate;
    const dateVal = month * 100 + day;
    const startVal = sm * 100 + sd;
    const endVal = em * 100 + ed;
    return dateVal >= startVal && dateVal <= endVal;
  });
}

// ─── Calendar Month Grid ─────────────────────
const CalendarMonth: React.FC<{ name: string; year: number; month: number; phaseFilter?: string }> = ({ name, year, month, phaseFilter }) => {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayOfWeek(year, month);
  const [hoveredDay, setHoveredDay] = useState<number | null>(null);

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const weekDays = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

  return (
    <div className="bg-card rounded-2xl border border-border p-4">
      <h4 className="font-heading font-bold text-sm text-foreground mb-3 text-center">{name}</h4>
      <div className="grid grid-cols-7 gap-0.5">
        {weekDays.map(d => (
          <div key={d} className="text-center text-[10px] font-heading font-semibold text-muted-foreground py-1">{d}</div>
        ))}
        {cells.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} />;
          const tasks = getTasksForDay(month, day, phaseFilter);
          const hasTask = tasks.length > 0;
          const hasHito = tasks.some(t => t.hito);

          return (
            <div
              key={day}
              className={`relative text-center text-xs py-1.5 rounded-md cursor-default transition-all ${
                hasTask
                  ? hasHito
                    ? "bg-primary/30 text-foreground font-bold ring-1 ring-primary/50"
                    : "bg-primary/15 text-foreground"
                  : "text-muted-foreground hover:bg-muted/50"
              }`}
              onMouseEnter={() => hasTask && setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}
            >
              {day}
              {hasHito && <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-primary" />}
              {hoveredDay === day && tasks.length > 0 && (
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-30 bg-foreground text-background text-[9px] px-2 py-1.5 rounded-md shadow-lg whitespace-nowrap pointer-events-none max-w-[200px]">
                  {tasks.map((t, j) => (
                    <div key={j} className="flex items-center gap-1">
                      {t.hito && <span>◆</span>}
                      <span className="truncate">{t.label}</span>
                    </div>
                  ))}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-3 border-r-3 border-t-3 border-transparent border-t-foreground" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Dependency Arrow (SVG) ──────────────────
const DependencyArrows: React.FC<{ tasks: GanttTask[]; colorClass: string }> = ({ tasks }) => {
  const taskMap = new Map(tasks.map((t, i) => [t.id, { ...t, row: i }]));

  const arrows: { fromRow: number; fromEnd: number; toRow: number; toStart: number }[] = [];
  tasks.forEach((t, i) => {
    if (t.dependsOn) {
      const dep = taskMap.get(t.dependsOn);
      if (dep) {
        arrows.push({
          fromRow: dep.row,
          fromEnd: ((dep.start + dep.dur) / TOTAL_WEEKS) * 100,
          toRow: i,
          toStart: (t.start / TOTAL_WEEKS) * 100,
        });
      }
    }
  });

  if (!arrows.length) return null;

  const ROW_H = 36; // matches h-9
  const svgH = tasks.length * ROW_H;

  return (
    <svg
      className="absolute top-0 left-[250px] right-0 pointer-events-none"
      style={{ height: svgH }}
      preserveAspectRatio="none"
    >
      <defs>
        <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
          <polygon points="0 0, 6 2, 0 4" className="fill-muted-foreground/40" />
        </marker>
      </defs>
      {arrows.map((a, i) => {
        const y1 = a.fromRow * ROW_H + ROW_H / 2;
        const y2 = a.toRow * ROW_H + ROW_H / 2;
        const x1 = `${a.fromEnd}%`;
        const x2 = `${a.toStart}%`;
        const midX = `${(a.fromEnd + a.toStart) / 2}%`;

        if (a.fromRow === a.toRow) {
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              className="stroke-muted-foreground/30" strokeWidth="1.5" markerEnd="url(#arrowhead)" strokeDasharray="4 2" />
          );
        }

        return (
          <path key={i}
            d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
            className="stroke-muted-foreground/30" strokeWidth="1.5" fill="none" markerEnd="url(#arrowhead)" strokeDasharray="4 2"
          />
        );
      })}
    </svg>
  );
};

// ─── Popup content for special tasks ─────────
const ACERCAMIENTO_INSTITUCIONAL = [
  "ICBF", "ICA", "Emcaservicios", "Secretaría de Salud",
  "Secretaría de Ambiente", "Secretaría de Agricultura",
];

const ACERCAMIENTO_LIDERES = [
  "Campesinos (por municipio)", "Consejos comunitarios", "Indígenas",
  "Personas con discapacidad", "Adulto mayor", "Jóvenes (PANES, Consejos de juventudes)",
  "Mujeres gestantes", "Institucional (salud, educación, alcaldías)",
  "Comunidad LGTBI", "OAC", "ICA", "ICBF", "PAE Educación", "FAO", "PMA",
  "Diputados (CDSAN)", "Salud departamental", "Ministerio de la Igualdad",
];

// ─── Gantt Row with Tooltip ──────────────────
const GanttRow: React.FC<{
  item: GanttTask;
  index: number;
  colorBar: string;
  colorBg: string;
  colorRing: string;
  colorDot: string;
}> = ({ item, index, colorBar, colorBg, colorRing, colorDot }) => {
  const [hovered, setHovered] = useState(false);
  const popupItems = item.id === "c2" ? ACERCAMIENTO_INSTITUCIONAL
    : item.id === "q2" ? ACERCAMIENTO_LIDERES : null;

  return (
    <div className="flex items-center h-9 group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span className="w-[250px] text-xs font-body pr-2 text-foreground shrink-0 flex items-center gap-1.5">
        {item.hito && <span className={colorDot}>◆</span>}
        {item.dependsOn && <span className="text-muted-foreground/50 text-[10px]">↳</span>}
        <span className="truncate">{item.label}</span>
      </span>
      <div className="flex-1 relative h-7">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${(item.dur / TOTAL_WEEKS) * 100}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.05 }}
          className={`absolute h-full rounded-md ${item.hito ? `${colorBar} ring-2 ${colorRing}` : colorBg} group-hover:brightness-110 transition-all cursor-default`}
          style={{ left: `${(item.start / TOTAL_WEEKS) * 100}%` }}
        />
        {/* Tooltip above the bar */}
        {hovered && !popupItems && (
          <div
            className="absolute -top-8 z-20 bg-foreground text-background text-[10px] font-semibold px-2.5 py-1 rounded-md shadow-lg whitespace-nowrap pointer-events-none"
            style={{ left: `${(item.start / TOTAL_WEEKS) * 100}%` }}
          >
            {item.dias}
            <div className="absolute left-3 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground" />
          </div>
        )}
        {/* Popup for special tasks */}
        {hovered && popupItems && (
          <div
            className="absolute bottom-full z-30 bg-foreground text-background text-[10px] px-3 py-2 rounded-xl shadow-xl pointer-events-none max-w-[260px]"
            style={{ left: `${(item.start / TOTAL_WEEKS) * 100}%` }}
          >
            <p className="font-heading font-bold text-[11px] mb-1">{item.label}</p>
            <p className="text-background/70 mb-1.5">{item.dias}</p>
            {popupItems.map((p, i) => (
              <div key={i} className="flex items-center gap-1.5 py-0.5">
                <span className="w-1 h-1 rounded-full bg-accent shrink-0" />
                <span>{p}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── Week Headers ────────────────────────────
const WeekHeaders: React.FC = () => (
  <>
    <div className="flex mb-1">
      {MONTHS.map((m, i) => (
        <div key={i} className="text-center font-heading font-bold text-xs text-foreground border-b-2 border-primary/30 pb-1" style={{ flex: m.semanas }}>
          {m.mes}
        </div>
      ))}
    </div>
    <div className="flex mb-3">
      {Array.from({ length: TOTAL_WEEKS }, (_, i) => (
        <div key={i} className="flex-1 text-center text-[10px] text-muted-foreground border-r border-border/30 pb-1">
          S{i + 1}
        </div>
      ))}
    </div>
  </>
);

// ─── Phase Gantt Block ───────────────────────
const PhaseBlock: React.FC<{ phase: GanttPhase; showHeader?: boolean }> = ({ phase, showHeader = true }) => (
  <div className={showHeader ? "border-t border-border pt-3 mt-3 first:border-0 first:pt-0 first:mt-0" : ""}>
    <div className="flex items-center gap-2 mb-2">
      <div className={`w-3 h-3 rounded-sm ${phase.colorBar}`} />
      <p className={`font-heading font-bold text-sm ${phase.colorDot}`}>
        {phase.title} ({phase.dateRange})
      </p>
      <span className={`text-xs ${phase.colorBg.replace("/80", "/10").replace("/70", "/20")} ${phase.colorDot} px-2 py-0.5 rounded-full font-heading font-semibold`}>
        {phase.totalDays}
      </span>
    </div>
    <div className="relative">
      <DependencyArrows tasks={phase.tasks} colorClass={phase.colorBar} />
      {phase.tasks.map((item, i) => (
        <GanttRow
          key={item.id}
          item={item}
          index={i}
          colorBar={phase.colorBar}
          colorBg={phase.colorBg}
          colorRing={phase.colorRing}
          colorDot={phase.colorDot}
        />
      ))}
    </div>
  </div>
);

// ─── MAIN COMPONENT ─────────────────────────
const GanttChart: React.FC = () => {
  const [view, setView] = useState<ViewMode>("general");

  const tabs: { key: ViewMode; label: string }[] = [
    { key: "general", label: "Vista General" },
    { key: "cuantitativa", label: "📊 Cuantitativa" },
    { key: "cualitativa", label: "🗣️ Cualitativa" },
    { key: "procesamiento", label: "⚙️ Procesamiento" },
    { key: "calendario", label: "📅 Calendario" },
  ];

  const visiblePhases = view === "general"
    ? phases
    : phases.filter(p => p.key === view);

  return (
    <div>
      {/* ── Resumen de Fases ── */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {phases.map((f, i) => (
          <motion.div
            key={i}
            variants={scaleIn}
            className={`bg-card rounded-2xl border border-border p-5 hover:shadow-lg transition-all cursor-pointer ${view === f.key ? "ring-2 ring-primary shadow-lg" : ""}`}
            onClick={() => setView(view === f.key ? "general" : f.key as ViewMode)}
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">{f.icon}</span>
              <div>
                <p className="font-heading font-bold text-sm text-foreground">{f.title.replace("FASE 1 — ", "").replace("FASE 2 — ", "").replace("FASE 3 — ", "")}</p>
                <p className="text-xs text-muted-foreground">{f.dateRange} 2026</p>
              </div>
            </div>
            <div className={`${f.colorBar} text-primary-foreground rounded-lg px-3 py-1.5 text-center font-heading font-bold text-lg mb-3`}>
              {f.totalDays}
            </div>
            <ul className="space-y-1">
              {f.summary.map((item, j) => (
                <li key={j} className="text-xs font-body text-muted-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Tab Buttons ── */}
      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setView(t.key)}
            className={`px-4 py-2 rounded-full text-sm font-heading font-semibold transition-all ${
              view === t.key
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-muted text-muted-foreground hover:bg-muted/80"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Gantt Chart or Calendar ── */}
      {view === "calendario" ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {calendarMonths.map((m) => (
              <CalendarMonth key={m.name} name={m.name} year={m.year} month={m.month} />
            ))}
          </div>
          <div className="flex flex-wrap items-center gap-4 mt-4 pt-4 border-t border-border">
            <div className="flex items-center gap-2 text-xs font-body text-muted-foreground">
              <div className="w-3 h-3 rounded-sm bg-primary/20 border border-primary/30" /> Día con actividad
            </div>
            <div className="flex items-center gap-2 text-xs font-body text-muted-foreground">
              <div className="w-3 h-3 rounded-sm bg-primary/30 ring-1 ring-primary/50" /> Hito clave
            </div>
            <div className="text-xs text-muted-foreground ml-auto font-body italic">
              Pasa el cursor sobre un día para ver las actividades
            </div>
          </div>
        </motion.div>
      ) : (
        <>
          <motion.div variants={fadeUp} className="bg-card rounded-2xl border border-border p-6 overflow-x-auto">
            <div className="min-w-[900px]">
              <WeekHeaders />
              {visiblePhases.map((phase) => (
                <PhaseBlock key={phase.key} phase={phase} showHeader={true} />
              ))}
            </div>

            {/* Leyenda */}
            <div className="flex flex-wrap items-center gap-4 mt-6 pt-4 border-t border-border min-w-[900px]">
              <div className="flex items-center gap-2 text-xs font-body text-muted-foreground">
                <div className="w-3 h-3 rounded-sm bg-primary" /> Cuantitativa
              </div>
              <div className="flex items-center gap-2 text-xs font-body text-muted-foreground">
                <div className="w-3 h-3 rounded-sm bg-secondary" /> Cualitativa
              </div>
              <div className="flex items-center gap-2 text-xs font-body text-muted-foreground">
                <div className="w-3 h-3 rounded-sm bg-accent" /> Procesamiento
              </div>
              <div className="flex items-center gap-2 text-xs font-body text-muted-foreground">
                <span className="text-primary">◆</span> Hito clave
              </div>
              <div className="flex items-center gap-2 text-xs font-body text-muted-foreground">
                <svg width="20" height="8"><line x1="0" y1="4" x2="20" y2="4" stroke="currentColor" strokeWidth="1.5" strokeDasharray="4 2" /><polygon points="16 1, 20 4, 16 7" fill="currentColor" /></svg>
                Dependencia
              </div>
              <div className="text-xs text-muted-foreground ml-auto font-body italic">
                Pasa el cursor sobre las barras para ver los días
              </div>
            </div>
          </motion.div>

          {/* ── Detail table for selected phase ── */}
          {view !== "general" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 bg-card rounded-2xl border border-border overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-border bg-muted/50">
                <h3 className="font-heading font-bold text-lg text-foreground">
                  Detalle por Actividad — {visiblePhases[0]?.title}
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 text-left font-heading font-semibold text-muted-foreground">#</th>
                      <th className="px-4 py-3 text-left font-heading font-semibold text-muted-foreground">Actividad</th>
                      <th className="px-4 py-3 text-left font-heading font-semibold text-muted-foreground">Período</th>
                      <th className="px-4 py-3 text-left font-heading font-semibold text-muted-foreground">Depende de</th>
                      <th className="px-4 py-3 text-center font-heading font-semibold text-muted-foreground">Hito</th>
                    </tr>
                  </thead>
                  <tbody>
                    {visiblePhases[0]?.tasks.map((t, i) => {
                      const dep = t.dependsOn ? visiblePhases[0].tasks.find(x => x.id === t.dependsOn) : null;
                      return (
                        <tr key={t.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-2.5 font-heading font-semibold text-muted-foreground">{i + 1}</td>
                          <td className="px-4 py-2.5 font-body text-foreground">{t.label}</td>
                          <td className="px-4 py-2.5 font-body text-muted-foreground whitespace-nowrap">{t.dias}</td>
                          <td className="px-4 py-2.5 font-body text-muted-foreground">{dep ? dep.label : "—"}</td>
                          <td className="px-4 py-2.5 text-center">{t.hito ? "◆" : ""}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default GanttChart;
