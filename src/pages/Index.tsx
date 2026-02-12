import SlideViewer from "@/components/presentation/SlideViewer";
import {
  CoverSlide,
  ContextSlide,
  AntecedentesSlide,
  JustificacionSlide,
  ProblemaSlide,
  ParticipantesSlide,
  PoblacionSlide,
  ObjetivosSlide,
  AlternativaSlide,
  PlanAccionSlide,
  Primeros4MesesSlide,
  DiagnosticoSlide,
  CronogramaDetalladoSlide,
  PerfilesSlide,
  RiesgosSlide,
  IndicadoresSlide,
  ComunicacionSlide,
  ConclusionSlide,
  CierreSlide,
} from "@/components/presentation/AllSlides";
import SlideLayout from "@/components/presentation/SlideLayout";

const totalSlides = 19;

const withLayout = (el: React.ReactNode, i: number) => el;

const slides = [
  <CoverSlide key={0} />,
  <ContextSlide key={1} />,
  <AntecedentesSlide key={2} />,
  <JustificacionSlide key={3} />,
  <ProblemaSlide key={4} />,
  <ParticipantesSlide key={5} />,
  <PoblacionSlide key={6} />,
  <ObjetivosSlide key={7} />,
  <AlternativaSlide key={8} />,
  <PlanAccionSlide key={9} />,
  <Primeros4MesesSlide key={10} />,
  <DiagnosticoSlide key={11} />,
  <CronogramaDetalladoSlide key={12} />,
  <PerfilesSlide key={13} />,
  <RiesgosSlide key={14} />,
  <IndicadoresSlide key={15} />,
  <ComunicacionSlide key={16} />,
  <ConclusionSlide key={17} />,
  <CierreSlide key={18} />,
];

const Index = () => {
  return <SlideViewer slides={slides} />;
};

export default Index;
