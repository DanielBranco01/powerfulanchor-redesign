import Link from "next/link";
import { notFound } from "next/navigation";
import { lerPortal, type Proposta } from "@/lib/portal";
import { ESTADO_PROPOSTA, Estado, PageTitle, Voltar, data, eur } from "@/components/portal/ui";
import { LinhasTabela } from "@/components/portal/LinhasTabela";
import AceitarForm from "@/components/portal/AceitarForm";
import ImprimirBotao from "@/components/portal/ImprimirBotao";

export const metadata = { title: "Proposta" };

const UUID = /^[0-9a-f-]{36}$/i;

export default async function PropostaPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ aceite?: string }> }) {
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

      <dl className="pt-meta">
        <div><dt>Estado</dt><dd><Estado tom={tom}>{label}</Estado></dd></div>
        <div><dt>Enviada</dt><dd>{data(p.partilhada_em)}</dd></div>
        <div><dt>Válida até</dt><dd>{data(p.valida_ate)}</dd></div>
        {p.aceite_em && <div><dt>Aceite</dt><dd>{data(p.aceite_em)}{p.aceite_por ? ` · ${p.aceite_por}` : ""}</dd></div>}
        {p.referencia_cliente && <div><dt>A sua referência</dt><dd>{p.referencia_cliente}</dd></div>}
        {p.encomenda && (
          <div><dt>Encomenda</dt><dd><Link href={`/area-cliente/encomendas/${p.encomenda.id}`}>{p.encomenda.ref} →</Link></dd></div>
        )}
      </dl>

      {p.descricao && <p className="pt-msg">{p.descricao}</p>}

      <LinhasTabela linhas={p.linhas} total={p.total} />
      <p className="pt-muted pt-nota">
        Preços em euros, sem IVA. Prazos de entrega sujeitos a confirmação de stock. Esta proposta não é um documento de faturação.
      </p>

      {p.estado === "aguarda_resposta" && !sp.aceite && <AceitarForm id={p.id} numero={p.numero} total={eur(p.total)} />}
      {p.estado === "expirada" && (
        <p className="pt-aviso">
          Esta proposta expirou. <Link href="/area-cliente/pedidos/novo">Peça-nos uma proposta atualizada</Link>.
        </p>
      )}
    </>
  );
}
