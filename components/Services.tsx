import Link from "next/link";
import Reveal from "./ui/Reveal";
import SectionHead from "./ui/SectionHead";

const SERVICES: {
  ref: string;
  title: string;
  description: string;
  href: string;
  route?: boolean;
}[] = [
  {
    ref: "RD",
    title: "Redes de Dados",
    description:
      "Cablagem estruturada, conectividade e componentes para infraestruturas de rede fiáveis e escaláveis.",
    href: `/produtos?cat=${encodeURIComponent("Redes de Dados")}`,
    route: true,
  },
  {
    ref: "AV",
    title: "Áudio e Vídeo",
    description:
      "Equipamentos e soluções de distribuição de áudio e vídeo para ambientes profissionais e comerciais.",
    href: `/produtos?cat=${encodeURIComponent("Áudio e Vídeo")}`,
    route: true,
  },
  {
    ref: "RF",
    title: "Sistemas de RF",
    description:
      "Componentes e sistemas de radiofrequência para transmissão, cobertura e comunicações sem fios.",
    href: `/produtos?cat=${encodeURIComponent("Sistemas de RF")}`,
    route: true,
  },
  {
    ref: "CT",
    title: "Consultoria Técnica",
    description:
      "Aconselhamento na escolha de produtos e no dimensionamento de soluções, ajustado ao seu projeto.",
    href: "#contacto",
  },
];

export default function Services() {
  return (
    <section className="sec sec-ink" id="servicos">
      <div className="wrap">
        <SectionHead
          code="02"
          eyebrow="O que fazemos"
          title="Áreas de solução"
          description="Produtos e soluções para todas as camadas da sua infraestrutura de comunicações."
        />
        <ol className="index">
          {SERVICES.map((service, i) => {
            const inner = (
              <>
                <span className="ix-ref">
                  {String(i + 1).padStart(2, "0")} / {service.ref}
                </span>
                <span className="ix-title">{service.title}</span>
                <span className="ix-desc">{service.description}</span>
                <span className="ix-go" aria-hidden="true">
                  →
                </span>
              </>
            );
            return (
              <Reveal as="li" index={i} key={service.title}>
                {service.route ? (
                  <Link href={service.href} className="ix-row">
                    {inner}
                  </Link>
                ) : (
                  <a href={service.href} className="ix-row">
                    {inner}
                  </a>
                )}
              </Reveal>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
