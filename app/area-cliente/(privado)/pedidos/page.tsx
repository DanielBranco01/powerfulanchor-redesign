import Link from "next/link";
import { lerPortal, type Pedido } from "@/lib/portal";
import { ESTADO_PEDIDO, ErroLeitura, Estado, PageTitle, Vazio, data } from "@/components/portal/ui";

export const metadata = { title: "Pedidos" };

export default async function PedidosPage({ searchParams }: { searchParams: Promise<{ enviado?: string }> }) {
  const sp = await searchParams;
  const pedidos = await lerPortal<Pedido[]>("portal_pedidos");

  return (
    <>
      <PageTitle code="01" eyebrow="Pedidos de orçamento" title="Pedidos">
        <Link href="/area-cliente/pedidos/novo" className="btn btn-primary">
          Novo pedido <span className="arrow">→</span>
        </Link>
        <Link href="/produtos" className="btn btn-line">
          Escolher no catálogo
        </Link>
      </PageTitle>

      {sp.enviado && (
        <p className="pt-ok" role="status">
          Pedido recebido. A nossa equipa responde normalmente em 24 horas úteis; a proposta aparece em <b>Propostas</b>.
        </p>
      )}

      {!pedidos ? (
        <ErroLeitura />
      ) : pedidos.length === 0 ? (
        <Vazio titulo="Ainda não fez pedidos.">
          Adicione artigos ao orçamento no catálogo ou descreva o que precisa num novo pedido.
        </Vazio>
      ) : (
        <ul className="pt-cards">
          {pedidos.map((p) => (
            <li key={p.id} className="pt-card">
              <div className="pt-card-head">
                <span className="pt-ref">{data(p.data)}</span>
                <Estado tom={ESTADO_PEDIDO[p.estado][1]}>{ESTADO_PEDIDO[p.estado][0]}</Estado>
              </div>
              <h3>{p.assunto}</h3>
              <p className="pt-muted">Pedido por {p.pedido_por}{p.origem === "portal" ? " · área de cliente" : " · site"}</p>
              {p.mensagem && <p className="pt-msg">{p.mensagem}</p>}
              {p.itens.length > 0 && (
                <ul className="pt-itens">
                  {p.itens.map((i, n) => (
                    <li key={`${i.ref}-${n}`}>
                      <span className="pt-qty">{i.qty}×</span>
                      {i.slug ? <Link href={`/produtos?produto=${encodeURIComponent(i.slug)}`}>{i.nome ?? i.ref}</Link> : <span>{i.nome ?? i.ref}</span>}
                      <span className="pt-ref-sm">{i.ref}</span>
                    </li>
                  ))}
                </ul>
              )}
              {p.proposta_id && (
                <Link href={`/area-cliente/propostas/${p.proposta_id}`} className="pt-more">
                  Ver a proposta →
                </Link>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
