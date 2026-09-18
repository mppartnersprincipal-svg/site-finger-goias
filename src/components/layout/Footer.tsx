import Link from "next/link";
import { InstagramIcon } from "@/components/ui/icons";
import { Logo } from "@/components/ui/Logo";
import { Container } from "@/components/ui/primitives";
import { site } from "@/content/site";

// Flame sobre Eerie dá 3,33:1 (reprova AA em texto pequeno): o hover dos links é Floral 100%
// com sublinhado, e não Flame como no Footer.jsx de referência do DS.
const linkClass =
  "link-underline inline-flex min-h-8 items-center py-1 text-neutral-floral/70 hover:text-neutral-floral";

const ColumnTitle = ({ children }: { children: React.ReactNode }) => (
  <h2 className="mb-4 font-heading text-xs leading-snug font-semibold tracking-wide text-neutral-timberwolf uppercase">
    {children}
  </h2>
);

export function Footer() {
  const { showroom, factory } = site;
  return (
    <footer data-hide-wa className="on-dark bg-dark-eerie text-neutral-floral">
      <Container className="grid gap-12 pt-24 pb-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1.2fr_1.2fr]">
        <div className="flex flex-col items-start gap-6">
          <div className="h-10">
            <Logo inverse />
          </div>
          <p className="max-w-[34ch] text-neutral-floral/80">
            Móveis planejados com precisão alemã, feitos para quem valoriza conforto, elegância e bem-estar.
          </p>
          <p className="inline-flex items-center gap-2.5 rounded-sm border border-dark-olive px-3 py-2 font-heading text-xs font-semibold tracking-wide uppercase">
            <span aria-hidden className="size-2.5 rounded-[0_100%_0_0] bg-primary-flame" />
            Origem alemã · Desde {site.since}
          </p>
        </div>

        <nav aria-label="Rodapé">
          <ColumnTitle>Navegação</ColumnTitle>
          <ul className="flex flex-col">
            {site.nav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={linkClass}>
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <Link href={site.cta.href} className={linkClass}>
                Orçamento e contato
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <ColumnTitle>{showroom.label}</ColumnTitle>
          <address className="flex flex-col gap-1 text-neutral-floral/80 not-italic">
            <span>{showroom.street}</span>
            <span>{showroom.complement}</span>
            <span>
              {showroom.district}, {showroom.city} - {showroom.state}
            </span>
            <a href={`https://wa.me/${showroom.whatsapp}`} className={linkClass}>
              {showroom.phoneDisplay}
            </a>
            <a href={showroom.mapsUrl} target="_blank" rel="noopener noreferrer" className={linkClass}>
              Ver no mapa
            </a>
          </address>
        </div>

        <div>
          <ColumnTitle>Fábrica</ColumnTitle>
          <address className="flex flex-col gap-1 text-neutral-floral/80 not-italic">
            <span>{factory.street}</span>
            <span>
              {factory.city} - {factory.state}
            </span>
            <a href={`mailto:${factory.email}`} className={linkClass}>
              {factory.email}
            </a>
          </address>
          <a
            href={site.social.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className={`${linkClass} mt-4 gap-2`}
          >
            <InstagramIcon aria-hidden size={20} />
            @fingergoias
          </a>
        </div>
      </Container>

      <Container>
        <div className="flex flex-col gap-2 border-t border-dark-olive py-6 text-sm text-neutral-floral/70 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. Todos os direitos reservados.
          </p>
          <Link href="/politica-de-privacidade" className={linkClass}>
            Política de privacidade
          </Link>
        </div>
      </Container>
    </footer>
  );
}
