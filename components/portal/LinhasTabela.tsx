import Link from "next/link";
import type { Linha } from "@/lib/portal";
import { eur } from "./ui";

export function LinhasTabela({ linhas, total }: { linhas: Linha[]; total: number }) {
  return (
    <div className="pt-table pt-linhas" role="table" aria-label="Artigos">
      <div className="pt-tr pt-th" role="row">
        <span role="columnheader">Artigo</span>
        <span role="columnheader" className="num">Qtd.</span>
        <span role="columnheader" className="num">Preço unit.</span>
        <span role="columnheader" className="num">Total</span>
      </div>
      {linhas.map((l, i) => (
        <div className="pt-tr" role="row" key={`${l.ref ?? l.nome}-${i}`}>
          <span role="cell">
            {l.slug ? <Link href={`/produtos?produto=${encodeURIComponent(l.slug)}`}><b>{l.nome}</b></Link> : <b>{l.nome}</b>}
            {l.ref && <span className="pt-ref-sm">{l.ref}</span>}
            {l.descricao && <small className="pt-muted"> {l.descricao}</small>}
          </span>
          <span role="cell" className="num" data-l="Qtd.">{l.quantidade}</span>
          <span role="cell" className="num pt-money" data-l="Preço unit.">{eur(l.preco_unit)}</span>
          <span role="cell" className="num pt-money" data-l="Total">{eur(l.total)}</span>
        </div>
      ))}
      <div className="pt-tr pt-tfoot" role="row">
        <span role="cell">Total sem IVA</span>
        <span role="cell" />
        <span role="cell" />
        <span role="cell" className="num pt-money">{eur(total)}</span>
      </div>
    </div>
  );
}
