// Leads vão só para o WhatsApp: o formulário monta uma mensagem pré-preenchida e abre wa.me.

export type WhatsAppField = { label: string; value: string | string[] | null | undefined };

/** Mensagem no formato do WhatsApp: título, linha em branco e um "*Rótulo:* valor" por linha. */
export function buildWhatsAppMessage(title: string, fields: WhatsAppField[]): string {
  const lines = fields
    .map(({ label, value }) => {
      const text = (Array.isArray(value) ? value.join(", ") : (value ?? "")).trim();
      return text ? `*${label}:* ${text}` : null;
    })
    .filter((line): line is string => line !== null);
  return [title.trim(), "", ...lines].join("\n");
}

/** `phone` só com dígitos, com DDI (ex.: 5562998008080). */
export function buildWhatsAppUrl(phone: string, message: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 12) throw new Error(`Telefone de WhatsApp inválido: "${phone}"`);
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
