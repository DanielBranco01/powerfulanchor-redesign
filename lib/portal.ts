import "server-only";
import { cache } from "react";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { DEMO_COOKIE, DEMO_SESSAO, lerDemo } from "./portal-demo";

/**
 * Área de cliente: sessão Supabase Auth do projeto do ERP, guardada em cookies (httpOnly via @supabase/ssr).
 * Só corre no servidor: as mesmas variáveis do catálogo (ERP_SUPABASE_URL / ERP_SUPABASE_PUBLISHABLE_KEY),
 * nada vai para o navegador. Os dados vêm das funções portal_* do ERP, que só devolvem o que é da empresa
 * do utilizador autenticado (ver supabase/migrations/0020_portal_cliente.sql no ERP).
 */
const URL = process.env.ERP_SUPABASE_URL;
const KEY = process.env.ERP_SUPABASE_PUBLISHABLE_KEY;

export const portalConfigurado = () => Boolean(URL && KEY);

/** Modo demonstração (cookie posto por /area-cliente/demo): dados fictícios, sem ERP. Ver lib/portal-demo.ts. */
export const emDemo = cache(async () => (await cookies()).get(DEMO_COOKIE)?.value === "1");

export async function portalClient() {
  if (!URL || !KEY) throw new Error("ERP_SUPABASE_URL / ERP_SUPABASE_PUBLISHABLE_KEY em falta.");
  const cookieStore = await cookies();
  return createServerClient(URL, KEY, {
    cookies: {
      getAll: () => cookieStore.getAll(),
      setAll: (list) => {
        try {
          list.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch {
          // Chamado a partir de um Server Component: o middleware renova a sessão.
        }
      },
    },
  });
}

export type Sessao = {
  contacto: { nome: string; email: string; cargo: string | null; telefone: string | null };
  cliente: { empresa: string; nif: string | null; morada: string | null; email: string | null; telefone: string | null };
};

/** Sessão do portal (ou null). Em cache por pedido: o layout e as páginas partilham a mesma leitura. */
export const sessaoPortal = cache(async (): Promise<Sessao | null> => {
  if (await emDemo()) return DEMO_SESSAO;
  if (!portalConfigurado()) return null;
  const supabase = await portalClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) return null;
  const { data, error } = await supabase.rpc("portal_sessao");
  if (error) {
    console.error("[portal] portal_sessao falhou:", error.code);
    return null;
  }
  return (data as Sessao | null) ?? null;
});

/** Chama uma função portal_* de leitura. Devolve null se falhar (a página mostra o estado vazio/erro). */
export async function lerPortal<T>(fn: string, args?: Record<string, unknown>): Promise<T | null> {
  // O layout e a página correm em paralelo: sem sessão, a página não chega a pedir dados (o layout redireciona).
  if (await emDemo()) return lerDemo(fn, args) as T;
  if (!(await sessaoPortal())) return null;
  const supabase = await portalClient();
  const { data, error } = await supabase.rpc(fn, args);
  if (error) {
    console.error(`[portal] ${fn} falhou:`, error.code, error.message);
    return null;
  }
  return data as T;
}

/* ---------------------------------------------------------------- tipos devolvidos pelas funções portal_* */
export type Item = { ref: string; qty: number; nome: string | null; slug: string | null };
export type Pedido = {
  id: string;
  data: string;
  assunto: string;
  mensagem: string | null;
  itens: Item[];
  pedido_por: string;
  origem: string;
  estado: "recebido" | "em_analise" | "proposta" | "encerrado";
  proposta_id: string | null;
};
export type PropostaResumo = {
  id: string;
  numero: string;
  titulo: string;
  partilhada_em: string;
  valida_ate: string | null;
  aceite_em: string | null;
  estado: EstadoProposta;
  total: number;
  encomenda_id: string | null;
  encomenda_ref: string | null;
};
export type EstadoProposta = "aguarda_resposta" | "aceite" | "adjudicada" | "expirada" | "encerrada";
export type Linha = { nome: string; descricao: string | null; ref: string | null; slug: string | null; quantidade: number; preco_unit: number; total: number };
export type Proposta = {
  id: string;
  numero: string;
  titulo: string;
  descricao: string | null;
  partilhada_em: string;
  valida_ate: string | null;
  estado: EstadoProposta;
  aceite_em: string | null;
  aceite_por: string | null;
  referencia_cliente: string | null;
  linhas: Linha[];
  total: number;
  encomenda: { id: string; ref: string } | null;
};
export type EstadoEncomenda = "confirmada" | "em_preparacao" | "expedida" | "entregue" | "cancelada";
export type EncomendaResumo = {
  id: string;
  ref: string;
  data: string;
  projeto: string | null;
  referencia_cliente: string | null;
  estado: EstadoEncomenda;
  data_prevista_entrega: string | null;
  total: number;
  em_aberto: number;
};
export type Encomenda = EncomendaResumo & {
  transportadora: string | null;
  num_seguimento: string | null;
  url_seguimento: string | null;
  data_expedicao: string | null;
  data_entrega: string | null;
  linhas: Linha[];
  conta: { valor: number; recebido: number; em_aberto: number; data_vencimento: string } | null;
  proposta: { id: string; numero: string } | null;
};
export type Conta = {
  id: string;
  referencia: string | null;
  encomenda_id: string | null;
  valor: number;
  pago: number;
  em_aberto: number;
  data_emissao: string;
  data_vencimento: string;
  estado: "paga" | "por_pagar" | "vencida";
};
export type Painel = {
  pedidos_abertos: number;
  propostas_pendentes: number;
  encomendas_em_curso: number;
  em_aberto: number;
  vencido: number;
  propostas: PropostaResumo[];
  encomendas: EncomendaResumo[];
  pedidos: Pedido[];
};
