import Link from "next/link";
import type { EstadoEncomenda, EstadoProposta, Pedido } from "@/lib/portal";

const EUR = new Intl.NumberFormat("pt-PT", { style: "currency", currency: "EUR" });
export const eur = (v: number | string | null | undefined) => EUR.format(Number(v ?? 0));

/** "2026-10-13" ou ISO completo → "13/10/2026". */
export function data(v: string | null | undefined) {
  if (!v) return "—";
  const [a, m, d] = v.slice(0, 10).split("-");
  return `${d}/${m}/${a}`;
}

type Tom = "accao" | "ativo" | "feito" | "neutro" | "alerta";

export function Estado({ tom, children }: { tom: Tom; children: React.ReactNode }) {
  return <span className={`pt-estado ${tom}`}>{children}</span>;
}

export const ESTADO_PEDIDO: Record<Pedido["estado"], [string, Tom]> = {
  recebido: ["Recebido", "neutro"],
  em_analise: ["Em análise", "ativo"],
  proposta: ["Proposta enviada", "accao"],
  encerrado: ["Encerrado", "feito"],
};

export const ESTADO_PROPOSTA: Record<EstadoProposta, [string, Tom]> = {
  aguarda_resposta: ["Aguarda a sua resposta", "accao"],
  aceite: ["Aceite · em processamento", "ativo"],
  adjudicada: ["Adjudicada", "feito"],
  expirada: ["Expirada", "neutro"],
  encerrada: ["Encerrada", "neutro"],
};

export const ESTADO_ENCOMENDA: Record<EstadoEncomenda, [string, Tom]> = {
  confirmada: ["Confirmada", "ativo"],
  em_preparacao: ["Em preparação", "ativo"],
  expedida: ["Expedida", "accao"],
  entregue: ["Entregue", "feito"],
  cancelada: ["Cancelada", "neutro"],
};

export function PageTitle({ code, eyebrow, title, children }: { code: string; eyebrow: string; title: string; children?: React.ReactNode }) {
  return (
    <div className="pt-title">
      <div>
        <span className="tag">
          <b>{code}</b>
          <span>{eyebrow}</span>
        </span>
        <h1>{title}</h1>
      </div>
      {children && <div className="pt-title-actions">{children}</div>}
    </div>
  );
}

export function Vazio({ titulo, children }: { titulo: string; children?: React.ReactNode }) {
  return (
    <div className="pt-vazio">
      <b>{titulo}</b>
      {children && <p>{children}</p>}
    </div>
  );
}

export function Voltar({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="pt-voltar">
      <span aria-hidden="true">←</span> {children}
    </Link>
  );
}

export function ErroLeitura() {
  return (
    <Vazio titulo="Não foi possível carregar esta informação.">
      Tente novamente dentro de instantes. Se o problema continuar, contacte-nos: sales@powerfulanchor.pt · +351 211 914 559.
    </Vazio>
  );
}
