"use client";

import Link from "next/link";
import { useActionState, useEffect, useRef } from "react";
import { entrar, type EntrarState } from "@/app/area-cliente/actions";

export default function EntrarForm({ next, erroInicial }: { next?: string; erroInicial?: string }) {
  const [state, action, pending] = useActionState<EntrarState, FormData>(entrar, { passo: "email", erro: erroInicial });
  const codigoRef = useRef<HTMLInputElement>(null);
  const email = state.email ?? "";

  useEffect(() => {
    if (state.passo === "codigo") codigoRef.current?.focus();
  }, [state]);

  return (
    <div className="form pt-entrar-form">
      <div className="form-head">
        <span>{state.passo === "email" ? "Entrar · passo 1 de 2" : "Entrar · veja o seu email"}</span>
        <span>Sem password</span>
      </div>

      {state.passo === "email" ? (
        <form action={action} key="email">
          <input type="hidden" name="acao" value="pedir" />
          <input type="hidden" name="next" value={next ?? ""} />
          <p className="pt-form-intro">Indique o email que a nossa equipa associou à sua empresa. Enviamos-lhe um link de entrada.</p>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" type="email" autoComplete="email" required defaultValue={email} placeholder="nome@empresa.pt" />
          </div>
          <input
            name="pa_extra_7f3"
            type="text"
            tabIndex={-1}
            autoComplete="off"
            aria-hidden="true"
            style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
          />
          {state.erro && <p className="field-error" role="alert">{state.erro}</p>}
          <button className="btn btn-primary" type="submit" disabled={pending}>
            {pending ? "A enviar…" : "Receber link de entrada"} <span className="arrow">→</span>
          </button>
        </form>
      ) : (
        <form action={action} key="codigo">
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="next" value={next ?? ""} />
          <p className="pt-form-intro">
            Se <b>{email || "o email indicado"}</b> tiver acesso, recebe um email dentro de instantes (veja também a pasta de spam).{" "}
            <b>Abra o link neste navegador</b> para entrar. Se o email trouxer um código, pode escrevê-lo aqui.
          </p>
          {state.aviso && <p className="pt-aviso">{state.aviso}</p>}
          <div className="field">
            <label htmlFor="codigo">Código</label>
            <input
              ref={codigoRef}
              id="codigo"
              name="codigo"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={12}
              className="pt-codigo"
              placeholder="000000"
            />
          </div>
          {state.erro && <p className="field-error" role="alert">{state.erro}</p>}
          <button className="btn btn-primary" type="submit" name="acao" value="confirmar" disabled={pending}>
            {pending ? "A verificar…" : "Entrar"} <span className="arrow">→</span>
          </button>
          <button type="submit" name="acao" value="voltar" className="pt-link" formNoValidate>
            Usar outro email ou pedir novo link
          </button>
        </form>
      )}

      <p className="form-note pt-form-legal">
        Ainda não tem acesso? <a href="/#contacto">Fale connosco</a>. Ao entrar, aceita os <Link href="/termos">Termos da área de cliente</Link> e
        a <Link href="/privacidade">Política de Privacidade</Link>. Usamos apenas um cookie essencial para manter a sessão.
      </p>
    </div>
  );
}
