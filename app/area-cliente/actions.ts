"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { portalClient, portalConfigurado, sessaoPortal } from "@/lib/portal";
import { notificarNovoLead, notificarPropostaAceite } from "@/lib/notify";

export type EntrarState = {
  passo: "email" | "codigo";
  email?: string;
  erro?: string;
  aviso?: string;
};

const emailSchema = z.string().trim().toLowerCase().email().max(200);
const destinoSeguro = (v: FormDataEntryValue | null) => {
  const s = String(v ?? "");
  return /^\/area-cliente(\/[\w\-/]*)?$/.test(s) ? s : "/area-cliente";
};

/** Endereço público do site (para o link do email): PORTAL_SITE_URL, ou a origem do pedido. */
async function origemSite() {
  const env = process.env.PORTAL_SITE_URL?.replace(/\/$/, "");
  if (env) return env;
  const h = await headers();
  const host = h.get("x-forwarded-host") ?? h.get("host") ?? "localhost:3000";
  const proto = h.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  return `${proto}://${host}`;
}

/** 1.º passo: pede o código de entrada. Não revela se o email tem acesso (a mensagem é sempre a mesma). */
async function pedirCodigo(fd: FormData): Promise<EntrarState> {
  if (String(fd.get("pa_extra_7f3") ?? "") !== "") return { passo: "codigo", email: "" };
  if (!portalConfigurado()) return { passo: "email", erro: "A área de cliente está temporariamente indisponível." };
  const parsed = emailSchema.safeParse(fd.get("email"));
  if (!parsed.success) return { passo: "email", erro: "Indique um email válido." };
  const email = parsed.data;

  const supabase = await portalClient();
  // O email traz um link de entrada (e o código, quando o modelo do email o incluir: exige SMTP próprio no Supabase).
  const next = destinoSeguro(fd.get("next"));
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { shouldCreateUser: false, emailRedirectTo: `${await origemSite()}/area-cliente/confirmar?next=${encodeURIComponent(next)}` },
  });
  if (error) {
    if (error.status === 429) {
      return { passo: "codigo", email, aviso: "Já pedimos um código há pouco. Aguarde um minuto antes de pedir outro, ou use o último que recebeu." };
    }
    // Email sem acesso (contas novas estão desligadas) ou outro erro: a resposta é igual para não revelar quem é cliente.
    if (error.status !== 400 && error.status !== 422) console.error("[portal] signInWithOtp:", error.status, error.code);
  }
  return { passo: "codigo", email };
}

/** 2.º passo: valida o código e confirma que o email tem acesso a um cliente. */
async function confirmarCodigo(fd: FormData): Promise<EntrarState> {
  const parsed = emailSchema.safeParse(fd.get("email"));
  const token = String(fd.get("codigo") ?? "").replace(/\s+/g, "");
  if (!parsed.success) return { passo: "email", erro: "Indique de novo o seu email." };
  const email = parsed.data;
  if (!/^\d{6,10}$/.test(token)) return { passo: "codigo", email, erro: "O código tem 6 algarismos." };

  const supabase = await portalClient();
  const { error } = await supabase.auth.verifyOtp({ email, token, type: "email" });
  if (error) return { passo: "codigo", email, erro: "Código inválido ou expirado. Peça um novo código." };

  const { data: sessao } = await supabase.rpc("portal_sessao");
  if (!sessao) {
    await supabase.auth.signOut();
    return { passo: "email", erro: "Este email não tem acesso à área de cliente. Fale connosco para o ativar." };
  }
  await supabase.rpc("portal_registar_entrada");
  redirect(destinoSeguro(fd.get("next")));
}

/** Ecrã de entrada (uma só ação, dois passos): acao = "pedir" | "confirmar" | "voltar". */
export async function entrar(_prev: EntrarState, fd: FormData): Promise<EntrarState> {
  const acao = String(fd.get("acao") ?? "");
  if (acao === "confirmar") return confirmarCodigo(fd);
  if (acao === "voltar") return { passo: "email", email: String(fd.get("email") ?? "") };
  return pedirCodigo(fd);
}

export async function sair() {
  if (portalConfigurado()) {
    const supabase = await portalClient();
    await supabase.auth.signOut();
  }
  redirect("/area-cliente/entrar");
}

/* ---------------------------------------------------------------- ações com sessão iniciada */
export type AcaoState = { erro?: string };

const erroAmigavel = (msg: string | undefined) =>
  msg && /Sem acesso|não encontrad|já não pode|expirou|Descreva|Demasiados|inválid/i.test(msg)
    ? msg
    : "Não foi possível concluir o pedido. Tente novamente ou contacte-nos.";

const pedidoSchema = z.object({
  assunto: z.string().trim().max(200).optional(),
  mensagem: z.string().trim().min(1, "Descreva o que precisa.").max(4000),
});

export async function novoPedido(_prev: AcaoState, fd: FormData): Promise<AcaoState> {
  const sessao = await sessaoPortal();
  if (!sessao) redirect("/area-cliente/entrar");
  const parsed = pedidoSchema.safeParse({ assunto: fd.get("assunto") ?? undefined, mensagem: fd.get("mensagem") });
  if (!parsed.success) return { erro: parsed.error.issues[0]?.message ?? "Verifique os dados." };
  const { assunto, mensagem } = parsed.data;

  const supabase = await portalClient();
  const { error } = await supabase.rpc("portal_pedir_orcamento", {
    p_assunto: assunto || "Pedido de orçamento",
    p_mensagem: mensagem,
    p_itens: null,
  });
  if (error) return { erro: erroAmigavel(error.message) };
  await notificarNovoLead({
    nome: sessao.contacto.nome,
    email: sessao.contacto.email,
    empresa: sessao.cliente.empresa,
    telefone: sessao.contacto.telefone ?? undefined,
    assunto: assunto || "Pedido de orçamento",
    mensagem,
    origem: "portal",
  });
  revalidatePath("/area-cliente", "layout");
  redirect("/area-cliente/pedidos?enviado=1");
}

export async function repetirEncomenda(fd: FormData) {
  const sessao = await sessaoPortal();
  if (!sessao) redirect("/area-cliente/entrar");
  const id = String(fd.get("id") ?? "");
  const supabase = await portalClient();
  const { error } = await supabase.rpc("portal_repetir_encomenda", { p_id: id, p_mensagem: null });
  if (error) redirect(`/area-cliente/encomendas/${encodeURIComponent(id)}?erro=1`);
  await notificarNovoLead({
    nome: sessao.contacto.nome,
    email: sessao.contacto.email,
    empresa: sessao.cliente.empresa,
    assunto: "Repetir encomenda",
    mensagem: "O cliente pediu para repetir uma encomenda anterior (ver o pedido no ERP).",
    origem: "portal",
  });
  revalidatePath("/area-cliente", "layout");
  redirect("/area-cliente/pedidos?enviado=1");
}

const aceitarSchema = z.object({
  id: z.string().uuid(),
  referencia: z.string().trim().max(80).optional(),
  nota: z.string().trim().max(2000).optional(),
  concordo: z.literal("1", { message: "Confirme que aceita as condições da proposta." }),
});

export async function aceitarProposta(_prev: AcaoState, fd: FormData): Promise<AcaoState> {
  const sessao = await sessaoPortal();
  if (!sessao) redirect("/area-cliente/entrar");
  const parsed = aceitarSchema.safeParse({
    id: fd.get("id"),
    referencia: fd.get("referencia") ?? undefined,
    nota: fd.get("nota") ?? undefined,
    concordo: fd.get("concordo") ?? "",
  });
  if (!parsed.success) return { erro: parsed.error.issues[0]?.message ?? "Verifique os dados." };
  const { id, referencia, nota } = parsed.data;

  const supabase = await portalClient();
  const { data: prop } = await supabase.rpc("portal_proposta", { p_id: id });
  const { data, error } = await supabase.rpc("portal_aceitar_proposta", {
    p_id: id,
    p_referencia: referencia || null,
    p_nota: nota || null,
  });
  if (error) return { erro: erroAmigavel(error.message) };
  const r = data as { encomenda_ref: string | null };
  const p = prop as { numero: string; titulo: string } | null;
  await notificarPropostaAceite({
    numero: p?.numero ?? "",
    titulo: p?.titulo ?? "",
    empresa: sessao.cliente.empresa,
    contacto: sessao.contacto.nome,
    email: sessao.contacto.email,
    encomendaRef: r?.encomenda_ref ?? null,
    referenciaCliente: referencia,
    nota,
  });
  revalidatePath("/area-cliente", "layout");
  redirect(`/area-cliente/propostas/${id}?aceite=1`);
}
