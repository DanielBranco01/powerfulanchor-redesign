"use client";

import { useActionState } from "react";
import { recusarProposta, type AcaoState } from "@/app/area-cliente/actions";
import { MOTIVOS_RECUSA } from "@/lib/portal-recusa";

/** «Não avançar»: fechado por omissão, abaixo da aceitação. O motivo vai para a equipa (oportunidade perdida + tarefa). */
export default function RecusarForm({ id, numero }: { id: string; numero: string }) {
  const [state, action, pending] = useActionState<AcaoState, FormData>(recusarProposta, {});
  return (
    <details className="pt-recusar" open={!!state.erro}>
      <summary>Não vamos avançar com esta proposta</summary>
      <div className="form">
        <div className="form-head">
          <span>Não avançar com a proposta {numero}</span>
          <span>Diga-nos porquê</span>
        </div>
        <form action={action}>
          <input type="hidden" name="id" value={id} />
          <fieldset className="pt-motivos">
            <legend>Motivo</legend>
            {MOTIVOS_RECUSA.map((m) => (
              <label key={m} className="pt-check">
                <input type="radio" name="motivo" value={m} required />
                <span>{m}</span>
              </label>
            ))}
          </fieldset>
          <div className="field">
            <label htmlFor="detalhe">Quer explicar? (obrigatório em «Outro motivo»)</label>
            <textarea id="detalhe" name="detalhe" maxLength={400} placeholder="Ex.: o prazo de entrega não serve a obra" />
          </div>
          {state.erro && <p className="field-error" role="alert">{state.erro}</p>}
          <button className="btn btn-line" type="submit" disabled={pending}>
            {pending ? "A registar…" : "Comunicar que não avançamos"} <span className="arrow">→</span>
          </button>
          <p className="form-note">
            A proposta fica como recusada e a nossa equipa recebe o motivo. Se quiser uma alternativa, peça-nos um novo orçamento.
          </p>
        </form>
      </div>
    </details>
  );
}
