"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { BudgetNotice } from "@/components/forms/BudgetNotice";
import { WhatsAppForm } from "@/components/forms/WhatsAppForm";
import { budget, budgetFields } from "@/content/budget";
import { site } from "@/content/site";
import { isBudgetClick } from "@/lib/budget-link";

/**
 * Pop-up do formulário de projeto. Os CTAs continuam sendo links para /orcamento (sem JS, nova aba e
 * Ctrl+clique levam à página); aqui um único ouvinte na fase de captura troca o clique simples pelo
 * pop-up, antes de o <Link> do Next navegar. O conteúdo só é montado no primeiro clique: não pesa no
 * HTML inicial nem no LCP, e as respostas ficam guardadas se a pessoa fechar e reabrir.
 */
export function BudgetDialog() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [hasOpened, setHasOpened] = useState(false);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const link = (event.target as Element | null)?.closest?.("a[href]");
      if (!(link instanceof HTMLAnchorElement)) return;
      const linkInfo = { href: link.getAttribute("href"), target: link.target, download: link.hasAttribute("download") };
      if (!isBudgetClick(event, linkInfo, window.location.origin)) return;
      event.preventDefault();
      // Fecha o menu mobile (ou outro <dialog>) antes de abrir o formulário.
      document.querySelectorAll("dialog[open]").forEach((d) => d !== dialogRef.current && (d as HTMLDialogElement).close());
      setHasOpened(true);
      setIsOpen(true);
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, []);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
    document.documentElement.classList.toggle("dialog-open", isOpen);
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby="orcamento-titulo"
      onClose={() => setIsOpen(false)}
      onClick={(event) => event.target === event.currentTarget && setIsOpen(false)}
      data-lenis-prevent
      className="menu-dialog m-auto max-h-[calc(100dvh-2rem)] w-[min(calc(100%-2rem),46rem)] max-w-none overflow-y-auto overscroll-contain rounded-lg bg-neutral-floral p-0 text-dark-eerie shadow-lg backdrop:bg-dark-eerie/60 max-sm:h-dvh max-sm:max-h-none max-sm:w-screen max-sm:rounded-none"
    >
      {hasOpened && (
        <div className="flex flex-col gap-6 px-5 pb-[max(2rem,env(safe-area-inset-bottom))] sm:px-10 sm:pb-10">
          <div className="sticky top-0 z-10 -mx-5 flex items-start justify-between gap-4 bg-neutral-floral px-5 pt-5 pb-2 sm:-mx-10 sm:px-10 sm:pt-8">
            <h2 id="orcamento-titulo" className="text-[clamp(1.5rem,4vw,2rem)] leading-tight">
              {budget.title}
            </h2>
            <button
              type="button"
              aria-label="Fechar formulário"
              onClick={() => setIsOpen(false)}
              className="-mr-2 inline-flex size-11 shrink-0 items-center justify-center rounded-full transition-colors duration-180 ease-out hover:bg-neutral-timberwolf/20"
            >
              <X aria-hidden size={24} strokeWidth={1.5} />
            </button>
          </div>
          <p className="-mt-2 text-dark-olive">{budget.lead}</p>
          <BudgetNotice />
          <WhatsAppForm intro={budget.intro} phone={site.showroom.whatsapp} fields={budgetFields} submitLabel={budget.submitLabel} />
        </div>
      )}
    </dialog>
  );
}
