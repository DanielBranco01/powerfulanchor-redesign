import type { Metadata } from "next";
import Link from "next/link";
import { EMPRESA, LEGAL_ATUALIZADO, identificacao } from "@/lib/legal";

export const metadata: Metadata = {
  title: "Política de Privacidade · Powerful Anchor",
  description: "Como a Powerful Anchor trata os dados pessoais recolhidos no site e na área de cliente.",
};

export default function PrivacidadePage() {
  return (
    <main className="pa-legal">
      <div className="wrap legal-inner">
        <span className="tag">
          <b>RGPD</b>
          <span>Dados pessoais</span>
        </span>
        <h1>Política de Privacidade</h1>
        <p className="legal-meta">Última atualização: {LEGAL_ATUALIZADO}</p>

        <p>
          Esta política explica que dados pessoais tratamos quando visita este site, nos contacta, pede um orçamento ou usa a área de
          cliente, para que fins, durante quanto tempo e que direitos tem. Aplica-se o Regulamento Geral sobre a Proteção de Dados
          (Regulamento (UE) 2016/679, «RGPD») e a Lei n.º 58/2019.
        </p>

        <h2><span>01</span>Quem é o responsável pelo tratamento</h2>
        <p>
          {identificacao()}. Para qualquer questão sobre os seus dados pessoais: <a href={`mailto:${EMPRESA.email}`}>{EMPRESA.email}</a> ou{" "}
          {EMPRESA.telefone}.
        </p>

        <h2><span>02</span>Que dados tratamos</h2>
        <ul>
          <li>
            <b>Formulários de contacto e de pedido de orçamento:</b> nome, email, telefone e empresa (quando indicados), a mensagem e os
            artigos e quantidades pedidos.
          </li>
          <li>
            <b>Área de cliente:</b> nome, email, telefone e cargo do contacto da empresa cliente; registos de entrada (data da última
            entrada); os pedidos, propostas, encomendas, dados de entrega e valores em aberto da empresa; as aceitações de propostas
            feitas online (data, autor, referência e nota).
          </li>
          <li>
            <b>Dados técnicos:</b> endereço IP, tipo de navegador e registos de erro e de segurança gerados pelos servidores, usados
            para manter o site a funcionar e protegido contra abusos.
          </li>
        </ul>
        <p>Não recolhemos categorias especiais de dados nem dados de menores, e não tomamos decisões automatizadas com efeitos jurídicos.</p>

        <h2><span>03</span>Para que fins e com que fundamento</h2>
        <div className="legal-scroll">
          <table>
            <thead>
              <tr>
                <th>Finalidade</th>
                <th>Fundamento (art. 6.º do RGPD)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Responder a mensagens e pedidos de orçamento e preparar propostas</td>
                <td>Diligências pré-contratuais a pedido do titular (n.º 1, b)) e interesse legítimo em responder a contactos profissionais (n.º 1, f))</td>
              </tr>
              <tr>
                <td>Gerir a área de cliente: dar acesso, mostrar pedidos, propostas, encomendas, entregas e valores em aberto</td>
                <td>Execução do contrato com a empresa cliente (n.º 1, b)) e interesse legítimo em lhe disponibilizar esta informação (n.º 1, f))</td>
              </tr>
              <tr>
                <td>Processar encomendas, entregas e cobranças</td>
                <td>Execução de contrato (n.º 1, b))</td>
              </tr>
              <tr>
                <td>Cumprir obrigações contabilísticas e fiscais</td>
                <td>Obrigação legal (n.º 1, c))</td>
              </tr>
              <tr>
                <td>Segurança do site, prevenção de abusos e defesa de direitos</td>
                <td>Interesse legítimo (n.º 1, f))</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Não usamos os seus dados para publicidade nem para envio de newsletters. Se um dia o quisermos fazer, pediremos antes o seu
          consentimento.
        </p>

        <h2><span>04</span>Durante quanto tempo</h2>
        <ul>
          <li>Pedidos de contacto ou de orçamento que não deram origem a negócio: até 24 meses após o último contacto.</li>
          <li>
            Dados de clientes, propostas e encomendas: durante a relação comercial e, depois, pelos prazos legais de conservação de
            documentos contabilísticos e fiscais (atualmente 10 anos).
          </li>
          <li>Acesso à área de cliente: enquanto estiver ativo; a conta de acesso é desativada quando o acesso é retirado.</li>
          <li>Registos técnicos e de segurança: até 12 meses.</li>
        </ul>

        <h2><span>05</span>Com quem partilhamos</h2>
        <p>Não vendemos dados pessoais. Recorremos a prestadores de serviços que os tratam apenas por nossa conta (subcontratantes):</p>
        <ul>
          <li><b>Supabase</b>: base de dados e autenticação da área de cliente, alojadas na União Europeia (Irlanda).</li>
          <li><b>Netlify</b>: alojamento e entrega do site.</li>
          <li><b>Resend</b>: envio de emails de serviço (por exemplo, avisos internos de novos pedidos e códigos de entrada).</li>
        </ul>
        <p>
          Alguns destes prestadores podem tratar dados fora do Espaço Económico Europeu, nomeadamente nos Estados Unidos. Nesses casos,
          a transferência assenta na decisão de adequação da Comissão Europeia relativa ao EU-U.S. Data Privacy Framework ou em cláusulas
          contratuais-tipo aprovadas pela Comissão. Podemos ainda comunicar dados a transportadoras (para entregas) e às autoridades,
          quando a lei o exija.
        </p>

        <h2><span>06</span>Cookies e armazenamento no navegador</h2>
        <p>Este site não usa cookies de publicidade nem de estatística. Usa apenas:</p>
        <ul>
          <li>
            <b>Cookie de sessão da área de cliente</b> (<code>sb-…-auth-token</code>): estritamente necessário para manter a sessão
            iniciada depois de introduzir o código de entrada. É apagado quando termina a sessão.
          </li>
          <li>
            <b>Cesto de orçamento</b>: os artigos que junta ao orçamento ficam guardados no seu navegador (armazenamento local) e não são
            enviados até submeter o pedido.
          </li>
        </ul>
        <p>Por serem estritamente necessários ao serviço que pediu, não exigem consentimento prévio.</p>

        <h2><span>07</span>Os seus direitos</h2>
        <p>
          Pode pedir o acesso aos seus dados, a retificação, o apagamento, a limitação do tratamento, a portabilidade e opor-se aos
          tratamentos baseados em interesse legítimo, escrevendo para <a href={`mailto:${EMPRESA.email}`}>{EMPRESA.email}</a>. Respondemos
          no prazo de um mês. Alguns dados têm de ser conservados por obrigação legal mesmo que peça o apagamento.
        </p>
        <p>
          Tem também o direito de apresentar reclamação à Comissão Nacional de Proteção de Dados (
          <a href="https://www.cnpd.pt" target="_blank" rel="noopener noreferrer">www.cnpd.pt</a>).
        </p>

        <h2><span>08</span>Segurança</h2>
        <p>
          Os dados circulam cifrados (HTTPS). A área de cliente não usa passwords: a entrada faz-se com um código de uso único enviado
          para o email do contacto. Cada utilizador só vê os dados da sua empresa, e o acesso pode ser retirado a qualquer momento pela
          nossa equipa ou a seu pedido.
        </p>

        <h2><span>09</span>Alterações</h2>
        <p>
          Podemos atualizar esta política. A data no topo indica a última versão; alterações relevantes são comunicadas aos utilizadores da
          área de cliente. Veja também os <Link href="/termos">Termos da área de cliente</Link>.
        </p>
      </div>
    </main>
  );
}
