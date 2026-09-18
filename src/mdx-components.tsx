import type { MDXComponents } from "mdx/types";
import Link from "next/link";

// Tipografia dos artigos do blog, conforme o DS (type-body: corpo 18px/1.7, medida ~60ch,
// itálico para citações curtas). Exigido pelo @next/mdx no App Router.
const components: MDXComponents = {
  h2: (props) => <h2 className="mt-14 mb-4 text-[clamp(1.5rem,2.6vw,2rem)]" {...props} />,
  h3: (props) => <h3 className="mt-10 mb-3 text-xl font-semibold" {...props} />,
  p: (props) => <p className="my-5 text-lg text-dark-eerie" {...props} />,
  ul: (props) => <ul className="my-5 flex list-disc flex-col gap-2 pl-6 text-lg marker:text-primary-flame" {...props} />,
  ol: (props) => <ol className="my-5 flex list-decimal flex-col gap-2 pl-6 text-lg marker:font-heading marker:font-semibold marker:text-primary-flame" {...props} />,
  strong: (props) => <strong className="font-semibold text-dark-eerie" {...props} />,
  blockquote: (props) => (
    <blockquote className="my-8 border-l-2 border-primary-flame pl-6 text-xl text-dark-olive italic [&>p]:text-xl [&>p]:text-dark-olive" {...props} />
  ),
  a: ({ href = "", ...props }) =>
    href.startsWith("/") ? (
      <Link href={href} className="link-underline text-primary-flame" {...props} />
    ) : (
      <a href={href} target="_blank" rel="noopener noreferrer" className="link-underline text-primary-flame" {...props} />
    ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
