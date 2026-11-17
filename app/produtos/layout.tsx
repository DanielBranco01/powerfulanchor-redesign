import BasketDrawer from "@/components/produtos/BasketDrawer";
import QuoteModal from "@/components/produtos/QuoteModal";
import Toast from "@/components/produtos/Toast";
import "./produtos.css";

/** Todo o catálogo vive sob `.pa-catalogue` (estilos isolados) e partilha o orçamento (gaveta, modal e aviso). */
export default function ProdutosLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pa-catalogue">
      {children}
      <BasketDrawer />
      <QuoteModal />
      <Toast />
    </div>
  );
}
