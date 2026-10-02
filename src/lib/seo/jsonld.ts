import { site } from "@/content/site";
import { fallbackSrc, media } from "@/lib/media";

const abs = (path: string) => new URL(path, site.url).toString();

/** Loja (showroom de Goiânia). Só campos com fonte confirmada: sem horário, nota ou avaliações. */
export function storeLd() {
  const { showroom } = site;
  return {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    "@id": abs("/#loja"),
    name: site.name,
    description: site.description,
    url: site.url,
    image: abs(fallbackSrc(media("sa-gourmet-7844"), 1280)),
    telephone: `+${showroom.whatsapp}`,
    foundingDate: String(site.since),
    address: {
      "@type": "PostalAddress",
      streetAddress: `${showroom.street} - ${showroom.complement}`,
      addressLocality: showroom.city,
      addressRegion: showroom.state,
      addressCountry: "BR",
    },
    areaServed: { "@type": "State", name: "Goiás" },
    sameAs: [site.social.instagram],
  };
}

export function breadcrumbLd(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Início", path: "/" }, ...trail].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: abs(item.path),
    })),
  };
}
