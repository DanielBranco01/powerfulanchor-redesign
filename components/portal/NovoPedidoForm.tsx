"use client";

import { useActionState } from "react";
import { novoPedido, type AcaoState } from "@/app/area-cliente/actions";

export default function NovoPedidoForm() {
  const [state, action, pending] = useActionState<AcaoState, FormData>(novoPedido, {});
  return (
    <div className="form">
      <div className="form-head">
        <span>Pedido de orçamento</span>
        <span>Resposta em 24h úteis</span>
      </div>
      <form action={action}>
        <div className="field">
          <label htmlFor="assunto">Assunto</label>
          <input id="assunto" name="assunto" type="text" maxLength={200} placeholder="Ex.: Cablagem do novo armazém" />
        </div>
        <div className="field">
          <label htmlFor="mensagem">O que precisa</label>
          <textarea id="mensagem" name="mensagem" required maxLength={4000} placeholder="Artigos, quantidades, local de entrega, prazos…" />
        </div>
        {state.erro && <p className="field-error" role="alert">{state.erro}</p>}
        <button className="btn btn-primary" type="submit" disabled={pending}>
          {pending ? "A enviar…" : "Enviar pedido"} <span className="arrow">→</span>
        </button>
      </form>
    </div>
  );
}
