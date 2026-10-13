import Reveal from "./ui/Reveal";
import { Tag } from "./ui/SectionHead";

const LIST_ITEMS = [
  "Suporte técnico próximo e conhecimento de produto",
  "Marcas líderes: Digitus, HellermannTyton, RFS, Brady e Roxtec",
  "Transparência, compromisso e fiabilidade em cada projeto",
];

const FACTS = [
  { n: "Stock", t: "Disponibilidade imediata" },
  { n: "Rapidez", t: "Na resposta e no serviço" },
  { n: "5 marcas", t: "Representadas em Portugal" },
  { n: "B2B", t: "Foco técnico e profissional" },
];

export default function About() {
  return (
    <section className="sec" id="sobre">
      <div className="wrap">
        <div className="about-grid">
          <Reveal className="about-copy" index={0}>
            <Tag code="01">Quem somos</Tag>
            <h2>Um parceiro sólido para as suas redes de comunicações.</h2>
            <p>
              A <strong>Powerful Anchor</strong> é uma empresa de distribuição e comercialização de
              produtos para redes de comunicações. O nosso objetivo é contribuir para o
              desenvolvimento destas redes, oferecendo soluções e produtos de qualidade.
            </p>
            <p>
              Trabalhamos lado a lado com integradores, instaladores e equipas técnicas,
              disponibilizando suporte especializado e soluções adaptadas a cada necessidade.
            </p>
            <ul className="about-list">
              {LIST_ITEMS.map((item, i) => (
                <li key={item}>
                  <span className="li-no">{String(i + 1).padStart(2, "0")}</span>
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
          <Reveal className="about-block" index={1}>
            <div className="big">
              20<span>+</span>
            </div>
            <div className="big-lbl">anos de experiência no setor</div>
            <dl className="about-facts">
              {FACTS.map((f) => (
                <div key={f.n}>
                  <dt>{f.n}</dt>
                  <dd>{f.t}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
