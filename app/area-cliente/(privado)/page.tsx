import Link from "next/link";
import { lerPortal, sessaoPortal, type Painel } from "@/lib/portal";
import { ESTADO_ENCOMENDA, ESTADO_PEDIDO, ESTADO_PROPOSTA, ErroLeitura, Estado, PageTitle, data, eur } from "@/components/portal/ui";

export const metadata = { title: "Resumo" };

export default async function PainelPage() {
  const [sessao, p] = await Promise.all([sessaoPortal(), lerPortal<Painel>("portal_painel")]);
  if (!p) return <ErroLeitura />;
  const primeiroNome = sessao?.contacto.nome.split(" ")[0] ?? "";

  return (
    <>
      <PageTitle code="00" eyebrow="Resumo" title={`Olá, ${primeiroNome}.`}>
        <Link href="/area-cliente/pedidos/novo" className="btn btn-primary">
          Novo pedido de orçamento <span className="arrow">→</span>
        </Link>
      </PageTitle>

      <div className="pt-kpis">
        <Link href="/area-cliente/propostas" className={`pt-kpi${p.propostas_pendentes > 0 ? " hot" : ""}`}>
          <span className="pt-kpi-lbl">Propostas por responder</span>
          <span className="pt-kpi-v">{p.propostas_pendentes}</span>
        </Link>
        <Link href="/area-cliente/encomendas" className="pt-kpi">
          <span className="pt-kpi-lbl">Encomendas em curso</span>
          <span className="pt-kpi-v">{p.encomendas_em_curso}</span>
        </Link>
        <Link href="/area-cliente/pedidos" className="pt-kpi">
          <span className="pt-kpi-lbl">Pedidos em análise</span>
          <span className="pt-kpi-v">{p.pedidos_abertos}</span>
        </Link>
        <Link href="/area-cliente/pagamentos" className={`pt-kpi${p.vencido > 0 ? " warn" : ""}`}>
          <span className="pt-kpi-lbl">Por pagar</span>
          <span className="pt-kpi-v money">{eur(p.em_aberto)}</span>
          {p.vencido > 0 && <span className="pt-kpi-sub">{eur(p.vencido)} vencido</span>}
        </Link>
      </div>

      {p.propostas.length > 0 && (
        <section className="pt-block">
          <h2 className="pt-h2">Propostas à espera da sua resposta</h2>
          <ul className="pt-list">
            {p.propostas.map((x) => (
              <li key={x.id}>
                <Link href={`/area-cliente/propostas/${x.id}`} className="pt-row">
                  <span className="pt-ref">{x.numero}</span>
                  <span className="pt-row-main">
                    <b>{x.titulo}</b>
                    <small>Válida até {data(x.valida_ate)}</small>
                  </span>
                  <span className="pt-money">{eur(x.total)}</span>
                  <Estado tom={ESTADO_PROPOSTA[x.estado][1]}>{ESTADO_PROPOSTA[x.estado][0]}</Estado>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="pt-two">
        <section className="pt-block">
          <div className="pt-block-head">
            <h2 className="pt-h2">Encomendas em curso</h2>
            <Link href="/area-cliente/encomendas" className="pt-more">Todas →</Link>
          </div>
          {p.encomendas.length === 0 ? (
            <p className="pt-muted">Sem encomendas em curso.</p>
          ) : (
            <ul className="pt-list">
              {p.encomendas.map((e) => (
                <li key={e.id}>
                  <Link href={`/area-cliente/encomendas/${e.id}`} className="pt-row">
                    <span className="pt-ref">{e.ref}</span>
                    <span className="pt-row-main">
                      <b>{e.projeto ?? `Encomenda de ${data(e.data)}`}</b>
                      <small>{e.data_prevista_entrega ? `Entrega prevista ${data(e.data_prevista_entrega)}` : data(e.data)}</small>
                    </span>
                    <Estado tom={ESTADO_ENCOMENDA[e.estado][1]}>{ESTADO_ENCOMENDA[e.estado][0]}</Estado>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section className="pt-block">
          <div className="pt-block-head">
            <h2 className="pt-h2">Últimos pedidos</h2>
            <Link href="/area-cliente/pedidos" className="pt-more">Todos →</Link>
          </div>
          {p.pedidos.length === 0 ? (
            <p className="pt-muted">
              Ainda não há pedidos. Peça um orçamento a partir do <Link href="/produtos">catálogo</Link> ou{" "}
              <Link href="/area-cliente/pedidos/novo">descreva o que precisa</Link>.
            </p>
          ) : (
            <ul className="pt-list">
              {p.pedidos.map((x) => (
                <li key={x.id}>
                  <Link href="/area-cliente/pedidos" className="pt-row">
                    <span className="pt-ref">{data(x.data)}</span>
                    <span className="pt-row-main">
                      <b>{x.assunto}</b>
                      <small>{x.itens.length > 0 ? `${x.itens.length} artigo${x.itens.length > 1 ? "s" : ""}` : x.pedido_por}</small>
                    </span>
                    <Estado tom={ESTADO_PEDIDO[x.estado][1]}>{ESTADO_PEDIDO[x.estado][0]}</Estado>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {sessao && (
        <section className="pt-block pt-dados">
          <h2 className="pt-h2">Os seus dados</h2>
          <dl>
            <div><dt>Empresa</dt><dd>{sessao.cliente.empresa}</dd></div>
            {sessao.cliente.nif && <div><dt>NIF</dt><dd>{sessao.cliente.nif}</dd></div>}
            {sessao.cliente.morada && <div><dt>Morada</dt><dd>{sessao.cliente.morada}</dd></div>}
            <div><dt>Contacto</dt><dd>{sessao.contacto.nome}{sessao.contacto.cargo ? ` · ${sessao.contacto.cargo}` : ""}</dd></div>
            <div><dt>Email</dt><dd>{sessao.contacto.email}</dd></div>
          </dl>
          <p className="pt-muted">
            Algum dado desatualizado? Escreva-nos para <a href="mailto:sales@powerfulanchor.pt">sales@powerfulanchor.pt</a>.
          </p>
        </section>
      )}
    </>
  );
}
