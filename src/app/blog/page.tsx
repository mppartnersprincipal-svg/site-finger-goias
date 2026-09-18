import type { Metadata } from "next";
import Link from "next/link";
import { Picture } from "@/components/media/Picture";
import { FinalCta } from "@/components/sections/HomeSections";
import { PageHeader } from "@/components/sections/PageHeader";
import { JsonLd } from "@/components/ui/JsonLd";
import { Section } from "@/components/ui/primitives";
import { formatDate, posts } from "@/content/blog/registry";
import { breadcrumbLd } from "@/lib/seo/jsonld";

export const metadata: Metadata = {
  title: "Blog: inspirações e design para viver bem",
  description:
    "Dicas de organização, tendências de arquitetura e conteúdos sobre como o design impacta o seu bem-estar diário.",
  alternates: { canonical: "/blog" },
};

export default function BlogPage() {
  return (
    <>
      <JsonLd data={breadcrumbLd([{ name: "Blog", path: "/blog" }])} />
      <PageHeader
        eyebrow="Blog / Inspirações"
        title="Inspirações & design para viver bem"
        lead="Dicas de organização, tendências de arquitetura e conteúdos sobre como o design impacta o seu bem-estar diário."
      />
      <Section className="pt-0">
        <ul className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <li key={post.slug}>
              <Link href={`/blog/${post.slug}`} className="group flex flex-col gap-4">
                <div className="aspect-[16/9] overflow-hidden rounded-md bg-neutral-timberwolf/30 shadow-sm transition-shadow duration-320 ease-out group-hover:shadow-md">
                  <Picture
                    id={post.cover}
                    alt=""
                    priority={i === 0}
                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                    imgClassName="transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <p className="font-heading text-xs font-semibold tracking-wide text-dark-olive uppercase">
                    <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readingMinutes} min de leitura
                  </p>
                  <h2 className="text-2xl transition-colors duration-180 ease-out group-hover:text-primary-flame">{post.title}</h2>
                  <p className="text-dark-olive">{post.description}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
      <FinalCta />
    </>
  );
}
