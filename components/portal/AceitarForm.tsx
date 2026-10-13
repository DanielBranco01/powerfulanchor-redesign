"use client";

import Link from "next/link";
import { useActionState } from "react";
import { aceitarProposta, type AcaoState } from "@/app/area-cliente/actions";

export default function AceitarForm({ id, numero, total }: { id: string; numero: string; total: string }) {
  const [state, action, pending] = useActionState<AcaoState, FormData>(aceitarProposta, {});
  return (
    <div className="form pt-aceitar">
      <div className="form-head">
        <span>Aceitar a proposta {numero}</span>
        <span>{total} s/ IVA</span>
      </div>
      <form action={action}>
        <input type="hidden" name="id" value={id} />
        <div className="row2">
          <div className="field">
            <label htmlFor="referencia">A sua referência (n.º de encomenda interno)</label>
            <input id="referencia" name="referencia" maxLength={80} placeholder="Opcional" />
          </div>
          <div className="field">
            <label htmlFor="nota">Nota para a equipa</label>
            <input id="nota" name="nota" maxLength={2000} placeholder="Ex.: morada de entrega, horário" />
          </div>
        </div>
        <label className="pt-check">
          <input type="checkbox" name="concordo" value="1" required />
          <span>
            Aceito esta proposta nas condições indicadas e confirmo a encomenda em nome da minha empresa, nos termos dos{" "}
            <Link href="/termos" target="_blank">Termos da área de cliente</Link>.
          </span>
        </label>
        {state.erro && <p className="field-error" role="alert">{state.erro}</p>}
        <button className="btn btn-primary" type="submit" disabled={pending}>
          {pending ? "A registar…" : "Aceitar e encomendar"} <span className="arrow">→</span>
        </button>
        <p className="form-note">Tem dúvidas ou quer alterar algo? Responda ao email da proposta ou ligue +351 211 914 559.</p>
      </form>
    </div>
  );
}
