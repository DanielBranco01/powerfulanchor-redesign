# Loja — site com catálogo por cotação

Cópia de `../powerful-anchor-redesign` (nov. 2026) para a primeira versão em produtivo. Mantém a identidade «ficha técnica»
e a área de cliente; muda o **catálogo**, que passa de uma aplicação de página única a rotas Next no servidor, **sem preços**,
com pedido de cotação só para clientes convidados. O `README.md` desta pasta é o herdado; este ficheiro descreve só o que
muda. Índice geral: [`../../README.md`](../../README.md). ERP correspondente: `../../ERP/powerful-anchor-erp-ecommerce/ECOMMERCE.md`.

## Catálogo (`/produtos`)
| Rota | O que mostra |
|---|---|
| `/produtos` | categorias com contagens (as ligações antigas `?cat=` e `?produto=` redirecionam) |
| `/produtos/[categoria]` | listagem (`todos` ou o slug da categoria); tipos como ligações; pesquisa, marca e ordenação por formulário GET; 24 por página |
| `/produtos/[categoria]/[id]` | ficha com características e relacionados; `/produtos/todos/<id>` redireciona para o endereço canónico |

- Renderizado no servidor (`lib/catalogue-server.ts`: ERP com cache de 1 h; reserva em `lib/data/*.json`). Cada artigo tem URL, título e descrição próprios; `app/sitemap.ts`, `app/robots.ts` e `app/not-found.tsx` acompanham.
- **Sem preços e sem stock:** a ficha diz «Preço e disponibilidade sob consulta». O ERP não envia preços nem custos ao site (funções públicas `catalogo_indice` e `catalogo_artigo`).
- **Cesto = orçamento.** O artigo leva nome, referência e imagem para o `localStorage`, por isso o navegador não descarrega o catálogo. A gaveta e o modal vivem em `app/produtos/layout.tsx`.
- **Cotação só com sessão:** sem sessão, o formulário mostra «Entrar na área de cliente» (com `?next=` para voltar ao artigo); com sessão, o pedido fica ligado à empresa (`portal_pedir_orcamento`). A mensagem de contacto do site continua a criar um pedido no ERP.
- **Pesquisa:** com texto, usa a pesquisa inteligente do ERP (`catalogo_pesquisar`, migração `0029`): sinónimos PT/EN, medidas («12u», «cat6»), referência exata primeiro. Se o ERP não responder, cai na pesquisa simples sobre o índice.
- **Atualização imediata:** `POST /api/revalidar` (cabeçalho `x-revalidate-secret` = `REVALIDATE_SECRET`) limpa a cache do catálogo; o ERP chama-o ao guardar um artigo. Sem segredo, desligado (404).
- Estilos: `app/produtos/produtos.css` (isolado em `.pa-catalogue`) com a pele «ficha técnica» no fim do ficheiro.

## Área de cliente (`/area-cliente`)
Igual à do redesign (login por link de email, pedidos, propostas, encomendas, pagamentos), com:
- **`next` após o login** para `/area-cliente/...` ou `/produtos/...` (`lib/portal-destino.ts`).
- **Convite explícito** no ecrã de entrada; textos que não prometem emails que ainda não saem.
- **Demonstração** (`/demo`) só em desenvolvimento ou com `PORTAL_DEMO=on` (mostra preços fictícios).
- **Prazo de entrega e condições** da proposta (precisa da migração `0026` do ERP; sem ela os campos vêm vazios).
- Proposta expirada → «Novo pedido» já com o assunto preenchido.
- **Mensagens à equipa** (`MensagemForm`): pedir alteração a uma proposta, reportar problema numa encomenda, pedir acesso para um colega e pedir alteração de dados; cada uma vira uma tarefa no ERP (`portal_enviar_mensagem`, `0029`) e avisa a equipa por email, se estiver configurado.
- **Email de confirmação ao cliente** ao aceitar uma proposta (`confirmarEncomendaAoCliente`), desligado sem `EMAIL_CLIENTE_FROM` + `RESEND_API_KEY` + `PORTAL_SITE_URL`.
- Páginas legais com a denominação social (POWERFUL ANCHOR, UNIPESSOAL LDA) e o NIPC (516092324).

## Supabase Auth: URLs de regresso (obrigatório antes de publicar)
O ERP e a loja usam a **mesma base**, logo a mesma configuração de Auth. O link de entrada por email só volta a endereços
autorizados; qualquer outro cai no endereço-base do projeto (**Site URL**, que é o do ERP). Sintoma: o link «vai para o ERP».
No painel do Supabase → *Authentication → URL Configuration*:
- **Site URL:** o do ERP (mantém-se).
- **Redirect URLs:** `http://localhost:3002/**` (desenvolvimento; a porta 3003 **não** está autorizada, por isso o `launch.json` usa a 3002) e o endereço público da loja, por exemplo `https://www.powerfulanchor.pt/**`. Definir o mesmo valor em `PORTAL_SITE_URL`.
- O modelo de email «Magic Link» tem de incluir `{{ .Token }}` e, para clientes reais, é preciso SMTP próprio (Resend com o domínio verificado).
Em `localhost` o cookie de sessão é partilhado entre portas: entrar como cliente na loja termina a sessão do ERP; testar o ERP em `http://127.0.0.1:3004`.

## Variáveis (`.env.example`)
`ERP_SUPABASE_URL`, `ERP_SUPABASE_PUBLISHABLE_KEY`; opcionais `RESEND_API_KEY`, `LEAD_NOTIFY_TO`, `LEAD_NOTIFY_FROM`,
`ERP_APP_URL`, `PORTAL_SITE_URL`, **`SITE_URL`** (domínio público, para o sitemap e os endereços canónicos) e `PORTAL_DEMO`.
O `.env.local` desta cópia aponta para o **ERP de produção**: cuidado ao testar formulários.

## Publicação (17/11/2026)
A loja **não criou projetos novos**: foi para o repositório e para o site de teste que já existiam (`powerfulanchor-redesign`).
- **GitHub:** `DanielBranco01/powerfulanchor-redesign`, ramo `main` (1 commit por cima do histórico, `c6bcc81` → `99af470`).
- **Ponto de regresso:** etiqueta **`pre-loja-v1`** (o redesign + área de cliente tal como estavam, `c6bcc81`). O site de produção antigo (`powerfulanchor`) **não foi tocado**.
- **Netlify:** site `powerfulanchor-redesign` (ligado ao GitHub, **publicação automática do `main`**: cada envio gasta um deploy; usar `[skip ci]` na mensagem em commits só de documentação). **Publicado a 18/11/2026** (deploy `6afd8fab…`, `main@0250b2f`) já com as variáveis. Variáveis definidas no Netlify (o site não tinha nenhuma): `ERP_SUPABASE_URL`, `ERP_SUPABASE_PUBLISHABLE_KEY` (valores públicos do ERP), `SITE_URL` e `PORTAL_SITE_URL` (`https://powerfulanchor-redesign.netlify.app` até haver domínio). Alterar variáveis exige novo deploy.
- **Supabase:** `https://powerfulanchor-redesign.netlify.app/**` **já está** em *Authentication → URL Configuration → Redirect URLs* (acrescentado a 18/11/2026). Quando houver domínio próprio, acrescentar também o novo endereço e atualizar `SITE_URL` e `PORTAL_SITE_URL`.
- Verificado ao vivo: ficha sem preços, pesquisa inteligente (323 resultados para «armário 19 polegadas 12u»), entrada «por convite» sem demonstração, sitemap com 2 726 endereços.
- Esta pasta (`Website/powerful-anchor-loja`) é agora o clone de trabalho do repositório; `powerful-anchor-redesign` fica como arquivo.

## Estado
- `npm run build` e `tsc` passam. Não há testes automáticos nesta pasta; verificada no navegador, incluindo 375 px sem scroll lateral nas páginas do catálogo e da área de cliente.
- Pendentes: domínio e emails (Resend), deploy, `SITE_URL` e URLs de regresso no Supabase.
  Lista completa: `../../ERP/powerful-anchor-erp-ecommerce/docs/PENDENTES.md` → «Versão e-commerce».
- Esta pasta ainda não tem repositório Git remoto nem site no Netlify.
