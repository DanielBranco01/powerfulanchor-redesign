import Link from "next/link";
import { lerPortal, type PropostaResumo } from "@/lib/portal";
import { ESTADO_PROPOSTA, ErroLeitura, Estado, PageTitle, Vazio, data, eur } from "@/components/portal/ui";

export const metadata = { title: "Propostas" };

export default async function PropostasPage() {
  const propostas = await lerPortal<PropostaResumo[]>("portal_propostas");

  return (
    <>
      <PageTitle code="02" eyebrow="Propostas" title="Propostas" />
      {!propostas ? (
        <ErroLeitura />
      ) : propostas.length === 0 ? (
        <Vazio titulo="Ainda não há propostas.">Quando respondermos a um pedido, a proposta aparece aqui e pode aceitá-la online.</Vazio>
      ) : (
        <div className="pt-table" role="table" aria-label="Propostas">
          <div className="pt-tr pt-th" role="row">
            <span role="columnheader">Proposta</span>
            <span role="columnheader">Título</span>
            <span role="columnheader">Validade</span>
            <span role="columnheader" className="num">Total s/ IVA</span>
            <span role="columnheader">Estado</span>
          </div>
          {propostas.map((p) => (
            <Link key={p.id} href={`/area-cliente/propostas/${p.id}`} className="pt-tr" role="row">
              <span role="cell" className="pt-ref">{p.numero}</span>
              <span role="cell"><b>{p.titulo}</b></span>
              <span role="cell" data-l="Válida até">{data(p.valida_ate)}</span>
              <span role="cell" className="num pt-money" data-l="Total s/ IVA">{eur(p.total)}</span>
              <span role="cell">
                <Estado tom={ESTADO_PROPOSTA[p.estado][1]}>{ESTADO_PROPOSTA[p.estado][0]}</Estado>
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
