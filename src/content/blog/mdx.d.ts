// Os artigos exportam `meta` além do componente padrão (tipado por @types/mdx).
declare module "*.mdx" {
  export const meta: import("./registry").PostMeta;
}
