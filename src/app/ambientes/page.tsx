import type { Metadata } from "next";
import { FilterableGrid, type GridItem } from "@/components/media/FilterableGrid";
import { Picture } from "@/components/media/Picture";
import { FinalCta } from "@/components/sections/HomeSections";
import { PageHeader } from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/Button";
import { Section, SectionHeading } from "@/components/ui/primitives";
import { activeCategories, categories, projects } from "@/content/projects";

export const metadata: Metadata = {
  title: "Ambientes planejados: cozinhas, dormitórios, salas e closets",
  description:
    "Navegue pelo portfólio da Finger por categoria e veja como a iluminação, os materiais nobres e o design personalizado enriquecem cada ambiente.",
  alternates: { canonical: "/ambientes" },
};

const labelOf = (id: string) => categories.find((c) => c.id === id)?.label ?? id;

export default function AmbientesPage() {
  // Intercala os projetos para a grade "Todos" não abrir com 20 fotos do mesmo empreendimento.
  const longest = Math.max(...projects.map((p) => p.photos.length));
  const items: GridItem[] = [];
  for (let i = 0; i < longest; i++)
    for (const project of projects) {
      const photo = project.photos[i];
      if (!photo) continue;
      items.push({
        key: photo.id,
        title: photo.title,
        category: photo.category,
        categoryLabel: labelOf(photo.category),
        project: project.name,
        href: `/ambientes/${project.slug}`,
        // A primeira foto da grade é o LCP da página; o restante da primeira fileira carrega sem lazy.
        picture: (
          <Picture
            id={photo.id}
            priority={items.length === 0}
            eager={items.length < 3}
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        ),
      });
    }

  return (
    <>
      <PageHeader
        eyebrow="Ambientes"
        title="A estética do conforto em cada espaço"
        lead="Navegue por nossas categorias e descubra como a iluminação natural, os materiais nobres e o design personalizado enriquecem cada ambiente."
      />

      <Section className="pt-0">
        <FilterableGrid items={items} filters={activeCategories.map(({ id, label }) => ({ id, label }))} />
      </Section>

      <Section tone="muted" aria-labelledby="projetos-titulo">
        <div className="flex flex-col gap-12">
          <SectionHeading
            eyebrow="Projetos"
            title={<span id="projetos-titulo">Veja cada projeto por inteiro</span>}
            lead="Ergonomia pensada para o uso diário, aproveitamento inteligente de espaço e acabamentos de altíssima precisão."
          />
          <ul className="grid gap-8 sm:grid-cols-2">
            {projects.map((project) => (
              <li key={project.slug} className="flex flex-col gap-4">
                <div className="aspect-[16/9] overflow-hidden rounded-md bg-neutral-timberwolf/30 shadow-sm">
                  <Picture id={project.cover} sizes="(min-width: 640px) 50vw, 100vw" />
                </div>
                <div className="flex flex-col items-start gap-2">
                  <h3 className="text-2xl">{project.name}</h3>
                  <p className="max-w-[52ch] text-dark-olive">{project.summary}</p>
                  <Button href={`/ambientes/${project.slug}`} variant="ghost">
                    Ver detalhes do projeto e iluminação
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <FinalCta />
    </>
  );
}
