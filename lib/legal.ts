/**
 * Identificação da empresa nas páginas legais (/privacidade e /termos).
 * PREENCHER antes de publicar: denominação social completa (ex.: "Powerful Anchor, Lda.") e NIPC.
 * Enquanto estiverem a null, as páginas mostram só o nome comercial e omitem o NIPC.
 */
export const EMPRESA = {
  nome: "Powerful Anchor",
  denominacao: null as string | null,
  nipc: null as string | null,
  morada: "Rua da Quinta da Nora 3, Loja A, 2790-140 Carnaxide, Portugal",
  email: "sales@powerfulanchor.pt",
  telefone: "+351 211 914 559",
};

export const LEGAL_ATUALIZADO = "13 de outubro de 2026";

export const identificacao = () =>
  [EMPRESA.denominacao ?? EMPRESA.nome, EMPRESA.nipc ? `NIPC ${EMPRESA.nipc}` : null, `com sede em ${EMPRESA.morada}`]
    .filter(Boolean)
    .join(", ");
