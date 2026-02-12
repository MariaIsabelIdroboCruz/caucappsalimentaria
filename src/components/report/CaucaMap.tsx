import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SubregionData {
  id: string;
  name: string;
  municipios: string[];
  poblacion: number;
  inseguridad: number;
  color: string;
  path: string;
}

const subregiones: SubregionData[] = [
  {
    id: "norte",
    name: "Norte",
    municipios: ["Buenos Aires", "Caloto", "Caldono", "Puerto Tejada", "Villa Rica", "Suárez", "Santander de Quilichao", "Toribío", "Corinto", "Padilla", "Miranda", "Guachené", "Jambaló"],
    poblacion: 478250,
    inseguridad: 140180,
    color: "hsl(145, 63%, 32%)",
    path: "M 280 40 L 380 30 L 420 80 L 400 140 L 350 170 L 300 160 L 260 120 L 250 70 Z",
  },
  {
    id: "centro",
    name: "Centro",
    municipios: ["Cajibío", "El Tambo", "Morales", "Piendamó", "Silvia", "Puracé", "Timbío", "Popayán"],
    poblacion: 412300,
    inseguridad: 120930,
    color: "hsl(145, 50%, 42%)",
    path: "M 200 130 L 300 160 L 350 170 L 370 220 L 340 280 L 280 300 L 220 280 L 180 230 L 170 170 Z",
  },
  {
    id: "pacifico",
    name: "Pacífico",
    municipios: ["Guapi", "López de Micay", "Timbiquí"],
    poblacion: 98400,
    inseguridad: 48700,
    color: "hsl(200, 60%, 45%)",
    path: "M 40 80 L 120 60 L 170 100 L 170 170 L 180 230 L 150 290 L 100 310 L 60 260 L 30 180 Z",
  },
  {
    id: "oriente",
    name: "Oriente",
    municipios: ["Inzá", "Páez", "Totoró"],
    poblacion: 95600,
    inseguridad: 38200,
    color: "hsl(30, 70%, 50%)",
    path: "M 400 140 L 470 110 L 500 160 L 490 230 L 440 260 L 370 220 L 350 170 Z",
  },
  {
    id: "sur",
    name: "Sur",
    municipios: ["Argelia", "Balboa", "Bolívar", "Florencia", "Mercaderes", "Patía", "Sucre"],
    poblacion: 198500,
    inseguridad: 65100,
    color: "hsl(0, 65%, 50%)",
    path: "M 180 330 L 280 300 L 340 340 L 360 400 L 320 440 L 240 450 L 180 420 L 150 370 Z",
  },
  {
    id: "macizo",
    name: "Macizo",
    municipios: ["Almaguer", "La Vega", "La Sierra", "Rosas", "Sotará", "San Sebastián"],
    poblacion: 168200,
    inseguridad: 52800,
    color: "hsl(280, 45%, 50%)",
    path: "M 280 300 L 340 280 L 400 310 L 420 370 L 380 420 L 340 440 L 340 340 Z",
  },
  {
    id: "bota",
    name: "Bota Caucana",
    municipios: ["Piamonte", "Santa Rosa"],
    poblacion: 38900,
    inseguridad: 15200,
    color: "hsl(340, 55%, 50%)",
    path: "M 400 310 L 490 300 L 520 370 L 500 440 L 440 470 L 380 420 L 420 370 Z",
  },
];

const CaucaMap: React.FC = () => {
  const [active, setActive] = useState<string | null>(null);
  const activeData = subregiones.find((s) => s.id === active);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-card rounded-2xl border border-border p-6 shadow-sm"
    >
      <h3 className="font-heading font-bold text-lg mb-4 text-center">Mapa Interactivo del Cauca — 7 Subregiones</h3>
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Map SVG */}
        <div className="lg:col-span-3 flex justify-center">
          <svg viewBox="0 0 540 500" className="w-full max-w-[420px]" role="img" aria-label="Mapa del Departamento del Cauca">
            {/* Background */}
            <defs>
              <filter id="shadow" x="-5%" y="-5%" width="110%" height="110%">
                <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.15" />
              </filter>
            </defs>
            {subregiones.map((sub) => (
              <g key={sub.id}>
                <path
                  d={sub.path}
                  fill={active === sub.id ? sub.color : `${sub.color}`}
                  stroke="white"
                  strokeWidth={active === sub.id ? 3 : 1.5}
                  opacity={!active || active === sub.id ? 1 : 0.4}
                  className="cursor-pointer transition-all duration-300"
                  onMouseEnter={() => setActive(sub.id)}
                  onMouseLeave={() => setActive(null)}
                  onClick={() => setActive(active === sub.id ? null : sub.id)}
                  filter={active === sub.id ? "url(#shadow)" : undefined}
                />
              </g>
            ))}
            {/* Labels */}
            {subregiones.map((sub) => {
              const match = sub.path.match(/M\s+([\d.]+)\s+([\d.]+)/);
              if (!match) return null;
              // Compute rough centroid from path
              const coords = sub.path.match(/[\d.]+/g)?.map(Number) || [];
              let cx = 0, cy = 0, count = 0;
              for (let i = 0; i < coords.length; i += 2) {
                cx += coords[i]; cy += coords[i + 1]; count++;
              }
              cx /= count; cy /= count;
              return (
                <text
                  key={`label-${sub.id}`}
                  x={cx}
                  y={cy}
                  textAnchor="middle"
                  dominantBaseline="central"
                  className="pointer-events-none select-none"
                  fill="white"
                  fontSize={sub.id === "bota" ? 10 : 12}
                  fontWeight="bold"
                  style={{ textShadow: "0 1px 3px rgba(0,0,0,0.6)" }}
                >
                  {sub.name}
                </text>
              );
            })}
          </svg>
        </div>

        {/* Info panel */}
        <div className="lg:col-span-2 flex flex-col justify-center">
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
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 rounded" style={{ backgroundColor: activeData.color }} />
                  <h4 className="font-heading font-bold text-xl text-foreground">{activeData.name}</h4>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-muted rounded-xl p-3 text-center">
                    <p className="font-heading font-black text-xl text-foreground">{activeData.poblacion.toLocaleString("es-CO")}</p>
                    <p className="text-xs text-muted-foreground">Población</p>
                  </div>
                  <div className="bg-secondary/10 rounded-xl p-3 text-center">
                    <p className="font-heading font-black text-xl text-secondary">{activeData.inseguridad.toLocaleString("es-CO")}</p>
                    <p className="text-xs text-muted-foreground">Inseg. Alimentaria</p>
                  </div>
                </div>
                <div>
                  <p className="text-xs font-heading font-semibold text-muted-foreground mb-2">Municipios ({activeData.municipios.length})</p>
                  <div className="flex flex-wrap gap-1.5">
                    {activeData.municipios.map((m) => (
                      <span key={m} className="bg-muted text-foreground px-2 py-0.5 rounded text-xs font-body">{m}</span>
                    ))}
                  </div>
                </div>
                {/* Severity bar */}
                <div>
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Tasa de inseguridad</span>
                    <span className="font-bold text-secondary">{Math.round((activeData.inseguridad / activeData.poblacion) * 100)}%</span>
                  </div>
                  <div className="bg-border rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${(activeData.inseguridad / activeData.poblacion) * 100}%` }}
                      transition={{ duration: 0.5 }}
                      className="h-full bg-secondary rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-8"
              >
                <p className="text-muted-foreground font-body text-sm">
                  👆 Pasa el cursor sobre una subregión para ver sus datos
                </p>
                <div className="mt-4 space-y-2">
                  {subregiones.map((s) => (
                    <button
                      key={s.id}
                      onMouseEnter={() => setActive(s.id)}
                      onMouseLeave={() => setActive(null)}
                      className="flex items-center gap-2 w-full px-3 py-1.5 rounded-lg hover:bg-muted transition-colors text-left"
                    >
                      <div className="w-3 h-3 rounded-sm shrink-0" style={{ backgroundColor: s.color }} />
                      <span className="text-xs font-heading font-semibold text-foreground flex-1">{s.name}</span>
                      <span className="text-xs text-muted-foreground">{s.municipios.length} mun.</span>
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
