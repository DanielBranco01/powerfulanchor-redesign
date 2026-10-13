import Link from "next/link";
import { lerPortal, type Conta } from "@/lib/portal";
import { ErroLeitura, Estado, PageTitle, Vazio, data, eur } from "@/components/portal/ui";

export const metadata = { title: "Pagamentos" };

const ESTADO: Record<Conta["estado"], [string, "feito" | "ativo" | "alerta"]> = {
  paga: ["Paga", "feito"],
  por_pagar: ["Por pagar", "ativo"],
  vencida: ["Vencida", "alerta"],
};

export default async function PagamentosPage() {
  const contas = await lerPortal<Conta[]>("portal_contas");
  const aberto = (contas ?? []).reduce((s, c) => s + Number(c.em_aberto), 0);
  const vencido = (contas ?? []).filter((c) => c.estado === "vencida").reduce((s, c) => s + Number(c.em_aberto), 0);

  return (
    <>
      <PageTitle code="04" eyebrow="Pagamentos" title="Pagamentos" />
      {!contas ? (
        <ErroLeitura />
      ) : contas.length === 0 ? (
        <Vazio titulo="Sem valores a pagar.">Os valores das suas encomendas aparecem aqui, com a data de vencimento.</Vazio>
      ) : (
        <>
          <div className="pt-kpis pt-kpis-2">
            <div className="pt-kpi">
              <span className="pt-kpi-lbl">Total em aberto</span>
              <span className="pt-kpi-v money">{eur(aberto)}</span>
            </div>
            <div className={`pt-kpi${vencido > 0 ? " warn" : ""}`}>
              <span className="pt-kpi-lbl">Vencido</span>
              <span className="pt-kpi-v money">{eur(vencido)}</span>
            </div>
          </div>
          <div className="pt-table pt-pag" role="table" aria-label="Pagamentos">
            <div className="pt-tr pt-th" role="row">
              <span role="columnheader">Referência</span>
              <span role="columnheader">Vencimento</span>
              <span role="columnheader" className="num">Valor</span>
              <span role="columnheader" className="num">Em aberto</span>
              <span role="columnheader">Estado</span>
            </div>
            {contas.map((c) => {
              const inner = (
                <>
                  <span role="cell" className="pt-ref">{c.referencia ?? "—"}</span>
                  <span role="cell" data-l="Vencimento">{data(c.data_vencimento)}</span>
                  <span role="cell" className="num pt-money" data-l="Valor">{eur(c.valor)}</span>
                  <span role="cell" className="num pt-money" data-l="Em aberto">{eur(c.em_aberto)}</span>
                  <span role="cell"><Estado tom={ESTADO[c.estado][1]}>{ESTADO[c.estado][0]}</Estado></span>
                </>
              );
              return c.encomenda_id ? (
                <Link key={c.id} href={`/area-cliente/encomendas/${c.encomenda_id}`} className="pt-tr" role="row">{inner}</Link>
              ) : (
                <div key={c.id} className="pt-tr" role="row">{inner}</div>
              );
            })}
          </div>
          <p className="pt-muted pt-nota">
            Valores informativos, sem IVA. Não substituem as faturas. Dados para pagamento e dúvidas: <a href="mailto:sales@powerfulanchor.pt">sales@powerfulanchor.pt</a>.
          </p>
        </>
      )}
    </>
  );
}
