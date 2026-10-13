import Reveal from "./ui/Reveal";
import SectionHead from "./ui/SectionHead";

const STEPS = [
  {
    title: "Contacto",
    description: "Fala connosco e explica o que precisa. Ouvimos o seu desafio técnico.",
  },
  {
    title: "Análise",
    description: "Avaliamos requisitos e recomendamos os produtos e soluções mais adequados.",
  },
  {
    title: "Proposta",
    description: "Apresentamos uma proposta clara, com as melhores marcas ao melhor preço.",
  },
  {
    title: "Entrega e apoio",
    description: "Fornecemos o material com rapidez e mantemos o suporte técnico ao seu lado.",
  },
];

export default function Process() {
  return (
    <section className="sec" id="processo">
      <div className="wrap">
        <SectionHead
          code="05"
          eyebrow="Como trabalhamos"
          title="Do primeiro contacto à entrega"
          description="Um processo simples e transparente, pensado para si."
        />
        <ol className="run">
          {STEPS.map((step, i) => (
            <Reveal as="li" className="run-step" index={i} key={step.title}>
              <span className="run-node" aria-hidden="true" />
              <span className="run-no">{String(i + 1).padStart(2, "0")}</span>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
