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
  { id: "c3b", label: "Respuesta a la solicitud enviada", start: 10, dur: 2, dias: "Abr 15–30 · 15 días", hito: true, dependsOn: "c3" },
  { id: "c4", label: "Socialización del plan de acción", start: 6, dur: 2, dias: "Mar 23 – Abr 3 · 10 días", hito: false, dependsOn: "c3" },
  { id: "c6", label: "Prueba piloto (1 municipio)", start: 10, dur: 2, dias: "Abr 15 – Abr 30 · 15 días", hito: false, dependsOn: "c4" },
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
"Fecha de Entrega de oficios del 15 al 30 de abril"];

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

// Colors matching the reference file exactly
const XL_COLORS = {
  headerDark:  "FF1F4E79",
  white:       "FFFFFFFF",
  alistFill:   "FFDEEBF7", alistBar:  "FF2E75B6", alistText: "FF2E75B6",
  diagFill:    "FFE2EFDA", diagBar:   "FF375623", diagText:  "FF375623",
  f1Fill:      "FFFFF2CC", f1Bar:     "FFBF8F00", f1Text:    "FFBF8F00",
  f2Fill:      "FFFCE4D6", f2Bar:     "FF843C0C", f2Text:    "FF843C0C",
  f3Fill:      "FFF2CEEF", f3Bar:     "FF7030A0", f3Text:    "FF7030A0",
  hitoBar:     "FFC00000",
  inactive:    "FFF7F7F7",
};

const FASE_XL: Record<string, { fill: string; bar: string; text: string }> = {
  "Alistamiento":         { fill: XL_COLORS.alistFill, bar: XL_COLORS.alistBar, text: XL_COLORS.alistText },
  "Diagnóstico":          { fill: XL_COLORS.diagFill,  bar: XL_COLORS.diagBar,  text: XL_COLORS.diagText  },
  "Fase 1 Cuantitativa":  { fill: XL_COLORS.f1Fill,    bar: XL_COLORS.f1Bar,    text: XL_COLORS.f1Text    },
  "Fase 2 Cualitativa":   { fill: XL_COLORS.f2Fill,    bar: XL_COLORS.f2Bar,    text: XL_COLORS.f2Text    },
  "Fase 3 Procesamiento": { fill: XL_COLORS.f3Fill,    bar: XL_COLORS.f3Bar,    text: XL_COLORS.f3Text    },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function xlStyle(ws: XLSX.WorkSheet, addr: string, s: Record<string, any>) {
  if (!ws[addr]) ws[addr] = { t: "z", v: "" };
  ws[addr].s = s;
}

function exportToExcel() {
  const wb = XLSX.utils.book_new();

  type Act = {
    n: number; fase: string; actividad: string; descripcion: string;
    responsable: string; recursos: string; producto: string;
    semanas: number[]; hito: boolean; labelS: string;
  };

  const activities: Act[] = [
    { n:1,  fase:"Alistamiento",         actividad:"Análisis de antecedentes de política pública",           descripcion:"Revisión y análisis de marco normativo, institucional, antecedentes de gestión e inversión y políticas existentes.",  responsable:"Equipo técnico de investigación",             recursos:"Viáticos investigadores, bases de datos DANE/ICBF",         producto:"Matrices marco normativo y marco referencial",         semanas:[1,2],         hito:false, labelS:"S1-S2" },
    { n:2,  fase:"Alistamiento",         actividad:"Mapeo de actores clave",                                 descripcion:"Identificar y analizar la relación de actores institucionales, sociales y privados relevantes.",                     responsable:"Coordinador del proyecto + enlaces territoriales",    recursos:"Transporte, material de presentación, directorio de actores",producto:"Matriz de actores",                                   semanas:[3],           hito:false, labelS:"S3"    },
    { n:3,  fase:"Alistamiento",         actividad:"Diseñar estrategia de participación",                    descripcion:"Definir mecanismos, espacios y metodologías participativas.",                                                        responsable:"Coordinador general + equipo metodológico",           recursos:"Software de diseño, material impreso",                     producto:"Estrategia de participación",                          semanas:[4],           hito:false, labelS:"S4"    },
    { n:4,  fase:"Diagnóstico",          actividad:"Levantamiento de información cuantitativa y línea base", descripcion:"Recolección de datos del problema con fuentes secundarias.",                                                        responsable:"Equipo técnico de investigación",                     recursos:"Acceso a repositorios digitales, bases de datos",          producto:"Matriz diagnóstico inicial",                           semanas:[5,6],         hito:false, labelS:"S5-S6" },
    { n:5,  fase:"Diagnóstico",          actividad:"Diagnóstico participativo",                              descripcion:"Realizar talleres y espacios participativos para identificar el problema.",                                          responsable:"Coordinadores de zona + facilitadores",               recursos:"Transporte, salones comunales, refrigerios",               producto:"Sistematización de información de los espacios participativos", semanas:[7,8], hito:false, labelS:"S7-S8" },
    { n:6,  fase:"Diagnóstico",          actividad:"Caracterización del problema",                           descripcion:"Analizar causas, efectos y magnitud del problema (árbol de problemas).",                                             responsable:"Equipo multidisciplinario",                           recursos:"Software de análisis, material bibliográfico",             producto:"Árbol de problemas",                                   semanas:[9],           hito:false, labelS:"S9"    },
    { n:7,  fase:"Diagnóstico",          actividad:"Socialización del diagnóstico",                          descripcion:"Validar resultados con actores institucionales y sociales.",                                                         responsable:"Coordinador general",                                 recursos:"Material de presentación, video beam",                     producto:"Diagnóstico validado",                                 semanas:[10],          hito:false, labelS:"S10"   },
    { n:8,  fase:"Diagnóstico",          actividad:"Diagnóstico finalizado",                                 descripcion:"Escritura del diagnóstico.",                                                                                        responsable:"Coordinador técnico + equipo redactor",               recursos:"Procesador de texto, software de diseño",                  producto:"Documento Diagnóstico",                                semanas:[11],          hito:false, labelS:"S11"   },
    { n:9,  fase:"Fase 1 Cuantitativa",  actividad:"Recolección de Información Primaria",                    descripcion:"Diseño y preparación de instrumentos de recolección de datos cuantitativos para los 42 municipios.",                 responsable:"Equipo metodológico",                                 recursos:"Equipos de cómputo, software KoBoToolbox/ODK",             producto:"Instrumentos de recolección validados",                semanas:[5,6],         hito:false, labelS:"S5-S6" },
    { n:10, fase:"Fase 1 Cuantitativa",  actividad:"Aplicación masiva de encuestas — 7.560",                 descripcion:"Aplicación de 7.560 encuestas en los 42 municipios por 420 encuestadores.",                                         responsable:"420 encuestadores coordinados por zonas",             recursos:"Honorarios, refrigerios, transporte, alojamiento",          producto:"7.560 encuestas diligenciadas y enviadas",             semanas:[12,13,14],    hito:false, labelS:"S12-S14"},
    { n:11, fase:"Fase 1 Cuantitativa",  actividad:"Prueba piloto (1 municipio — Popayán)",                  descripcion:"Aplicación piloto de instrumentos de encuesta en Popayán para validar metodología.",                                 responsable:"Equipo de campo - Zona 6",                            recursos:"Transporte, refrigerios piloto, tabletas",                 producto:"Encuesta validada con ajustes incorporados",           semanas:[11],          hito:false, labelS:"S11"   },
    { n:12, fase:"Fase 2 Cualitativa",   actividad:"Revisión de información secundaria cualitativa",         descripcion:"Análisis de fuentes cualitativas sobre SAN diferencial por grupos poblacionales y territorios.",                    responsable:"Equipo de investigación cualitativa",                 recursos:"Material bibliográfico, software atlas.ti",                producto:"Marco conceptual cualitativo SAN diferencial",         semanas:[15],          hito:false, labelS:"S15"   },
    { n:13, fase:"Fase 2 Cualitativa",   actividad:"Acercamiento a líderes y actores comunitarios",          descripcion:"Contacto con líderes comunitarios e institucionales en 9 zonas.",                                                    responsable:"Coordinadores de zona (9 zonas operativas)",          recursos:"Transporte, material de presentación",                     producto:"Listado de participantes confirmados por zona",        semanas:[15,16],       hito:false, labelS:"S15-S16"},
    { n:14, fase:"Fase 2 Cualitativa",   actividad:"Talleres diferenciales — 20 talleres / 9 zonas ◆ HITO",  descripcion:"Realización de 20 talleres participativos diferenciales en 9 zonas con 2.000 participantes.",                       responsable:"Facilitadores especializados por zona",               recursos:"Honorarios, alimentación, materiales, transporte",          producto:"20 talleres ejecutados, memorias y relatorías",        semanas:[13,14,15,16], hito:true,  labelS:"S13-S16"},
    { n:15, fase:"Fase 3 Procesamiento", actividad:"Limpieza y validación de datos",                         descripcion:"Depuración y validación de las 7.560 encuestas y registros cualitativos.",                                           responsable:"Estadísticos y analistas de datos",                   recursos:"Licencias SPSS/R/Python, computadores",                    producto:"Base de datos limpia, validada y codificada",          semanas:[14,15],       hito:false, labelS:"S14-S15"},
    { n:16, fase:"Fase 3 Procesamiento", actividad:"Procesamiento estadístico",                              descripcion:"Análisis estadístico descriptivo e inferencial de los datos cuantitativos.",                                        responsable:"Estadístico principal",                               recursos:"Licencias SPSS/Stata/R",                                   producto:"Tablas estadísticas y gráficos de resultados",         semanas:[15],          hito:false, labelS:"S15"   },
    { n:17, fase:"Fase 3 Procesamiento", actividad:"Análisis cruzado cuantitativo — cualitativo",            descripcion:"Triangulación e integración de resultados cuantitativos y cualitativos.",                                            responsable:"Equipo técnico multidisciplinario",                   recursos:"Software NVivo/R, sala de trabajo",                        producto:"Análisis integrado y triangulación de resultados",     semanas:[16],          hito:false, labelS:"S16"   },
    { n:18, fase:"Fase 3 Procesamiento", actividad:"Redacción informe diagnóstico ◆ HITO",                   descripcion:"Elaboración del informe final del diagnóstico departamental SAN del Cauca 2026.",                                   responsable:"Coordinador técnico y equipo redactor",               recursos:"Honorarios redactor, software de diseño",                  producto:"Informe diagnóstico SAN Cauca 2026 (borrador final)",  semanas:[16],          hito:true,  labelS:"S16"   },
    { n:19, fase:"Fase 3 Procesamiento", actividad:"Presentación ante el CDSAN",                             descripcion:"Presentación oficial del diagnóstico SAN ante el Comité Departamental.",                                           responsable:"Director del proyecto",                               recursos:"Impresión informes, video beam, sistema de audio",          producto:"Diagnóstico presentado y validado por CDSAN",          semanas:[16],          hito:false, labelS:"S16"   },
  ];

  const TOTAL_W = 16;
  const TOTAL_COLS = 7 + TOTAL_W; // 23

  // ── ROW 0: TITLE ──────────────────────────────────────────────────
  // Cols A-W = 0-22; rows are 0-indexed in XLSX aoa
  const titleRow: (string | null)[] = Array(TOTAL_COLS).fill(null);
  titleRow[0] = "CRONOGRAMA PLAN DE ACCIÓN SAN – CAUCA 2026";

  // ── ROW 1: COLUMN HEADERS + MONTH SPANS ──────────────────────────
  const headerRow: (string | null)[] = [
    "N°", "Fase", "Actividad", "Descripción", "Responsable",
    "Recursos Necesarios\n(financieros, técnicos, humanos, logísticos)",
    "Producto Esperado",
    "feb-26", null, null, null,
    "mar-26", null, null, null,
    "abr-26", null, null, null,
    "may-26", null, null, null,
  ];

  // ── ROW 2: WEEK LABELS ────────────────────────────────────────────
  const weekRow: (string | null)[] = [
    null, null, null, null, null, null, null,
    ...Array.from({ length: TOTAL_W }, (_, i) => `S${i + 1}`),
  ];

  const aoa: (string | null)[][] = [titleRow, headerRow, weekRow];

  // ── ROWS 3-21: ACTIVITIES ─────────────────────────────────────────
  for (const act of activities) {
    const weekCells: (string | null)[] = Array(TOTAL_W).fill(null);
    let isFirst = true;
    for (const s of act.semanas) {
      if (s >= 1 && s <= TOTAL_W) {
        weekCells[s - 1] = isFirst ? act.labelS : "";
        isFirst = false;
      }
    }
    aoa.push([
      String(act.n), act.fase, act.actividad, act.descripcion,
      act.responsable, act.recursos, act.producto, ...weekCells,
    ]);
  }

  // ── ROW 22: BLANK SEPARATOR ───────────────────────────────────────
  aoa.push(Array(TOTAL_COLS).fill(""));

  // ── ROW 23: LEGEND ───────────────────────────────────────────────
  const legendRow: (string | null)[] = [
    "LEYENDA:", "Alistamiento", "Diagnóstico", "Fase 1 Cuantitativa",
    "Fase 2 Cualitativa", "Fase 3 Procesamiento", "Actividad activa", "Hito ◆",
    ...Array(TOTAL_COLS - 8).fill(null),
  ];
  aoa.push(legendRow);

  const ws = XLSX.utils.aoa_to_sheet(aoa);

  const thin = { style: "thin", color: { rgb: "FFBFBFBF" } };
  const bd = { left: thin, right: thin, top: thin, bottom: thin };

  // ── Style ROW 0: Title ─────────────────────────────────────────────
  for (let c = 0; c < TOTAL_COLS; c++) {
    xlStyle(ws, XLSX.utils.encode_cell({ r: 0, c }), {
      font: { bold: true, sz: 12, color: { rgb: XL_COLORS.white }, name: "Calibri" },
      fill: { fgColor: { rgb: XL_COLORS.headerDark }, patternType: "solid" },
      alignment: { horizontal: "center", vertical: "center", wrapText: false },
      border: bd,
    });
  }

  // ── Style ROW 1: Headers + month labels ───────────────────────────
  for (let c = 0; c < TOTAL_COLS; c++) {
    xlStyle(ws, XLSX.utils.encode_cell({ r: 1, c }), {
      font: { bold: true, sz: 9, color: { rgb: XL_COLORS.white }, name: "Calibri" },
      fill: { fgColor: { rgb: XL_COLORS.headerDark }, patternType: "solid" },
      alignment: { horizontal: "center", vertical: "center", wrapText: true },
      border: bd,
    });
  }

  // ── Style ROW 2: Week labels ───────────────────────────────────────
  for (let c = 0; c < TOTAL_COLS; c++) {
    xlStyle(ws, XLSX.utils.encode_cell({ r: 2, c }), {
      font: { bold: true, sz: 9, color: { rgb: XL_COLORS.white }, name: "Calibri" },
      fill: { fgColor: { rgb: XL_COLORS.headerDark }, patternType: "solid" },
      alignment: { horizontal: "center", vertical: "center", wrapText: false },
      border: bd,
    });
  }

  // ── Style ROWS 3-21: Activities ────────────────────────────────────
  for (let i = 0; i < activities.length; i++) {
    const act = activities[i];
    const r = i + 3;
    const fase = act.fase as keyof typeof FASE_XL;
    const fc = FASE_XL[fase] ?? FASE_XL["Alistamiento"];
    const barColor = act.hito ? XL_COLORS.hitoBar : fc.bar;

    // Label columns 0-6
    const labelStyles = [
      { bold: true,  color: fc.text,       sz: 10, align: "center" }, // N°
      { bold: true,  color: fc.text,       sz: 9,  align: "left"   }, // Fase
      { bold: true,  color: "FF000000",    sz: 9,  align: "left"   }, // Actividad
      { bold: false, color: "FF000000",    sz: 9,  align: "left"   }, // Descripción
      { bold: false, color: "FF000000",    sz: 9,  align: "left"   }, // Responsable
      { bold: false, color: "FF000000",    sz: 9,  align: "left"   }, // Recursos
      { bold: false, color: "FF000000",    sz: 9,  align: "left"   }, // Producto
    ];
    for (let c = 0; c < 7; c++) {
      const ls = labelStyles[c];
      xlStyle(ws, XLSX.utils.encode_cell({ r, c }), {
        font: { bold: ls.bold, sz: ls.sz, color: { rgb: ls.color }, name: "Calibri" },
        fill: { fgColor: { rgb: fc.fill }, patternType: "solid" },
        alignment: { horizontal: ls.align, vertical: "center", wrapText: true },
        border: bd,
      });
    }

    // Week columns 7-22
    const activeSet = new Set(act.semanas);
    for (let c = 7; c < 7 + TOTAL_W; c++) {
      const wi = c - 6; // 1-indexed
      const isActive = activeSet.has(wi);
      xlStyle(ws, XLSX.utils.encode_cell({ r, c }), {
        font: { bold: act.hito && isActive, sz: 9, color: { rgb: isActive ? XL_COLORS.white : XL_COLORS.inactive }, name: "Calibri" },
        fill: { fgColor: { rgb: isActive ? barColor : XL_COLORS.inactive }, patternType: "solid" },
        alignment: { horizontal: "center", vertical: "center", wrapText: false },
        border: bd,
      });
    }
  }

  // ── Style LEGEND ROW ──────────────────────────────────────────────
  const legendRow_r = activities.length + 4; // row index
  const legendStyles: { fill: string; text: string }[] = [
    { fill: "FFFFFFFF",            text: "FF000000" }, // LEYENDA:
    { fill: XL_COLORS.alistFill,   text: XL_COLORS.alistText  },
    { fill: XL_COLORS.diagFill,    text: XL_COLORS.diagText   },
    { fill: XL_COLORS.f1Fill,      text: XL_COLORS.f1Text     },
    { fill: XL_COLORS.f2Fill,      text: XL_COLORS.f2Text     },
    { fill: XL_COLORS.f3Fill,      text: XL_COLORS.f3Text     },
    { fill: XL_COLORS.alistBar,    text: XL_COLORS.white      }, // Actividad activa
    { fill: XL_COLORS.hitoBar,     text: XL_COLORS.white      }, // Hito
  ];
  for (let c = 0; c < legendStyles.length; c++) {
    const ls = legendStyles[c];
    xlStyle(ws, XLSX.utils.encode_cell({ r: legendRow_r, c }), {
      font: { bold: true, sz: 9, color: { rgb: ls.text }, name: "Calibri" },
      fill: { fgColor: { rgb: ls.fill }, patternType: "solid" },
      alignment: { horizontal: "center", vertical: "center", wrapText: false },
      border: bd,
    });
  }

  // ── MERGES ───────────────────────────────────────────────────────
  const merges: XLSX.Range[] = [];
  // Row 0: full title
  merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: TOTAL_COLS - 1 } });
  // Rows 1-2: merge label cols vertically
  for (let c = 0; c < 7; c++) {
    merges.push({ s: { r: 1, c }, e: { r: 2, c } });
  }
  // Row 1: month spans (4 cols each)
  for (let m = 0; m < 4; m++) {
    const sc = 7 + m * 4;
    merges.push({ s: { r: 1, c: sc }, e: { r: 1, c: sc + 3 } });
  }
  ws["!merges"] = merges;

  // ── COLUMN WIDTHS ────────────────────────────────────────────────
  ws["!cols"] = [
    { wch: 4  }, // N°
    { wch: 16 }, // Fase
    { wch: 22 }, // Actividad
    { wch: 40 }, // Descripción
    { wch: 22 }, // Responsable
    { wch: 32 }, // Recursos
    { wch: 28 }, // Producto
    { wch: 8  }, // S1 (wider for label)
    ...Array(TOTAL_W - 1).fill({ wch: 4.5 }),
  ];

  // ── ROW HEIGHTS ──────────────────────────────────────────────────
  ws["!rows"] = [
    { hpt: 22 }, // title
    { hpt: 20 }, // headers
    { hpt: 18 }, // week labels
    ...Array(activities.length).fill({ hpt: 48 }),
    { hpt: 6  }, // separator
    { hpt: 18 }, // legend
  ];

  // ── FREEZE panes at H4 (after 3 header rows, after G col) ────────
  ws["!freeze"] = { xSplit: 7, ySplit: 3 };

  XLSX.utils.book_append_sheet(wb, ws, "Cronograma Gantt");

  XLSX.writeFile(wb, "CronogramaSAN_Cauca_2026.xlsx");
}



  const activities: ActivityRow[] = [
    { n: 1, fase: "Alistamiento", actividad: "Análisis de antecedentes de política pública", descripcion: "Revisión y análisis de marco normativo, institucional, antecedentes de gestión e inversión y políticas existentes.", responsable: "Equipo técnico de investigación", recursos: "Viáticos investigadores, bases de datos DANE/ICBF", producto: "Matrices marco normativo y marco referencial", semanas: [1, 2], hito: false, faseKey: "alistamiento" },
    { n: 2, fase: "Alistamiento", actividad: "Mapeo de actores clave", descripcion: "Identificar y analizar la relación de actores institucionales, sociales y privados relevantes.", responsable: "Coordinador del proyecto + enlaces territoriales", recursos: "Transporte, material de presentación, directorio de actores", producto: "Matriz de actores", semanas: [3], hito: false, faseKey: "alistamiento" },
    { n: 3, fase: "Alistamiento", actividad: "Diseñar estrategia de participación", descripcion: "Definir mecanismos, espacios y metodologías participativas.", responsable: "Coordinador general + equipo metodológico", recursos: "Software de diseño, material impreso", producto: "Estrategia de participación", semanas: [4], hito: false, faseKey: "alistamiento" },
    { n: 4, fase: "Diagnóstico", actividad: "Levantamiento de información cuantitativa y línea base", descripcion: "Recolección de datos del problema con fuentes secundarias.", responsable: "Equipo técnico de investigación", recursos: "Acceso a repositorios digitales, bases de datos", producto: "Matriz diagnóstico inicial", semanas: [5, 6], hito: false, faseKey: "diagnostico" },
    { n: 5, fase: "Diagnóstico", actividad: "Diagnóstico participativo", descripcion: "Realizar talleres y espacios participativos para identificar el problema.", responsable: "Coordinadores de zona + facilitadores", recursos: "Transporte, salones comunales, refrigerios", producto: "Sistematización de información de los espacios participativos", semanas: [7, 8], hito: false, faseKey: "diagnostico" },
    { n: 6, fase: "Diagnóstico", actividad: "Caracterización del problema", descripcion: "Analizar causas, efectos y magnitud del problema (árbol de problemas).", responsable: "Equipo multidisciplinario", recursos: "Software de análisis, material bibliográfico", producto: "Árbol de problemas", semanas: [9], hito: false, faseKey: "diagnostico" },
    { n: 7, fase: "Diagnóstico", actividad: "Socialización del diagnóstico", descripcion: "Validar resultados con actores institucionales y sociales.", responsable: "Coordinador general", recursos: "Material de presentación, video beam", producto: "Diagnóstico validado", semanas: [10], hito: false, faseKey: "diagnostico" },
    { n: 8, fase: "Diagnóstico", actividad: "Diagnóstico finalizado", descripcion: "Escritura del diagnóstico.", responsable: "Coordinador técnico + equipo redactor", recursos: "Procesador de texto, software de diseño", producto: "Documento Diagnóstico", semanas: [11], hito: false, faseKey: "diagnostico" },
    { n: 9, fase: "Fase 1 Cuantitativa", actividad: "Recolección de Información Primaria", descripcion: "Diseño y preparación de instrumentos de recolección de datos cuantitativos para los 42 municipios.", responsable: "Equipo metodológico", recursos: "Equipos de cómputo, software KoBoToolbox/ODK", producto: "Instrumentos de recolección validados", semanas: [5, 6], hito: false, faseKey: "fase1" },
    { n: 10, fase: "Fase 1 Cuantitativa", actividad: "Aplicación masiva de encuestas — 7.560", descripcion: "Aplicación de 7.560 encuestas en los 42 municipios por 420 encuestadores.", responsable: "420 encuestadores coordinados por zonas", recursos: "Honorarios, refrigerios, transporte, alojamiento", producto: "7.560 encuestas diligenciadas y enviadas", semanas: [12, 13, 14], hito: false, faseKey: "fase1" },
    { n: 11, fase: "Fase 1 Cuantitativa", actividad: "Prueba piloto (1 municipio — Popayán)", descripcion: "Aplicación piloto de instrumentos de encuesta en Popayán para validar metodología.", responsable: "Equipo de campo - Zona 6", recursos: "Transporte, refrigerios piloto, tabletas", producto: "Encuesta validada con ajustes incorporados", semanas: [11], hito: false, faseKey: "fase1" },
    { n: 12, fase: "Fase 2 Cualitativa", actividad: "Revisión de información secundaria cualitativa", descripcion: "Análisis de fuentes cualitativas sobre SAN diferencial por grupos poblacionales y territorios.", responsable: "Equipo de investigación cualitativa", recursos: "Material bibliográfico, software atlas.ti", producto: "Marco conceptual cualitativo SAN diferencial", semanas: [15], hito: false, faseKey: "fase2" },
    { n: 13, fase: "Fase 2 Cualitativa", actividad: "Acercamiento a líderes y actores comunitarios", descripcion: "Contacto con líderes comunitarios e institucionales en 9 zonas.", responsable: "Coordinadores de zona (9 zonas operativas)", recursos: "Transporte, material de presentación", producto: "Listado de participantes confirmados por zona", semanas: [15, 16], hito: false, faseKey: "fase2" },
    { n: 14, fase: "Fase 2 Cualitativa", actividad: "Talleres diferenciales — 20 talleres / 9 zonas ◆ HITO", descripcion: "Realización de 20 talleres participativos diferenciales en 9 zonas con 2.000 participantes.", responsable: "Facilitadores especializados por zona", recursos: "Honorarios, alimentación, materiales, transporte", producto: "20 talleres ejecutados, memorias y relatorías", semanas: [13, 14, 15, 16], hito: true, faseKey: "fase2" },
    { n: 15, fase: "Fase 3 Procesamiento", actividad: "Limpieza y validación de datos", descripcion: "Depuración y validación de las 7.560 encuestas y registros cualitativos.", responsable: "Estadísticos y analistas de datos", recursos: "Licencias SPSS/R/Python, computadores", producto: "Base de datos limpia, validada y codificada", semanas: [14, 15], hito: false, faseKey: "fase3" },
    { n: 16, fase: "Fase 3 Procesamiento", actividad: "Procesamiento estadístico", descripcion: "Análisis estadístico descriptivo e inferencial de los datos cuantitativos.", responsable: "Estadístico principal", recursos: "Licencias SPSS/Stata/R", producto: "Tablas estadísticas y gráficos de resultados", semanas: [15], hito: false, faseKey: "fase3" },
    { n: 17, fase: "Fase 3 Procesamiento", actividad: "Análisis cruzado cuantitativo — cualitativo", descripcion: "Triangulación e integración de resultados cuantitativos y cualitativos.", responsable: "Equipo técnico multidisciplinario", recursos: "Software NVivo/R, sala de trabajo", producto: "Análisis integrado y triangulación de resultados", semanas: [16], hito: false, faseKey: "fase3" },
    { n: 18, fase: "Fase 3 Procesamiento", actividad: "Redacción informe diagnóstico ◆ HITO", descripcion: "Elaboración del informe final del diagnóstico departamental SAN del Cauca 2026.", responsable: "Coordinador técnico y equipo redactor", recursos: "Honorarios redactor, software de diseño", producto: "Informe diagnóstico SAN Cauca 2026 (borrador final)", semanas: [16], hito: true, faseKey: "fase3" },
    { n: 19, fase: "Fase 3 Procesamiento", actividad: "Presentación ante el CDSAN", descripcion: "Presentación oficial del diagnóstico SAN ante el Comité Departamental.", responsable: "Director del proyecto", recursos: "Impresión informes, video beam, sistema de audio", producto: "Diagnóstico presentado y validado por CDSAN", semanas: [16], hito: false, faseKey: "fase3" },
  ];

  // Phase color fills (ARGB)
  const FASE_COLORS: Record<string, { bar: string; header: string; text: string; rowFill: string }> = {
    alistamiento: { bar: "FF7C3AED", header: "FFEDE9FE", text: "FF4C1D95", rowFill: "FFF5F3FF" },
    diagnostico:  { bar: "FF0284C7", header: "FFE0F2FE", text: "FF0C4A6E", rowFill: "FFF0F9FF" },
    fase1:        { bar: "FF2563EB", header: "FFD1E0FF", text: "FF1D3C7A", rowFill: "FFF8FAFF" },
    fase2:        { bar: "FF16A34A", header: "FFD1FAE5", text: "FF145733", rowFill: "FFF0FDF4" },
    fase3:        { bar: "FFD97706", header: "FFFEF3C7", text: "FF78380A", rowFill: "FFFFFBEB" },
  };

  // 16 weeks mapped to months: Feb(S1-S4), Mar(S5-S8), Abr(S9-S12), May(S13-S16)
  const WEEK_MONTHS = [
    { mes: "feb-26", weeks: [1,2,3,4] },
    { mes: "mar-26", weeks: [5,6,7,8] },
    { mes: "abr-26", weeks: [9,10,11,12] },
    { mes: "may-26", weeks: [13,14,15,16] },
  ];
  const TOTAL_W = 16;

  // ── Build header rows ──
  const titleRow: (string | null)[] = [
    "N°", "Fase", "Actividad", "Descripción", "Responsable",
    "Recursos Necesarios (financieros, técnicos, humanos, logísticos)",
    "Producto Esperado",
  ];
  for (const wm of WEEK_MONTHS) {
    titleRow.push(wm.mes);
    for (let i = 1; i < 4; i++) titleRow.push(null);
  }

  const weekLabelRow: (string | null)[] = [
    "", "", "", "", "", "", "",
    ...Array.from({ length: TOTAL_W }, (_, i) => `S${i + 1}`),
  ];

  const aoa: (string | null)[][] = [titleRow, weekLabelRow];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rowMeta2: { faseKey: string; hito: boolean; semanas: number[] }[] = [];

  for (const act of activities) {
    const weekCells: string[] = Array(TOTAL_W).fill("");
    for (const s of act.semanas) {
      if (s >= 1 && s <= TOTAL_W) weekCells[s - 1] = act.hito ? "◆" : "█";
    }
    aoa.push([
      String(act.n),
      act.fase,
      act.actividad,
      act.descripcion,
      act.responsable,
      act.recursos,
      act.producto,
      ...weekCells,
    ]);
    rowMeta2.push({ faseKey: act.faseKey, hito: act.hito, semanas: act.semanas });
  }

  const ws = XLSX.utils.aoa_to_sheet(aoa);

  // ── Apply styles ──
  const TOTAL_COLS = 7 + TOTAL_W;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function styleCell2(addr: string, style: Record<string, any>) {
    if (!ws[addr]) ws[addr] = { t: "z", v: "" };
    ws[addr].s = style;
  }

  // Row 0: month header (dark)
  for (let c = 0; c < TOTAL_COLS; c++) {
    styleCell2(XLSX.utils.encode_cell({ r: 0, c }), {
      font: { bold: true, sz: 11, color: { rgb: "FFFFFFFF" }, name: "Arial" },
      fill: { fgColor: { rgb: "FF1E293B" }, patternType: "solid" },
      alignment: { horizontal: "center", vertical: "center", wrapText: true },
      border: { bottom: { style: "medium", color: { rgb: "FF475569" } } },
    });
  }

  // Row 1: week labels
  for (let c = 0; c < TOTAL_COLS; c++) {
    styleCell2(XLSX.utils.encode_cell({ r: 1, c }), {
      font: { bold: true, sz: 9, color: { rgb: "FF334155" }, name: "Arial" },
      fill: { fgColor: { rgb: "FFE2E8F0" }, patternType: "solid" },
      alignment: { horizontal: "center", vertical: "center" },
      border: { bottom: { style: "thin", color: { rgb: "FFCBD5E1" } } },
    });
  }

  // Data rows (row 2+)
  for (let r = 0; r < rowMeta2.length; r++) {
    const meta = rowMeta2[r];
    const pc = FASE_COLORS[meta.faseKey] ?? { bar: "FF94A3B8", header: "FFF8FAFC", text: "FF334155", rowFill: "FFFFFFFF" };
    const excelRow = r + 2;

    // Text columns (0..6)
    for (let c = 0; c < 7; c++) {
      styleCell2(XLSX.utils.encode_cell({ r: excelRow, c }), {
        font: { sz: 10, bold: c === 0 || c === 2, color: { rgb: c === 0 ? pc.text : "FF334155" }, name: "Arial" },
        fill: { fgColor: { rgb: pc.rowFill }, patternType: "solid" },
        alignment: { vertical: "center", wrapText: true, horizontal: c === 0 ? "center" : "left" },
        border: {
          bottom: { style: "hair", color: { rgb: "FFE2E8F0" } },
          right: c === 6 ? { style: "thin", color: { rgb: "FFCBD5E1" } } : undefined,
        },
      });
    }

    // Week bar columns (7..7+TOTAL_W)
    for (let c = 7; c < 7 + TOTAL_W; c++) {
      const weekIdx = c - 7 + 1; // 1-indexed
      const isActive = meta.semanas.includes(weekIdx);
      styleCell2(XLSX.utils.encode_cell({ r: excelRow, c }), {
        font: { bold: isActive && meta.hito, sz: meta.hito && isActive ? 13 : 10, color: { rgb: isActive ? "FFFFFFFF" : "FFCBD5E1" }, name: "Arial" },
        fill: { fgColor: { rgb: isActive ? pc.bar : "FFFFFFFF" }, patternType: "solid" },
        alignment: { horizontal: "center", vertical: "center" },
        border: { bottom: { style: "hair", color: { rgb: "FFE2E8F0" } }, right: { style: "hair", color: { rgb: "FFE2E8F0" } } },
      });
    }
  }

  // ── Merge month header cells ──
  const merges: XLSX.Range[] = [];
  // Merge first 7 cols in row 0
  merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: 6 } });
  // Also merge row 0 & row 1 for label cols
  for (let c = 0; c < 7; c++) {
    merges.push({ s: { r: 0, c }, e: { r: 1, c } });
  }
  // Month spans in header row
  let startCol = 7;
  for (const wm of WEEK_MONTHS) {
    merges.push({ s: { r: 0, c: startCol }, e: { r: 0, c: startCol + 3 } });
    startCol += 4;
  }
  ws["!merges"] = merges;

  // ── Column widths ──
  ws["!cols"] = [
    { wch: 4 },   // N°
    { wch: 20 },  // Fase
    { wch: 42 },  // Actividad
    { wch: 55 },  // Descripción
    { wch: 36 },  // Responsable
    { wch: 48 },  // Recursos
    { wch: 42 },  // Producto
    ...Array(TOTAL_W).fill({ wch: 5 }), // week cols
  ];

  // ── Row heights ──
  ws["!rows"] = [
    { hpt: 28 }, // month header
    { hpt: 16 }, // week labels
    ...rowMeta2.map(() => ({ hpt: 50 })),
  ];

  // ── Freeze top 2 rows + first 3 columns ──
  ws["!freeze"] = { xSplit: 3, ySplit: 2 };

  XLSX.utils.book_append_sheet(wb, ws, "Cronograma Gantt");

  XLSX.writeFile(wb, "CronogramaSAN_Cauca_2026.xlsx");
}








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