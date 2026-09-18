import { describe, expect, it } from "vitest";
import { buildWhatsAppMessage, buildWhatsAppUrl } from "./whatsapp";

describe("buildWhatsAppMessage", () => {
  it("formata rótulos em negrito, um por linha, após o título", () => {
    const msg = buildWhatsAppMessage("Olá! Gostaria de solicitar um projeto.", [
      { label: "Nome", value: "João Conceição" },
      { label: "Prazo", value: "Até 3 meses" },
    ]);
    expect(msg).toBe("Olá! Gostaria de solicitar um projeto.\n\n*Nome:* João Conceição\n*Prazo:* Até 3 meses");
  });

  it("junta seleção múltipla com vírgulas", () => {
    const msg = buildWhatsAppMessage("t", [{ label: "Ambientes", value: ["Cozinha", "Closet", "Residência Completa"] }]);
    expect(msg).toContain("*Ambientes:* Cozinha, Closet, Residência Completa");
  });

  it("omite campos vazios, nulos ou só com espaços", () => {
    const msg = buildWhatsAppMessage("t", [
      { label: "Nome", value: "Ana" },
      { label: "Metragem", value: "   " },
      { label: "Escritório", value: null },
      { label: "Ambientes", value: [] },
    ]);
    expect(msg).toBe("t\n\n*Nome:* Ana");
  });
});

describe("buildWhatsAppUrl", () => {
  it("codifica acentos, quebras de linha e asteriscos sem perder conteúdo", () => {
    const message = "Olá!\n\n*Cidade/Estado:* Goiânia/GO & região";
    const url = buildWhatsAppUrl("5562998008080", message);
    expect(url.startsWith("https://wa.me/5562998008080?text=")).toBe(true);
    expect(url).not.toMatch(/[\n &]text|\s/);
    expect(decodeURIComponent(url.split("?text=")[1])).toBe(message);
  });

  it("aceita telefone formatado e mantém só os dígitos", () => {
    expect(buildWhatsAppUrl("+55 (62) 99800-8080", "oi")).toBe("https://wa.me/5562998008080?text=oi");
  });

  it("rejeita telefone sem DDI/DDD", () => {
    expect(() => buildWhatsAppUrl("99800-8080", "oi")).toThrow(/inválido/);
  });
});
