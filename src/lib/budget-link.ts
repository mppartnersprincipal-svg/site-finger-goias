// Todo CTA aponta para /orcamento (funciona sem JS e em nova aba). Com JS, o clique simples
// abre o pop-up do formulário no lugar da navegação.

import { site } from "../content/site";

type ClickLike = Pick<MouseEvent, "button" | "metaKey" | "ctrlKey" | "shiftKey" | "altKey" | "defaultPrevented">;
type LinkLike = { href: string | null; target?: string | null; download?: boolean };

export function isBudgetClick(event: ClickLike, link: LinkLike, origin: string): boolean {
  if (event.defaultPrevented || event.button !== 0) return false;
  if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
  if (!link.href || link.download || (link.target && link.target !== "_self")) return false;
  const url = new URL(link.href, origin);
  return url.origin === origin && url.pathname.replace(/\/$/, "") === site.cta.href;
}
