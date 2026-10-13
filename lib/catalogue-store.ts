"use client";

import { useEffect, useSyncExternalStore } from "react";
import type { Product, ProductSummary } from "./catalogue";

/**
 * Catálogo no navegador: carregado uma vez de `/api/catalogo` (servido a partir do ERP, em cache de 1 hora)
 * e partilhado por todos os componentes. Só as páginas que o usam o descarregam.
 */
type Estado = { produtos: ProductSummary[]; porId: Map<string, ProductSummary>; pronto: boolean; erro: boolean };

const VAZIO: Estado = { produtos: [], porId: new Map(), pronto: false, erro: false };
let estado: Estado = VAZIO;
let pedido: Promise<void> | null = null;
const ouvintes = new Set<() => void>();
const avisar = () => ouvintes.forEach((f) => f());

function carregar() {
  if (pedido) return pedido;
  pedido = fetch("/api/catalogo")
    .then((r) => (r.ok ? (r.json() as Promise<ProductSummary[]>) : Promise.reject(new Error(String(r.status)))))
    .then((produtos) => {
      estado = { produtos, porId: new Map(produtos.map((p) => [p.id, p])), pronto: true, erro: false };
    })
    .catch(() => {
      estado = { ...VAZIO, pronto: true, erro: true };
      pedido = null; // permite tentar de novo
    })
    .finally(avisar);
  return pedido;
}

function subscrever(f: () => void) {
  ouvintes.add(f);
  return () => ouvintes.delete(f);
}

export function useCatalogueData() {
  useEffect(() => {
    void carregar();
  }, []);
  const s = useSyncExternalStore(subscrever, () => estado, () => VAZIO);
  return {
    products: s.produtos,
    ready: s.pronto,
    error: s.erro,
    retry: () => {
      estado = VAZIO;
      avisar();
      void carregar();
    },
    getProduct: (id: string) => s.porId.get(id),
    countByCat: (cat: string) => s.produtos.reduce((n, p) => n + (p.cat === cat ? 1 : 0), 0),
  };
}

const fichas = new Map<string, Promise<Product | null>>();

/** Ficha com as características técnicas (pedida ao abrir o detalhe; guardada enquanto a página estiver aberta). */
export function fetchProductDetail(id: string): Promise<Product | null> {
  let f = fichas.get(id);
  if (!f) {
    f = fetch(`/api/catalogo/${encodeURIComponent(id)}`)
      .then((r) => (r.ok ? (r.json() as Promise<Product>) : null))
      .catch(() => null);
    fichas.set(id, f);
  }
  return f;
}
