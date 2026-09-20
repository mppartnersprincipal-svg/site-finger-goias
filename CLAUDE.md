@AGENTS.md

# Site Finger Goiás — guia para o Claude

Leia este arquivo e pare: ele substitui a exploração do repositório. Só abra outros arquivos quando a
tarefa exigir. Estado atual, decisões do cliente e pendências estão na memória do projeto e em
`PENDENCIAS.md`; medições em `PERFORMANCE.md`.

## O que é

Site institucional do showroom **Finger Goiás** (móveis planejados; fábrica em Sarandi/RS desde 1978).
Next.js 16 App Router, **21 rotas 100% estáticas**, TypeScript, Tailwind v4, GSAP + Lenis, cena 3D em
three.js puro, blog em MDX. Leads **só por WhatsApp** (sem backend). Hospedagem alvo: Vercel.
Repo: github.com/mppartnersprincipal-svg/site-finger-goias (branch `main`). Ainda sem deploy.

Fontes de verdade, fora deste repo (pasta pai `../`): `Copy do Site.txt` manda em **textos, menu e
CTAs**; `Design System/` manda no **visual**. Em conflito entre os dois, vale essa divisão.

## Mapa

| Preciso mexer em… | Arquivo |
|---|---|
| Telefone/WhatsApp, endereço, menu, CTA, redes | `src/content/site.ts` |
| Portfólio (projetos, fotos, categorias) | `src/content/projects.ts` |
| Artigos do blog | `src/content/blog/*.mdx` + 1 linha em `registry.ts` |
| Tokens do DS (cores, fontes, raios, easing) | `src/app/globals.css` (`@theme`) |
| Botão, Badge, Eyebrow, Section, Accent (Ephesis) | `src/components/ui/` |
| Navbar, menu mobile, Footer, botão WhatsApp | `src/components/layout/` |
| Seções da Home e cabeçalho das internas | `src/components/sections/` |
| Fotos responsivas, vídeos, galeria, grade filtrável | `src/components/media/` |
| Animações (Lenis, reveals, parallax, transição, cursor) | `src/components/motion/MotionProvider.tsx` |
| Móvel 3D: peças e medidas / cena / gatilho de scroll | `src/components/three/module-spec.mjs` / `FurnitureScene.ts` / `FurnitureCanvas.tsx` |
| Formulários → mensagem do WhatsApp | `src/components/forms/WhatsAppForm.tsx`, `src/lib/whatsapp.ts` |
| JSON-LD, sitemap, robots | `src/lib/seo/jsonld.ts`, `src/app/sitemap.ts`, `robots.ts` |

## Comandos

```bash
npm run dev                       # desenvolvimento
npm run lint && npx tsc --noEmit && npx vitest run   # checagens (todas devem passar limpas)
bash scripts/serve.sh             # build + servidor de produção em http://localhost:3100
bash scripts/lh-real.sh / home    # Lighthouse mobile com throttling APLICADO (o número que vale)
node scripts/media/check-budget.mjs   # orçamento de peso da mídia
```

Mídia: os brutos (1,5 GB) ficam em `../` e **nunca entram no repo**. Foto nova = entrada em
`scripts/media/curation.json` (com `alt`) → `node scripts/media/build-images.mjs` → usar o `id` em
`<Picture id>` ou `projects.ts`. Vídeos: `bash scripts/media/build-videos.sh <alvo>`. Depois de editar
`module-spec.mjs`: `node scripts/media/build-furniture-svg.mjs`.

## Regras que não podem ser quebradas

1. **LCP ≤ 3 s no mobile** (hoje 2,2–2,8 s). O elemento de LCP é renderizado no servidor e **nada nasce
   oculto** no HTML/CSS: nenhuma animação de `opacity: 0` em conteúdo da primeira dobra. Revelações por
   scroll só valem para o que está abaixo da dobra quando o GSAP assume. Uma única `<Picture priority>`
   por página. Vídeo do hero, GSAP/Lenis e three só depois do `load` (import dinâmico).
2. **Design System**: só as 5 cores (Flame `#C44E2A`, Floral `#FFFCF2`, Timberwolf `#CCC5B9`, Olive
   `#403D39`, Eerie `#252422`) e alphas delas; nunca preto puro. Raios 2/6/8 px em cards, imagens,
   campos e badges. **Exceção pedida pelo cliente (20/09/2026): todos os botões são arredondados
   (`rounded-full`)**, inclusive chips, filtros e botões de ícone; o flutuante do WhatsApp é circular, com
   o glifo oficial e o verde da marca (`bg-brand-whatsapp`, única cor fora da paleta).
   Ephesis: 1 palavra por tela, ≥ 32 px, nunca em botão/nav/parágrafo. Easing único
   `cubic-bezier(.22,1,.36,1)`, sem bounce. Ícones Lucide com traço 1.5. Sem emoji.
   Flame sobre Eerie dá 3,33:1 — proibido em texto < 24 px.
3. **Só material real da Finger.** Nada de imagem gerada por IA, nome de cliente, arquiteto, cidade ou
   especificação inventados. Seção sem mídia vira solução tipográfica/gráfica.
4. **Acessibilidade AA**: foco visível, `prefers-reduced-motion` respeitado em tudo (inclusive os
   trilhos sticky do 3D), dialogs nativos. Lighthouse a11y/boas práticas/SEO estão em 100 — manter.
5. Tom da copy: pt-BR, sereno, "você"/"nós", frases curtas, sem superlativos.

## Armadilhas já descobertas

- **Next 16**: `params` é Promise; `PageProps<"/rota/[slug]">` exige `npx next typegen`; `next lint`
  não existe (usar `eslint`). Docs da versão em `node_modules/next/dist/docs/`.
- `lucide-react` 1.x não tem ícones de marca: Instagram e o glifo oficial do WhatsApp estão em `ui/icons.tsx`.
- `:has()` na raiz (`html:has(...)`) e `text-wrap: pretty` global dobram o custo de estilo — não usar.
- Tailwind: utilitários conflitantes na mesma classe (`hidden` + `inline-flex`, `border-transparent` +
  `border-…`) resolvem pela ordem do CSS, não da string. Usar variantes (`max-sm:hidden`).
- A cena 3D precisa de **trilho sticky** (`data-furniture-track`) para a animação terminar na tela;
  amarrar o progresso só à passagem do bloco faz o scroll "passar reto".
- Lighthouse em localhost: o modo simulado infla o LCP (latência zero distorce o grafo). Fechar o
  navegador de teste antes de medir — ele disputa CPU.
- Git Bash no Windows: não há `bc` (usar `awk`); nunca editar um `.sh` enquanto ele roda; heredocs
  grandes com aspas falham — criar arquivos com a ferramenta de escrita.
- `.sh` e `.mjs` têm `eol=lf` no `.gitattributes`; não remover.
