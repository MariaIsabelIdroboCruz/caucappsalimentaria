import React from "react";
import SlideLayout from "./SlideLayout";
import heroCauca from "@/assets/hero-cauca.jpg";
import escudoCauca from "@/assets/escudo-cauca.png";
import logoAgricultura from "@/assets/logo-agricultura.png";

// ─── Reusable sub-components ───────────────────────────────

const SectionTitle: React.FC<{ children: React.ReactNode; accent?: boolean }> = ({ children, accent }) => (
  <h2 className={`font-heading font-bold text-[42px] mb-8 leading-tight ${accent ? "text-slide-red" : "text-slide-green"}`}>
    {children}
  </h2>
);

const Bullet: React.FC<{ children: React.ReactNode; color?: string }> = ({ children, color }) => (
  <li className="flex items-start gap-4 mb-3">
    <span className={`mt-2 w-3 h-3 rounded-full shrink-0 ${color || "bg-slide-green"}`} />
    <span className="text-[24px] leading-relaxed text-foreground">{children}</span>
  </li>
);

const TableCell: React.FC<{ children: React.ReactNode; header?: boolean; accent?: boolean }> = ({
  children,
  header,
  accent,
}) => (
  <td
    className={`border border-border px-5 py-3 text-[18px] ${
      header
        ? "bg-slide-green text-primary-foreground font-heading font-semibold text-[20px]"
        : accent
        ? "bg-slide-green-light"
        : ""
    }`}
  >
    {children}
  </td>
);

const GanttBar: React.FC<{
  label: string;
  startCol: number;
  span: number;
  color?: string;
  row: number;
}> = ({ label, startCol, span, color, row }) => (
  <div
    className="absolute h-[36px] rounded-md flex items-center justify-center text-[14px] font-heading font-semibold text-primary-foreground px-2 overflow-hidden whitespace-nowrap"
    style={{
      left: `${(startCol / 20) * 100}%`,
      width: `${(span / 20) * 100}%`,
      top: row * 48 + 4,
      backgroundColor: color || "hsl(145,63%,32%)",
    }}
  >
    {label}
  </div>
);

// ─── SLIDES ────────────────────────────────────────────────

export function CoverSlide() {
  return (
    <SlideLayout variant="cover">
      <div className="absolute inset-0">
        <img src={heroCauca} alt="Cauca" className="w-full h-full object-cover opacity-30" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground via-foreground/80 to-foreground/40" />
      </div>
      <div className="relative z-10 flex flex-col h-full px-20 py-16">
        {/* Logos */}
        <div className="flex items-center gap-8 mb-auto">
          <img src={escudoCauca} alt="Escudo Cauca" className="h-[90px] w-auto" />
          <img src={logoAgricultura} alt="Sec. Agricultura" className="h-[90px] w-auto" />
          <div className="ml-6 text-primary-foreground/70 font-body text-[20px]">
            Gobernación del Cauca<br />
            Secretaría de Agricultura y Desarrollo Rural
          </div>
        </div>
        {/* Title */}
        <div className="flex-1 flex flex-col justify-center max-w-[1400px]">
          <div className="h-[6px] w-[120px] bg-slide-green rounded mb-8" />
          <h1 className="font-heading font-black text-[58px] text-primary-foreground leading-[1.15] mb-6">
            Construcción de la Política Pública de<br />
            <span className="text-slide-gold">Seguridad y Soberanía Alimentaria</span><br />
            en el Departamento del Cauca
          </h1>
          <p className="text-[28px] text-primary-foreground/70 font-body mb-4">
            Plan de Acción Pre-Fases y Cronograma de Implementación
          </p>
          <div className="flex items-center gap-6 mt-6">
            <span className="bg-slide-green text-primary-foreground px-6 py-2 rounded-full font-heading font-semibold text-[20px]">
              Febrero 2026
            </span>
            <span className="text-primary-foreground/50 text-[20px] font-body">
              Fase III — Factibilidad
            </span>
          </div>
        </div>
        <div className="h-[4px] w-full bg-slide-red rounded mt-8" />
      </div>
    </SlideLayout>
  );
}

export function ContextSlide() {
  return (
    <SlideLayout>
      <SectionTitle>Contexto del Proyecto</SectionTitle>
      <div className="grid grid-cols-2 gap-12">
        <div>
          <ul className="list-none">
            <Bullet><strong>Objetivo General:</strong> Generar estrategia para la garantía progresiva del derecho a la alimentación en el Cauca</Bullet>
            <Bullet><strong>Presupuesto Total:</strong> $943.381.615</Bullet>
            <Bullet><strong>Duración:</strong> 12 meses (Feb 2026 – Ene 2027)</Bullet>
            <Bullet><strong>Fase Actual:</strong> III — Factibilidad</Bullet>
          </ul>
        </div>
        <div className="bg-slide-green-light rounded-2xl p-10">
          <h3 className="font-heading font-bold text-[28px] text-slide-green mb-6">Enfoques Diferenciales</h3>
          <div className="grid grid-cols-2 gap-4">
            {["Ciclos de Vida", "Género", "Étnico", "Campesino"].map((e) => (
              <div key={e} className="bg-primary-foreground rounded-xl px-5 py-4 text-center shadow-sm">
                <span className="font-heading font-semibold text-[22px] text-slide-green">{e}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SlideLayout>
  );
}

export function AntecedentesSlide() {
  return (
    <SlideLayout>
      <SectionTitle>Antecedentes</SectionTitle>
      <ul className="list-none max-w-[1600px]">
        <Bullet>El Cauca presenta altos índices de <strong>inseguridad alimentaria</strong>, especialmente en zonas rurales y comunidades étnicas (DANE)</Bullet>
        <Bullet>Brechas significativas entre población urbana y rural en acceso a alimentos nutritivos</Bullet>
        <Bullet>Ausencia de una <strong>política pública departamental</strong> que articule esfuerzos institucionales</Bullet>
        <Bullet>Necesidad de construir información diagnóstica con enfoque territorial y diferencial</Bullet>
        <Bullet>Contribución directa al <strong>Plan de Desarrollo Departamental 2024-2027</strong></Bullet>
      </ul>
      <div className="mt-10 bg-slide-red-light border-l-4 border-slide-red rounded-r-xl px-8 py-5">
        <p className="text-[22px] text-slide-red font-semibold">
          ⚠ Sin política pública, las acciones son fragmentadas y sin seguimiento articulado
        </p>
      </div>
    </SlideLayout>
  );
}

export function JustificacionSlide() {
  return (
    <SlideLayout>
      <SectionTitle>Justificación y Marco Legal</SectionTitle>
      <div className="grid grid-cols-2 gap-12">
        <div>
          <h3 className="font-heading font-bold text-[28px] text-slide-green mb-5">Justificación</h3>
          <ul className="list-none">
            <Bullet>Alineación con el <strong>Plan de Desarrollo 2024-2027</strong></Bullet>
            <Bullet>Cumplimiento del <strong>derecho humano a la alimentación</strong></Bullet>
            <Bullet>Articulación con lineamientos <strong>PMA-FAO</strong></Bullet>
            <Bullet>Respuesta a realidades territoriales con enfoque diferencial</Bullet>
          </ul>
        </div>
        <div>
          <h3 className="font-heading font-bold text-[28px] text-slide-red mb-5">Marco Normativo</h3>
          <div className="space-y-4">
            {[
              { norm: "Ley 715/2001", desc: "Competencias departamentales" },
              { norm: "CONPES 113/2008", desc: "Política Nacional SAN" },
              { norm: "PMA-FAO", desc: "Metodologías CARI/FIES" },
              { norm: "Derechos Humanos", desc: "Derecho a alimentación" },
              { norm: "Plan Desarrollo", desc: "Cauca 2024-2027" },
            ].map((n) => (
              <div key={n.norm} className="flex items-center gap-4 bg-slide-green-light rounded-xl px-6 py-3">
                <span className="font-heading font-bold text-[20px] text-slide-green min-w-[180px]">{n.norm}</span>
                <span className="text-[20px] text-foreground">{n.desc}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SlideLayout>
  );
}

export function ProblemaSlide() {
  return (
    <SlideLayout>
      <SectionTitle accent>Análisis del Problema — Árbol de Problemas</SectionTitle>
      <div className="flex flex-col items-center">
        {/* Effects */}
        <div className="flex gap-6 mb-4">
          {[
            "Brechas sociales y desigualdad alimentaria",
            "Políticas sin enfoque diferencial",
            "Desarticulación institucional",
          ].map((e) => (
            <div key={e} className="bg-slide-red-light border border-slide-red rounded-xl px-6 py-4 text-center max-w-[320px]">
              <span className="text-[18px] font-semibold text-slide-red">↑ EFECTO</span>
              <p className="text-[18px] mt-1">{e}</p>
            </div>
          ))}
        </div>
        <div className="w-0 h-8 border-l-2 border-slide-red border-dashed" />
        {/* Central problem */}
        <div className="bg-slide-red text-primary-foreground rounded-2xl px-10 py-6 text-center max-w-[800px] shadow-lg">
          <span className="text-[16px] font-heading uppercase tracking-wider opacity-80">Problema Central</span>
          <p className="text-[24px] font-heading font-bold mt-2">
            Limitada garantía del derecho a la alimentación en el Departamento del Cauca
          </p>
        </div>
        <div className="w-0 h-8 border-l-2 border-slide-green border-dashed" />
        {/* Causes */}
        <div className="flex gap-6">
          {[
            "Limitada información diagnóstica territorial",
            "Ausencia de política pública departamental SAN",
            "Débil seguimiento y evaluación de acciones",
          ].map((c) => (
            <div key={c} className="bg-slide-green-light border border-slide-green rounded-xl px-6 py-4 text-center max-w-[320px]">
              <span className="text-[18px] font-semibold text-slide-green">↓ CAUSA</span>
              <p className="text-[18px] mt-1">{c}</p>
            </div>
          ))}
        </div>
      </div>
    </SlideLayout>
  );
}

export function ParticipantesSlide() {
  return (
    <SlideLayout>
      <SectionTitle>Participantes y Análisis de Actores</SectionTitle>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <TableCell header>Actor</TableCell>
            <TableCell header>Rol</TableCell>
            <TableCell header>Contribución</TableCell>
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
          ].map(([actor, rol, contrib]) => (
            <tr key={actor}>
              <TableCell accent>{actor}</TableCell>
              <TableCell>{rol}</TableCell>
              <TableCell>{contrib}</TableCell>
            </tr>
          ))}
        </tbody>
      </table>
    </SlideLayout>
  );
}

export function PoblacionSlide() {
  return (
    <SlideLayout>
      <SectionTitle>Población Objetivo</SectionTitle>
      <div className="grid grid-cols-2 gap-12">
        <div>
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slide-green rounded-2xl px-6 py-5 text-center">
              <span className="text-primary-foreground text-[18px] font-body">Población Afectada</span>
              <p className="text-primary-foreground font-heading font-black text-[38px]">1.590.171</p>
            </div>
            <div className="bg-slide-red rounded-2xl px-6 py-5 text-center">
              <span className="text-primary-foreground text-[18px] font-body">Con Inseg. Alimentaria</span>
              <p className="text-primary-foreground font-heading font-black text-[38px]">466.000</p>
            </div>
          </div>
          <ul className="list-none">
            <Bullet><strong>42 municipios</strong> — 7 subregiones</Bullet>
            <Bullet>Sur, Macizo, Pacífico, Norte, Centro, Piedemonte, Oriente</Bullet>
            <Bullet><strong>50.7%</strong> población femenina</Bullet>
          </ul>
        </div>
        <div>
          <h3 className="font-heading font-bold text-[24px] text-slide-green mb-4">Caracterización Demográfica</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <TableCell header>Grupo Etario</TableCell>
                <TableCell header>Población</TableCell>
              </tr>
            </thead>
            <tbody>
              {[
                ["0-14 años", "103.726"],
                ["15-29 años", "112.340"],
                ["30-49 años", "118.950"],
                ["50-64 años", "78.420"],
                ["65+ años", "52.564"],
              ].map(([g, p]) => (
                <tr key={g}>
                  <TableCell accent>{g}</TableCell>
                  <TableCell>{p}</TableCell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SlideLayout>
  );
}

export function ObjetivosSlide() {
  return (
    <SlideLayout>
      <SectionTitle>Objetivos — Árbol de Objetivos</SectionTitle>
      <div className="flex flex-col items-center">
        {/* General */}
        <div className="bg-slide-green text-primary-foreground rounded-2xl px-10 py-5 text-center max-w-[900px] shadow-lg mb-6">
          <span className="text-[16px] font-heading uppercase tracking-wider opacity-80">Objetivo General</span>
          <p className="text-[22px] font-heading font-bold mt-2">
            Generar estrategia para la garantía progresiva del derecho a la alimentación en el Cauca
          </p>
        </div>
        <div className="flex gap-4 mb-4">
          <div className="w-0 h-6 border-l-2 border-slide-green" />
          <div className="w-0 h-6 border-l-2 border-slide-green" />
          <div className="w-0 h-6 border-l-2 border-slide-green" />
        </div>
        {/* Sub-objectives */}
        <div className="flex gap-6 mb-8">
          {[
            { num: "1", title: "Diagnóstico", desc: "Elaborar diagnóstico aprobado por CISAN" },
            { num: "2", title: "Formulación", desc: "Construir documento técnico de política pública" },
            { num: "3", title: "Seguimiento", desc: "Aprobación y transferencia metodológica" },
          ].map((o) => (
            <div key={o.num} className="bg-slide-green-light border-2 border-slide-green rounded-xl px-6 py-5 text-center max-w-[350px]">
              <div className="w-10 h-10 rounded-full bg-slide-green text-primary-foreground flex items-center justify-center mx-auto mb-3 font-heading font-bold text-[20px]">
                {o.num}
              </div>
              <h4 className="font-heading font-bold text-[22px] text-slide-green mb-2">{o.title}</h4>
              <p className="text-[18px]">{o.desc}</p>
            </div>
          ))}
        </div>
        {/* Indicator */}
        <div className="bg-slide-gold/20 border border-slide-gold rounded-xl px-8 py-4 flex items-center gap-4">
          <span className="text-[32px]">📊</span>
          <div>
            <span className="font-heading font-bold text-[20px]">Meta Indicador:</span>
            <span className="text-[20px] ml-3">Reducir inseguridad alimentaria grave al <strong>1.8%</strong></span>
          </div>
        </div>
      </div>
    </SlideLayout>
  );
}

export function AlternativaSlide() {
  return (
    <SlideLayout>
      <SectionTitle>Alternativa Seleccionada</SectionTitle>
      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-3">
          <div className="bg-slide-green text-primary-foreground rounded-2xl px-8 py-4 mb-6 inline-block">
            <span className="font-heading font-bold text-[24px]">Alternativa 1 — Construcción Participativa</span>
          </div>
          <ul className="list-none mb-6">
            <Bullet><strong>Localización:</strong> 7 subregiones del Cauca</Bullet>
            <Bullet><strong>Cadena de Valor:</strong> Insumos → Procesos → Outputs → Política Pública</Bullet>
            <Bullet><strong>Costo Total:</strong> $943.381.615</Bullet>
          </ul>
        </div>
        <div className="col-span-2">
          <h3 className="font-heading font-bold text-[24px] text-slide-green mb-4">Desglose Presupuestal</h3>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <TableCell header>Actividad</TableCell>
                <TableCell header>Monto</TableCell>
              </tr>
            </thead>
            <tbody>
              <tr>
                <TableCell accent>Diagnóstico</TableCell>
                <TableCell>$571M</TableCell>
              </tr>
              <tr>
                <TableCell accent>Elaboración Doc.</TableCell>
                <TableCell>$228M</TableCell>
              </tr>
              <tr>
                <TableCell accent>Seguimiento</TableCell>
                <TableCell>$73M</TableCell>
              </tr>
              <tr>
                <TableCell accent><strong>TOTAL</strong></TableCell>
                <TableCell><strong>$943M</strong></TableCell>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </SlideLayout>
  );
}

export function PlanAccionSlide() {
  return (
    <SlideLayout>
      <SectionTitle>Plan de Acción General</SectionTitle>
      <div className="grid grid-cols-2 gap-12">
        <div>
          <ul className="list-none">
            <Bullet><strong>Período:</strong> Febrero 2026 — Enero 2027</Bullet>
            <Bullet><strong>Propósito:</strong> Hoja de ruta para sincronizar equipo</Bullet>
            <Bullet><strong>Estructura:</strong> Fase 0 a Fase 5</Bullet>
          </ul>
          <h3 className="font-heading font-bold text-[24px] text-slide-green mt-8 mb-4">Equipo Requerido</h3>
          <div className="flex flex-wrap gap-3">
            {["Politología", "Nutrición", "Género", "Trabajo Social", "Ingeniería", "Gestión Documental", "Enlaces Territoriales", "Encuestadores"].map((p) => (
              <span key={p} className="bg-slide-green-light text-slide-green font-heading font-semibold px-4 py-2 rounded-full text-[18px]">
                {p}
              </span>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {[
            { phase: "Fase 0", title: "Alistamiento", time: "Feb 2026", color: "bg-slide-green" },
            { phase: "Fase 1", title: "Diagnóstico", time: "Mar-Jun 2026", color: "bg-slide-green" },
            { phase: "Fase 2", title: "Elaboración Doc. Técnico", time: "Jul-Sep 2026", color: "bg-slide-gold" },
            { phase: "Fase 3", title: "Validación CISAN", time: "Oct 2026", color: "bg-slide-gold" },
            { phase: "Fase 4", title: "Aprobación Asamblea", time: "Nov-Dic 2026", color: "bg-slide-red" },
            { phase: "Fase 5", title: "Transferencia", time: "Ene 2027", color: "bg-slide-red" },
          ].map((f) => (
            <div key={f.phase} className="flex items-center gap-4">
              <div className={`${f.color} text-primary-foreground rounded-xl px-5 py-3 min-w-[120px] text-center font-heading font-bold text-[18px]`}>
                {f.phase}
              </div>
              <div className="flex-1">
                <span className="font-heading font-semibold text-[20px]">{f.title}</span>
                <span className="text-muted-foreground text-[18px] ml-3">{f.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideLayout>
  );
}

export function Primeros4MesesSlide() {
  return (
    <SlideLayout>
      <SectionTitle accent>Foco: Primeros 4 Meses — Contratación y Alistamiento</SectionTitle>
      <div className="grid grid-cols-3 gap-8">
        <div className="bg-slide-green rounded-2xl p-8 text-primary-foreground">
          <h3 className="font-heading font-bold text-[26px] mb-4">Fase 0 — Febrero 2026</h3>
          <ul className="space-y-3 text-[19px]">
            <li>✓ Reunión de arranque</li>
            <li>✓ Validación metodologías CARI/FIES</li>
            <li>✓ Diseño de instrumentos</li>
            <li>✓ Capacitación 420 encuestadores</li>
            <li>✓ Piloto de prueba</li>
          </ul>
        </div>
        <div className="bg-slide-gold/20 border-2 border-slide-gold rounded-2xl p-8">
          <h3 className="font-heading font-bold text-[26px] mb-4 text-foreground">Contratación Equipo</h3>
          <ul className="space-y-3 text-[19px]">
            <li>📋 Perfiles profesionales clave</li>
            <li>📋 Logística de contratación</li>
            <li>📋 420 encuestadores (bachiller mín.)</li>
            <li>📋 Supervisores de campo</li>
            <li>📋 Equipo técnico central</li>
          </ul>
        </div>
        <div className="bg-slide-green-light border-2 border-slide-green rounded-2xl p-8">
          <h3 className="font-heading font-bold text-[26px] mb-4 text-slide-green">Fase 1 — Mar a Mayo</h3>
          <ul className="space-y-3 text-[19px]">
            <li>🔍 Inicio diagnóstico integral</li>
            <li>🔍 Encuestas en 42 municipios</li>
            <li>🔍 7.560 encuestas programadas</li>
            <li>🔍 Talleres participativos</li>
            <li>🔍 Análisis información secundaria</li>
          </ul>
        </div>
      </div>
      <div className="mt-8 flex items-center gap-3">
        <div className="h-[6px] flex-1 bg-gradient-to-r from-slide-green via-slide-gold to-slide-red rounded-full" />
        <span className="font-heading font-bold text-[20px] text-muted-foreground">Feb → May 2026</span>
      </div>
    </SlideLayout>
  );
}

export function DiagnosticoSlide() {
  return (
    <SlideLayout>
      <SectionTitle>Actividad 1: Diagnóstico (4 Meses — $571M)</SectionTitle>
      <div className="grid grid-cols-2 gap-12">
        <div>
          <h3 className="font-heading font-bold text-[28px] text-slide-green mb-5">Componente Cuantitativo</h3>
          <ul className="list-none">
            <Bullet><strong>7.560 encuestas</strong> en 42 municipios</Bullet>
            <Bullet>10 encuestadores por municipio × 3 días</Bullet>
            <Bullet>6 encuestas diarias mínimo por encuestador</Bullet>
            <Bullet>Metodologías CARI/FIES/IPC aprobadas por CISAN</Bullet>
          </ul>
        </div>
        <div>
          <h3 className="font-heading font-bold text-[28px] text-slide-red mb-5">Componente Cualitativo</h3>
          <ul className="list-none">
            <Bullet color="bg-slide-red"><strong>14 talleres</strong> (2 por subregión)</Bullet>
            <Bullet color="bg-slide-red">100 participantes por taller</Bullet>
            <Bullet color="bg-slide-red">Enfoques: familia, consumo, prácticas alimentación</Bullet>
            <Bullet color="bg-slide-red">Almuerzo completo incluido (jugo 260cc, proteína 240g, etc.)</Bullet>
          </ul>
        </div>
      </div>
    </SlideLayout>
  );
}

export function CronogramaDetalladoSlide() {
  return (
    <SlideLayout>
      <SectionTitle>Cronograma Detallado — Actividad 1 (Gantt)</SectionTitle>
      <div className="relative w-full">
        {/* Month headers */}
        <div className="flex mb-2">
          {["Feb", "Mar", "Abr", "May", "Jun"].map((m, i) => (
            <div key={m} className="flex-1 text-center font-heading font-semibold text-[18px] text-muted-foreground border-b-2 border-border pb-2">
              {m} 2026
            </div>
          ))}
        </div>
        {/* Phase labels + bars */}
        <div className="mt-4 space-y-1">
          {[
            { label: "Análisis info. secundaria", start: 0, dur: 3, phase: "F1" },
            { label: "Acercamiento institucional", start: 3, dur: 3, phase: "F1" },
            { label: "Definición herramienta", start: 6, dur: 2, phase: "F1" },
            { label: "Aprobación CISAN", start: 8, dur: 2, phase: "F1" },
            { label: "Construcción encuestas", start: 10, dur: 1, phase: "F1" },
            { label: "Desarrollo encuesta digital", start: 11, dur: 3, phase: "F1", color: "hsl(145,63%,42%)" },
            { label: "Logística y capacitación", start: 14, dur: 3, phase: "F1", color: "hsl(45,90%,45%)" },
            { label: "Aplicación encuestas", start: 17, dur: 2, phase: "F1", color: "hsl(0,72%,45%)" },
          ].map((item, i) => (
            <div key={i} className="flex items-center h-[42px]">
              <span className="w-[260px] text-[16px] font-body truncate pr-4 text-foreground">{item.label}</span>
              <div className="flex-1 relative h-[32px]">
                <div
                  className="absolute h-full rounded-md flex items-center px-3 text-primary-foreground text-[14px] font-heading font-semibold"
                  style={{
                    left: `${(item.start / 20) * 100}%`,
                    width: `${(item.dur / 20) * 100}%`,
                    backgroundColor: item.color || "hsl(145,63%,32%)",
                  }}
                >
                  {item.dur > 2 ? `${item.dur * 5}d` : ""}
                </div>
              </div>
            </div>
          ))}
          <div className="border-t-2 border-border mt-3 pt-3">
            <span className="font-heading font-bold text-[18px] text-slide-red">FASE 2 — Cualitativa</span>
          </div>
          {[
            { label: "Info. secundaria cualitativa", start: 6, dur: 3, color: "hsl(0,72%,55%)" },
            { label: "Acercamiento actores", start: 9, dur: 4, color: "hsl(0,72%,50%)" },
            { label: "Definición metodología", start: 13, dur: 2, color: "hsl(0,72%,45%)" },
            { label: "Construcción talleres", start: 15, dur: 1, color: "hsl(0,72%,45%)" },
            { label: "Realización 14 talleres", start: 16, dur: 4, color: "hsl(0,72%,40%)" },
          ].map((item, i) => (
            <div key={`q-${i}`} className="flex items-center h-[42px]">
              <span className="w-[260px] text-[16px] font-body truncate pr-4 text-foreground">{item.label}</span>
              <div className="flex-1 relative h-[32px]">
                <div
                  className="absolute h-full rounded-md flex items-center px-3 text-primary-foreground text-[14px] font-heading font-semibold"
                  style={{
                    left: `${(item.start / 20) * 100}%`,
                    width: `${(item.dur / 20) * 100}%`,
                    backgroundColor: item.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </SlideLayout>
  );
}

export function PerfilesSlide() {
  return (
    <SlideLayout>
      <SectionTitle>Perfiles del Equipo y Responsabilidades</SectionTitle>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <TableCell header>Perfil</TableCell>
            <TableCell header>Fase 1 (Diagnóstico)</TableCell>
            <TableCell header>Fase 2 (Formulación)</TableCell>
            <TableCell header>Fase 3 (Seguimiento)</TableCell>
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
          ].map(([perfil, f1, f2, f3]) => (
            <tr key={perfil}>
              <TableCell accent>{perfil}</TableCell>
              <TableCell>{f1}</TableCell>
              <TableCell>{f2}</TableCell>
              <TableCell>{f3}</TableCell>
            </tr>
          ))}
        </tbody>
      </table>
    </SlideLayout>
  );
}

export function RiesgosSlide() {
  return (
    <SlideLayout>
      <SectionTitle accent>Riesgos y Mitigación</SectionTitle>
      <table className="w-full border-collapse mb-6">
        <thead>
          <tr>
            <TableCell header>Riesgo</TableCell>
            <TableCell header>Probabilidad</TableCell>
            <TableCell header>Impacto</TableCell>
            <TableCell header>Medida de Mitigación</TableCell>
          </tr>
        </thead>
        <tbody>
          {[
            ["Consensos difíciles entre actores", "Alta", "Alto", "Diálogos interculturales previos"],
            ["Cambios políticos institucionales", "Moderada", "Alto", "Trazabilidad con actas formales"],
            ["Baja participación comunidades", "Moderada", "Alto", "Convocatoria anticipada (15 días)"],
            ["Retrasos en contratación", "Alta", "Medio", "Gestión anticipada desde enero"],
            ["Dificultades logísticas rurales", "Alta", "Medio", "Coordinación con alcaldías"],
          ].map(([r, prob, imp, mit]) => (
            <tr key={r}>
              <TableCell accent>{r}</TableCell>
              <TableCell>
                <span className={`font-semibold ${prob === "Alta" ? "text-slide-red" : "text-slide-gold"}`}>{prob}</span>
              </TableCell>
              <TableCell>
                <span className={`font-semibold ${imp === "Alto" ? "text-slide-red" : "text-slide-gold"}`}>{imp}</span>
              </TableCell>
              <TableCell>{mit}</TableCell>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="bg-slide-green-light rounded-xl px-8 py-4 flex items-center gap-4">
        <span className="text-[28px]">🔄</span>
        <span className="text-[22px]"><strong>Monitoreo quincenal</strong> en Comité Técnico</span>
      </div>
    </SlideLayout>
  );
}

export function IndicadoresSlide() {
  return (
    <SlideLayout>
      <SectionTitle>Indicadores de Éxito</SectionTitle>
      <div className="grid grid-cols-2 gap-8">
        {[
          { icon: "📋", label: "Actividades Ejecutadas", value: "≥ 90%", desc: "Del plan de acción" },
          { icon: "✅", label: "Entregables Aprobados", value: "100%", desc: "Aprobados por CISAN" },
          { icon: "🗺️", label: "Cobertura Municipal", value: "42/42", desc: "Todos los municipios" },
          { icon: "📊", label: "Inseguridad Grave", value: "→ 1.8%", desc: "Meta de reducción" },
        ].map((ind) => (
          <div key={ind.label} className="bg-slide-green-light rounded-2xl p-8 flex items-center gap-6">
            <span className="text-[48px]">{ind.icon}</span>
            <div>
              <p className="font-heading font-bold text-[32px] text-slide-green">{ind.value}</p>
              <p className="font-heading font-semibold text-[22px]">{ind.label}</p>
              <p className="text-[18px] text-muted-foreground">{ind.desc}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 bg-slide-gold/20 border border-slide-gold rounded-xl px-8 py-4">
        <span className="text-[20px]">📈 Indicadores de <strong>corto, mediano y largo plazo</strong> integrados en la política pública</span>
      </div>
    </SlideLayout>
  );
}

export function ComunicacionSlide() {
  return (
    <SlideLayout>
      <SectionTitle>Protocolo de Comunicación</SectionTitle>
      <div className="grid grid-cols-2 gap-12">
        <div>
          <h3 className="font-heading font-bold text-[28px] text-slide-green mb-6">Reuniones</h3>
          <div className="space-y-6">
            <div className="flex items-start gap-6">
              <div className="w-[80px] h-[80px] rounded-2xl bg-slide-green flex items-center justify-center shrink-0">
                <span className="text-primary-foreground font-heading font-bold text-[20px]">2x<br/>mes</span>
              </div>
              <div>
                <p className="font-heading font-bold text-[24px]">Comité Técnico</p>
                <p className="text-[20px] text-muted-foreground">Seguimiento quincenal de avances y riesgos</p>
              </div>
            </div>
            <div className="flex items-start gap-6">
              <div className="w-[80px] h-[80px] rounded-2xl bg-slide-red flex items-center justify-center shrink-0">
                <span className="text-primary-foreground font-heading font-bold text-[20px]">1x<br/>mes</span>
              </div>
              <div>
                <p className="font-heading font-bold text-[24px]">CISAN</p>
                <p className="text-[20px] text-muted-foreground">Comité Intersectorial de Seguridad Alimentaria</p>
              </div>
            </div>
          </div>
        </div>
        <div>
          <h3 className="font-heading font-bold text-[28px] text-slide-green mb-6">Canales Digitales</h3>
          <div className="space-y-4">
            {[
              { tool: "Microsoft Teams", use: "Comunicación diaria del equipo" },
              { tool: "SharePoint", use: "Repositorio documental y trazabilidad" },
              { tool: "Correo Institucional", use: "Comunicaciones formales" },
              { tool: "Actas Digitales", use: "Registro de decisiones y compromisos" },
            ].map((c) => (
              <div key={c.tool} className="bg-slide-green-light rounded-xl px-6 py-4 flex items-center gap-4">
                <span className="font-heading font-bold text-[20px] text-slide-green min-w-[200px]">{c.tool}</span>
                <span className="text-[20px]">{c.use}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SlideLayout>
  );
}

export function ConclusionSlide() {
  return (
    <SlideLayout>
      <SectionTitle>Conclusión y Siguientes Pasos</SectionTitle>
      <div className="grid grid-cols-3 gap-6 mb-10">
        <div className="bg-slide-green rounded-2xl p-8 text-primary-foreground text-center">
          <div className="w-[60px] h-[60px] rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-4">
            <span className="font-heading font-black text-[28px]">1</span>
          </div>
          <h3 className="font-heading font-bold text-[24px] mb-3">Contratación Equipo</h3>
          <p className="text-[20px] opacity-90">Febrero 2026</p>
        </div>
        <div className="bg-slide-gold rounded-2xl p-8 text-foreground text-center">
          <div className="w-[60px] h-[60px] rounded-full bg-foreground/10 flex items-center justify-center mx-auto mb-4">
            <span className="font-heading font-black text-[28px]">2</span>
          </div>
          <h3 className="font-heading font-bold text-[24px] mb-3">Alistamiento</h3>
          <p className="text-[20px] opacity-90">Feb — Mar 2026</p>
        </div>
        <div className="bg-slide-red rounded-2xl p-8 text-primary-foreground text-center">
          <div className="w-[60px] h-[60px] rounded-full bg-primary-foreground/20 flex items-center justify-center mx-auto mb-4">
            <span className="font-heading font-black text-[28px]">3</span>
          </div>
          <h3 className="font-heading font-bold text-[24px] mb-3">Diagnóstico</h3>
          <p className="text-[20px] opacity-90">Mar — Jun 2026</p>
        </div>
      </div>
      <div className="bg-slide-green-light border-2 border-slide-green rounded-2xl px-10 py-6 text-center">
        <p className="font-heading font-bold text-[28px] text-slide-green">
          🏛️ Meta: Aprobación en Asamblea Departamental — Diciembre 2026 a Febrero 2027
        </p>
        <p className="text-[22px] text-muted-foreground mt-3">
          Iniciar en febrero 2026 es crítico para cumplir el cronograma establecido
        </p>
      </div>
    </SlideLayout>
  );
}

export function CierreSlide() {
  return (
    <SlideLayout variant="cover">
      <div className="absolute inset-0 bg-slide-green" />
      <div className="absolute bottom-0 left-0 right-0 h-[8px] bg-slide-red" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-20">
        <div className="flex items-center gap-8 mb-12">
          <img src={escudoCauca} alt="Escudo" className="h-[100px] w-auto" />
          <img src={logoAgricultura} alt="Agricultura" className="h-[100px] w-auto" />
        </div>
        <h1 className="font-heading font-black text-[56px] text-primary-foreground leading-tight mb-6">
          ¡Gracias!
        </h1>
        <p className="text-[28px] text-primary-foreground/80 font-body max-w-[900px] mb-8">
          Secretaría de Agricultura y Desarrollo Rural<br />
          Gobernación del Cauca
        </p>
        <div className="h-[2px] w-[200px] bg-primary-foreground/30 mb-8" />
        <p className="text-[22px] text-primary-foreground/60 font-body">
          Política Pública de Seguridad y Soberanía Alimentaria — Febrero 2026
        </p>
      </div>
    </SlideLayout>
  );
}
