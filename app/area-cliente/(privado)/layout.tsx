import { redirect } from "next/navigation";
import { emDemo, sessaoPortal } from "@/lib/portal";
import PortalNav from "@/components/portal/PortalNav";
import { sair } from "../actions";

export default async function PortalLayout({ children }: { children: React.ReactNode }) {
  const sessao = await sessaoPortal();
  if (!sessao) redirect("/area-cliente/entrar");
  const demo = await emDemo();

  return (
    <div className="pa-portal">
      {demo && (
        <p className="pt-demo" role="status">
          <b>Demonstração</b> Empresa, pedidos e valores fictícios. Nada do que fizer aqui é enviado à Powerful Anchor.
        </p>
      )}
      <div className="pt-band">
        <div className="wrap pt-band-inner">
          <div className="pt-who">
            <span className="pt-who-lbl">Área de cliente</span>
            <strong>{sessao.cliente.empresa}</strong>
            <span className="pt-who-sub">{sessao.contacto.nome} · {sessao.contacto.email}</span>
          </div>
          <form action={sair}>
            <button className="pt-sair" type="submit">
              Sair
            </button>
          </form>
        </div>
        <div className="wrap">
          <PortalNav />
        </div>
      </div>
      <main className="wrap pt-main">{children}</main>
    </div>
  );
}
