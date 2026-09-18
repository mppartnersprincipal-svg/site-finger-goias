import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Gallery, type GalleryPhoto } from "@/components/media/Gallery";
import { Picture } from "@/components/media/Picture";
import { StoriesReel } from "@/components/media/StoriesReel";
import { FinalCta } from "@/components/sections/HomeSections";
import { PageHeader } from "@/components/sections/PageHeader";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { Container, Section } from "@/components/ui/primitives";
import { getProject, projects } from "@/content/projects";
import { fallbackSrc, media, srcSet } from "@/lib/media";
import { breadcrumbLd } from "@/lib/seo/jsonld";

export const dynamicParams = false;
export const generateStaticParams = () => projects.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: PageProps<"/ambientes/[slug]">): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) return {};
  const cover = media(project.cover);
  return {
    title: `${project.name}: ambientes planejados Finger`,
    description: project.summary,
    alternates: { canonical: `/ambientes/${project.slug}` },
    openGraph: { images: [{ url: fallbackSrc(cover, 1280), alt: cover.alt }] },
  };
}

export default async function ProjectPage({ params }: PageProps<"/ambientes/[slug]">) {
  const project = getProject((await params).slug);
  if (!project) notFound();

  // A capa abre a página; a galeria traz as demais fotos.
  const photos: GalleryPhoto[] = project.photos
    .filter((photo) => photo.id !== project.cover)
    .map((photo) => {
      const entry = media(photo.id);
      return {
        key: photo.id,
        title: photo.title,
        alt: entry.alt,
        width: entry.width,
        height: entry.height,
        avif: srcSet(entry.sources.avif),
        webp: srcSet(entry.sources.webp),
        src: fallbackSrc(entry, 1920),
        thumb: <Picture id={photo.id} alt="" sizes="(min-width: 1024px) 66vw, (min-width: 640px) 50vw, 100vw" />,
      };
    });

  return (
    <>
      <JsonLd
        data={breadcrumbLd([
          { name: "Ambientes", path: "/ambientes" },
          { name: project.name, path: `/ambientes/${project.slug}` },
        ])}
      />
      <PageHeader eyebrow={project.kind} title={project.name} lead={project.summary}>
        <Button href="/ambientes" variant="secondary" size="sm">
          Todos os ambientes
        </Button>
      </PageHeader>

      {project.photos.length > 0 && (
        <Container>
          <div className="aspect-[4/3] overflow-hidden rounded-md shadow-lg sm:aspect-[16/9]">
            <Picture id={project.cover} priority sizes="(min-width: 1280px) 1152px, 100vw" />
          </div>
        </Container>
      )}

      {photos.length > 0 && (
        <Section aria-label="Galeria do projeto">
          <Gallery photos={photos} />
        </Section>
      )}

      {project.reels && (
        <section className="overflow-hidden pb-section" aria-label="Vídeos do projeto">
          <StoriesReel
            items={project.reels.map((reel) => ({
              src: reel.src,
              title: reel.title,
              poster: <Picture id={reel.poster} alt="" sizes="(min-width: 640px) 304px, 62vw" className="absolute inset-0" />,
            }))}
          />
        </section>
      )}

      <FinalCta
        title="Gostou deste projeto?"
        lead="Conte como é o seu espaço. A gente desenha um ambiente com a mesma precisão, do seu jeito."
      />
    </>
  );
}
