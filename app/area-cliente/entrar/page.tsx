import { redirect } from "next/navigation";
import { sessaoPortal } from "@/lib/portal";
import EntrarForm from "@/components/portal/EntrarForm";

export const metadata = { title: "Entrar" };

const ERROS: Record<string, string> = {
  link: "O link de entrada expirou ou já foi usado, ou foi aberto noutro navegador. Peça um novo e abra-o neste navegador.",
  "sem-acesso": "Este email não tem acesso à área de cliente. Fale connosco para o ativar.",
};

export default async function EntrarPage({ searchParams }: { searchParams: Promise<{ next?: string; erro?: string }> }) {
  if (await sessaoPortal()) redirect("/area-cliente");
  const { next, erro } = await searchParams;

  return (
    <div className="pa-portal pt-entrar">
      <div className="wrap pt-entrar-grid">
        <div className="pt-entrar-copy">
          <span className="tag">
            <b>AC</b>
            <span>Área de cliente</span>
          </span>
          <h1>
            Os seus pedidos,
            <br />
            propostas e encomendas.
            <br />
            <em>Num só sítio.</em>
          </h1>
          <ul className="pt-entrar-list">
            <li><span>01</span> Acompanhe cada pedido de orçamento</li>
            <li><span>02</span> Consulte e aceite propostas online</li>
            <li><span>03</span> Siga a preparação e a entrega das encomendas</li>
            <li><span>04</span> Veja os valores em aberto e os vencimentos</li>
          </ul>
          {/* <a> e não <Link>: o destino é uma rota que grava um cookie, não deve ser pré-carregada. */}
          <a href="/area-cliente/demo" className="pt-demo-cta">
            <span>Ainda não é cliente?</span>
            <b>Ver a área de cliente com dados de exemplo →</b>
          </a>
        </div>
        <EntrarForm next={next} erroInicial={erro ? ERROS[erro] : undefined} />
      </div>
    </div>
  );
}
