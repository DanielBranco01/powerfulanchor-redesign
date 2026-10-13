import Reveal from "./ui/Reveal";

export default function CtaBand() {
  return (
    <section className="cta">
      <div className="wrap">
        <Reveal className="cta-inner">
          <h2>
            Pronto para dar <span>POWER</span> ao seu negócio?
          </h2>
          <div className="cta-side">
            <p>
              Diga-nos o que precisa. A nossa equipa ajuda a encontrar a solução certa para o seu
              projeto.
            </p>
            <a href="tel:00351211914559" className="cta-phone">
              <span>Linha direta</span>
              +351 211 914 559
            </a>
            <a href="#contacto" className="btn btn-ink">
              Pedir orçamento <span className="arrow">→</span>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
