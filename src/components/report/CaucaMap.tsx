import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

// ─── Types ──────────────────────────────────
interface ZonaData {
  id: string;
  name: string;
  subregion: string;
  municipios: string[];
  taller: string;
  color: string;
  cx: number;
  cy: number;
  actores: string[];
}

// ─── Zones Data ──────────────────────────────────
const zonas: ZonaData[] = [
  {
    id: "zona1",
    name: "Zona 1",
    subregion: "Centro (Piendamó)",
    municipios: ["Piendamó", "Cajibío", "Morales", "Silvia"],
    taller: "1 taller participativo en Piendamó",
    color: "hsl(145, 63%, 32%)",
    cx: 310, cy: 210,
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
    subregion: "Norte (Santander de Quilichao)",
    municipios: ["Santander de Quilichao", "Caldono", "Buenos Aires", "Caloto", "Jambaló"],
    taller: "1 taller participativo en Santander de Quilichao",
    color: "hsl(145, 50%, 42%)",
    cx: 370, cy: 110,
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
    subregion: "Oriente (Inzá)",
    municipios: ["Inzá", "Páez (Belalcázar)", "Totoró"],
    taller: "1 taller participativo en Inzá",
    color: "hsl(30, 70%, 50%)",
    cx: 450, cy: 175,
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
    subregion: "Pacífico (Guapi)",
    municipios: ["Guapi", "López de Micay", "Timbiquí"],
    taller: "1 taller participativo en Guapi",
    color: "hsl(200, 60%, 45%)",
    cx: 100, cy: 240,
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
    subregion: "Sur (Bolívar - El Bordo)",
    municipios: ["El Bordo (Patía)", "Mercaderes", "Bolívar", "Florencia", "Sucre", "Balboa", "Argelia"],
    taller: "1 taller participativo en El Bordo",
    color: "hsl(0, 65%, 50%)",
    cx: 270, cy: 390,
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
    subregion: "Centro (Popayán - Capital)",
    municipios: ["Popayán"],
    taller: "1 taller participativo en Popayán",
    color: "hsl(260, 50%, 50%)",
    cx: 285, cy: 285,
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
    subregion: "Centro (Timbío - Rosas)",
    municipios: ["Timbío", "Rosas", "La Sierra", "Sotará"],
    taller: "1 taller participativo en Timbío",
    color: "hsl(340, 55%, 50%)",
    cx: 330, cy: 320,
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
    subregion: "Macizo (La Vega)",
    municipios: ["La Vega", "San Sebastián", "Almaguer"],
    taller: "1 taller participativo en La Vega",
    color: "hsl(280, 45%, 50%)",
    cx: 390, cy: 360,
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
    subregion: "Bota Caucana (Piamonte)",
    municipios: ["Santa Rosa", "Piamonte"],
    taller: "1 taller participativo en Piamonte",
    color: "hsl(170, 55%, 38%)",
    cx: 460, cy: 450,
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

// ─── Approximate region paths grouped by zone ──────────────────
const zonasPaths: Record<string, string> = {
  zona1: "M 240 175 L 300 165 L 345 185 L 355 230 L 325 255 L 265 250 L 235 220 Z",
  zona2: "M 290 55 L 400 40 L 430 90 L 415 145 L 360 160 L 310 150 L 275 110 L 270 70 Z",
  zona3: "M 415 145 L 485 115 L 510 165 L 500 225 L 450 250 L 405 230 L 390 185 Z",
  zona4: "M 50 150 L 150 120 L 195 170 L 200 240 L 210 290 L 170 340 L 100 310 L 55 250 Z",
  zona5: "M 175 355 L 275 330 L 310 360 L 325 415 L 295 455 L 225 460 L 175 435 L 150 390 Z",
  zona6: "M 240 250 L 325 255 L 350 290 L 340 335 L 295 345 L 250 335 L 225 300 Z",
  zona7: "M 295 345 L 365 330 L 395 360 L 380 405 L 345 415 L 310 400 L 295 370 Z",
  zona8: "M 365 330 L 430 320 L 460 365 L 445 415 L 400 430 L 360 415 L 355 380 Z",
  zona9: "M 445 415 L 510 400 L 530 455 L 510 500 L 455 510 L 415 480 L 420 445 Z",
};

const CaucaMap: React.FC = () => {
  const [active, setActive] = useState<string | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const activeData = zonas.find((z) => z.id === (selected || active));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-card rounded-2xl border border-border p-6 shadow-sm"
    >
      <h3 className="font-heading font-bold text-lg mb-1 text-center">
        Mapa Interactivo del Cauca — 7 Subregiones / 9 Zonas Operativas
      </h3>
      <p className="text-center text-xs text-muted-foreground mb-4 font-body">
        Haz clic en una zona para ver detalle de municipios y actores · 1 taller diferencial por zona
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Map SVG */}
        <div className="lg:col-span-3 flex justify-center relative">
          <svg
            viewBox="0 0 560 540"
            className="w-full max-w-[440px]"
            role="img"
            aria-label="Mapa del Departamento del Cauca — 9 Zonas Operativas"
          >
            <defs>
              <filter id="shadow-zone" x="-8%" y="-8%" width="116%" height="116%">
                <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.2" />
              </filter>
            </defs>

            {zonas.map((zona) => (
              <g key={zona.id}>
                <path
                  d={zonasPaths[zona.id]}
                  fill={zona.color}
                  stroke="white"
                  strokeWidth={(selected === zona.id || active === zona.id) ? 3 : 1.5}
                  opacity={(!active && !selected) || active === zona.id || selected === zona.id ? 1 : 0.35}
                  className="cursor-pointer transition-all duration-300"
                  onMouseEnter={() => !selected && setActive(zona.id)}
                  onMouseLeave={() => !selected && setActive(null)}
                  onClick={() => setSelected(selected === zona.id ? null : zona.id)}
                  filter={(selected === zona.id || active === zona.id) ? "url(#shadow-zone)" : undefined}
                />
                <text
                  x={zona.cx}
                  y={zona.cy - 6}
                  textAnchor="middle"
                  className="pointer-events-none select-none"
                  fill="white"
                  fontSize={10}
                  fontWeight="bold"
                >
                  {zona.name}
                </text>
                <text
                  x={zona.cx}
                  y={zona.cy + 8}
                  textAnchor="middle"
                  className="pointer-events-none select-none"
                  fill="rgba(255,255,255,0.8)"
                  fontSize={8}
                >
                  {zona.municipios.length} mun.
                </text>
              </g>
            ))}
          </svg>
        </div>

        {/* Info panel */}
        <div className="lg:col-span-2 flex flex-col">
          <AnimatePresence mode="wait">
            {activeData ? (
              <motion.div
                key={activeData.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded shrink-0" style={{ backgroundColor: activeData.color }} />
                    <div>
                      <h4 className="font-heading font-bold text-lg text-foreground leading-tight">{activeData.name}</h4>
                      <p className="text-xs text-muted-foreground font-body">{activeData.subregion}</p>
                    </div>
                  </div>
                  {selected && (
                    <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Taller badge */}
                <div className="bg-primary/10 border border-primary/30 rounded-xl px-4 py-2">
                  <p className="text-xs font-heading font-semibold text-primary">📍 {activeData.taller}</p>
                </div>

                {/* Municipios */}
                <div>
                  <p className="text-xs font-heading font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                    Municipios ({activeData.municipios.length})
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {activeData.municipios.map((m) => (
                      <span key={m} className="bg-muted text-foreground px-2 py-0.5 rounded text-xs font-body">{m}</span>
                    ))}
                  </div>
                </div>

                {/* Actores */}
                <div>
                  <p className="text-xs font-heading font-semibold text-muted-foreground mb-2 uppercase tracking-wide">
                    Actores a Convocar ({activeData.actores.length})
                  </p>
                  <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                    {activeData.actores.map((a, i) => (
                      <div key={i} className="flex items-start gap-2 text-xs font-body text-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 shrink-0" />
                        <span>{a}</span>
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
                className="py-4"
              >
                <p className="text-muted-foreground font-body text-sm text-center mb-4">
                  👆 Selecciona una zona para ver detalle
                </p>
                <div className="space-y-1.5">
                  {zonas.map((z) => (
                    <button
                      key={z.id}
                      onMouseEnter={() => setActive(z.id)}
                      onMouseLeave={() => setActive(null)}
                      onClick={() => setSelected(selected === z.id ? null : z.id)}
                      className="flex items-center gap-2 w-full px-3 py-1.5 rounded-lg hover:bg-muted transition-colors text-left"
                    >
                      <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: z.color }} />
                      <span className="text-xs font-heading font-semibold text-foreground flex-1">{z.name} — {z.subregion}</span>
                      <span className="text-xs text-muted-foreground shrink-0">{z.municipios.length} mun.</span>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
};

export default CaucaMap;
