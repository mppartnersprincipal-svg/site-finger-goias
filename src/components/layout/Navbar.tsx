"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/cn";
import { site } from "@/content/site";

const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  // DS: após 8 px de scroll o header vira Floral 82% + blur 12 px com borda Timberwolf 50%.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Fecha o menu ao navegar.
  useEffect(() => dialogRef.current?.close(), [pathname]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-(--header-h) border-b transition-[background-color,border-color,backdrop-filter] duration-320 ease-out",
        scrolled
          ? "border-neutral-timberwolf/50 bg-neutral-floral/82 backdrop-blur-[12px]"
          : "border-transparent bg-neutral-floral",
      )}
    >
      <div className="mx-auto flex h-full max-w-container items-center justify-between gap-8 px-gutter">
        <div className="h-7 md:h-8">
          <Logo />
        </div>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-8">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  aria-current={isActive(pathname, item.href) ? "page" : undefined}
                  className="link-underline py-2 font-heading text-sm font-semibold text-dark-eerie hover:text-primary-flame aria-[current=page]:text-primary-flame"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          <Button href={site.cta.href} aria-label={site.cta.label} className="max-sm:hidden">
            <span className="xl:hidden">{site.cta.short}</span>
            <span className="hidden xl:inline">{site.cta.label}</span>
          </Button>
          <button
            type="button"
            aria-label="Abrir menu"
            aria-haspopup="dialog"
            aria-controls="menu-mobile"
            onClick={() => {
              dialogRef.current?.showModal();
              document.documentElement.classList.add("dialog-open");
            }}
            className="-mr-2 inline-flex size-11 items-center justify-center rounded-md text-dark-eerie transition-colors duration-180 ease-out hover:bg-neutral-timberwolf/20 lg:hidden"
          >
            <Menu aria-hidden size={24} strokeWidth={1.5} />
          </button>
        </div>
      </div>

      {/* <dialog> modal: foco preso, Esc fecha e o restante da página fica inerte, nativamente. */}
      <dialog
        ref={dialogRef}
        id="menu-mobile"
        onClick={(event) => {
          if ((event.target as Element).closest("a[href]")) dialogRef.current?.close();
        }}
        onClose={() => document.documentElement.classList.remove("dialog-open")}
        aria-label="Menu"
        data-lenis-prevent
        className="menu-dialog m-0 h-dvh max-h-none w-screen max-w-none bg-neutral-floral text-dark-eerie backdrop:bg-transparent"
      >
        <div className="flex h-full flex-col px-gutter pb-[max(2rem,env(safe-area-inset-bottom))]">
          <div className="flex h-(--header-h) shrink-0 items-center justify-between">
            <div className="h-7">
              <Logo />
            </div>
            <button
              type="button"
              aria-label="Fechar menu"
              onClick={() => dialogRef.current?.close()}
              className="-mr-2 inline-flex size-11 items-center justify-center rounded-md transition-colors duration-180 ease-out hover:bg-neutral-timberwolf/20"
            >
              <X aria-hidden size={24} strokeWidth={1.5} />
            </button>
          </div>

          <nav aria-label="Principal (menu)" className="flex flex-1 flex-col justify-center">
            <ul className="flex flex-col">
              {site.nav.map((item, i) => (
                <li key={item.href} className="menu-item border-b border-neutral-timberwolf/50" style={{ "--i": i } as React.CSSProperties}>
                  <Link
                    href={item.href}
                    aria-current={isActive(pathname, item.href) ? "page" : undefined}
                    className="flex min-h-16 items-center font-heading text-[clamp(1.75rem,7vw,2.5rem)] leading-tight font-bold tracking-tight aria-[current=page]:text-primary-flame"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex flex-col gap-4">
            <Button href={site.cta.href} size="lg" className="w-full">
              {site.cta.label}
            </Button>
            <p className="text-center text-sm text-dark-olive">
              {site.showroom.label} · {site.showroom.phoneDisplay}
            </p>
          </div>
        </div>
      </dialog>
    </header>
  );
}
