import Reveal from "./ui/Reveal";
import SectionHead from "./ui/SectionHead";

/* Schematic line drawings, in the spirit of an installation diagram.
   `.hot` strokes are the magenta "live" run. */

function DrawingCabling() {
  return (
    <svg viewBox="0 0 240 160" aria-hidden="true">
      <path d="M10 140H230" />
      <rect x="24" y="40" width="44" height="100" />
      <path d="M30 52H62M30 64H62M30 76H62M30 88H62M30 100H62M30 112H62M30 124H62" className="thin" />
      <rect x="130" y="20" width="90" height="120" />
      <path d="M130 60H220M130 100H220" className="thin" />
      <rect x="196" y="48" width="10" height="8" />
      <rect x="196" y="88" width="10" height="8" />
      <rect x="196" y="128" width="10" height="8" />
      <path d="M68 58H96V52H196" className="hot" />
      <path d="M68 70H104V92H196" />
      <path d="M68 82H112V132H196" />
    </svg>
  );
}

function DrawingRF() {
  return (
    <svg viewBox="0 0 240 160" aria-hidden="true">
      <path d="M10 140H230" />
      <path d="M62 50V140M70 50V140" />
      <polyline points="62,140 70,125 62,110 70,95 62,80 70,65 62,50" className="thin" />
      <rect x="72" y="40" width="8" height="30" />
      <path d="M95.4 39.6A22 22 0 0 1 95.4 70.4" />
      <path d="M109.4 25.6A42 42 0 0 1 109.4 84.4" className="hot" />
      <path d="M123.4 11.6A62 62 0 0 1 123.4 98.4" />
      <path d="M84 55L197 82" className="thin dash" />
      <path d="M197 80V96" />
      <circle cx="197" cy="78" r="2.5" />
      <rect x="180" y="96" width="34" height="44" />
    </svg>
  );
}

function DrawingAV() {
  return (
    <svg viewBox="0 0 240 160" aria-hidden="true">
      <rect x="14" y="66" width="40" height="28" />
      <circle cx="34" cy="80" r="5" className="thin" />
      <rect x="96" y="56" width="36" height="48" />
      <path d="M104 68H124M104 80H124M104 92H124" className="thin" />
      <rect x="168" y="22" width="62" height="40" />
      <path d="M199 62V70M189 70H209" />
      <rect x="180" y="96" width="28" height="44" />
      <circle cx="194" cy="111" r="6" className="thin" />
      <circle cx="194" cy="130" r="4" className="thin" />
      <path d="M54 80H96" className="hot" />
      <path d="M132 70H150V42H168" className="hot" />
      <path d="M132 92H150V118H180" />
    </svg>
  );
}

const PROJECTS = [
  {
    code: "A.1",
    tag: "Redes de Dados",
    title: "Cablagem estruturada em edifícios",
    description:
      "Infraestruturas de rede fiáveis para escritórios, data centers e espaços comerciais.",
    Drawing: DrawingCabling,
  },
  {
    code: "A.2",
    tag: "Sistemas de RF",
    title: "Cobertura de rádio e wireless",
    description: "Componentes de radiofrequência para comunicações estáveis em ambientes exigentes.",
    Drawing: DrawingRF,
  },
  {
    code: "A.3",
    tag: "Áudio e Vídeo",
    title: "Distribuição AV profissional",
    description: "Sistemas de áudio e vídeo para instalações que exigem qualidade e continuidade.",
    Drawing: DrawingAV,
  },
];

export default function Projects() {
  return (
    <section className="sec sec-alt" id="projetos">
      <div className="wrap">
        <SectionHead
          code="04"
          eyebrow="Aplicações"
          title="Onde as nossas soluções entram em ação"
          description="Exemplos representativos dos contextos em que os nossos produtos fazem a diferença."
        />
        <div className="apps">
          {PROJECTS.map(({ Drawing, ...project }, i) => (
            <Reveal as="div" className="app" index={i} key={project.title}>
              <div className="app-fig">
                <span className="app-code">Fig. {project.code}</span>
                <Drawing />
              </div>
              <span className="app-tag">{project.tag}</span>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
