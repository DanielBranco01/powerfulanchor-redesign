# Redesign v2 — "ficha técnica"

Cópia de teste de `../powerful-anchor-next` (03/10/2026) com uma nova identidade visual. A lógica (catálogo, cesto,
formulários, ligação ao ERP) é a mesma do site atual; muda a apresentação. O `README.md` desta pasta é a cópia do
original com uma nota no topo — este ficheiro descreve só o que é diferente. Índice do módulo: [`../README.md`](../README.md).

Pré-visualização da homepage: `preview-homepage.png`.

## Conceito

Linguagem de **ficha técnica / esquema de instalação**: papel, tinta e magenta chapados; canto "folha" tirado do
logótipo; etiquetas numeradas (`01 · QUEM SOMOS`, `FIG. A.1`, `REV. 2026`); coordenadas da sede no cabeçalho.

| | Site atual (`powerful-anchor-next`) | Redesign |
|---|---|---|
| Tipografia | Space Grotesk + Inter | Archivo (eixo de largura: títulos a `wdth 125`, texto a 100) + IBM Plex Mono (referências/etiquetas) |
| Hero | "Soluções tecnológicas que dão POWER…", grelha de fundo e `NodeVisual` animado (nós ligados ao centro) | "Dê POWER ao seu negócio.", fundo papel, **patch panel interativo** com as 5 categorias do catálogo |
| Aplicações | estilo original, sem ilustrações | Desenhos esquemáticos em SVG (cablagem, RF, AV) com a linha "viva" em magenta |
| Diferenciais | estilo original | Tabela tipo ficha técnica (Produto, Suporte, Experiência, Configuração, Disponibilidade, Conformidade) |
| Áreas de solução | estilo original | Lista numerada em fundo escuro (`01 / RD`, `02 / AV`…) com seta |

## O que mudou no código

| Ficheiro | Alteração |
|---|---|
| `app/layout.tsx` | fontes Archivo + IBM Plex Mono |
| `app/globals.css` | novos tokens e estilos (~33 KB vs. ~27 KB) |
| `components/PatchPanel.tsx` | **novo**: painel de 20 portas em 5 grupos (uma categoria cada, de `lib/nav-catalogue`), LEDs a piscar desfasados, hover "liga" o grupo; cada grupo é um link `/produtos?cat=…` |
| `components/NodeVisual.tsx` | removido (substituído pelo PatchPanel) |
| `components/Hero.tsx` | nova composição (meta-linha, estatísticas em array, painel) |
| `components/Projects.tsx` | desenhos SVG por aplicação |
| `About`, `Services`, `Differentials`, `Process`, `CtaBand`, `TrustBar`, `Contact`, `Footer` | reescritos para a nova linguagem |
| `public/logo.png` | variante do logótipo |

Sem alterações: `Nav`, `ProductsMegaMenu`, `BasketProvider`, `lib/*` (já inclui a leitura do catálogo do ERP),
`app/actions.ts`, `app/api/*`, `scripts/*`.

## Estado e cuidados

- Porta 3002 no `launch.json` da pasta-mãe. Tem Git local desde 13/10/2026 (área de cliente); publicação: ver o `README.md` da pasta `Website`.
- Área de cliente com **modo demonstração** em `/demo` (dados fictícios, sem login) — para mostrar sem uma conta real.
- O README diz "sem `.env.local`", mas existe um `.env.local` nesta pasta. Se tiver as chaves do ERP, **os formulários do
  redesign criam leads reais no ERP** — confirmar antes de testar o formulário de contacto.
- O README herdado ainda menciona `NodeVisual.tsx` e as fontes antigas nas notas de implementação.
- O catálogo (`/produtos`) não foi redesenhado nesta versão: confirmar se o estilo `.pa-catalogue` encaixa na nova identidade.

## Próximo passo: decidir

1. **Adotar** → levar os ficheiros da tabela acima para `powerful-anchor-next` num ramo (`git switch -c redesign`), rever
   o catálogo e a responsividade, publicar num único deploy (créditos Netlify).
2. **Iterar** → pôr esta pasta em Git (`git init`) antes de mais alterações.
3. **Descartar** → arquivar a pasta e o `preview-homepage.png` como referência.
