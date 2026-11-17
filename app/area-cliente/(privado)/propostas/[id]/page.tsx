import Link from "next/link";
import { notFound } from "next/navigation";
import { lerPortal, type Proposta } from "@/lib/portal";
import { ESTADO_PROPOSTA, Estado, PageTitle, Voltar, data, eur } from "@/components/portal/ui";
import { LinhasTabela } from "@/components/portal/LinhasTabela";
import AceitarForm from "@/components/portal/AceitarForm";
import RecusarForm from "@/components/portal/RecusarForm";
import ImprimirBotao from "@/components/portal/ImprimirBotao";
import MensagemForm from "@/components/portal/MensagemForm";

export const metadata = { title: "Proposta" };

const UUID = /^[0-9a-f-]{36}$/i;

export default async function PropostaPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ aceite?: string; recusada?: string }> }) {
  const { id } = await params;
  const sp = await searchParams;
  if (!UUID.test(id)) notFound();
  const p = await lerPortal<Proposta | null>("portal_proposta", { p_id: id });
  if (!p) notFound();
  const [label, tom] = ESTADO_PROPOSTA[p.estado];

  return (
    <>
      <Voltar href="/area-cliente/propostas">Propostas</Voltar>
      <PageTitle code={p.numero} eyebrow="Proposta" title={p.titulo}>
        <ImprimirBotao />
      </PageTitle>

      {sp.aceite && (
        <p className="pt-ok" role="status">
          Obrigado! Recebemos a sua aceitação{p.encomenda ? <> e a encomenda <b>{p.encomenda.ref}</b> foi registada</> : ""}. A nossa equipa
          confirma a disponibilidade e o prazo de entrega em breve.
        </p>
      )}

      {sp.recusada && (
        <p className="pt-ok" role="status">
          Registámos que não vai avançar com esta proposta. Obrigado por nos dizer porquê: a nossa equipa pode contactá-lo
          para perceber se há uma alternativa.
        </p>
      )}

      <dl className="pt-meta">
        <div><dt>Estado</dt><dd><Estado tom={tom}>{label}</Estado></dd></div>
        <div><dt>Enviada</dt><dd>{data(p.partilhada_em)}</dd></div>
        <div><dt>Válida até</dt><dd>{data(p.valida_ate)}</dd></div>
        {p.aceite_em && <div><dt>Aceite</dt><dd>{data(p.aceite_em)}{p.aceite_por ? ` · ${p.aceite_por}` : ""}</dd></div>}
        {p.recusada_em && <div><dt>Recusada</dt><dd>{data(p.recusada_em)}{p.recusada_por ? ` · ${p.recusada_por}` : ""}</dd></div>}
        {p.motivo_recusa && <div><dt>Motivo</dt><dd>{p.motivo_recusa}</dd></div>}
        {p.prazo_entrega && <div><dt>Prazo de entrega</dt><dd>{p.prazo_entrega}</dd></div>}
        {p.referencia_cliente && <div><dt>A sua referência</dt><dd>{p.referencia_cliente}</dd></div>}
        {p.encomenda && (
          <div><dt>Encomenda</dt><dd><Link href={`/area-cliente/encomendas/${p.encomenda.id}`}>{p.encomenda.ref} →</Link></dd></div>
        )}
      </dl>

      {p.descricao && <p className="pt-msg">{p.descricao}</p>}
      {p.condicoes && (
        <p className="pt-msg" style={{ whiteSpace: "pre-line" }}>
          <b>Condições</b>
          <br />
          {p.condicoes}
        </p>
      )}

      <LinhasTabela linhas={p.linhas} total={p.total} />
      <p className="pt-muted pt-nota">
        Preços em euros, sem IVA. Prazos de entrega sujeitos a confirmação de stock. Esta proposta não é um documento de faturação.
      </p>

      {p.estado === "aguarda_resposta" && !sp.aceite && !sp.recusada && (
        <>
          <AceitarForm id={p.id} numero={p.numero} total={eur(p.total)} />
          <MensagemForm
            tipo="alteracao_proposta"
            refId={p.id}
            voltar={`/area-cliente/propostas/${p.id}`}
            titulo="Pedir uma alteração a esta proposta"
            placeholder="Ex.: preciso de mais 2 unidades, ou de entrega mais cedo…"
            botao="Enviar pedido de alteração"
          />
          <RecusarForm id={p.id} numero={p.numero} />
        </>
      )}
      {p.estado === "expirada" && (
        <p className="pt-aviso">
          Esta proposta expirou. <Link href={`/area-cliente/pedidos/novo?proposta=${encodeURIComponent(p.numero)}`}>Peça-nos uma proposta atualizada</Link>.
        </p>
      )}
    </>
  );
}
