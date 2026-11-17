/**
 * Identificação da empresa nas páginas legais (/privacidade e /termos).
 * Denominação social e NIPC preenchidos (POWERFUL ANCHOR, UNIPESSOAL LDA · 516092324), como indicado pela empresa.
 */
export const EMPRESA = {
  nome: "Powerful Anchor",
  denominacao: "POWERFUL ANCHOR, UNIPESSOAL LDA" as string | null,
  nipc: "516092324" as string | null,
  morada: "Rua da Quinta da Nora 3, Loja A, 2790-140 Carnaxide, Portugal",
  email: "sales@powerfulanchor.pt",
  telefone: "+351 211 914 559",
};

export const LEGAL_ATUALIZADO = "17 de novembro de 2026";

export const identificacao = () =>
  [EMPRESA.denominacao ?? EMPRESA.nome, EMPRESA.nipc ? `NIPC ${EMPRESA.nipc}` : null, `com sede em ${EMPRESA.morada}`]
    .filter(Boolean)
    .join(", ");
