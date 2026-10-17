import "server-only";
import type { Conta, Encomenda, EncomendaResumo, Linha, Painel, Pedido, Proposta, PropostaResumo, Sessao } from "./portal";

/**
 * Modo demonstração da área de cliente: entra-se por /demo (ou /area-cliente/demo), sem login, e vê-se uma
 * empresa fictícia. Não toca no ERP: as leituras vêm daqui e as ações (pedir, aceitar, repetir) não gravam nada.
 * As datas são relativas a hoje, para a demonstração parecer sempre atual.
 */
export const DEMO_COOKIE = "pa_demo";

const dia = (n: number) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d.toISOString().slice(0, 10);
};
const id = (n: number) => `d0000000-0000-4000-8000-${String(n).padStart(12, "0")}`;
const linha = (nome: string, ref: string, slug: string, quantidade: number, preco_unit: number, descricao: string | null = null): Linha => ({
  nome,
  descricao,
  ref,
  slug,
  quantidade,
  preco_unit,
  total: Math.round(quantidade * preco_unit * 100) / 100,
});
const soma = (l: Linha[]) => Math.round(l.reduce((s, x) => s + x.total, 0) * 100) / 100;

export const DEMO_SESSAO: Sessao = {
  contacto: { nome: "Manuel Costa", email: "manuel.costa@exemplo.pt", cargo: "Diretor técnico", telefone: null },
  cliente: { empresa: "Instalações Exemplo, Lda.", nif: null, morada: "Rua da Demonstração, 10 · Lisboa", email: "geral@exemplo.pt", telefone: null },
};

function dados() {
  const ARMARIO = linha("Armário de rede série Unique - 600x1000 mm (LxP)", "DN-19 42U-6/10-1", "dn-19-42u-6-10-1", 1, 612);

  const lPiso2 = [
    linha("Patch panel de secretária CAT 6A, classe EA, blindado, preto", "DN-91612SD-EA", "dn-91612sd-ea", 4, 89.9),
    linha("Switch de rede PoE Gigabit de 8 portas, de secretária, não gerido", "DN-95140", "dn-95140", 2, 64.5),
    ARMARIO,
    linha("Régua de tomadas com perfil de alumínio e interruptor, 8 vias", "DN-95402-1-FR", "dn-95402-1-fr", 2, 38.4),
  ];
  const lTorre = [
    linha('3/8" CELLFLEX Superflexible Foam-Dielectric Coaxial Cable', "SCF38-50J", "scf38-50j", 500, 4.85, "metros"),
    linha('1/4" CELLFLEX Superflexible Foam-Dielectric Coaxial Cable', "SCF14-50J", "scf14-50j", 200, 3.2, "metros"),
  ];
  const lHdmiSala = [linha("Conjunto extensor HDMI, Full HD, 50 m", "DS-55100-1", "ds-55100-1", 3, 79.9)];
  const lSalaTecnica = [linha("GUDE Smart PDU, 1U, saída monitorizada e comutada, 12 x C13", "8045-1", "8045-1", 2, 389), ARMARIO];
  const lFibra = [
    linha("Cabo de instalação interior/exterior 50/125 µ OM4, 8 fibras, LSZH", "DK-35081/4-U", "dk-35081-4-u", 300, 2.95, "metros"),
  ];
  const lAuditorio = [linha("Conjunto extensor HDMI, Full HD, 50 m", "DS-55100-1", "ds-55100-1", 6, 74.9)];

  const propostas: Proposta[] = [
    {
      id: id(101),
      numero: "PA-PR-2026-0142",
      titulo: "Rede estruturada — escritório piso 2",
      descricao: "Proposta para a rede do novo escritório: cablagem Cat 6A, dois switches PoE para os pontos de acesso e armário de 42U com réguas de alimentação.",
      partilhada_em: dia(-3),
      valida_ate: dia(27),
      estado: "aguarda_resposta",
      aceite_em: null,
      aceite_por: null,
      referencia_cliente: null,
      linhas: lPiso2,
      total: soma(lPiso2),
      encomenda: null,
    },
    {
      id: id(102),
      numero: "PA-PR-2026-0128",
      titulo: "Cabo coaxial RF — torre norte",
      descricao: null,
      partilhada_em: dia(-12),
      valida_ate: dia(18),
      estado: "adjudicada",
      aceite_em: dia(-7),
      aceite_por: DEMO_SESSAO.contacto.nome,
      referencia_cliente: "OBRA-117",
      linhas: lTorre,
      total: soma(lTorre),
      encomenda: { id: id(201), ref: "PA-EN-2026-0311" },
    },
    {
      id: id(103),
      numero: "PA-PR-2026-0097",
      titulo: "Extensores HDMI — sala de reuniões",
      descricao: null,
      partilhada_em: dia(-62),
      valida_ate: dia(-32),
      estado: "expirada",
      aceite_em: null,
      aceite_por: null,
      referencia_cliente: null,
      linhas: lHdmiSala,
      total: soma(lHdmiSala),
      encomenda: null,
    },
  ];

  const conta = (valor: number, recebido: number, data_vencimento: string) => ({ valor, recebido, em_aberto: Math.round((valor - recebido) * 100) / 100, data_vencimento });
  const encomendas: Encomenda[] = [
    {
      id: id(201),
      ref: "PA-EN-2026-0311",
      data: dia(-6),
      projeto: "Cabo coaxial RF — torre norte",
      referencia_cliente: "OBRA-117",
      estado: "expedida",
      data_prevista_entrega: dia(1),
      total: soma(lTorre),
      em_aberto: soma(lTorre) / 2,
      transportadora: "DPD",
      num_seguimento: "DEMO 0311 2026",
      url_seguimento: null,
      data_expedicao: dia(-1),
      data_entrega: null,
      linhas: lTorre,
      conta: conta(soma(lTorre), soma(lTorre) / 2, dia(24)),
      proposta: { id: id(102), numero: "PA-PR-2026-0128" },
    },
    {
      id: id(202),
      ref: "PA-EN-2026-0298",
      data: dia(-4),
      projeto: "Armário e PDU — sala técnica",
      referencia_cliente: null,
      estado: "em_preparacao",
      data_prevista_entrega: dia(5),
      total: soma(lSalaTecnica),
      em_aberto: soma(lSalaTecnica),
      transportadora: null,
      num_seguimento: null,
      url_seguimento: null,
      data_expedicao: null,
      data_entrega: null,
      linhas: lSalaTecnica,
      conta: conta(soma(lSalaTecnica), 0, dia(26)),
      proposta: null,
    },
    {
      id: id(203),
      ref: "PA-EN-2026-0254",
      data: dia(-40),
      projeto: "Fibra OM4 — ligação entre edifícios",
      referencia_cliente: "OBRA-109",
      estado: "entregue",
      data_prevista_entrega: dia(-33),
      total: soma(lFibra),
      em_aberto: soma(lFibra),
      transportadora: "DPD",
      num_seguimento: "DEMO 0254 2026",
      url_seguimento: null,
      data_expedicao: dia(-35),
      data_entrega: dia(-33),
      linhas: lFibra,
      conta: conta(soma(lFibra), 0, dia(-3)),
      proposta: null,
    },
    {
      id: id(204),
      ref: "PA-EN-2026-0201",
      data: dia(-80),
      projeto: "Extensores HDMI — auditório",
      referencia_cliente: null,
      estado: "entregue",
      data_prevista_entrega: dia(-74),
      total: soma(lAuditorio),
      em_aberto: 0,
      transportadora: "CTT Expresso",
      num_seguimento: "DEMO 0201 2026",
      url_seguimento: null,
      data_expedicao: dia(-76),
      data_entrega: dia(-74),
      linhas: lAuditorio,
      conta: conta(soma(lAuditorio), soma(lAuditorio), dia(-50)),
      proposta: null,
    },
  ];

  const contas: Conta[] = encomendas.map((e, i) => {
    const c = e.conta!;
    return {
      id: id(301 + i),
      referencia: `FT 2026/${e.ref.slice(-4)}`,
      encomenda_id: e.id,
      valor: c.valor,
      pago: c.recebido,
      em_aberto: c.em_aberto,
      data_emissao: e.data,
      data_vencimento: c.data_vencimento,
      estado: c.em_aberto === 0 ? "paga" : c.data_vencimento < dia(0) ? "vencida" : "por_pagar",
    };
  });

  const nome = DEMO_SESSAO.contacto.nome;
  const pedidos: Pedido[] = [
    {
      id: id(401),
      data: dia(-1),
      assunto: "Conectores para cabo plano",
      mensagem: "Precisamos de 200 conectores para a obra da próxima semana. Conseguem entregar até sexta?",
      itens: [{ ref: "A-MO 8/8 SF", qty: 200, nome: "Conector modular para cabo plano", slug: "a-mo-8-8-sf" }],
      pedido_por: nome,
      origem: "portal",
      estado: "recebido",
      proposta_id: null,
    },
    {
      id: id(402),
      data: dia(-5),
      assunto: "Rede estruturada — escritório piso 2",
      mensagem: "Novo escritório com 24 postos e 4 pontos de acesso Wi-Fi. Precisamos de tudo para a sala técnica.",
      itens: [],
      pedido_por: nome,
      origem: "portal",
      estado: "proposta",
      proposta_id: id(101),
    },
    {
      id: id(403),
      data: dia(-9),
      assunto: "Câmaras PoE — armazém",
      mensagem: "Switches para 20 câmaras PoE no armazém. Aguardamos sugestão.",
      itens: [{ ref: "DN-95323-1", qty: 3, nome: "Switch de rede Fast Ethernet PoE de 8 portas", slug: "dn-95323-1" }],
      pedido_por: nome,
      origem: "site-orcamento",
      estado: "em_analise",
      proposta_id: null,
    },
    {
      id: id(404),
      data: dia(-64),
      assunto: "Extensores HDMI — sala de reuniões",
      mensagem: null,
      itens: [{ ref: "DS-55100-1", qty: 3, nome: "Conjunto extensor HDMI, Full HD, 50 m", slug: "ds-55100-1" }],
      pedido_por: nome,
      origem: "portal",
      estado: "encerrado",
      proposta_id: id(103),
    },
  ];

  return { propostas, encomendas, contas, pedidos };
}

const resumoProposta = (p: Proposta): PropostaResumo => ({
  id: p.id,
  numero: p.numero,
  titulo: p.titulo,
  partilhada_em: p.partilhada_em,
  valida_ate: p.valida_ate,
  aceite_em: p.aceite_em,
  estado: p.estado,
  total: p.total,
  encomenda_id: p.encomenda?.id ?? null,
  encomenda_ref: p.encomenda?.ref ?? null,
});
const resumoEncomenda = ({ id, ref, data, projeto, referencia_cliente, estado, data_prevista_entrega, total, em_aberto }: Encomenda): EncomendaResumo => ({
  id,
  ref,
  data,
  projeto,
  referencia_cliente,
  estado,
  data_prevista_entrega,
  total,
  em_aberto,
});

/** Equivalente fictício das funções portal_* do ERP. */
export function lerDemo(fn: string, args?: Record<string, unknown>): unknown {
  const d = dados();
  const pId = args?.p_id;
  switch (fn) {
    case "portal_painel": {
      const emCurso = d.encomendas.filter((e) => ["confirmada", "em_preparacao", "expedida"].includes(e.estado));
      const pendentes = d.propostas.filter((p) => p.estado === "aguarda_resposta");
      const painel: Painel = {
        pedidos_abertos: d.pedidos.filter((p) => p.estado === "recebido" || p.estado === "em_analise").length,
        propostas_pendentes: pendentes.length,
        encomendas_em_curso: emCurso.length,
        em_aberto: d.contas.reduce((s, c) => s + c.em_aberto, 0),
        vencido: d.contas.filter((c) => c.estado === "vencida").reduce((s, c) => s + c.em_aberto, 0),
        propostas: pendentes.map(resumoProposta),
        encomendas: emCurso.map(resumoEncomenda),
        pedidos: d.pedidos.slice(0, 3),
      };
      return painel;
    }
    case "portal_pedidos":
      return d.pedidos;
    case "portal_propostas":
      return d.propostas.map(resumoProposta);
    case "portal_proposta":
      return d.propostas.find((p) => p.id === pId) ?? null;
    case "portal_encomendas":
      return d.encomendas.map(resumoEncomenda);
    case "portal_encomenda":
      return d.encomendas.find((e) => e.id === pId) ?? null;
    case "portal_contas":
      return d.contas;
    default:
      return null;
  }
}
