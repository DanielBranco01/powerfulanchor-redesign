import Reveal from "./ui/Reveal";
import PatchPanel from "./PatchPanel";

const STATS = [
  { num: "20+", lbl: "Anos de experiência" },
  { num: "5", lbl: "Marcas de referência" },
  { num: "24h", lbl: "Rapidez de resposta" },
];

export default function Hero() {
  return (
    <section className="hero" id="top">
      <div className="wrap">
        <div className="hero-meta" aria-hidden="true">
          <span>PA / Distribuição de infraestrutura de comunicações</span>
          <span>Carnaxide · PT — 38°43′N 9°14′W</span>
        </div>

        <Reveal as="h1" className="hero-title" index={0}>
          Dê <span className="hl">POWER</span>
          <br />
          ao seu negócio.
        </Reveal>

        <div className="hero-body">
          <Reveal className="hero-copy" index={1}>
            <p className="lead">
              Distribuímos e comercializamos produtos para redes de comunicações — dados, áudio e
              vídeo e sistemas de RF — com suporte técnico próximo e as melhores marcas do mercado.
            </p>
            <div className="hero-actions">
              <a href="#contacto" className="btn btn-primary">
                Falar connosco <span className="arrow">→</span>
              </a>
              <a href="/produtos" className="btn btn-line">
                Ver catálogo
              </a>
            </div>
          </Reveal>
          <Reveal className="hero-stats" index={2}>
            {STATS.map((s) => (
              <div className="stat" key={s.lbl}>
                <div className="num">{s.num}</div>
                <div className="lbl">{s.lbl}</div>
              </div>
            ))}
          </Reveal>
        </div>

        <Reveal className="hero-panel" index={3}>
          <div className="panel-caption">
            <span>Catálogo — escolha uma área</span>
            <span>Patch panel · 1U · 20 portas</span>
          </div>
          <PatchPanel />
        </Reveal>
      </div>
    </section>
  );
}
