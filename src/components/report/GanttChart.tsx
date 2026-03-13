import React, { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Download } from "lucide-react";
import * as XLSX from "xlsx";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};
const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
};
const stagger = {
  visible: { transition: { staggerChildren: 0.12 } }
};

// ─── Types ──────────────────────────────────
type GanttTask = {
  id: string;
  label: string;
  start: number; // week offset (0-indexed)
  dur: number; // duration in weeks
  dias: string; // human-readable date range
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
  { id: "c3", label: "Recolección de Información Primaria", start: 4, dur: 2, dias: "Mar 9–20 · 12 días", hito: false, dependsOn: "c2" },
  { id: "c3b", label: "Respuesta a la solicitud enviada", start: 4, dur: 1, dias: "Mar 13–18 · 5 días", hito: true, dependsOn: "c3" },
  { id: "c4", label: "Socialización del plan de acción", start: 6, dur: 2, dias: "Mar 23 – Abr 3 · 10 días", hito: false, dependsOn: "c3" },
  { id: "c6", label: "Prueba piloto (1 municipio)", start: 8, dur: 1, dias: "Mar 30 – Abr 3 · 5 días", hito: false, dependsOn: "c4" },
  { id: "c8", label: "Aplicación encuestas — 7.560", start: 10, dur: 4, dias: "Abr 13 – May 8 · 20 días", hito: false, dependsOn: "c6" }]

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
  summary: ["20 talleres", "2.000 participantes", "9 zonas operativas"],
  tasks: [
  { id: "q1", label: "Revisión info. secundaria cualitativa", start: 8, dur: 2, dias: "Abr 6–17 · 10 días", hito: false },
  { id: "q2", label: "Acercamiento líderes y actores", start: 9, dur: 3, dias: "Abr 13 – May 1 · 15 días", hito: false, dependsOn: "q1" },
  { id: "q3", label: "Talleres diferenciales — 7 subregiones / 9 zonas", start: 12, dur: 6, dias: "May 4 – Jun 12 · 40 días", hito: true, dependsOn: "q2" }]

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
  { id: "p4", label: "Redacción informe diagnóstico", start: 17, dur: 2, dias: "Jun 8–19 · 10 días", hito: true, dependsOn: "p3" },
  { id: "p5", label: "Presentación CDSAN", start: 19, dur: 1, dias: "Jun 22–26 · 5 días", hito: false, dependsOn: "p4" }]

}];


const TOTAL_WEEKS = 21;
const MONTHS = [
{ mes: "Feb 2026", semanas: 4 },
{ mes: "Mar 2026", semanas: 4 },
{ mes: "Abr 2026", semanas: 5 },
{ mes: "May 2026", semanas: 4 },
{ mes: "Jun 2026", semanas: 4 }];


type ViewMode = "general" | "cuantitativa" | "cualitativa" | "procesamiento";

// ─── Calendar Data ──────────────────────────
type CalendarDay = {
  day: number;
  tasks: {label: string;phase: string;colorClass: string;}[];
};

const calendarMonths = [
{ name: "Febrero 2026", year: 2026, month: 1, startDay: 0 }, // Sun=0, Mon=1... Feb 1 2026 = Sunday
{ name: "Marzo 2026", year: 2026, month: 2, startDay: 0 },
{ name: "Abril 2026", year: 2026, month: 3, startDay: 3 },
{ name: "Mayo 2026", year: 2026, month: 4, startDay: 5 },
{ name: "Junio 2026", year: 2026, month: 5, startDay: 1 }];


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
{ label: "Presentación CDSAN", startDate: [5, 15], endDate: [5, 26], phase: "procesamiento", colorBg: "bg-accent/30", hito: true }];


function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay(); // 0=Sun
}

function getTasksForDay(month: number, day: number, phaseFilter?: string): {label: string;colorBg: string;hito: boolean;}[] {
  return calendarTasks.filter((t) => {
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
const CalendarMonth: React.FC<{name: string;year: number;month: number;phaseFilter?: string;}> = ({ name, year, month, phaseFilter }) => {
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
        {weekDays.map((d) =>
        <div key={d} className="text-center text-[10px] font-heading font-semibold text-muted-foreground py-1">{d}</div>
        )}
        {cells.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} />;
          const tasks = getTasksForDay(month, day, phaseFilter);
          const hasTask = tasks.length > 0;
          const hasHito = tasks.some((t) => t.hito);

          return (
            <div
              key={day}
              className={`relative text-center text-xs py-1.5 rounded-md cursor-default transition-all ${
              hasTask ?
              hasHito ?
              "bg-primary/30 text-foreground font-bold ring-1 ring-primary/50" :
              "bg-primary/15 text-foreground" :
              "text-muted-foreground hover:bg-muted/50"}`
              }
              onMouseEnter={() => hasTask && setHoveredDay(day)}
              onMouseLeave={() => setHoveredDay(null)}>
              
              {day}
              {hasHito && <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-primary" />}
              {hoveredDay === day && tasks.length > 0 &&
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 z-30 bg-foreground text-background text-[9px] px-2 py-1.5 rounded-md shadow-lg whitespace-nowrap pointer-events-none max-w-[200px]">
                  {tasks.map((t, j) =>
                <div key={j} className="flex items-center gap-1">
                      {t.hito && <span>◆</span>}
                      <span className="truncate">{t.label}</span>
                    </div>
                )}
                  <div className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-3 border-r-3 border-t-3 border-transparent border-t-foreground" />
                </div>
              }
            </div>);

        })}
      </div>
    </div>);

};

// ─── Dependency Arrow (SVG) ──────────────────
const DependencyArrows: React.FC<{tasks: GanttTask[];colorClass: string;}> = ({ tasks }) => {
  const taskMap = new Map(tasks.map((t, i) => [t.id, { ...t, row: i }]));

  const arrows: {fromRow: number;fromEnd: number;toRow: number;toStart: number;}[] = [];
  tasks.forEach((t, i) => {
    if (t.dependsOn) {
      const dep = taskMap.get(t.dependsOn);
      if (dep) {
        arrows.push({
          fromRow: dep.row,
          fromEnd: (dep.start + dep.dur) / TOTAL_WEEKS * 100,
          toRow: i,
          toStart: t.start / TOTAL_WEEKS * 100
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
      preserveAspectRatio="none">
      
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
            className="stroke-muted-foreground/30" strokeWidth="1.5" markerEnd="url(#arrowhead)" strokeDasharray="4 2" />);

        }

        return (
          <path key={i}
          d={`M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`}
          className="stroke-muted-foreground/30" strokeWidth="1.5" fill="none" markerEnd="url(#arrowhead)" strokeDasharray="4 2" />);


      })}
    </svg>);

};

// ─── Popup content for special tasks ─────────
const ACERCAMIENTO_INSTITUCIONAL = [
"CDSAN",
"Comités Municipales de Seguridad Alimentaria y Nutricional"];

const RESPUESTA_SOLICITUD = [
"Fecha de Entrega de oficios 30 de marzo"];

const SOCIALIZACION_PLAN = [
"CDSAN",
"Asamblea Departamental"];

const PRUEBA_PILOTO = [
"Popayán"];

const TALLERES_ZONAS = [
  { zona: "Zona 1 — Centro", sede: "Piendamó", municipios: ["Piendamó", "Cajibío", "Morales", "Silvia"] },
  { zona: "Zona 2 — Norte", sede: "Santander de Quilichao", municipios: ["Santander de Quilichao", "Caldono", "Buenos Aires", "Caloto", "Jambaló"] },
  { zona: "Zona 3 — Oriente", sede: "Inzá", municipios: ["Inzá", "Páez (Belalcázar)", "Totoró"] },
  { zona: "Zona 4 — Pacífico", sede: "Guapi", municipios: ["Guapi", "López de Micay", "Timbiquí"] },
  { zona: "Zona 5 — Sur", sede: "El Bordo / Bolívar", municipios: ["El Bordo (Patía)", "Mercaderes", "Bolívar", "Florencia", "Sucre", "Balboa", "Argelia"] },
  { zona: "Zona 6 — Centro Capital", sede: "Popayán", municipios: ["Popayán"] },
  { zona: "Zona 7 — Centro Sur", sede: "Timbío / Rosas", municipios: ["Timbío", "Rosas", "La Sierra", "Sotará"] },
  { zona: "Zona 8 — Macizo", sede: "La Vega", municipios: ["La Vega", "San Sebastián", "Almaguer"] },
  { zona: "Zona 9 — Bota Caucana", sede: "Piamonte", municipios: ["Santa Rosa", "Piamonte"] },
];

const ACERCAMIENTO_LIDERES_GRUPOS = [
{
  grupo: "Actores Institucionales",
  items: ["ICA", "ICBF", "PAE – Educación", "Proveedores PAE", "Galpones", "Ganaderos", "Cámara de Comercio", "EMCASERVICIOS", "CRC", "Acueducto de Popayán", "Ministerio de la Igualdad"]
},
{
  grupo: "Actores Famas y comerciantes de alimentos",
  items: ["Famas y comerciantes de alimentos"]
},
{
  grupo: "Actores Políticos",
  items: ["Diputados – POPAYÁN CDSAN"]
},
{
  grupo: "Actores PAEs y PANEs",
  items: ["PAEs y PANEs"]
},
{
  grupo: "Organismos Internacionales",
  items: ["FAO", "PMA"]
},
{
  grupo: "Actores Salud",
  items: ["Salud Departamental"]
},
{
  grupo: "Actores Comunitarios",
  items: ["Campesinos (por municipio)", "Consejos comunitarios", "Actores indígenas"]
},
{
  grupo: "Poblaciones diferenciales",
  items: [
  "Personas con discapacidad",
  "Adulto mayor – Gestión Social, Secretarías de Salud, programas adultos mayores",
  "Jóvenes – Instituciones educativas, PANES, Consejos departamentales y municipales de juventudes, Salud departamental",
  "Mujeres gestantes",
  "Comunidad LGTBI"]

},
{
  grupo: "Actores Institucional territorial",
  items: ["Salud", "Educación", "Alcaldías"]
},
{
  grupo: "Otros actores",
  items: ["OAC"]
}];


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
  const [pinned, setPinned] = useState(false);
  const popupRef = useRef<HTMLDivElement>(null);
  const rowRef = useRef<HTMLDivElement>(null);

  const popupItems =
    item.id === "c2" ? ACERCAMIENTO_INSTITUCIONAL :
    item.id === "c3b" ? RESPUESTA_SOLICITUD :
    item.id === "c4" ? SOCIALIZACION_PLAN :
    item.id === "c6" ? PRUEBA_PILOTO :
    null;
  const popupGrupos = item.id === "q2" ? ACERCAMIENTO_LIDERES_GRUPOS : null;
  const popupZonas = item.id === "q3" ? TALLERES_ZONAS : null;
  const hasSpecialPopup = !!(popupItems || popupGrupos || popupZonas);

  const showPopup = hovered || pinned;

  // Close on outside click
  const handleOutsideClick = useCallback((e: MouseEvent) => {
    if (
    popupRef.current && !popupRef.current.contains(e.target as Node) &&
    rowRef.current && !rowRef.current.contains(e.target as Node))
    {
      setPinned(false);
    }
  }, []);

  useEffect(() => {
    if (pinned) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [pinned, handleOutsideClick]);

  return (
    <div
      ref={rowRef}
      className={`flex items-center group relative ${item.id === "q3" ? "h-auto min-h-[2.5rem] py-1" : "h-9"}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      
      <span className="w-[250px] text-xs font-body pr-2 text-foreground shrink-0 flex items-start gap-1.5">
        {item.hito && <span className={`${colorDot} mt-0.5`}>◆</span>}
        {item.dependsOn && <span className="text-muted-foreground/50 text-[10px] mt-0.5">↳</span>}
        <span className={item.id === "q3" ? "leading-snug" : "truncate"}>{item.label}</span>
        {hasSpecialPopup &&
        <span className="ml-1 text-[9px] text-primary/60 font-heading hidden group-hover:inline shrink-0 mt-0.5">clic</span>
        }
      </span>
      <div className="flex-1 relative h-7">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${item.dur / TOTAL_WEEKS * 100}%` }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: index * 0.05 }}
          onClick={() => hasSpecialPopup && setPinned((p) => !p)}
          className={`absolute h-full rounded-md ${item.hito ? `${colorBar} ring-2 ${colorRing}` : colorBg} group-hover:brightness-110 transition-all ${hasSpecialPopup ? "cursor-pointer" : "cursor-default"} ${pinned ? "ring-2 ring-accent" : ""}`}
          style={{ left: `${item.start / TOTAL_WEEKS * 100}%` }} />
        

        {/* Simple date tooltip (non-special tasks) */}
        {showPopup && !hasSpecialPopup &&
        <div
          className="absolute -top-8 z-20 bg-foreground text-background text-[10px] font-semibold px-2.5 py-1 rounded-md shadow-lg whitespace-nowrap pointer-events-none"
          style={{ left: `${item.start / TOTAL_WEEKS * 100}%` }}>
          
            {item.dias}
            <div className="absolute left-3 top-full w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-foreground" />
          </div>
        }

        {/* Popup for institucional (flat list) */}
        {showPopup && popupItems &&
        <div
          ref={pinned ? popupRef : undefined}
          className="absolute bottom-full z-30 bg-foreground text-background text-[10px] px-4 py-3 rounded-xl shadow-2xl max-w-[280px]"
          style={{ left: `${item.start / TOTAL_WEEKS * 100}%` }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}>
          
            <div className="flex items-center justify-between mb-2 gap-4">
              <p className="font-heading font-bold text-[11px]">{item.label}</p>
              {pinned &&
            <button onClick={() => setPinned(false)} className="text-background/50 hover:text-background text-[11px] shrink-0">✕</button>
            }
            </div>
            <p className="text-background/60 text-[10px] mb-2">{item.dias}</p>
            {popupItems.map((p, i) =>
          <div key={i} className="flex items-center gap-1.5 py-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                <span>{p}</span>
              </div>
          )}
            {!pinned && <p className="text-background/40 text-[9px] mt-2 italic">Clic en la barra para fijar</p>}
          </div>
        }

        {/* Popup for líderes y actores (grouped) */}
        {showPopup && popupGrupos &&
        <div
          ref={pinned ? popupRef : undefined}
          className="absolute bottom-full z-30 bg-foreground text-background text-[10px] px-4 py-3 rounded-xl shadow-2xl max-w-[340px]"
          style={{ left: `${Math.min(item.start / TOTAL_WEEKS * 100, 35)}%` }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}>
          
            <div className="flex items-center justify-between mb-2 gap-4">
              <p className="font-heading font-bold text-[11px]">{item.label}</p>
              {pinned &&
            <button onClick={() => setPinned(false)} className="text-background/50 hover:text-background text-[11px] shrink-0">✕</button>
            }
            </div>
            <p className="text-background/60 text-[10px] mb-2">{item.dias}</p>
            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
              {popupGrupos.map((g, gi) =>
            <div key={gi}>
                  <p className="font-heading font-semibold text-[10px] text-accent mb-0.5 uppercase tracking-wide">{g.grupo}</p>
                  {g.items.map((it, ii) =>
              <div key={ii} className="flex items-start gap-1.5 py-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent shrink-0 mt-1" />
                      <span className="leading-snug">{it}</span>
                    </div>
              )}
                </div>
            )}
            </div>
            {!pinned && <p className="text-background/40 text-[9px] mt-2 italic">Clic en la barra para fijar</p>}
          </div>
        }

        {/* Popup for talleres — 9 zonas con municipios */}
        {showPopup && popupZonas &&
        <div
          ref={pinned ? popupRef : undefined}
          className="absolute bottom-full z-30 bg-foreground text-background text-[10px] px-4 py-3 rounded-xl shadow-2xl max-w-[380px]"
          style={{ left: `${Math.min(item.start / TOTAL_WEEKS * 100, 30)}%` }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}>
            <div className="flex items-center justify-between mb-2 gap-4">
              <p className="font-heading font-bold text-[11px]">9 Zonas Operativas · Talleres Diferenciales</p>
              {pinned &&
              <button onClick={() => setPinned(false)} className="text-background/50 hover:text-background text-[11px] shrink-0">✕</button>
              }
            </div>
            <p className="text-background/60 text-[10px] mb-3">{item.dias}</p>
            <div className="space-y-2.5 max-h-[320px] overflow-y-auto pr-1">
              {popupZonas.map((z, zi) =>
              <div key={zi}>
                <p className="font-heading font-semibold text-[10px] text-accent mb-0.5 uppercase tracking-wide">
                  {z.zona} — Sede: {z.sede}
                </p>
                <div className="flex flex-wrap gap-x-2 gap-y-0.5 pl-1">
                  {z.municipios.map((m, mi) =>
                  <span key={mi} className="flex items-center gap-1 text-[9px] text-background/80">
                    <span className="w-1 h-1 rounded-full bg-accent/60 shrink-0" />{m}
                  </span>
                  )}
                </div>
              </div>
              )}
            </div>
            {!pinned && <p className="text-background/40 text-[9px] mt-2 italic">Clic en la barra para fijar</p>}
          </div>
        }
      </div>
    </div>);

};

// ─── Week Headers ────────────────────────────
const WeekHeaders: React.FC = () =>
<>
    <div className="flex mb-1">
      {MONTHS.map((m, i) =>
    <div key={i} className="text-center font-heading font-bold text-xs text-foreground border-b-2 border-primary/30 pb-1" style={{ flex: m.semanas }}>
          {m.mes}
        </div>
    )}
    </div>
    <div className="flex mb-3">
      {Array.from({ length: TOTAL_WEEKS }, (_, i) =>
    <div key={i} className="flex-1 text-center text-[10px] text-muted-foreground border-r border-border/30 pb-1">
          S{i + 1}
        </div>
    )}
    </div>
  </>;


// ─── Phase Gantt Block ───────────────────────
const PhaseBlock: React.FC<{phase: GanttPhase;showHeader?: boolean;}> = ({ phase, showHeader = true }) =>
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
      {phase.tasks.map((item, i) =>
    <GanttRow
      key={item.id}
      item={item}
      index={i}
      colorBar={phase.colorBar}
      colorBg={phase.colorBg}
      colorRing={phase.colorRing}
      colorDot={phase.colorDot} />

    )}
    </div>
  </div>;


// ─── Excel Export ────────────────────────────
function getPopupText(taskId: string): string {
  if (taskId === "c2") return ACERCAMIENTO_INSTITUCIONAL.join(" | ");
  if (taskId === "c4") return SOCIALIZACION_PLAN.join(" | ");
  if (taskId === "c6") return PRUEBA_PILOTO.join(" | ");
  if (taskId === "q2")
    return ACERCAMIENTO_LIDERES_GRUPOS
      .map((g) => `${g.grupo}: ${g.items.join(", ")}`)
      .join(" || ");
  if (taskId === "q3")
    return TALLERES_ZONAS
      .map((z) => `${z.zona} (Sede: ${z.sede}) — ${z.municipios.join(", ")}`)
      .join(" || ");
  return "";
}

// Phase color fills (ARGB) for xlsx styling
const PHASE_COLORS: Record<string, { bar: string; header: string; text: string }> = {
  cuantitativa: { bar: "FF2563EB", header: "FFD1E0FF", text: "FF1D3C7A" },
  cualitativa:  { bar: "FF16A34A", header: "FFD1FAE5", text: "FF145733" },
  procesamiento:{ bar: "FFD97706", header: "FFFEF3C7", text: "FF78380A" },
};

// Helper: apply cell style
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function styleCell(ws: XLSX.WorkSheet, addr: string, style: Record<string, any>) {
  if (!ws[addr]) ws[addr] = { t: "z", v: "" };
  ws[addr].s = style;
}

function exportToExcel() {
  const wb = XLSX.utils.book_new();

  const WEEKS = TOTAL_WEEKS;
  const weekLabels = Array.from({ length: WEEKS }, (_, i) => `S${i + 1}`);

  // ── Row 1: Month headers ──
  const monthRow: (string | null)[] = ["", "Actividad", "Período", "Dependencia", "Hito", "Detalle (popup)"];
  for (const m of MONTHS) {
    monthRow.push(m.mes);
    for (let i = 1; i < m.semanas; i++) monthRow.push(null);
  }

  // ── Row 2: Week labels ──
  const weekRow: string[] = ["", "Actividad", "Período", "Dependencia", "Hito", "Detalle (popup)", ...weekLabels];

  const aoa: (string | null)[][] = [monthRow as (string | null)[], weekRow];

  // Track row indices for styling
  const rowMeta: { type: "header" | "task" | "blank"; phase: string; taskId?: string; taskStart?: number; taskDur?: number; hito?: boolean }[] = [
    { type: "blank", phase: "" }, // row 0 = month header
    { type: "blank", phase: "" }, // row 1 = week header
  ];

  for (const phase of phases) {
    // Phase header
    aoa.push([phase.icon, phase.title, phase.dateRange, "", phase.totalDays, phase.summary.join(" · "), ...Array(WEEKS).fill("")]);
    rowMeta.push({ type: "header", phase: phase.key });

    for (const task of phase.tasks) {
      const depTask = phases.flatMap(p => p.tasks).find((t) => t.id === task.dependsOn);
      const bar: (string | null)[] = Array(WEEKS).fill("");
      for (let w = task.start; w < task.start + task.dur; w++) {
        bar[w] = task.hito ? "◆" : "█";
      }
      aoa.push([
        "",
        task.label,
        task.dias,
        depTask ? depTask.label : "—",
        task.hito ? "◆" : "",
        getPopupText(task.id),
        ...bar,
      ]);
      rowMeta.push({ type: "task", phase: phase.key, taskId: task.id, taskStart: task.start, taskDur: task.dur, hito: task.hito });
    }

    // Blank separator
    aoa.push(Array(6 + WEEKS).fill("") as string[]);
    rowMeta.push({ type: "blank", phase: "" });
  }

  const ws = XLSX.utils.aoa_to_sheet(aoa);

  // ── Apply styles ──
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const headerBase: Record<string, any> = {
    font: { bold: true, sz: 10, color: { rgb: "FF1E293B" } },
    alignment: { horizontal: "center", vertical: "center", wrapText: true },
    fill: { fgColor: { rgb: "FFE2E8F0" }, patternType: "solid" },
    border: { bottom: { style: "thin", color: { rgb: "FFCBD5E1" } } },
  };

  // Style row 0 (months) and row 1 (weeks)
  for (let c = 0; c < 6 + WEEKS; c++) {
    const addr0 = XLSX.utils.encode_cell({ r: 0, c });
    const addr1 = XLSX.utils.encode_cell({ r: 1, c });
    styleCell(ws, addr0, { ...headerBase, fill: { fgColor: { rgb: "FF1E293B" }, patternType: "solid" }, font: { bold: true, sz: 10, color: { rgb: "FFFFFFFF" } } });
    styleCell(ws, addr1, { ...headerBase });
  }

  // Style data rows
  for (let r = 2; r < rowMeta.length; r++) {
    const meta = rowMeta[r];
    const pc = PHASE_COLORS[meta.phase] ?? { bar: "FF94A3B8", header: "FFF8FAFC", text: "FF334155" };

    if (meta.type === "header") {
      for (let c = 0; c < 6 + WEEKS; c++) {
        const addr = XLSX.utils.encode_cell({ r, c });
        styleCell(ws, addr, {
          font: { bold: true, sz: 11, color: { rgb: pc.text } },
          fill: { fgColor: { rgb: pc.header }, patternType: "solid" },
          alignment: { vertical: "center", wrapText: true },
          border: { top: { style: "medium", color: { rgb: pc.bar } }, bottom: { style: "thin", color: { rgb: pc.bar } } },
        });
      }
    } else if (meta.type === "task") {
      // Style label columns
      for (let c = 0; c < 6; c++) {
        const addr = XLSX.utils.encode_cell({ r, c });
        styleCell(ws, addr, {
          font: { sz: 10, color: { rgb: "FF334155" } },
          fill: { fgColor: { rgb: "FFFAFAFA" }, patternType: "solid" },
          alignment: { vertical: "center", wrapText: c === 5 }, // wrap popup text
          border: { bottom: { style: "hair", color: { rgb: "FFE2E8F0" } } },
        });
      }
      // Style bar columns
      for (let c = 6; c < 6 + WEEKS; c++) {
        const weekIdx = c - 6;
        const isActive = meta.taskStart !== undefined && meta.taskDur !== undefined
          && weekIdx >= meta.taskStart && weekIdx < (meta.taskStart + meta.taskDur);
        const addr = XLSX.utils.encode_cell({ r, c });
        styleCell(ws, addr, {
          font: { bold: isActive, sz: meta.hito ? 12 : 10, color: { rgb: isActive ? "FFFFFFFF" : "FFCBD5E1" } },
          fill: { fgColor: { rgb: isActive ? pc.bar : "FFFFFFFF" }, patternType: "solid" },
          alignment: { horizontal: "center", vertical: "center" },
          border: { bottom: { style: "hair", color: { rgb: "FFE2E8F0" } } },
        });
      }
    }
  }

  // ── Row heights ──
  ws["!rows"] = rowMeta.map((m) => ({
    hpt: m.type === "header" ? 22 : m.type === "task" ? 18 : 6,
  }));

  // ── Column widths ──
  ws["!cols"] = [
    { wch: 4 },
    { wch: 45 },
    { wch: 26 },
    { wch: 38 },
    { wch: 6 },
    { wch: 80 },
    ...Array(WEEKS).fill({ wch: 4 }),
  ];

  // ── Merge month header cells ──
  const merges: XLSX.Range[] = [];
  let startCol = 6;
  for (const m of MONTHS) {
    merges.push({ s: { r: 0, c: startCol }, e: { r: 0, c: startCol + m.semanas - 1 } });
    startCol += m.semanas;
  }
  ws["!merges"] = merges;

  // ── Freeze top 2 rows + first 2 columns ──
  ws["!freeze"] = { xSplit: 2, ySplit: 2 };

  XLSX.utils.book_append_sheet(wb, ws, "Cronograma Gantt");

  // ── HOJA 2: Detalle Popups ─────────────────
  const popupAoa: string[][] = [
    ["Tarea", "Actividad", "Tipo", "Información Detallada"],
  ];

  for (const item of ACERCAMIENTO_INSTITUCIONAL) {
    popupAoa.push(["c2", "Acercamiento institucional", "Institución", item]);
  }
  for (const item of SOCIALIZACION_PLAN) {
    popupAoa.push(["c4", "Socialización del plan de acción", "Institución", item]);
  }
  for (const item of PRUEBA_PILOTO) {
    popupAoa.push(["c6", "Prueba piloto (1 municipio)", "Municipio", item]);
  }
  for (const g of ACERCAMIENTO_LIDERES_GRUPOS) {
    for (const it of g.items) {
      popupAoa.push(["q2", "Acercamiento líderes y actores", g.grupo, it]);
    }
  }
  for (const z of TALLERES_ZONAS) {
    for (const m of z.municipios) {
      popupAoa.push(["q3", "Talleres diferenciales — 9 zonas", `${z.zona} · Sede: ${z.sede}`, m]);
    }
  }

  const wsPopup = XLSX.utils.aoa_to_sheet(popupAoa);

  // Style popup sheet header
  for (let c = 0; c < 4; c++) {
    const addr = XLSX.utils.encode_cell({ r: 0, c });
    if (wsPopup[addr]) {
      wsPopup[addr].s = {
        font: { bold: true, sz: 11, color: { rgb: "FFFFFFFF" } },
        fill: { fgColor: { rgb: "FF1E293B" }, patternType: "solid" },
        alignment: { horizontal: "center", vertical: "center" },
      };
    }
  }

  // Color rows by task type
  const popupPhaseMap: Record<string, string> = {
    c2: "cuantitativa", c4: "cuantitativa", c6: "cuantitativa",
    q2: "cualitativa", q3: "cualitativa",
  };
  for (let r = 1; r < popupAoa.length; r++) {
    const taskId = popupAoa[r][0];
    const pc2 = PHASE_COLORS[popupPhaseMap[taskId]] ?? { header: "FFFFFFFF", text: "FF334155" };
    for (let c = 0; c < 4; c++) {
      const addr = XLSX.utils.encode_cell({ r, c });
      if (!wsPopup[addr]) wsPopup[addr] = { t: "z", v: "" };
      wsPopup[addr].s = {
        font: { sz: 10, color: { rgb: pc2.text } },
        fill: { fgColor: { rgb: pc2.header }, patternType: "solid" },
        alignment: { vertical: "center", wrapText: c === 3 },
        border: { bottom: { style: "hair", color: { rgb: "FFCBD5E1" } } },
      };
    }
  }

  wsPopup["!cols"] = [{ wch: 6 }, { wch: 42 }, { wch: 44 }, { wch: 55 }];
  wsPopup["!rows"] = popupAoa.map((_, i) => ({ hpt: i === 0 ? 20 : 15 }));
  XLSX.utils.book_append_sheet(wb, wsPopup, "Detalle Participantes y Zonas");

  XLSX.writeFile(wb, "Cronograma_Diagnostico_SAN_Cauca.xlsx");
}

// ─── MAIN COMPONENT ─────────────────────────
const GanttChart: React.FC = () => {
  const [view, setView] = useState<ViewMode>("general");

  const tabs: {key: ViewMode;label: string;}[] = [
  { key: "general", label: "Vista General" },
  { key: "cuantitativa", label: "📊 Cuantitativa" },
  { key: "cualitativa", label: "🗣️ Cualitativa" },
  { key: "procesamiento", label: "⚙️ Procesamiento" }];


  const visiblePhases = view === "general" ?
  phases :
  phases.filter((p) => p.key === view);

  return (
    <div>
      {/* ── Resumen de Fases ── */}
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {phases.map((f, i) => (
          <motion.div key={f.key} variants={scaleIn} className={`rounded-xl border p-4 ring-2 ${f.colorRing}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{f.icon}</span>
              <div>
                <p className="font-bold text-sm text-foreground">{f.title}</p>
                <p className="text-xs text-muted-foreground">{f.dateRange} · {f.totalDays}</p>
              </div>
            </div>
            <ul className="space-y-1">
              {f.summary.map((s) => (
                <li key={s} className="text-xs text-muted-foreground flex items-center gap-1">
                  <span className={`w-1.5 h-1.5 rounded-full ${f.colorBg}`} />
                  {s}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </motion.div>

      {/* ── Tab Buttons + Export ── */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {tabs.map((t) =>
        <button
          key={t.key}
          onClick={() => setView(t.key)}
          className={`px-4 py-2 rounded-full text-sm font-heading font-semibold transition-all ${
          view === t.key ?
          "bg-primary text-primary-foreground shadow-md" :
          "bg-muted text-muted-foreground hover:bg-muted/80"}`
          }>
            {t.label}
          </button>
        )}
        <button
          onClick={exportToExcel}
          className="ml-auto flex items-center gap-2 px-4 py-2 rounded-full text-sm font-heading font-semibold bg-accent text-accent-foreground hover:bg-accent/90 active:scale-95 transition-all shadow-sm"
          aria-label="Descargar cronograma en Excel"
        >
          <Download size={14} />
          Descargar Excel
        </button>
      </div>

      {/* ── Gantt Chart ── */}
      <>
        <motion.div variants={fadeUp} className="bg-card rounded-2xl border border-border p-6 overflow-x-auto">
            <div className="min-w-[900px]">
              <WeekHeaders />
              {visiblePhases.map((phase) =>
            <PhaseBlock key={phase.key} phase={phase} showHeader={true} />
            )}
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
          {view !== "general" &&
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 bg-card rounded-2xl border border-border overflow-hidden">
          
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
                  const dep = t.dependsOn ? visiblePhases[0].tasks.find((x) => x.id === t.dependsOn) : null;
                  return (
                    <tr key={t.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                          <td className="px-4 py-2.5 font-heading font-semibold text-muted-foreground">{i + 1}</td>
                          <td className="px-4 py-2.5 font-body text-foreground">{t.label}</td>
                          <td className="px-4 py-2.5 font-body text-muted-foreground whitespace-nowrap">{t.dias}</td>
                          <td className="px-4 py-2.5 font-body text-muted-foreground">{dep ? dep.label : "—"}</td>
                          <td className="px-4 py-2.5 text-center">{t.hito ? "◆" : ""}</td>
                        </tr>);

                })}
                  </tbody>
                </table>
              </div>
            </motion.div>
        }
        </>
    </div>);

};

export default GanttChart;