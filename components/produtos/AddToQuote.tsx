"use client";

import type { ProductSummary } from "@/lib/catalogue";
import { useBasket } from "../BasketProvider";

/** Junta o artigo ao orçamento (cesto). `variant="card"` é o botão pequeno dos cartões. */
export default function AddToQuote({ product, variant = "page" }: { product: ProductSummary; variant?: "card" | "page" }) {
  const { add, toast } = useBasket();
  const onClick = () => {
    add({ id: product.id, name: product.name, ref: product.ref, cat: product.cat, img: product.img });
    toast(`${product.name} adicionado ao orçamento`);
  };
  return variant === "card" ? (
    <button className="addbtn" onClick={onClick}>
      + Orçamento
    </button>
  ) : (
    <button className="btn-primary" onClick={onClick}>
      Adicionar ao orçamento
    </button>
  );
}
