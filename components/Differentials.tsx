import Reveal from "./ui/Reveal";
import SectionHead from "./ui/SectionHead";

const FEATURES: { key: string; title: string; description: string }[] = [
  {
    key: "Produto",
    title: "Produtos de qualidade",
    description:
      "As melhores marcas do mercado, ao melhor preço, com a fiabilidade que os seus projetos exigem.",
  },
  {
    key: "Suporte",
    title: "Suporte técnico",
    description:
      "Equipa que conhece o produto e responde às suas questões técnicas com rapidez e rigor.",
  },
  {
    key: "Experiência",
    title: "+20 anos de experiência",
    description:
      "Duas décadas de conhecimento aplicado às redes de comunicações e às necessidades reais dos clientes.",
  },
  {
    key: "Configuração",
    title: "Soluções à medida",
    description:
      "Adaptamos produtos e recomendações ao seu contexto, em vez de soluções rígidas de prateleira.",
  },
  {
    key: "Disponibilidade",
    title: "Stock disponível",
    description: "Disponibilidade de material que evita atrasos e mantém as suas obras a andar.",
  },
  {
    key: "Conformidade",
    title: "Compromisso e fiabilidade",
    description: "Transparência em cada relação. Aderentes ao Compromisso de Pagamento Pontual.",
  },
];

export default function Differentials() {
  return (
    <section className="sec" id="diferenciais">
      <div className="wrap">
        <SectionHead
          code="03"
          eyebrow="Porquê a Powerful Anchor"
          title="O que nos distingue"
          description="Mais do que fornecer produtos, somos um ponto de apoio fiável para o seu negócio."
        />
        <Reveal className="sheet">
          <div className="sheet-head">
            <span>Ficha técnica</span>
            <span>Powerful Anchor</span>
            <span>Rev. {new Date().getFullYear()}</span>
          </div>
          <dl className="sheet-rows">
            {FEATURES.map((f, i) => (
              <div className="sheet-row" key={f.key}>
                <dt>
                  <span className="sr-no">{String(i + 1).padStart(2, "0")}</span>
                  {f.key}
                </dt>
                <dd>
                  <strong>{f.title}</strong>
                  <span>{f.description}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>
    </section>
  );
}
