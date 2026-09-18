# Retomada da análise de LCP — 18/09/2026

## Ambientes

O relatório deixado pelo Claude (`scripts/media/_out/lhr-ambientes.json`) identificava a primeira
foto da grade (`sa-gourmet-7844`) como LCP: 4,15 s, com 2,20 s de atraso de renderização depois do
download. A imagem já usava AVIF, carregamento eager e prioridade alta.

`FilterableGrid.tsx` aplicava `grid-item-in` aos 48 cartões no HTML inicial. Essa classe anima
opacidade de zero e transformação. Agora ela só é ativada após uma interação com os filtros;
o carregamento inicial e a abertura de uma categoria pela URL não animam os cartões.

### Medições locais

Next.js em produção na porta 3101, Lighthouse 13.5.0, mobile, throttling DevTools, CPU 4x e
configuração de rede igual à de `scripts/lh-real.sh`. Execuções sequenciais.

| Métrica | Antes (nova medição) | Depois | Confirmação |
|---|---:|---:|---:|
| Performance | 52 | 82 | 83 |
| LCP | 4,91 s | 2,33 s | 2,32 s |
| Atraso de renderização do LCP | 2,93 s | 0,40 s | 0,37 s |
| TBT | 1.230 ms | 520 ms | 480 ms |

São resultados de laboratório local, sujeitos à carga da máquina; não representam dados reais
de visitantes. Ainda há bloqueio da thread principal a investigar. O relatório antigo do Claude
e a nova medição anterior diferem, portanto a tabela compara as execuções desta retomada.

Relatórios e capturas ficam no diretório ignorado pelo Git `scripts/media/_out/`:
`lhr-ambientes-before.json`, `lhr-ambientes-after.json`, `lhr-ambientes-confirm.json`,
`ambientes-after-mobile.png` e `ambientes-after-desktop.png`.

### Verificações

- Build de produção aprovado, com 21 páginas estáticas.
- Navegador: filtros Cozinhas/Todos, categoria mantida ao recarregar a URL, movimento reduzido,
  cartões visíveis sem JavaScript e ausência de erros JavaScript nas interações verificadas.
- Inspeção visual em 412 × 823 e 1440 × 1000.
- O lint já apresentava dois erros e um aviso antes deste ajuste: arquivo temporário
  `scripts/media/_out/loaf.js`, atualização de estado no efeito de `FilterableGrid.tsx` e
  expressão em `WhatsAppFloat.tsx`. Essas pendências não foram alteradas neste ajuste de LCP.

Referência: [decomposição e otimização do LCP](https://web.dev/articles/optimize-lcp).

---

# Verificação final — 18/09/2026 (Claude, após a retomada do Codex)

Correção de `/ambientes` confirmada de forma independente. Lighthouse 13, mobile, build de produção
local (`scripts/serve.sh`), execuções sequenciais.

## LCP com throttling aplicado (`scripts/lh-real.sh`: 4G lento 1,6 Mbps / RTT 150 ms + CPU 4x)

| Página | LCP | CLS | Elemento de LCP |
|---|---:|---:|---|
| `/` | 2,5 s | 0 | pôster do hero (AVIF 43 KB) |
| `/ambientes` | 2,6 s | 0 | 1ª foto da grade (`priority`) |
| `/sobre` | 2,3–2,4 s | 0–0,03 | título (texto) |
| `/como-funciona` | 2,3 s | 0,01 | título (texto) |
| `/orcamento` | 2,2 s | 0,03 | título (texto) |

Todas dentro da meta do projeto (LCP ≤ 3 s). Acessibilidade 100, Boas Práticas 100, SEO 100.

## Ressalva: a simulação padrão do Lighthouse dá números maiores

No modo padrão (`scripts/lh.sh`, simulação "Lantern") a Home marca LCP 4,0–4,4 s e `/sobre` 3,4 s,
embora o LCP **observado** seja 0,2–1,3 s. Em localhost a latência é zero, então JS, fontes e imagens
lazy terminam antes do LCP observado e a simulação os coloca no caminho crítico. O modo com throttling
aplicado mede o carregamento de fato limitado e é o mais fiel aqui — mas **nenhuma medição local
substitui o teste em produção**: depois do deploy, validar no PageSpeed Insights (dados de laboratório
do Google) e acompanhar o LCP real de visitantes no Speed Insights da Vercel.

## O que foi feito pelo LCP (em ordem de impacto)

1. Nada nasce oculto: removida a classe que escondia `[data-reveal]` até o GSAP carregar; as
   revelações só se aplicam ao que está abaixo da dobra (`MotionProvider`). `/sobre`: 5,2 s → 2,3 s.
2. `/ambientes`: cartões sem animação de opacidade no HTML inicial (Codex) + 1ª foto `priority`.
3. Removidos `html:has(dialog[open])` e `text-wrap: pretty` global: Style & Layout −50 %.
4. Fontes: Ephesis em subset pt-BR (51 → 16 KB), Source Serif em pesos estáticos, só a Open Sans
   com preload.
5. Pôster do hero mobile: 143 → 43 KB (720 px, mesma largura do vídeo que entra por cima).
6. Vídeo do hero, GSAP/Lenis e three só depois do `load`; three apenas perto da tela e em
   aparelhos capazes.

## Ainda em aberto (não bloqueia a meta)

- TBT de laboratório alto com CPU 4x (Home ~880 ms, Como Funciona ~1.160 ms): primeira renderização,
  setup das animações e inicialização da cena 3D (chunk three = 133 KB gz). Tudo ocorre depois do LCP.
- Imagens lazy a menos de ~2.500 px da dobra são baixadas cedo pelo Chrome (comportamento nativo).
