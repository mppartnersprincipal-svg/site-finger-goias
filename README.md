# Site Finger Goiás

Site institucional da Finger Ambientes Personalizados (showroom de Goiânia). Next.js 16 (App Router,
100% estático), Tailwind v4 com os tokens do Design System, GSAP + Lenis, cena 3D procedural em
three.js e leads via WhatsApp (sem backend).

## Comandos

```bash
npm run dev          # desenvolvimento
npm run build        # build de produção (todas as rotas saem estáticas)
npx vitest run       # testes de src/lib
bash scripts/serve.sh            # build + servidor local em http://localhost:3100
bash scripts/lh.sh / home        # Lighthouse mobile de uma rota (precisa do servidor acima)
```

## Onde mexer

| O que | Onde |
|---|---|
| Telefone/WhatsApp, endereço, menu, redes | `src/content/site.ts` |
| Portfólio (projetos, fotos, categorias) | `src/content/projects.ts` |
| Artigos do blog | `src/content/blog/*.mdx` + uma linha em `registry.ts` |
| Tokens do Design System | `src/app/globals.css` (`@theme`) |
| Medidas/peças do móvel 3D | `src/components/three/module-spec.mjs` |

Domínio: defina `NEXT_PUBLIC_SITE_URL` (usado em canonical, sitemap e JSON-LD).

## Mídia

Os arquivos brutos (1,5 GB) ficam **fora do repositório**, na pasta pai (`../`). O que vai para o
site é gerado por scripts e versionado em `public/media`:

```bash
node scripts/media/build-images.mjs     # fotos -> AVIF/WebP 640–1920 + LQIP + src/content/media-manifest.json
bash scripts/media/build-videos.sh all  # hero mobile/desktop, reels, loops, institucional, stills (ffmpeg)
node scripts/media/build-furniture-svg.mjs   # fallback isométrico do móvel 3D (após editar module-spec.mjs)
node scripts/media/build-og.mjs         # imagem Open Graph
node scripts/media/check-budget.mjs     # falha se algum arquivo estourar o orçamento de peso
```

Para incluir uma foto: adicione uma entrada em `scripts/media/curation.json` (com `alt` descritivo),
rode `build-images.mjs` e use o `id` em `projects.ts` ou em `<Picture id="..." />`.

## Regras de performance (LCP)

- O elemento de LCP de cada página é renderizado no servidor e **nunca nasce oculto**. As revelações
  por scroll só são aplicadas pelo GSAP ao que está abaixo da dobra (`MotionProvider`).
- Uma única imagem `priority` por página. O vídeo do hero só é requisitado depois do `load`.
- GSAP, Lenis e three são importados dinamicamente; three só carrega quando o palco 3D se aproxima
  da tela e o aparelho é capaz (`src/lib/device-tier.ts`), senão fica o desenho em SVG.
- Tudo respeita `prefers-reduced-motion`.

## Pendências com o cliente

Ver `PENDENCIAS.md`.

## Revisão e publicação

O diagnóstico e as medições locais estão em `PERFORMANCE.md`. Para validar antes de publicar:

```bash
npm run lint
npx vitest run
node scripts/media/check-budget.mjs
npm run build
```

No PowerShell, o servidor de produção pode ser iniciado após o build com:

```powershell
node node_modules/next/dist/bin/next start -p 3101
```

Antes do deploy, confirmar os itens de `PENDENCIAS.md` e definir `NEXT_PUBLIC_SITE_URL` com a
origem HTTPS definitiva (sem caminho). Depois de configurar o domínio, gerar um novo build e
conferir canonical, `/sitemap.xml`, `/robots.txt` e os dados estruturados na URL publicada.
O fallback `localhost:3000` é apenas para desenvolvimento e não deve ser usado em produção.

As rotas são pré-renderizadas pelo Next.js, mas este projeto não usa `output: "export"`:
publicar como projeto Next.js para preservar headers de cache e o redirecionamento `/contato`.
Os componentes de Analytics e Speed Insights são incluídos somente quando `VERCEL=1`;
habilitar os serviços correspondentes no projeto Vercel antes de validar as métricas em produção.

Na verificação dos formulários, conferir o destinatário e a mensagem preenchida no WhatsApp.
O site prepara a conversa; o envio final depende da ação do visitante no WhatsApp.
