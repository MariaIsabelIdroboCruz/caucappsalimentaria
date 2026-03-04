import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MapPin, Users } from "lucide-react";

interface ZonaData {
  id: string;
  name: string;
  subregion: string;
  municipios: string[];
  taller: string;
  color: string;
  labelX: number;
  labelY: number;
  actores: string[];
}

// ─── Zone Data ────────────────────────────────
const zonas: ZonaData[] = [
  {
    id: "zona1",
    name: "Zona 1",
    subregion: "Centro — Piendamó",
    municipios: ["Piendamó", "Cajibío", "Morales", "Silvia"],
    taller: "1 taller participativo — sede Piendamó",
    color: "#1a7a3e",
    labelX: 415, labelY: 295,
    actores: [
      "Campesinos (se aterriza en cada municipio)",
      "Indígenas",
      "Personas con discapacidad",
      "Adulto mayor (Gestión social, secretarías de salud, programas de adultos mayores)",
      "Jóvenes (Instituciones educativas, PANES, Consejos de juventudes, salud departamental)",
      "Mujeres gestantes",
      "Institucional (salud, educación, alcaldías)",
      "Comunidad LGTBI",
      "OAC",
    ],
  },
  {
    id: "zona2",
    name: "Zona 2",
    subregion: "Norte — Santander de Quilichao",
    municipios: ["Santander de Quilichao", "Caldono", "Buenos Aires", "Caloto", "Jambaló"],
    taller: "1 taller participativo — sede Santander de Quilichao",
    color: "#2d9e5a",
    labelX: 510, labelY: 195,
    actores: [
      "Campesinos (se aterriza en cada municipio)",
      "Consejos comunitarios",
      "Indígenas",
      "Personas con discapacidad",
      "Adulto mayor (Gestión social, secretarías de salud, programas de adultos mayores)",
      "Jóvenes (Instituciones educativas, PANES, Consejos de juventudes, salud departamental)",
      "Mujeres gestantes",
      "Institucional (salud, educación, alcaldías)",
      "Comunidad LGTBI",
      "OAC",
    ],
  },
  {
    id: "zona3",
    name: "Zona 3",
    subregion: "Oriente — Inzá",
    municipios: ["Inzá", "Páez (Belalcázar)", "Totoró"],
    taller: "1 taller participativo — sede Inzá",
    color: "#c97a1a",
    labelX: 630, labelY: 255,
    actores: [
      "Campesinos (se aterriza en cada municipio)",
      "Indígenas",
      "Personas con discapacidad",
      "Adulto mayor (Gestión social, secretarías de salud, programas de adultos mayores)",
      "Jóvenes (Instituciones educativas, PANES, Consejos de juventudes, salud departamental)",
      "Mujeres gestantes",
      "Institucional (salud, educación, alcaldías)",
      "Comunidad LGTBI",
      "OAC",
    ],
  },
  {
    id: "zona4",
    name: "Zona 4",
    subregion: "Pacífico — Guapi",
    municipios: ["Guapi", "López de Micay", "Timbiquí"],
    taller: "1 taller participativo — sede Guapi",
    color: "#1a6ea0",
    labelX: 175, labelY: 320,
    actores: [
      "Campesinos (se aterriza en cada municipio)",
      "Consejos comunitarios",
      "Indígenas",
      "Personas con discapacidad",
      "Adulto mayor (Gestión social, secretarías de salud, programas de adultos mayores)",
      "Jóvenes (Instituciones educativas, PANES, Consejos de juventudes, salud departamental)",
      "Mujeres gestantes",
      "Institucional (salud, educación, alcaldías)",
      "Comunidad LGTBI",
      "OAC",
    ],
  },
  {
    id: "zona5",
    name: "Zona 5",
    subregion: "Sur — Bolívar / El Bordo",
    municipios: ["El Bordo (Patía)", "Mercaderes", "Bolívar", "Florencia", "Sucre", "Balboa", "Argelia"],
    taller: "1 taller participativo — sede El Bordo",
    color: "#b02828",
    labelX: 320, labelY: 510,
    actores: [
      "Campesinos (se aterriza en cada municipio)",
      "Consejos comunitarios",
      "Indígenas",
      "Personas con discapacidad",
      "Adulto mayor (Gestión social, secretarías de salud, programas de adultos mayores)",
      "Jóvenes (Instituciones educativas, PANES, Consejos de juventudes, salud departamental)",
      "Mujeres gestantes",
      "Institucional (salud, educación, alcaldías)",
      "Comunidad LGTBI",
      "OAC",
    ],
  },
  {
    id: "zona6",
    name: "Zona 6",
    subregion: "Centro Capital — Popayán",
    municipios: ["Popayán"],
    taller: "1 taller participativo — sede Popayán",
    color: "#6a3db8",
    labelX: 420, labelY: 368,
    actores: [
      "ICA", "ICBF", "PAE Educación", "Proveedores PAE", "Galpones Ganaderos",
      "Cámara de Comercio", "Emcaservicios", "CRC", "Acueducto de Popayán",
      "Ministerio de la Igualdad", "FAMAS y comerciantes de alimentos",
      "Diputados (CDSAN)", "Actores políticos (diputados)",
      "PAES y PANES", "FAO", "PMA", "Salud departamental",
      "Campesinos (se aterriza en cada municipio)", "Consejos comunitarios",
      "Indígenas", "Personas con discapacidad",
      "Adulto mayor (Gestión social, secretarías de salud, programas de adultos mayores)",
      "Jóvenes (Instituciones educativas, PANES, Consejos de juventudes, salud departamental)",
      "Mujeres gestantes", "Institucional (salud, educación, alcaldías)",
      "Comunidad LGTBI", "OAC",
    ],
  },
  {
    id: "zona7",
    name: "Zona 7",
    subregion: "Centro Sur — Timbío / Rosas",
    municipios: ["Timbío", "Rosas", "La Sierra", "Sotará"],
    taller: "1 taller participativo — sede Timbío",
    color: "#c0404a",
    labelX: 455, labelY: 440,
    actores: [
      "Campesinos (se aterriza en cada municipio)",
      "Consejos comunitarios",
      "Indígenas",
      "Personas con discapacidad",
      "Adulto mayor (Gestión social, secretarías de salud, programas de adultos mayores)",
      "Jóvenes (Instituciones educativas, PANES, Consejos de juventudes, salud departamental)",
      "Mujeres gestantes",
      "Institucional (salud, educación, alcaldías)",
      "Comunidad LGTBI",
      "OAC",
    ],
  },
  {
    id: "zona8",
    name: "Zona 8",
    subregion: "Macizo — La Vega",
    municipios: ["La Vega", "San Sebastián", "Almaguer"],
    taller: "1 taller participativo — sede La Vega",
    color: "#7a3daa",
    labelX: 530, labelY: 490,
    actores: [
      "Campesinos (se aterriza en cada municipio)",
      "Consejos comunitarios",
      "Indígenas",
      "Personas con discapacidad",
      "Adulto mayor (Gestión social, secretarías de salud, programas de adultos mayores)",
      "Jóvenes (Instituciones educativas, PANES, Consejos de juventudes, salud departamental)",
      "Mujeres gestantes",
      "Institucional (salud, educación, alcaldías)",
      "Comunidad LGTBI",
      "OAC",
    ],
  },
  {
    id: "zona9",
    name: "Zona 9",
    subregion: "Bota Caucana — Piamonte",
    municipios: ["Santa Rosa", "Piamonte"],
    taller: "1 taller participativo — sede Piamonte",
    color: "#1a8a7a",
    labelX: 580, labelY: 610,
    actores: [
      "Campesinos (se aterriza en cada municipio)",
      "Consejos comunitarios",
      "Indígenas",
      "Personas con discapacidad",
      "Adulto mayor (Gestión social, secretarías de salud, programas de adultos mayores)",
      "Jóvenes (Instituciones educativas, PANES, Consejos de juventudes, salud departamental)",
      "Mujeres gestantes",
      "Institucional (salud, educación, alcaldías)",
      "Comunidad LGTBI",
      "OAC",
    ],
  },
];

/**
 * SVG zone paths traced to match the real Cauca department map.
 * ViewBox: 0 0 810 685  (matches the reference map image proportions)
 *
 * Zone layout (approximate geographic areas):
 *  Z1 Centro-Piendamó    — center cluster
 *  Z2 Norte              — northeast quadrant
 *  Z3 Oriente            — far right bulge
 *  Z4 Pacífico           — entire left/west coast strip
 *  Z5 Sur                — lower-center left
 *  Z6 Popayán capital    — small center node
 *  Z7 Timbío-Rosas       — center-south cluster
 *  Z8 Macizo             — south-center-right
 *  Z9 Bota Caucana       — far south-east peninsula
 */
const zonePaths: Record<string, string> = {
  // ZONA 4 — Pacífico (large western coast, painted first / underneath)
  zona4:
    "M 95 115 L 150 85 L 200 95 L 245 115 L 280 145 L 300 185 L 310 235 " +
    "L 305 285 L 290 325 L 275 365 L 260 405 L 240 440 L 215 470 L 185 490 " +
    "L 155 500 L 125 490 L 100 465 L 78 430 L 65 390 L 58 345 L 60 295 " +
    "L 68 245 L 75 195 L 82 155 Z",

  // ZONA 2 — Norte (north/northeast cluster, complex border)
  zona2:
    "M 355 48 L 400 40 L 440 44 L 475 52 L 510 58 L 545 68 L 570 82 " +
    "L 590 100 L 600 118 L 595 138 L 575 155 L 555 170 L 528 182 " +
    "L 500 190 L 470 195 L 445 200 L 415 205 L 395 215 L 375 228 " +
    "L 355 238 L 335 230 L 315 220 L 300 210 L 295 195 L 300 180 " +
    "L 310 165 L 320 148 L 330 128 L 340 108 L 348 78 Z",

  // ZONA 3 — Oriente (right bulge)
  zona3:
    "M 570 82 L 610 72 L 650 68 L 685 75 L 710 92 L 725 115 L 730 140 " +
    "L 725 168 L 710 195 L 690 215 L 668 232 L 645 245 L 620 255 " +
    "L 598 258 L 575 255 L 555 240 L 540 220 L 528 200 L 528 182 " +
    "L 545 168 L 565 155 L 580 138 L 595 118 L 590 100 Z",

  // ZONA 1 — Centro-Piendamó (center area, smallish)
  zona1:
    "M 300 185 L 335 175 L 355 168 L 375 175 L 395 185 L 415 192 " +
    "L 435 198 L 445 200 L 415 205 L 395 215 L 375 228 L 355 238 " +
    "L 335 248 L 320 258 L 305 270 L 295 285 L 290 300 L 292 318 " +
    "L 295 335 L 300 350 L 295 365 " +
    "L 285 370 L 275 365 L 275 345 L 280 325 L 285 305 L 290 285 " +
    "L 295 265 L 300 245 L 305 225 L 305 205 L 300 185 Z",

  // ZONA 6 — Popayán capital (center, small)
  zona6:
    "M 358 345 L 380 338 L 398 340 L 415 348 L 425 360 L 422 375 " +
    "L 408 385 L 390 390 L 370 386 L 355 375 L 352 360 Z",

  // ZONA 7 — Timbío-Rosas (center-south)
  zona7:
    "M 395 390 L 428 382 L 450 385 L 468 395 L 480 410 L 485 428 " +
    "L 478 448 L 462 460 L 442 465 L 420 460 L 405 448 L 395 430 " +
    "L 390 410 Z",

  // ZONA 5 — Sur (lower-left, large)
  zona5:
    "M 295 365 L 300 350 L 320 355 L 345 358 L 358 345 " +
    "L 352 360 L 355 375 L 370 386 L 390 390 " +
    "L 390 410 L 395 430 L 405 448 L 420 460 L 442 465 " +
    "L 445 480 L 440 500 L 428 518 L 412 530 L 390 538 " +
    "L 368 538 L 348 528 L 328 515 L 310 498 L 292 480 " +
    "L 278 460 L 265 440 L 253 418 L 248 395 L 248 370 " +
    "L 255 355 L 268 348 L 285 348 Z",

  // ZONA 8 — Macizo (south center-right)
  zona8:
    "M 468 395 L 490 390 L 512 392 L 532 400 L 548 415 " +
    "L 555 435 L 550 455 L 538 472 L 520 482 L 500 488 " +
    "L 480 482 L 462 468 L 462 460 L 478 448 L 485 428 " +
    "L 480 410 Z",

  // ZONA 9 — Bota Caucana (southeast peninsula)
  zona9:
    "M 548 415 L 565 410 L 585 408 L 608 412 L 628 422 " +
    "L 642 438 L 650 458 L 652 480 L 646 500 L 634 518 " +
    "L 618 532 L 600 540 L 580 542 L 562 535 L 550 520 " +
    "L 542 502 L 538 482 L 538 460 L 540 438 L 544 420 Z",
};

// ─── Main Component ──────────────────────────
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
              viewBox="0 0 810 685"
              className="w-full h-auto"
              role="img"
              aria-label="Mapa interactivo del Departamento del Cauca con 9 zonas operativas"
            >
              {/* Zone fills */}
              {zonas.map((zona) => {
                const isSelected = selected === zona.id;
                const isHovered = hovered === zona.id && !selected;
                const isActive = isSelected || isHovered;
                // All zones always visible — only dim non-selected when one is selected
                const opacity = selected
                  ? isSelected ? 0.9 : 0.3
                  : isHovered ? 0.85 : 0.65;

                return (
                  <path
                    key={zona.id}
                    d={zonePaths[zona.id]}
                    fill={zona.color}
                    fillOpacity={opacity}
                    stroke="white"
                    strokeWidth={isActive ? 2.8 : 1.4}
                    strokeOpacity={isActive ? 1 : 0.7}
                    className="cursor-pointer transition-all duration-200"
                    style={{
                      filter: isActive ? `drop-shadow(0 0 7px ${zona.color}99)` : "none",
                    }}
                    onMouseEnter={() => setHovered(zona.id)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={() => handleZoneClick(zona.id)}
                    role="button"
                    aria-label={`${zona.name} — ${zona.subregion}`}
                    tabIndex={0}
                    onKeyDown={e => e.key === "Enter" && handleZoneClick(zona.id)}
                  />
                );
              })}

              {/* Zone labels — always readable */}
              {zonas.map((zona) => {
                const isActive = selected === zona.id || (!selected && hovered === zona.id);
                const isDimmed = selected && selected !== zona.id;
                return (
                  <g key={`label-${zona.id}`} className="pointer-events-none select-none">
                    <text
                      x={zona.labelX}
                      y={zona.labelY}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill="white"
                      fontSize={isActive ? 13 : 11}
                      fontWeight="bold"
                      opacity={isDimmed ? 0.4 : 1}
                      style={{ filter: "drop-shadow(0 1px 3px rgba(0,0,0,0.9))" }}
                    >
                      {zona.name}
                    </text>
                  </g>
                );
              })}
            </svg>
            <p className="text-center text-[11px] text-muted-foreground font-body mt-1">
              {selected ? "Clic en otra zona para navegar · Clic en la zona activa para deseleccionar" : "Clic o hover en una zona para explorar"}
            </p>
          </div>
        </div>

        {/* ── INFO PANEL ── */}
        <div className="lg:col-span-2 border-t lg:border-t-0 lg:border-l border-border flex flex-col">

          {/* Zone list — always visible as quick nav */}
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
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: z.color }}
                  />
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
