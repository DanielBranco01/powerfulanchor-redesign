"use client";

import { useActionState } from "react";
import { enviarMensagem, type MensagemState } from "@/app/area-cliente/actions";

export type TipoMensagem = "alteracao_proposta" | "problema_encomenda" | "convidar_colega" | "alterar_dados";

/** Mensagem à equipa a partir da área de cliente (pedir alteração à proposta, problema numa encomenda, colega, dados). */
export default function MensagemForm({
  tipo,
  refId,
  voltar,
  titulo,
  placeholder,
  botao,
}: {
  tipo: TipoMensagem;
  refId?: string;
  voltar: string;
  titulo: string;
  placeholder: string;
  botao: string;
}) {
  const [state, action, pending] = useActionState<MensagemState, FormData>(enviarMensagem, {});
  return (
    <details className="pt-mensagem">
      <summary>{titulo}</summary>
      {state.ok ? (
        <p className="pt-ok" role="status">{state.ok}</p>
      ) : (
        <form action={action}>
          <input type="hidden" name="tipo" value={tipo} />
          {refId && <input type="hidden" name="ref" value={refId} />}
          <input type="hidden" name="voltar" value={voltar} />
          <div className="field">
            <label htmlFor={`msg-${tipo}`}>Mensagem para a nossa equipa</label>
            <textarea id={`msg-${tipo}`} name="mensagem" required maxLength={2000} placeholder={placeholder} />
          </div>
          {state.erro && <p className="field-error" role="alert">{state.erro}</p>}
          <button className="btn btn-line" type="submit" disabled={pending}>
            {pending ? "A enviar…" : botao}
          </button>
        </form>
      )}
    </details>
  );
}
