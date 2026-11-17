/**
 * Aviso por email quando entra um pedido do site (via Resend).
 * Desligado por omissão: só envia se RESEND_API_KEY, LEAD_NOTIFY_TO e LEAD_NOTIFY_FROM estiverem definidas
 * (variáveis de servidor). Falhar nunca pode impedir o pedido de ser gravado: devolve false e regista o motivo.
 *
 *   RESEND_API_KEY   chave da API do Resend
 *   LEAD_NOTIFY_TO   destinatário(s), separados por vírgula
 *   LEAD_NOTIFY_FROM remetente (ex.: "Powerful Anchor <no-reply@powerfulanchor.pt>" ou onboarding@resend.dev)
 *   ERP_APP_URL      opcional; https://powerfulanchor-erp.netlify.app → link para os leads no ERP
 */
export type NovoLead = {
  nome: string;
  email: string;
  telefone?: string;
  empresa?: string;
  assunto?: string;
  mensagem?: string;
  itens?: { ref: string; qty: number }[];
  origem: "site-contacto" | "site-orcamento" | "portal";
};

const ESC: Record<string, string> = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ESC[c]);

export function montarEmail(lead: NovoLead, erpUrl?: string) {
  const tipo =
    lead.origem === "portal"
      ? "Pedido na área de cliente"
      : lead.origem === "site-orcamento"
        ? "Pedido de orçamento"
        : "Mensagem de contacto";
  const linhas: [string, string][] = [
    ["Nome", lead.nome],
    ["Email", lead.email],
    ["Telefone", lead.telefone ?? "—"],
    ["Empresa", lead.empresa ?? "—"],
    ["Assunto", lead.assunto ?? "—"],
  ];
  const itens = lead.itens?.length ? lead.itens.map((i) => `${i.ref} × ${i.qty}`).join("\n") : "";
  const link = erpUrl ? `${erpUrl.replace(/\/$/, "")}/leads?f=Novo` : "";

  const html = `<div style="font-family:system-ui,sans-serif;max-width:560px">
<h2 style="margin:0 0 12px">${esc(tipo)} — novo lead do site</h2>
<table style="border-collapse:collapse;width:100%">${linhas
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${k}</td><td><b>${esc(v)}</b></td></tr>`)
    .join("")}</table>
${lead.mensagem ? `<p style="white-space:pre-wrap;background:#f7f5f9;padding:12px;border-radius:8px">${esc(lead.mensagem)}</p>` : ""}
${itens ? `<p><b>Artigos pedidos</b></p><pre style="background:#f7f5f9;padding:12px;border-radius:8px">${esc(itens)}</pre>` : ""}
${link ? `<p><a href="${esc(link)}">Abrir no ERP</a></p>` : ""}
</div>`;

  const text = [
    `${tipo} — novo lead do site`,
    ...linhas.map(([k, v]) => `${k}: ${v}`),
    lead.mensagem ? `\nMensagem:\n${lead.mensagem}` : "",
    itens ? `\nArtigos pedidos:\n${itens}` : "",
    link ? `\nAbrir no ERP: ${link}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return { subject: `Novo ${tipo.toLowerCase()} do site: ${lead.nome}`, html, text };
}

export async function notificarNovoLead(lead: NovoLead): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_TO;
  const from = process.env.LEAD_NOTIFY_FROM;
  if (!key || !to || !from) return false; // desligado

  const destinatarios = to.split(",").map((s) => s.trim()).filter(Boolean);
  if (!destinatarios.length) return false;
  const { subject, html, text } = montarEmail(lead, process.env.ERP_APP_URL);
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: destinatarios, reply_to: lead.email, subject, html, text }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.error("[notify] o Resend recusou o envio, estado HTTP", res.status);
    return res.ok;
  } catch (e) {
    console.error("[notify] falha no envio:", e instanceof Error ? e.name : "erro");
    return false;
  }
}

/** Aviso à equipa quando um cliente aceita uma proposta na área de cliente (mesmas variáveis; desligado sem elas). */
export async function notificarPropostaAceite(a: {
  numero: string;
  titulo: string;
  empresa: string;
  contacto: string;
  email: string;
  encomendaRef: string | null;
  referenciaCliente?: string;
  nota?: string;
}): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_TO;
  const from = process.env.LEAD_NOTIFY_FROM;
  if (!key || !to || !from) return false;
  const destinatarios = to.split(",").map((s) => s.trim()).filter(Boolean);
  if (!destinatarios.length) return false;

  const erp = process.env.ERP_APP_URL?.replace(/\/$/, "");
  const venda = a.encomendaRef
    ? `Venda ${a.encomendaRef} criada automaticamente — confirmar e preparar a entrega.`
    : "A venda NÃO foi criada automaticamente (ver a tarefa no ERP).";
  const linhas: [string, string][] = [
    ["Proposta", `${a.numero} — ${a.titulo}`],
    ["Cliente", a.empresa],
    ["Aceite por", `${a.contacto} <${a.email}>`],
    ["Ref. do cliente", a.referenciaCliente || "—"],
  ];
  const html = `<div style="font-family:system-ui,sans-serif;max-width:560px">
<h2 style="margin:0 0 12px">Proposta aceite na área de cliente</h2>
<table style="border-collapse:collapse;width:100%">${linhas
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${k}</td><td><b>${esc(v)}</b></td></tr>`)
    .join("")}</table>
${a.nota ? `<p style="white-space:pre-wrap;background:#f7f5f9;padding:12px;border-radius:8px">${esc(a.nota)}</p>` : ""}
<p>${esc(venda)}</p>
${erp ? `<p><a href="${esc(erp)}/tarefas">Abrir as tarefas no ERP</a></p>` : ""}
</div>`;
  const text = [
    "Proposta aceite na área de cliente",
    ...linhas.map(([k, v]) => `${k}: ${v}`),
    a.nota ? `\nNota do cliente:\n${a.nota}` : "",
    `\n${venda}`,
    erp ? `\nTarefas no ERP: ${erp}/tarefas` : "",
  ]
    .filter(Boolean)
    .join("\n");
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: destinatarios, reply_to: a.email, subject: `Proposta ${a.numero} aceite por ${a.empresa}`, html, text }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.error("[notify] o Resend recusou o envio, estado HTTP", res.status);
    return res.ok;
  } catch (e) {
    console.error("[notify] falha no envio:", e instanceof Error ? e.name : "erro");
    return false;
  }
}

/** Aviso à equipa quando um cliente recusa uma proposta na área de cliente (mesmas variáveis; desligado sem elas). */
export async function notificarPropostaRecusada(a: {
  numero: string;
  titulo: string;
  empresa: string;
  contacto: string;
  email: string;
  motivo: string;
}): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const to = process.env.LEAD_NOTIFY_TO;
  const from = process.env.LEAD_NOTIFY_FROM;
  if (!key || !to || !from) return false;
  const destinatarios = to.split(",").map((s) => s.trim()).filter(Boolean);
  if (!destinatarios.length) return false;

  const erp = process.env.ERP_APP_URL?.replace(/\/$/, "");
  const linhas: [string, string][] = [
    ["Proposta", `${a.numero} — ${a.titulo}`],
    ["Cliente", a.empresa],
    ["Recusada por", `${a.contacto} <${a.email}>`],
    ["Motivo", a.motivo],
  ];
  const html = `<div style="font-family:system-ui,sans-serif;max-width:560px">
<h2 style="margin:0 0 12px">Proposta recusada na área de cliente</h2>
<table style="border-collapse:collapse;width:100%">${linhas
    .map(([k, v]) => `<tr><td style="padding:4px 12px 4px 0;color:#666">${k}</td><td><b>${esc(v)}</b></td></tr>`)
    .join("")}</table>
<p>A oportunidade foi marcada como perdida e há uma tarefa para contactar o cliente.</p>
${erp ? `<p><a href="${esc(erp)}/tarefas">Abrir as tarefas no ERP</a></p>` : ""}
</div>`;
  const text = [
    "Proposta recusada na área de cliente",
    ...linhas.map(([k, v]) => `${k}: ${v}`),
    "\nA oportunidade foi marcada como perdida e há uma tarefa para contactar o cliente.",
    erp ? `\nTarefas no ERP: ${erp}/tarefas` : "",
  ]
    .filter(Boolean)
    .join("\n");
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: destinatarios, reply_to: a.email, subject: `Proposta ${a.numero} recusada por ${a.empresa}`, html, text }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.error("[notify] o Resend recusou o envio, estado HTTP", res.status);
    return res.ok;
  } catch (e) {
    console.error("[notify] falha no envio:", e instanceof Error ? e.name : "erro");
    return false;
  }
}

/**
 * Confirmação ao cliente quando aceita uma proposta (desligada por omissão). Só envia com RESEND_API_KEY,
 * EMAIL_CLIENTE_FROM e PORTAL_SITE_URL definidas (domínio verificado no Resend). Nunca impede a aceitação.
 */
export async function confirmarEncomendaAoCliente(a: {
  para: string;
  numeroProposta: string;
  titulo: string;
  encomendaRef: string | null;
  propostaId: string;
}): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_CLIENTE_FROM;
  const site = process.env.PORTAL_SITE_URL?.replace(/\/$/, "");
  if (!key || !from || !site || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a.para)) return false;
  const link = `${site}/area-cliente/propostas/${a.propostaId}`;
  const ref = a.encomendaRef ? `A encomenda ${a.encomendaRef} foi registada.` : "A sua aceitação ficou registada.";
  const html = `<div style="font-family:system-ui,sans-serif;max-width:560px;color:#0e0d10">
<h2 style="margin:0 0 12px">Recebemos a sua aceitação</h2>
<p>Obrigado! Aceitou a proposta <b>${esc(a.numeroProposta)}</b> — ${esc(a.titulo)}. ${esc(ref)}</p>
<p>A nossa equipa confirma a disponibilidade e o prazo de entrega e avisa quando a encomenda for expedida.</p>
<p style="margin:20px 0"><a href="${esc(link)}" style="background:#e4097f;color:#fff;padding:10px 18px;text-decoration:none;font-weight:600">Ver a proposta</a></p>
<p style="color:#666;font-size:13px">Powerful Anchor · sales@powerfulanchor.pt · +351 211 914 559</p>
</div>`;
  const text = `Recebemos a sua aceitação\n\nAceitou a proposta ${a.numeroProposta} — ${a.titulo}. ${ref}\n\nA nossa equipa confirma a disponibilidade e o prazo de entrega e avisa quando a encomenda for expedida.\n\nVer a proposta: ${link}`;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from, to: [a.para], subject: `Proposta ${a.numeroProposta} aceite`, html, text }),
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) console.error("[notify] o Resend recusou o envio, estado HTTP", res.status);
    return res.ok;
  } catch (e) {
    console.error("[notify] falha no envio:", e instanceof Error ? e.name : "erro");
    return false;
  }
}
