import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Picture } from "@/components/media/Picture";
import { FinalCta } from "@/components/sections/HomeSections";
import { Button } from "@/components/ui/Button";
import { JsonLd } from "@/components/ui/JsonLd";
import { Container, Eyebrow } from "@/components/ui/primitives";
import { formatDate, getPost, posts } from "@/content/blog/registry";
import { fallbackSrc, media } from "@/lib/media";
import { articleLd, breadcrumbLd } from "@/lib/seo/jsonld";

export const dynamicParams = false;
export const generateStaticParams = () => posts.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const post = getPost((await params).slug);
  if (!post) return {};
  const cover = media(post.cover);
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      publishedTime: post.date,
      images: [{ url: fallbackSrc(cover, 1280), alt: cover.alt }],
    },
  };
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const post = getPost((await params).slug);
  if (!post) notFound();
  const { Content } = post;
  const image = fallbackSrc(media(post.cover), 1280);

  return (
    <>
      <JsonLd data={articleLd({ ...post, image })} />
      <JsonLd data={breadcrumbLd([{ name: "Blog", path: "/blog" }, { name: post.title, path: `/blog/${post.slug}` }])} />

      <article>
        <header className="pt-16 pb-10 md:pt-24">
          <Container className="flex max-w-4xl flex-col items-start gap-6">
            <Eyebrow className="hero-rise text-dark-olive">
              <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readingMinutes} min de leitura
            </Eyebrow>
            <h1 className="hero-rise text-[clamp(2.25rem,4.5vw,3.75rem)]" style={{ "--i": 1 } as React.CSSProperties}>
              {post.title}
            </h1>
            <p className="hero-rise max-w-[56ch] text-xl text-dark-olive" style={{ "--i": 2 } as React.CSSProperties}>
              {post.description}
            </p>
          </Container>
        </header>

        <Container className="max-w-5xl">
          <div className="aspect-[16/9] overflow-hidden rounded-md shadow-lg">
            <Picture id={post.cover} priority sizes="(min-width: 1024px) 960px, 100vw" />
          </div>
        </Container>

        <Container className="max-w-[46rem] py-12 md:py-16">
          <Content />
          <div className="mt-14 border-t border-neutral-timberwolf pt-8">
            <Button href="/blog" variant="secondary" size="sm">
              Todos os artigos
            </Button>
          </div>
        </Container>
      </article>

      <FinalCta />
    </>
  );
}
