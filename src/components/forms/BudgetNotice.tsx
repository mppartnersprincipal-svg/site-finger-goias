import { budget } from "@/content/budget";
import { cn } from "@/lib/cn";

/** Aviso da taxa do projeto, antes do formulário (pop-up dos CTAs e página /orcamento). */
export function BudgetNotice({ className }: { className?: string }) {
  const { fee } = budget;
  return (
    <div className={cn("flex flex-col gap-3 rounded-md border border-neutral-timberwolf bg-neutral-timberwolf/20 p-5 sm:flex-row sm:items-center sm:gap-6", className)}>
      <p className="flex shrink-0 flex-col">
        <span className="font-heading text-xs font-semibold tracking-[0.12em] text-dark-olive uppercase">{fee.label}</span>
        <span className="font-heading text-3xl font-bold tracking-tight text-dark-eerie">{fee.value}</span>
      </p>
      <p className="text-sm text-dark-olive sm:border-l sm:border-neutral-timberwolf sm:pl-6">{fee.text}</p>
    </div>
  );
}
