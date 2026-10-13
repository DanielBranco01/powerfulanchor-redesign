import Link from "next/link";
import { notFound } from "next/navigation";
import { lerPortal, type Encomenda, type EstadoEncomenda } from "@/lib/portal";
import { ESTADO_ENCOMENDA, Estado, PageTitle, Voltar, data, eur } from "@/components/portal/ui";
import { LinhasTabela } from "@/components/portal/LinhasTabela";
import ImprimirBotao from "@/components/portal/ImprimirBotao";
import { repetirEncomenda } from "../../../actions";

export const metadata = { title: "Encomenda" };

const UUID = /^[0-9a-f-]{36}$/i;
const PASSOS: [EstadoEncomenda, string][] = [
  ["confirmada", "Confirmada"],
  ["em_preparacao", "Em preparação"],
  ["expedida", "Expedida"],
  ["entregue", "Entregue"],
];

export default async function EncomendaPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ erro?: string }> }) {
  const { id } = await params;
  const sp = await searchParams;
  if (!UUID.test(id)) notFound();
  const e = await lerPortal<Encomenda | null>("portal_encomenda", { p_id: id });
  if (!e) notFound();
  const atual = PASSOS.findIndex(([k]) => k === e.estado);
  const datas: Record<string, string | null> = { confirmada: e.data, expedida: e.data_expedicao, entregue: e.data_entrega };

  return (
    <>
      <Voltar href="/area-cliente/encomendas">Encomendas</Voltar>
      <PageTitle code={e.ref} eyebrow="Encomenda" title={e.projeto ?? `Encomenda de ${data(e.data)}`}>
        <ImprimirBotao />
        <form action={repetirEncomenda}>
          <input type="hidden" name="id" value={e.id} />
          <button type="submit" className="btn btn-ink">
            Voltar a encomendar <span className="arrow">→</span>
          </button>
        </form>
      </PageTitle>

      {sp.erro && <p className="pt-aviso" role="alert">Não foi possível criar o pedido. Tente novamente ou contacte-nos.</p>}

      {e.estado === "cancelada" ? (
        <p className="pt-aviso">Esta encomenda foi cancelada.</p>
      ) : (
        <ol className="pt-steps" aria-label="Estado da entrega">
          {PASSOS.map(([k, l], i) => (
            <li key={k} className={i < atual ? "done" : i === atual ? "now" : undefined} aria-current={i === atual ? "step" : undefined}>
              <span className="pt-led" aria-hidden="true" />
              <b>{l}</b>
              {datas[k] && i <= atual && <small>{data(datas[k])}</small>}
              {k === "entregue" && i > atual && e.data_prevista_entrega && <small>Prevista {data(e.data_prevista_entrega)}</small>}
            </li>
          ))}
        </ol>
      )}

      <dl className="pt-meta">
        <div><dt>Estado</dt><dd><Estado tom={ESTADO_ENCOMENDA[e.estado][1]}>{ESTADO_ENCOMENDA[e.estado][0]}</Estado></dd></div>
        <div><dt>Data</dt><dd>{data(e.data)}</dd></div>
        {e.referencia_cliente && <div><dt>A sua referência</dt><dd>{e.referencia_cliente}</dd></div>}
        {e.transportadora && <div><dt>Transportadora</dt><dd>{e.transportadora}</dd></div>}
        {e.num_seguimento && (
          <div>
            <dt>Seguimento</dt>
            <dd>
              {e.url_seguimento ? (
                <a href={e.url_seguimento} target="_blank" rel="noopener noreferrer">{e.num_seguimento} ↗</a>
              ) : (
                e.num_seguimento
              )}
            </dd>
          </div>
        )}
        {e.proposta && <div><dt>Proposta</dt><dd><Link href={`/area-cliente/propostas/${e.proposta.id}`}>{e.proposta.numero} →</Link></dd></div>}
      </dl>

      <LinhasTabela linhas={e.linhas} total={e.total} />

      {e.conta && (
        <div className="pt-conta">
          <div><span>Valor</span><b className="pt-money">{eur(e.conta.valor)}</b></div>
          <div><span>Pago</span><b className="pt-money">{eur(e.conta.recebido)}</b></div>
          <div className={e.conta.em_aberto > 0 ? "hot" : undefined}><span>Em aberto</span><b className="pt-money">{eur(e.conta.em_aberto)}</b></div>
          <div><span>Vencimento</span><b>{data(e.conta.data_vencimento)}</b></div>
        </div>
      )}
      <p className="pt-muted pt-nota">Valores sem IVA. A fatura é enviada à parte; esta página não é um documento de faturação.</p>
    </>
  );
}
