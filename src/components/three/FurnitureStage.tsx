import { cn } from "@/lib/cn";
import { FurnitureFallback } from "./FurnitureFallback";
import { FurnitureCanvas } from "./FurnitureCanvas";

/**
 * Palco do Módulo Finger. O desenho isométrico é renderizado no servidor e ocupa a caixa final
 * (sem CLS); a cena WebGL é carregada sob demanda por cima dele e só em dispositivos capazes.
 *
 * A animação é conduzida pelo scroll e precisa de tempo de tela para ser vista até o fim
 * (montado → desenho técnico → explodido → remontado → LED). Por isso o palco sempre fica PRESO
 * enquanto ela acontece:
 *  - abaixo de 1024 px, este wrapper é um trilho alto e o palco fica numa moldura sticky dentro dele;
 *  - a partir de 1024 px, quem prende é a seção inteira (data-furniture-track="section" no pai).
 * Com prefers-reduced-motion os trilhos voltam à altura natural (globals.css).
 */
export function FurnitureStage({ className }: { className?: string }) {
  return (
    <div data-furniture-track="stage" className="max-lg:h-[230svh]">
      {/* Moldura sticky da altura da tela: o palco fica centralizado nela enquanto o trilho passa. */}
      <div className="max-lg:sticky max-lg:top-(--header-h) max-lg:flex max-lg:h-[calc(100svh-var(--header-h))] max-lg:items-center">
        <div
          data-furniture-stage
          className={cn("relative mx-auto aspect-[4/5] w-full max-w-[34rem] max-lg:max-h-[calc(100svh-var(--header-h)-2rem)]", className)}
        >
          <FurnitureFallback data-furniture-fallback className="h-full w-full transition-opacity duration-700 ease-out" />
          <FurnitureCanvas />
        </div>
      </div>
    </div>
  );
}
