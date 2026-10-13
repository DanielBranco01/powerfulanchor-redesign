"use client";

export default function ImprimirBotao({ label = "Imprimir / PDF" }: { label?: string }) {
  return (
    <button type="button" className="btn btn-line" onClick={() => window.print()}>
      {label}
    </button>
  );
}
