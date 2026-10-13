import Link from "next/link";
import { lerPortal, type EncomendaResumo } from "@/lib/portal";
import { ESTADO_ENCOMENDA, ErroLeitura, Estado, PageTitle, Vazio, data, eur } from "@/components/portal/ui";

export const metadata = { title: "Encomendas" };

export default async function EncomendasPage() {
  const encomendas = await lerPortal<EncomendaResumo[]>("portal_encomendas");

  return (
    <>
      <PageTitle code="03" eyebrow="Encomendas" title="Encomendas" />
      {!encomendas ? (
        <ErroLeitura />
      ) : encomendas.length === 0 ? (
        <Vazio titulo="Ainda não há encomendas.">As encomendas confirmadas aparecem aqui, com o estado da entrega.</Vazio>
      ) : (
        <div className="pt-table pt-enc" role="table" aria-label="Encomendas">
          <div className="pt-tr pt-th" role="row">
            <span role="columnheader">Encomenda</span>
            <span role="columnheader">Projeto</span>
            <span role="columnheader">Data</span>
            <span role="columnheader" className="num">Total s/ IVA</span>
            <span role="columnheader">Estado</span>
          </div>
          {encomendas.map((e) => (
            <Link key={e.id} href={`/area-cliente/encomendas/${e.id}`} className="pt-tr" role="row">
              <span role="cell" className="pt-ref">{e.ref}</span>
              <span role="cell">
                <b>{e.projeto ?? "—"}</b>
                {e.referencia_cliente && <small className="pt-muted"> · ref. {e.referencia_cliente}</small>}
              </span>
              <span role="cell" data-l="Data">{data(e.data)}</span>
              <span role="cell" className="num pt-money" data-l="Total s/ IVA">{eur(e.total)}</span>
              <span role="cell">
                <Estado tom={ESTADO_ENCOMENDA[e.estado][1]}>{ESTADO_ENCOMENDA[e.estado][0]}</Estado>
              </span>
            </Link>
          ))}
        </div>
      )}
    </>
  );
}
