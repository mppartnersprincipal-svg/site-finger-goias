import { describe, expect, it } from "vitest";
import { isBudgetClick } from "./budget-link";

const ORIGIN = "https://fingergoias.com.br";
const plain = { button: 0, metaKey: false, ctrlKey: false, shiftKey: false, altKey: false, defaultPrevented: false };

describe("isBudgetClick", () => {
  it("abre o pop-up no clique simples em link para /orcamento", () => {
    expect(isBudgetClick(plain, { href: "/orcamento" }, ORIGIN)).toBe(true);
    expect(isBudgetClick(plain, { href: `${ORIGIN}/orcamento?origem=hero#form` }, ORIGIN)).toBe(true);
  });

  it("ignora outros caminhos e outros domínios", () => {
    expect(isBudgetClick(plain, { href: "/ambientes" }, ORIGIN)).toBe(false);
    expect(isBudgetClick(plain, { href: "/orcamento-antigo" }, ORIGIN)).toBe(false);
    expect(isBudgetClick(plain, { href: "https://outro.site/orcamento" }, ORIGIN)).toBe(false);
    expect(isBudgetClick(plain, { href: null }, ORIGIN)).toBe(false);
  });

  it("respeita nova aba, botão do meio, teclas modificadoras e clique já tratado", () => {
    expect(isBudgetClick({ ...plain, ctrlKey: true }, { href: "/orcamento" }, ORIGIN)).toBe(false);
    expect(isBudgetClick({ ...plain, metaKey: true }, { href: "/orcamento" }, ORIGIN)).toBe(false);
    expect(isBudgetClick({ ...plain, shiftKey: true }, { href: "/orcamento" }, ORIGIN)).toBe(false);
    expect(isBudgetClick({ ...plain, button: 1 }, { href: "/orcamento" }, ORIGIN)).toBe(false);
    expect(isBudgetClick({ ...plain, defaultPrevented: true }, { href: "/orcamento" }, ORIGIN)).toBe(false);
    expect(isBudgetClick(plain, { href: "/orcamento", target: "_blank" }, ORIGIN)).toBe(false);
    expect(isBudgetClick(plain, { href: "/orcamento", download: true }, ORIGIN)).toBe(false);
  });
});
