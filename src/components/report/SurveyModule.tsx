import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users, Sprout, ShoppingCart, ShieldCheck, Leaf,
  ChevronDown, ChevronRight, HelpCircle
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// ─── Types ────────────────────────────────────
interface Question {
  id: number;
  text: string;
  hint: string;
}

interface Block {
  key: string;
  title: string;
  description: string;
  objective: string;
  icon: React.ReactNode;
  color: string;       // tailwind bg for icon badge
  borderColor: string; // tailwind ring/border
  questions: Question[];
}

// ─── Data ─────────────────────────────────────
const blocks: Block[] = [
  {
    key: "caracterizacion",
    title: "Caracterización",
    description: "Recoge información general de las personas encuestadas para entender sus condiciones sociales, económicas y demográficas.",
    objective: "Identificar quiénes son los actores del territorio.",
    icon: <Users size={22} />,
    color: "bg-blue-100 text-blue-700",
    borderColor: "border-blue-300 ring-blue-200",
    questions: [
      { id: 1, text: "Municipio del Cauca al cual pertenece usted ________________________", hint: "Ubicación geográfica del encuestado dentro del departamento." },
      { id: 2, text: "Edad (en años cumplidos) ______________", hint: "Rango etario para segmentar la población." },
      { id: 3, text: "Sexo: Hombre ____ Mujer ____ Otro ____", hint: "Distribución por género de los participantes." },
      { id: 4, text: "¿Con cuál de los siguientes grupos étnicos o culturales se reconoce usted?\nNegro(a)____ Indígena____ Afrocolombiano(a) ____ Mestizo(a) ____ Rrom____ Raizal____ Palanquero(a) ____ Campesino(a)____ Ninguno____ Otro____ ¿Cuál?_____________________", hint: "Identidad étnica y cultural del encuestado." },
      { id: 5, text: "¿A cuál de los siguientes grupos poblacionales pertenece usted?\nPersona con discapacidad____ poblacion LGBTIQ+____ Víctima de conflicto armado____ Ninguno____ Otro ¿Cuál?_____________________", hint: "Pertenencia a grupos poblacionales diferenciales." },
      { id: 6, text: "¿Cuál es su nivel educativo más alto alcanzado?\nPrimaria____ Bachillerato____ Tecnológico____ Técnico____ Universitario____ Especialización____ Maestría____ Doctorado____ Ninguno____", hint: "Nivel de escolaridad para analizar capital humano." },
      { id: 7, text: "¿En qué actividad ocupó usted la mayor parte del tiempo la semana pasada?\nTrabajando____ Buscando trabajo____ Estudiando____ Oficios del hogar____ Incapacitado permanente para trabajar____ Otro____ ¿Cuál?_____________________", hint: "Ocupación principal y situación laboral." },
      { id: 8, text: "Nombre de la organización, entidad, comunidad u organismo internacional al que representa: _____________________", hint: "Vínculo institucional u organizativo del encuestado." },
      { id: 9, text: "¿Cuál es el sector al que pertenece?\nInstitucional____ Academia____ Organizaciones no gubernamentales ONG´s____ Organizaciones y/o Asociaciones____ Organismos internacionales____ Otro ____ ¿Cuál?_____________________", hint: "Sector de procedencia para mapeo de actores." },
      { id: 10, text: "¿Cuál es el ingreso mensual aproximado de su familia? (Marque una sola opción)\nMenos de 1 salario mínimo mensual legal vigente (SMMLV) ____\nEntre 1 y menos de 2 salarios mínimos (SMMLV) ____\nEntre 2 y menos de 3 salarios mínimos (SMMLV) ____\nEntre 3 y menos de 4 salarios mínimos (SMMLV) ____\n4 o más salarios mínimos (SMMLV) ____\nNo sabe / No responde ____", hint: "Nivel socioeconómico del hogar." },
      { id: 11, text: "¿Cuántas personas viven en su hogar? _____ (Marque en números)", hint: "Tamaño del núcleo familiar." },
      { id: 12, text: "¿Cuántos son niños, niñas o adultos mayores? _____ (Marque en números)", hint: "Población vulnerable dentro del hogar." },
      { id: 13, text: "¿Con cuáles servicios básicos cuenta su vivienda? (Marque una o varias opciones)\nAgua potable____ Alcantarillado____ Recolección de basuras____ Energía eléctrica____ Acueducto____ Energías alternativas ____ Otro____ ¿Cuál?_____________________", hint: "Acceso a servicios públicos domiciliarios." },
    ],
  },
  {
    key: "disponibilidad",
    title: "Disponibilidad",
    description: "Analiza si en el territorio existen suficientes alimentos y cómo se producen.",
    objective: "Comprender la capacidad productiva y factores que afectan la oferta de alimentos.",
    icon: <Sprout size={22} />,
    color: "bg-green-100 text-green-700",
    borderColor: "border-green-300 ring-green-200",
    questions: [
      { id: 14, text: "¿Dispone de espacio para cultivar alimentos?\nSI ____ No____", hint: "Disponibilidad de tierra para producción agrícola." },
      { id: 15, text: "¿Dispone de un espacio para cría de animales?\nSI ____ No____", hint: "Disponibilidad de espacio para producción pecuaria." },
      { id: 16, text: "La producción es para:\nAutoconsumo ___ Venta ___ Ambos ____", hint: "Destino de la producción agropecuaria." },
      { id: 17, text: "¿Ha disminuido la producción en los últimos 2 años?\n× Riesgo de pérdida o baja productividad___\n× Incertidumbre con respecto a si lo que se siembra se va a vender___\n× Pérdida de fertilidad de los suelos y necesidad de alternativas rentables de cultivos de rotación___\n× Efectos no esperados por el cambio climático___\n× Altos costos en los precios de los agroquímicos que obstaculizan las posibilidades de mayores reducciones en los costos de producción___\n× Material vegetal y semillas sin certificar generando rendimientos bajos en producción y heterogeneidad en la calidad del mercado___\n× Organización y agremiación de los productores precaria___\n× Capacitación, transferencia de tecnología y asistencia técnica y empresarial insuficientes___\n× Baja generación de valor agregado en la cadena___\n× Abuso de pesticidas y fungicidas que dejan residuos toxico en el producto___\n× Malas prácticas de cultivo y en los tratamientos postcosecha, característica minifundista de la producción___\n× Sistema de comercialización ineficiente (alto número de intermediarios) ___\n× Carencia de adecuados sistemas de información___\n× No sabe, no informa____\n× Otro___", hint: "Factores que han reducido la producción local." },
      { id: 18, text: "¿En su municipio existen algunos de los siguientes sistemas de producción? (Marque una o varias opciones)\nAgroecológica____ Agroforestería____ Agroindustrial____ Ganadería orgánica y eficiente____ Pesca eficiente y responsable____ Agricultura urbana____ Ninguno____ Otro ____ No sabe/ No Informa ____", hint: "Tipos de sistemas productivos presentes en el municipio." },
      { id: 19, text: "¿Para la producción de alimentos agrícolas qué tipo de semillas se utilizan en la región?\n(Marque una o varias opciones)\nSemillas nativas____ Semillas introducidas____ Semillas certificadas____ Otras____ No sabe/ No Informa ____", hint: "Tipo de material vegetal utilizado en la producción." },
      { id: 20, text: "¿Dónde compran principalmente los alimentos para el hogar en su municipio? (Marque una o varias opciones)\nTiendas de barrio o vereda____ Minimercado de barrio o vereda____ Plaza minorista____ Plaza mayorista____ Supermercado____ Ventas ambulantes____ Carnicería____ Otro ____ No sabe/ No Informa ____", hint: "Canales de abastecimiento de alimentos." },
      { id: 21, text: "¿Cuál es la razón principal para escoger dónde compra los alimentos?\nCercanía____ Calidad____ Precios____ Variedad____ Tamaño del empaque____ Facilidad de transporte____ Atención____ Infraestructura____ Facilidad de pago____ Inocuidad ____ Otro ____ No sabe/ No Informa ____", hint: "Criterios de decisión en la compra de alimentos." },
      { id: 22, text: "¿Dónde comercializan las familias productoras del municipio?\nPlazas de mercado____ Mercados campesinos____ Grandes superficies____ Otros____ No sabe/ No Informa ____", hint: "Puntos de venta de los productores locales." },
    ],
  },
  {
    key: "acceso",
    title: "Acceso",
    description: "Evalúa si los hogares pueden acceder a alimentos suficientes y de calidad.",
    objective: "Identificar niveles de seguridad o inseguridad alimentaria.",
    icon: <ShoppingCart size={22} />,
    color: "bg-amber-100 text-amber-700",
    borderColor: "border-amber-300 ring-amber-200",
    questions: [
      { id: 23, text: "¿Alguna vez usted preocupo por no tener suficientes alimentos para comer?\nSi____ No____ No sabe/ No Informa____", hint: "Nivel de preocupación por escasez alimentaria." },
      { id: 24, text: "¿En su hogar no pudo comer alimentos saludables y nutritivos?\nSi____ No____ No sabe/ No Informa____", hint: "Acceso a alimentación saludable y nutritiva." },
      { id: 25, text: "¿Alguna vez usted o algún integrante en su hogar consumió poca variedad de alimentos?\nSi____ No____ No sabe/ No Informa____", hint: "Diversidad alimentaria en el hogar." },
      { id: 26, text: "¿Alguna vez usted o algún integrante tuvo que saltar una comida (desayuno, almuerzo, comida o cena)?\nSi____ No____ No sabe/ No Informa____", hint: "Omisión de tiempos de comida por falta de alimentos." },
      { id: 27, text: "¿Alguna vez usted o algún integrante de su hogar Comió menos de lo que pensaba que debía de comer\nSi____ No____ No sabe/ No Informa____", hint: "Reducción de la cantidad de alimentos consumidos." },
      { id: 28, text: "¿Alguna vez el hogar quedo sin alimentos?\nSi____ No____ No sabe/ No Informa____", hint: "Episodios de desabastecimiento total en el hogar." },
      { id: 29, text: "¿Alguna vez usted o algún integrante tuvo hambre y no comió?\nSi____ No____ No sabe/ No Informa____", hint: "Experiencia directa de hambre." },
      { id: 30, text: "¿Alguna vez usted o algún integrante de su hogar no comió en un día entero?\nSi____ No____ No sabe/ No Informa____", hint: "Privación alimentaria extrema (día completo sin comer)." },
      { id: 31, text: "¿Prioriza en su hogar el consumo de alimentos para los grupos prioritarios (niños, niñas, mujeres embarazadas, adultos mayores)?\nSi____ No____ No sabe/ No Informa____", hint: "Priorización alimentaria para grupos vulnerables." },
      { id: 32, text: "¿Después de entregar estos alimentos a los grupos prioritarios, si quedan alimentos, se distribuyen entre el resto de los integrantes del hogar?\nSi____ No____ No sabe/ No Informa____", hint: "Distribución intrafamiliar de alimentos." },
      { id: 33, text: "¿Ha enviado a integrantes de la familia a comer donde vecinos, familiares u otros?\nSi____ No____ No sabe/ No Informa____", hint: "Estrategia de afrontamiento: comer fuera del hogar." },
      { id: 34, text: "¿Alguna vez usted ha pedido alimentos fiados en las tiendas locales?\nSi____ No____ No sabe/ No Informa____", hint: "Uso de crédito informal para alimentación." },
      { id: 35, text: "¿Alguna vez usted ha usado ahorros destinados a otras actividades para comprar alimentos?\nSi____ No____ No sabe/ No Informa____", hint: "Redireccionamiento de recursos para comprar alimentos." },
      { id: 36, text: "¿Alguna vez usted ha pedido dinero prestado a amigos o familiares para comprar alimentos?\nSi____ No____ No sabe/ No Informa____", hint: "Endeudamiento para cubrir necesidades alimentarias." },
      { id: 37, text: "¿Aproximadamente, cuánto dinero destina la familia mensualmente para gasto de alimentos?\nMenos de $200.000\nEntre $200.001 y $400.000\nEntre $400.001 y $600.000\nEntre $600.001 y $800.000\nEntre $800.001 y $1.000.000\nEntre $1.000.001 y $1.500.000\nMás de $1.500.000\nNo sabe / No responde", hint: "Gasto mensual en alimentos del hogar." },
      { id: 38, text: "¿Usted recibe ayudas del gobierno nacional, departamental o municipal?\nSi____ No____ No sabe/ No Informa____", hint: "Acceso a programas de asistencia gubernamental." },
      { id: 39, text: "¿Usted recibe ayudas de otras entidades privadas como fundaciones, iglesias?\nSi____ No____ No sabe/ No Informa____", hint: "Apoyo alimentario de sector privado y sociedad civil." },
      { id: 40, text: "¿Qué programas de alimentación complementaria existen en su municipio? (Marque una o varias opciones)\nHogares comunitarios (ICBF) ____ Restaurante escolar____ Paquete alimentario mujer gestante y lactante____ Complemento para la primera infancia____ Paquete alimentario familias vulnerables____ Paquete alimentario adulto mayor____ Otros programas alimentarios ____ No sabe/ No Informa____", hint: "Presencia de programas de alimentación complementaria." },
      { id: 41, text: "¿Cuáles son los factores que han influido en obtener los alimentos que requiere para el consumo familiar?\nAltos precios de los alimentos                 Si____ No___ No sabe/ No Informa____\nFalta de ingresos familiares                    Si____ No___ No sabe/ No Informa____\nEl sitio donde venden comida esté lejos Si____ No___ No sabe/ No Informa____\nFalta o escasez de alimentos en los lugares de compra           Si____ No___ No sabe/ No Informa____", hint: "Barreras para acceder a alimentos suficientes." },
    ],
  },
  {
    key: "inocuidad",
    title: "Inocuidad",
    description: "Examina la calidad, diversidad y seguridad de los alimentos consumidos.",
    objective: "Identificar riesgos alimentarios y su relación con la salud.",
    icon: <ShieldCheck size={22} />,
    color: "bg-rose-100 text-rose-700",
    borderColor: "border-rose-300 ring-rose-200",
    questions: [
      { id: 42, text: "¿Con que frecuencia comen en la familia los siguientes grupos de alimentos?\n\nGrupo de alimentos | Diario | 1 vez por semana | 2–4 veces por semana | 5-6 veces por semana | 1–3 veces al mes | Nunca / Casi nunca\nCereales y derivados (arroz, pan, pasta, maíz)\nTubérculos y plátanos (papa, yuca, plátano)\nLeguminosas (fríjol, lenteja, garbanzo)\nVerduras y hortalizas\nFrutas\nCarnes (res, cerdo, pollo)\nVísceras (hígado, bofe, pajarilla)\nPescados y mariscos\nHuevos\nLeche y productos lácteos\nGrasas y aceites\nAzúcares y dulces\nBebidas azucaradas (gaseosas, jugos artificiales)\nAlimentos ultraprocesados (snacks, paquetes, embutidos)", hint: "Frecuencia de consumo por grupo alimentario." },
      { id: 43, text: "A qué régimen de salud pertenece:\nSubsidiado____ Contributivo____ Ninguno____ Otro ____", hint: "Afiliación al sistema de salud." },
      { id: 44, text: "El agua que utiliza para preparar los alimentos es:\nPotable____ Hervida____ Tratada____ Sin tratamiento____", hint: "Calidad del agua usada en preparación de alimentos." },
      { id: 45, text: "¿Usted o algún integrante de su familia ha presentado o presenta?\nDesnutrición        Si____ No___ No sabe/ No Informa____\nObesidad             Si____ No___ No sabe/ No Informa____\nHipertensión        Si____ No___ No sabe/ No Informa____\nDiabetes              Si____ No___ No sabe/ No Informa____\nEnfermedad del corazón Si____ No___ No sabe/ No Informa____\nHígado graso Si____ No___ No sabe/ No Informa____\nGastritis Si____ No___ No sabe/ No Informa____\nAnemia                Si____ No___ No sabe/ No Informa____", hint: "Condiciones de salud relacionadas con la alimentación." },
    ],
  },
  {
    key: "sostenibilidad",
    title: "Sostenibilidad",
    description: "Analiza si los sistemas alimentarios pueden mantenerse en el tiempo.",
    objective: "Evaluar prácticas sostenibles y percepción frente al futuro alimentario.",
    icon: <Leaf size={22} />,
    color: "bg-emerald-100 text-emerald-700",
    borderColor: "border-emerald-300 ring-emerald-200",
    questions: [
      { id: 46, text: "¿Usted cree que el cambio climático afecta la producción?\nSí____ No____ No sabe/ No Informa____", hint: "Percepción sobre el impacto del cambio climático." },
      { id: 47, text: "¿Usted realiza alguna de estas prácticas?\nHuertas____  Compostaje____  Conservación de semillas____ Rotación de cultivos____ Otro____ ¿Cuál?________________", hint: "Prácticas sostenibles adoptadas por el encuestado." },
      { id: 48, text: "¿Usted cree que será más difícil conseguir alimentos en el futuro?\nSí____ No____", hint: "Percepción sobre la futura disponibilidad alimentaria." },
    ],
  },
];

// ─── Animations ───────────────────────────────
const fadeIn = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

// ─── Question Card ────────────────────────────
const QuestionCard: React.FC<{ q: Question }> = ({ q }) => {
  const [open, setOpen] = useState(false);
  const lines = q.text.split("\n");
  const mainLine = lines[0];
  const optionLines = lines.slice(1);

  return (
    <motion.div
      variants={fadeIn}
      className="rounded-xl border border-border bg-card shadow-sm overflow-hidden"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left px-5 py-4 flex items-start gap-3 hover:bg-muted/40 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        aria-expanded={open}
      >
        <span className="shrink-0 mt-0.5 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold font-heading">
          {q.id}
        </span>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-foreground leading-relaxed whitespace-pre-line">
            {mainLine}
          </p>
        </div>
        <ChevronDown
          size={18}
          className={`shrink-0 mt-1 text-muted-foreground transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-5 pb-4 space-y-3">
              {/* Options */}
              {optionLines.length > 0 && (
                <div className="bg-muted/50 rounded-lg p-3 text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                  {optionLines.join("\n")}
                </div>
              )}
              {/* Hint */}
              <div className="flex items-start gap-2 bg-primary/5 rounded-lg p-3">
                <HelpCircle size={16} className="shrink-0 mt-0.5 text-primary" />
                <p className="text-xs text-primary font-medium leading-relaxed">
                  <span className="font-bold">¿Qué se busca?</span> {q.hint}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ─── Block Content ────────────────────────────
const BlockContent: React.FC<{ block: Block }> = ({ block }) => (
  <motion.div
    initial="hidden"
    animate="visible"
    variants={{ visible: { transition: { staggerChildren: 0.04 } } }}
    className="space-y-3"
  >
    {/* Block header */}
    <div className={`rounded-xl border-2 ${block.borderColor} p-5 mb-4`}>
      <div className="flex items-center gap-3 mb-2">
        <span className={`w-10 h-10 rounded-lg flex items-center justify-center ${block.color}`}>
          {block.icon}
        </span>
        <div>
          <h3 className="font-heading font-bold text-lg text-foreground">{block.title}</h3>
          <span className="text-xs text-muted-foreground font-medium">
            {block.questions.length} preguntas · Objetivo: {block.objective}
          </span>
        </div>
      </div>
      <p className="text-sm text-muted-foreground leading-relaxed mt-1">{block.description}</p>
    </div>

    {/* Questions */}
    {block.questions.map((q) => (
      <QuestionCard key={q.id} q={q} />
    ))}
  </motion.div>
);

// ─── Main Component ───────────────────────────
const SurveyModule: React.FC = () => {
  const [activeBlock, setActiveBlock] = useState("caracterizacion");

  return (
    <div className="space-y-6">
      {/* Title area */}
      <div className="text-center mb-2">
        <span className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-3">
          <HelpCircle size={14} /> Instrumento de Recolección
        </span>
        <h2 className="font-heading font-extrabold text-2xl md:text-3xl text-foreground mb-2">
          Encuesta de Seguridad y Soberanía Alimentaria
        </h2>
        <p className="text-muted-foreground text-sm max-w-2xl mx-auto">
          48 preguntas organizadas en 5 bloques temáticos. Haz clic en cada pregunta para ver las opciones de respuesta y qué se busca identificar.
        </p>
      </div>

      {/* Block summary cards (mobile: horizontal scroll, desktop: grid) */}
      <div className="flex gap-3 overflow-x-auto pb-2 md:grid md:grid-cols-5 md:overflow-visible scrollbar-thin">
        {blocks.map((b) => (
          <button
            key={b.key}
            onClick={() => setActiveBlock(b.key)}
            className={`shrink-0 flex flex-col items-center gap-1.5 rounded-xl border-2 px-4 py-3 min-w-[120px] transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
              activeBlock === b.key
                ? `${b.borderColor} ring-2 bg-card shadow-md scale-[1.02]`
                : "border-border bg-card/50 hover:border-muted-foreground/30"
            }`}
          >
            <span className={`w-9 h-9 rounded-lg flex items-center justify-center ${b.color}`}>
              {b.icon}
            </span>
            <span className="text-xs font-bold text-foreground font-heading">{b.title}</span>
            <span className="text-[10px] text-muted-foreground">{b.questions.length} preguntas</span>
          </button>
        ))}
      </div>

      {/* Active block content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeBlock}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          <BlockContent block={blocks.find((b) => b.key === activeBlock)!} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default SurveyModule;
