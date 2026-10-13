import type { Metadata } from "next";
import Link from "next/link";
import { EMPRESA, LEGAL_ATUALIZADO, identificacao } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Termos da área de cliente · Powerful Anchor",
  description: "Condições de acesso e utilização da área de cliente da Powerful Anchor.",
};

export default function TermosPage() {
  return (
    <main className="pa-legal">
      <div className="wrap legal-inner">
        <span className="tag">
          <b>AC</b>
          <span>Condições de utilização</span>
        </span>
        <h1>Termos da área de cliente</h1>
        <p className="legal-meta">Última atualização: {LEGAL_ATUALIZADO}</p>

        <h2><span>01</span>Objeto</h2>
        <p>
          Estes termos regulam o acesso e a utilização da área de cliente do site da {EMPRESA.nome}, onde as empresas clientes acompanham
          pedidos de orçamento, consultam e aceitam propostas, seguem encomendas e consultam valores em aberto. O serviço é prestado por{" "}
          {identificacao()}. Ao entrar na área de cliente, o utilizador aceita estes termos.
        </p>

        <h2><span>02</span>Acesso</h2>
        <ul>
          <li>
            O acesso é concedido pela {EMPRESA.nome} a contactos indicados pela empresa cliente. É pessoal: cada contacto entra com o seu
            próprio email.
          </li>
          <li>
            A entrada faz-se com um código de uso único enviado para esse email. O utilizador é responsável por manter a segurança da sua
            conta de email e por não partilhar os códigos recebidos.
          </li>
          <li>
            A empresa cliente deve avisar-nos quando um contacto deixa de estar autorizado (por exemplo, por ter saído da empresa), para
            retirarmos o acesso.
          </li>
          <li>
            Podemos suspender ou retirar o acesso em caso de uso indevido, suspeita de acesso não autorizado ou fim da relação comercial.
          </li>
        </ul>

        <h2><span>03</span>Informação disponibilizada</h2>
        <ul>
          <li>
            A informação da área de cliente reflete o nosso sistema de gestão e tem natureza informativa. Os valores são apresentados sem
            IVA, salvo indicação em contrário.
          </li>
          <li>
            Os valores em aberto e os vencimentos não substituem as faturas nem outros documentos fiscais, que são emitidos e enviados à
            parte. Em caso de divergência, prevalecem as faturas.
          </li>
          <li>
            Os estados e as datas de entrega são indicativos e dependem de fornecedores e transportadoras. Os links de seguimento
            encaminham para sites de terceiros, pelos quais não somos responsáveis.
          </li>
        </ul>

        <h2><span>04</span>Pedidos de orçamento</h2>
        <p>
          Os pedidos feitos no site ou na área de cliente não vinculam nenhuma das partes: servem para prepararmos uma proposta. Os preços
          e a disponibilidade só ficam definidos na proposta.
        </p>

        <h2><span>05</span>Propostas e aceitação online</h2>
        <ul>
          <li>
            Cada proposta indica os artigos, as quantidades, os preços e o prazo de validade. Depois desse prazo, deixa de poder ser aceite
            online e pode ser atualizada a pedido.
          </li>
          <li>
            Ao aceitar uma proposta na área de cliente, o utilizador declara ter poderes para encomendar em nome da empresa cliente e
            confirma a encomenda nas condições da proposta. A aceitação fica registada com a data, o nome do utilizador e a referência ou
            nota que indicar.
          </li>
          <li>
            A encomenda fica sujeita à confirmação de disponibilidade de stock pela {EMPRESA.nome}. Se algum artigo não estiver disponível
            nas condições propostas, contactamos o cliente antes de avançar, e o cliente pode aceitar a alternativa ou cancelar essa parte
            sem custos.
          </li>
          <li>
            As condições de pagamento e de entrega são as indicadas na proposta ou, na falta delas, as acordadas com o cliente.
          </li>
        </ul>

        <h2><span>06</span>Utilização adequada</h2>
        <p>
          O utilizador compromete-se a usar a área de cliente apenas para fins relacionados com a relação comercial com a{" "}
          {EMPRESA.nome}, sem tentar aceder a dados de outros clientes, contornar as medidas de segurança ou sobrecarregar o serviço.
        </p>

        <h2><span>07</span>Disponibilidade e responsabilidade</h2>
        <p>
          Procuramos manter a área de cliente disponível e correta, mas podem ocorrer interrupções para manutenção ou por motivos alheios.
          Na medida permitida por lei, não respondemos por danos indiretos resultantes da indisponibilidade temporária do serviço. Para
          qualquer assunto urgente, contacte-nos por {EMPRESA.telefone} ou <a href={`mailto:${EMPRESA.email}`}>{EMPRESA.email}</a>.
        </p>

        <h2><span>08</span>Dados pessoais</h2>
        <p>
          O tratamento dos dados pessoais dos utilizadores está descrito na <Link href="/privacidade">Política de Privacidade</Link>.
        </p>

        <h2><span>09</span>Alterações</h2>
        <p>
          Podemos alterar estes termos. A data no topo indica a versão em vigor. Alterações relevantes são comunicadas aos utilizadores, e
          continuar a usar a área de cliente depois disso significa que as aceita.
        </p>

        <h2><span>10</span>Lei aplicável e litígios</h2>
        <p>
          Aplica-se a lei portuguesa. Os litígios são resolvidos pelos tribunais da comarca de Lisboa Oeste, salvo norma legal imperativa
          em contrário. Pode ainda apresentar reclamação no{" "}
          <a href="https://www.livroreclamacoes.pt" target="_blank" rel="noopener noreferrer">Livro de Reclamações Eletrónico</a>.
        </p>
      </div>
    </main>
  );
}
