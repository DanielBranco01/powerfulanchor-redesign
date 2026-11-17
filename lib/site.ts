/** Endereço público do site (sem barra final). Definir SITE_URL no alojamento quando o domínio estiver ligado. */
export const SITE_URL = (process.env.SITE_URL ?? "https://powerfulanchor.pt").replace(/\/$/, "");
