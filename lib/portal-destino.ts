/** Destinos permitidos depois de entrar: só caminhos do próprio site, da área de cliente ou do catálogo
 *  (sem protocolo, sem `//`, sem parâmetros), para o `next` não poder levar a outro sítio. */
const PERMITIDO = /^\/(area-cliente|produtos)(\/[\w\-/]*)?$/;

export function destinoSeguro(v: FormDataEntryValue | string | null | undefined): string {
  const s = String(v ?? "");
  return PERMITIDO.test(s) && !s.includes("//") ? s : "/area-cliente";
}
