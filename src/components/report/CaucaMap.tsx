import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Users } from "lucide-react";

interface ZonaData {
  id: string;
  name: string;
  subregion: string;
  municipios: string[];
  taller: string;
  color: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  actores: string[];
  poblacion: number;
  encuestas: number;
  insegAlimentaria: string;
}

// Zonas como elipses bien distribuidas en el mapa (viewBox 0 0 760 680)
// Basado en la distribución geográfica real del Cauca:
// Pacífico (oeste grande), Norte (noreste), Oriente (este), Centro (centro),
// Popayán (centro pequeño), Sur (sur grande), Timbío (centro-sur), Macizo, Bota Caucana (sureste)
const zonas: ZonaData[] = [
  {
    id: "zona1",
    name: "Zona 1",
    subregion: "Centro Capital — Popayán",
    municipios: ["Popayán"],
    taller: "1 taller participativo — sede Popayán",
    color: "#1a7a3e",
    cx: 380, cy: 270, rx: 95, ry: 75,
    poblacion: 340000,
    encuestas: 840,
    insegAlimentaria: "1.8%",
    actores: [
      "Institucionalidad: Consejo Municipal de Política Social, Comités Municipales de Seguridad Alimentaria y Nutricional",
      "Programas de ICBF",
      "Madres comunitarias",
      "Instituciones Educativas",
      "Organización de Acción Comunal OAC",
      "ICA", "PAE Educación", "Proveedores PAE", "Galpones Ganaderos",
      "Cámara de Comercio", "Emcaservicios", "CRC", "Acueducto de Popayán",
      "Ministerio de la Igualdad", "FAMAS y comerciantes de alimentos",
      "Diputados (CDSAN)", "FAO", "PMA", "Salud departamental",
      "Campesinos", "Consejos comunitarios", "Indígenas",
      "Personas con discapacidad", "Adulto mayor", "Jóvenes",
      "Mujeres gestantes", "Comunidad LGTBI",
    ],
  },
  {
    id: "zona2",
    name: "Zona 2",
    subregion: "Norte — Santander de Quilichao",
    municipios: ["Santander de Quilichao", "Caldono", "Buenos Aires", "Caloto", "Jambaló", "Padilla", "Puerto Tejada", "Villa Rica", "Miranda", "Guachené", "Piamonte"],
    taller: "1 taller participativo — sede Santander de Quilichao",
    color: "#2d9e5a",
    cx: 400, cy: 120, rx: 130, ry: 90,
    poblacion: 198600,
    encuestas: 1260,
    insegAlimentaria: "2.6%",
    actores: [
      "Campesinos (se aterriza en cada municipio)",
      "Consejos comunitarios",
      "Indígenas",
      "Personas con discapacidad",
      "Adulto mayor",
      "Jóvenes",
      "Mujeres gestantes",
      "Institucionalidad: Consejo Municipal de Política Social, Comités Municipales de Seguridad Alimentaria y Nutricional",
      "Programas de ICBF",
      "Madres comunitarias",
      "Instituciones Educativas",
      "Organización de Acción Comunal OAC",
      "Comunidad LGTBI",
    ],
  },
  {
    id: "zona3",
    name: "Zona 3",
    subregion: "Oriente — Inzá",
    municipios: ["Inzá", "Páez (Belalcázar)", "Totoró"],
    taller: "1 taller participativo — sede Inzá",
    color: "#c97a1a",
    cx: 610, cy: 155, rx: 105, ry: 80,
    poblacion: 87300,
    encuestas: 630,
    insegAlimentaria: "3.8%",
    actores: [
      "Campesinos (se aterriza en cada municipio)",
      "Indígenas",
      "Personas con discapacidad",
      "Adulto mayor",
      "Jóvenes",
      "Mujeres gestantes",
      "Institucionalidad: Consejo Municipal de Política Social, Comités Municipales de Seguridad Alimentaria y Nutricional",
      "Programas de ICBF",
      "Madres comunitarias",
      "Instituciones Educativas",
      "Organización de Acción Comunal OAC",
      "Comunidad LGTBI",
    ],
  },
  {
    id: "zona4",
    name: "Zona 4",
    subregion: "Pacífico — Guapi",
    municipios: ["Guapi", "López de Micay", "Timbiquí"],
    taller: "1 taller participativo — sede Guapi",
    color: "#1a6ea0",
    cx: 130, cy: 310, rx: 110, ry: 175,
    poblacion: 74200,
    encuestas: 630,
    insegAlimentaria: "4.2%",
    actores: [
      "Campesinos (se aterriza en cada municipio)",
      "Consejos comunitarios",
      "Indígenas",
      "Personas con discapacidad",
      "Adulto mayor",
      "Jóvenes",
      "Mujeres gestantes",
      "Institucionalidad: Consejo Municipal de Política Social, Comités Municipales de Seguridad Alimentaria y Nutricional",
      "Programas de ICBF",
      "Madres comunitarias",
      "Instituciones Educativas",
      "Organización de Acción Comunal OAC",
      "Comunidad LGTBI",
    ],
  },
  {
    id: "zona5",
    name: "Zona 5",
    subregion: "Sur — Bolívar / El Bordo",
    municipios: ["El Bordo (Patía)", "Mercaderes", "Bolívar", "Florencia", "Sucre", "Balboa", "Argelia"],
    taller: "1 taller participativo — sede El Bordo",
    color: "#b02828",
    cx: 290, cy: 490, rx: 130, ry: 115,
    poblacion: 163500,
    encuestas: 1260,
    insegAlimentaria: "3.4%",
    actores: [
      "Campesinos (se aterriza en cada municipio)",
      "Consejos comunitarios",
      "Indígenas",
      "Personas con discapacidad",
      "Adulto mayor",
      "Jóvenes",
      "Mujeres gestantes",
      "Institucionalidad: Consejo Municipal de Política Social, Comités Municipales de Seguridad Alimentaria y Nutricional",
      "Programas de ICBF",
      "Madres comunitarias",
      "Instituciones Educativas",
      "Organización de Acción Comunal OAC",
      "Comunidad LGTBI",
    ],
  },
  {
    id: "zona6",
    name: "Zona 6",
    subregion: "Centro — Piendamó",
    municipios: ["Piendamó", "Cajibío", "Morales", "Silvia"],
    taller: "1 taller participativo — sede Piendamó",
    color: "#6a3db8",
    cx: 390, cy: 375, rx: 60, ry: 50,
    poblacion: 112400,
    encuestas: 840,
    insegAlimentaria: "3.1%",
    actores: [
      "Campesinos (se aterriza en cada municipio)",
      "Indígenas",
      "Personas con discapacidad",
      "Adulto mayor",
      "Jóvenes",
      "Mujeres gestantes",
      "Institucionalidad: Consejo Municipal de Política Social, Comités Municipales de Seguridad Alimentaria y Nutricional",
      "Programas de ICBF",
      "Madres comunitarias",
      "Instituciones Educativas",
      "Organización de Acción Comunal OAC",
      "Comunidad LGTBI",
    ],
  },
  {
    id: "zona7",
    name: "Zona 7",
    subregion: "Centro Sur — Timbío / Rosas",
    municipios: ["Timbío", "Rosas", "La Sierra", "Sotará"],
    taller: "1 taller participativo — sede Timbío",
    color: "#c0404a",
    cx: 460, cy: 440, rx: 72, ry: 60,
    poblacion: 95800,
    encuestas: 840,
    insegAlimentaria: "2.9%",
    actores: [
      "Campesinos (se aterriza en cada municipio)",
      "Consejos comunitarios",
      "Indígenas",
      "Personas con discapacidad",
      "Adulto mayor",
      "Jóvenes",
      "Mujeres gestantes",
      "Institucionalidad: Consejo Municipal de Política Social, Comités Municipales de Seguridad Alimentaria y Nutricional",
      "Programas de ICBF",
      "Madres comunitarias",
      "Instituciones Educativas",
      "Organización de Acción Comunal OAC",
      "Comunidad LGTBI",
    ],
  },
  {
    id: "zona8",
    name: "Zona 8",
    subregion: "Macizo — La Vega",
    municipios: ["La Vega", "San Sebastián", "Almaguer", "Santa Rosa"],
    taller: "1 taller participativo — sede La Vega",
    color: "#7a3daa",
    cx: 560, cy: 455, rx: 65, ry: 58,
    poblacion: 68400,
    encuestas: 630,
    insegAlimentaria: "3.6%",
    actores: [
      "Campesinos (se aterriza en cada municipio)",
      "Consejos comunitarios",
      "Indígenas",
      "Personas con discapacidad",
      "Adulto mayor",
      "Jóvenes",
      "Mujeres gestantes",
      "Institucionalidad: Consejo Municipal de Política Social, Comités Municipales de Seguridad Alimentaria y Nutricional",
      "Programas de ICBF",
      "Madres comunitarias",
      "Instituciones Educativas",
      "Organización de Acción Comunal OAC",
      "Comunidad LGTBI",
    ],
  },
  {
    id: "zona9",
    name: "Zona 9",
    subregion: "Bota Caucana — Piamonte",
    municipios: ["Santa Rosa", "Piamonte"],
    taller: "1 taller participativo — sede Piamonte",
    color: "#1a8a7a",
    cx: 610, cy: 560, rx: 72, ry: 65,
    poblacion: 28700,
    encuestas: 420,
    insegAlimentaria: "4.8%",
    actores: [
      "Campesinos (se aterriza en cada municipio)",
      "Consejos comunitarios",
      "Indígenas",
      "Personas con discapacidad",
      "Adulto mayor",
      "Jóvenes",
      "Mujeres gestantes",
      "Institucionalidad: Consejo Municipal de Política Social, Comités Municipales de Seguridad Alimentaria y Nutricional",
      "Programas de ICBF",
      "Madres comunitarias",
      "Instituciones Educativas",
      "Organización de Acción Comunal OAC",
      "Comunidad LGTBI",
    ],
  },
];

const CaucaMap: React.FC = () => {
  const [selected, setSelected] = useState<string | null>(null);
  const [hovered, setHovered] = useState<string | null>(null);

  const focusedId = selected ?? hovered;
  const focusedData = zonas.find((z) => z.id === focusedId);

  const handleZoneClick = (id: string) => {
    setSelected(prev => prev === id ? null : id);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 pt-5 pb-3 border-b border-border flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h3 className="font-heading font-bold text-lg text-foreground">
            Mapa Interactivo del Cauca
          </h3>
          <p className="text-xs text-muted-foreground font-body mt-0.5">
            7 Subregiones · 9 Zonas operativas · 1 taller diferencial por zona
          </p>
        </div>
        {selected && (
          <button
            onClick={() => setSelected(null)}
            className="flex items-center gap-1.5 text-xs font-heading font-semibold text-primary hover:text-primary/80 transition-colors bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full self-start sm:self-auto"
          >
            ← Ver todas las zonas
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
        {/* ── MAP ── */}
        <div className="lg:col-span-3 p-4 flex items-center justify-center bg-muted/20">
          <div className="relative w-full max-w-[540px]">
            <svg
              viewBox="0 0 760 660"
              className="w-full h-auto"
              aria-label="Mapa interactivo del Departamento del Cauca con 9 zonas operativas"
            >
              {/* subtle background */}
              <rect x="0" y="0" width="760" height="660" fill="transparent" />

              {/* Render zones as ellipses */}
              {zonas.map((zona) => {
                const isSelected = selected === zona.id;
                const isHovered = hovered === zona.id;
                const isActive = isSelected || isHovered;
                const opacity = selected
                  ? isSelected ? 0.92 : 0.22
                  : isHovered ? 0.88 : 0.72;

                return (
                  <g key={zona.id}>
                    {/* Glow ring when active */}
                    {isActive && (
                      <ellipse
                        cx={zona.cx}
                        cy={zona.cy}
                        rx={zona.rx + 8}
                        ry={zona.ry + 8}
                        fill="none"
                        stroke={zona.color}
                        strokeWidth="3"
                        opacity="0.5"
                      />
                    )}
                    {/* Main ellipse */}
                    <ellipse
                      cx={zona.cx}
                      cy={zona.cy}
                      rx={zona.rx}
                      ry={zona.ry}
                      fill={zona.color}
                      fillOpacity={opacity}
                      stroke="white"
                      strokeWidth={isActive ? 2.5 : 1.2}
                      strokeOpacity={0.9}
                      className="cursor-pointer transition-all duration-200"
                      onMouseEnter={() => setHovered(zona.id)}
                      onMouseLeave={() => setHovered(null)}
                      onClick={() => handleZoneClick(zona.id)}
                      role="button"
                      aria-label={`${zona.name} — ${zona.subregion}`}
                      tabIndex={0}
                      onKeyDown={e => e.key === "Enter" && handleZoneClick(zona.id)}
                    />
                    {/* Label — always centered inside ellipse */}
                    <text
                      x={zona.cx}
                      y={zona.cy - 6}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="white"
                      fontSize={isActive ? 14 : 12}
                      fontWeight="bold"
                      opacity={selected && !isSelected ? 0.35 : 1}
                      style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.85))", pointerEvents: "none", userSelect: "none" }}
                    >
                      {zona.name}
                    </text>
                    {/* Subregion name below — only when active or no selection */}
                    {(isActive || !selected) && (
                      <text
                        x={zona.cx}
                        y={zona.cy + 10}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="white"
                        fontSize={9}
                        fontWeight="normal"
                        opacity={selected && !isSelected ? 0 : 0.85}
                        style={{ filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.9))", pointerEvents: "none", userSelect: "none" }}
                      >
                        {zona.subregion.split(" — ")[0]}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>
            <p className="text-center text-[11px] text-muted-foreground font-body mt-1">
              {selected
                ? "Clic en otra zona para navegar · Clic en la misma zona para deseleccionar"
                : "Haz clic en cualquier zona de color para ver sus detalles"}
            </p>
          </div>
        </div>

        {/* ── INFO PANEL ── */}
        <div className="lg:col-span-2 border-t lg:border-t-0 lg:border-l border-border flex flex-col">

          {/* Quick nav */}
          <div className="px-4 pt-3 pb-2 border-b border-border/60 bg-muted/20">
            <p className="text-[10px] font-heading font-semibold text-muted-foreground uppercase tracking-widest mb-2">
              Navegar por zona
            </p>
            <div className="flex flex-wrap gap-1.5">
              {zonas.map((z) => (
                <button
                  key={z.id}
                  onClick={() => handleZoneClick(z.id)}
                  onMouseEnter={() => setHovered(z.id)}
                  onMouseLeave={() => setHovered(null)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-heading font-semibold border transition-all ${
                    selected === z.id
                      ? "text-white shadow-sm scale-105"
                      : "text-foreground bg-background hover:scale-105 border-border/60 hover:shadow-sm"
                  }`}
                  style={
                    selected === z.id
                      ? { backgroundColor: z.color, borderColor: z.color }
                      : { borderColor: `${z.color}55` }
                  }
                  aria-pressed={selected === z.id}
                  title={z.subregion}
                >
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: z.color }} />
                  {z.name}
                </button>
              ))}
            </div>
          </div>

          {/* Detail panel */}
          <div className="flex-1 overflow-y-auto">
            <AnimatePresence mode="wait">
              {focusedData ? (
                <motion.div
                  key={focusedData.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.18 }}
                  className="p-5"
                >
                  {/* Zone header */}
                  <div className="flex items-center gap-3 mb-3">
                    <div
                      className="w-4 h-10 rounded-full shrink-0"
                      style={{ backgroundColor: focusedData.color }}
                    />
                    <div>
                      <h4 className="font-heading font-bold text-base text-foreground leading-tight">
                        {focusedData.name}
                      </h4>
                      <p className="text-xs text-muted-foreground font-body">{focusedData.subregion}</p>
                    </div>
                  </div>

                  {/* Taller badge */}
                  <div
                    className="rounded-xl px-4 py-2 mb-4 border"
                    style={{
                      backgroundColor: `${focusedData.color}15`,
                      borderColor: `${focusedData.color}40`,
                    }}
                  >
                    <p className="text-xs font-heading font-semibold" style={{ color: focusedData.color }}>
                      📍 {focusedData.taller}
                    </p>
                  </div>

                  {/* Stats grid */}
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {[
                      { label: "Población", value: focusedData.poblacion.toLocaleString("es-CO") },
                      { label: "Encuestas", value: focusedData.encuestas.toLocaleString("es-CO") },
                      { label: "Inseg. Alim.", value: focusedData.insegAlimentaria },
                    ].map((stat, i) => (
                      <div
                        key={i}
                        className="rounded-lg px-2 py-2 text-center border"
                        style={{
                          backgroundColor: `${focusedData.color}10`,
                          borderColor: `${focusedData.color}30`,
                        }}
                      >
                        <p className="font-heading font-black text-sm leading-tight" style={{ color: focusedData.color }}>
                          {stat.value}
                        </p>
                        <p className="text-[10px] text-muted-foreground font-body mt-0.5 leading-tight">{stat.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Municipios */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MapPin size={13} className="text-muted-foreground" />
                      <p className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide">
                        Municipios ({focusedData.municipios.length})
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {focusedData.municipios.map((m) => (
                        <span
                          key={m}
                          className="px-2.5 py-1 rounded-lg text-xs font-body font-medium border"
                          style={{
                            backgroundColor: `${focusedData.color}12`,
                            borderColor: `${focusedData.color}35`,
                            color: focusedData.color,
                          }}
                        >
                          {m}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actores */}
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Users size={13} className="text-muted-foreground" />
                      <p className="text-xs font-heading font-semibold text-muted-foreground uppercase tracking-wide">
                        Actores a Convocar ({focusedData.actores.length})
                      </p>
                    </div>
                    <div className="space-y-1">
                      {focusedData.actores.map((a, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs font-body text-foreground">
                          <span
                            className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                            style={{ backgroundColor: focusedData.color }}
                          />
                          <span className="leading-relaxed">{a}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-5 flex flex-col items-center justify-center h-48 text-center"
                >
                  <div className="text-3xl mb-3">🗺️</div>
                  <p className="text-muted-foreground font-body text-sm font-medium">
                    Selecciona una zona
                  </p>
                  <p className="text-muted-foreground font-body text-xs mt-1">
                    Usa los botones de arriba o haz clic en el mapa
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer stats */}
          <div className="border-t border-border px-4 py-3 bg-muted/20">
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: "Subregiones", val: "7" },
                { label: "Zonas", val: "9" },
                { label: "Talleres", val: "20" },
                { label: "Municipios", val: "42" },
              ].map((l, i) => (
                <div key={i} className="text-center">
                  <p className="font-heading font-black text-sm text-primary">{l.val}</p>
                  <p className="text-[10px] text-muted-foreground font-body leading-tight">{l.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CaucaMap;
