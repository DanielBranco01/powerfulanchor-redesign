"use client";

import { useState } from "react";
import { catIcon } from "@/lib/catalogue";
import SvgIcon from "./SvgIcon";

/** Imagem do artigo; sem URL (ou em erro de carregamento) mostra o ícone da categoria. */
export default function ProductImage({ img, cat, name, big = false }: { img: string | null; cat: string; name: string; big?: boolean }) {
  const [status, setStatus] = useState<"loading" | "loaded" | "error">(img ? "loading" : "error");
  return (
    <>
      {status !== "loaded" && (
        <div className="ph">
          <SvgIcon inner={catIcon(cat)} strokeWidth={big ? 1.4 : 1.5} />
          <small>imagem do produto</small>
        </div>
      )}
      {img && status !== "error" && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={img} alt={name} loading={big ? "eager" : "lazy"} onLoad={() => setStatus("loaded")} onError={() => setStatus("error")} />
      )}
    </>
  );
}
