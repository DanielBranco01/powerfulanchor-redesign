import Link from "next/link";
import { PageTitle, Voltar } from "@/components/portal/ui";
import NovoPedidoForm from "@/components/portal/NovoPedidoForm";

export const metadata = { title: "Novo pedido" };

export default function NovoPedidoPage() {
  return (
    <>
      <Voltar href="/area-cliente/pedidos">Pedidos</Voltar>
      <PageTitle code="01" eyebrow="Novo pedido" title="Pedir orçamento" />
      <div className="pt-two pt-two-form">
        <NovoPedidoForm />
        <aside className="pt-aside">
          <h2 className="pt-h2">Sabe as referências?</h2>
          <p>
            Escolha os artigos no <Link href="/produtos">catálogo</Link> e use o botão <b>Orçamento</b>: com a sessão iniciada, o pedido
            fica logo associado à sua empresa e aparece aqui.
          </p>
          <h2 className="pt-h2">Projeto à medida?</h2>
          <p>Descreva o local, as quantidades aproximadas e os prazos. Respondemos com uma proposta em <b>Propostas</b>.</p>
        </aside>
      </div>
    </>
  );
}
