"use client";

import { CircleCheck } from "lucide-react";
import { useId, useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/cn";
import { buildWhatsAppMessage, buildWhatsAppUrl, type WhatsAppField } from "@/lib/whatsapp";

export type FieldDef = {
  name: string;
  label: string;
  type: "text" | "email" | "tel" | "select" | "chips";
  required?: boolean;
  options?: string[];
  autoComplete?: string;
  placeholder?: string;
  hint?: string;
  /** Ocupa a linha inteira no grid de duas colunas. */
  wide?: boolean;
};

type Props = {
  /** Primeira linha da mensagem enviada ao WhatsApp. */
  intro: string;
  phone: string;
  fields: FieldDef[];
  submitLabel: string;
  tone?: "light" | "dark";
};

const control =
  "min-h-12 w-full rounded-md border bg-transparent px-4 font-body text-base transition-colors duration-180 ease-out placeholder:text-current/45";

/**
 * Formulário sem backend: monta a mensagem e abre a conversa no WhatsApp (único canal de leads).
 * A abertura acontece de forma síncrona dentro do submit, para não ser bloqueada como pop-up.
 */
export function WhatsAppForm({ intro, phone, fields, submitLabel, tone = "light" }: Props) {
  const uid = useId();
  const [chipError, setChipError] = useState<string | null>(null);
  const [sentUrl, setSentUrl] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const dark = tone === "dark";

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const missing = fields.find((f) => f.type === "chips" && f.required && data.getAll(f.name).length === 0);
    if (missing) {
      setChipError(missing.name);
      document.getElementById(`${uid}-${missing.name}`)?.querySelector("input")?.focus();
      return;
    }
    setChipError(null);

    const values: WhatsAppField[] = fields.map((f) => ({
      label: f.label,
      value: f.type === "chips" ? data.getAll(f.name).map(String) : String(data.get(f.name) ?? ""),
    }));
    const url = buildWhatsAppUrl(phone, buildWhatsAppMessage(intro, values));
    setAnswers(Object.fromEntries(fields.map((field) => [
      field.name,
      field.type === "chips" ? data.getAll(field.name).map(String) : String(data.get(field.name) ?? ""),
    ])));

    const win = window.open(url, "_blank");
    if (win) win.opener = null;
    else window.location.href = url; // pop-up bloqueado: segue na mesma aba
    setSentUrl(url);
  };

  if (sentUrl) {
    return (
      <div role="status" className={cn("flex flex-col items-start gap-4 rounded-md border p-8", dark ? "border-dark-olive" : "border-neutral-timberwolf")}>
        <CircleCheck aria-hidden size={28} strokeWidth={1.5} className="text-primary-flame" fill="currentColor" fillOpacity={0.15} />
        <h3 className="text-2xl">Sua mensagem está pronta no WhatsApp</h3>
        <p className={dark ? "text-neutral-floral/80" : "text-dark-olive"}>
          Abrimos a conversa com os seus dados preenchidos. É só tocar em enviar, e você pode anexar a planta do ambiente
          por lá. Se a janela não abriu, use o botão abaixo.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button href={sentUrl} target="_blank" rel="noopener noreferrer">
            Abrir WhatsApp
          </Button>
          <Button variant={dark ? "inverse" : "secondary"} onClick={() => setSentUrl(null)}>
            Editar respostas
          </Button>
        </div>
      </div>
    );
  }

  const borders = dark
    ? "border-dark-olive hover:border-neutral-timberwolf focus:border-neutral-floral"
    : "border-neutral-timberwolf hover:border-dark-olive focus:border-dark-eerie";

  return (
    <form onSubmit={onSubmit} className="grid gap-x-6 gap-y-6 sm:grid-cols-2">
      {fields.map((field) => {
        const id = `${uid}-${field.name}`;
        const answer = answers[field.name];
        const labelClass = "font-heading text-sm font-semibold";
        const mark = field.required ? (
          <span aria-hidden className="text-primary-flame"> *</span>
        ) : (
          <span className={cn("font-normal", dark ? "text-neutral-floral/60" : "text-dark-olive/80")}> (opcional)</span>
        );

        if (field.type === "chips") {
          const invalid = chipError === field.name;
          return (
            <fieldset key={field.name} id={id} className="flex flex-col gap-3 sm:col-span-2" aria-describedby={invalid ? `${id}-erro` : undefined}>
              <legend className={cn(labelClass, "mb-3")}>
                {field.label}
                {mark}
              </legend>
              <div className="flex flex-wrap gap-2">
                {field.options?.map((option) => (
                  <label
                    key={option}
                    className={cn(
                      "inline-flex min-h-11 cursor-pointer items-center rounded-md border px-4 font-heading text-sm font-semibold transition-colors duration-180 ease-out has-focus-visible:outline-2 has-focus-visible:outline-offset-3",
                      dark
                        ? "border-dark-olive has-checked:border-neutral-floral has-checked:bg-neutral-floral has-checked:text-dark-eerie has-focus-visible:outline-neutral-floral hover:border-neutral-timberwolf"
                        : "border-neutral-timberwolf has-checked:border-dark-eerie has-checked:bg-dark-eerie has-checked:text-neutral-floral has-focus-visible:outline-primary-flame hover:bg-neutral-timberwolf/20",
                    )}
                  >
                    <input type="checkbox" name={field.name} value={option} defaultChecked={Array.isArray(answer) && answer.includes(option)} className="sr-only" onChange={() => setChipError(null)} />
                    {option}
                  </label>
                ))}
              </div>
              {invalid && (
                <p id={`${id}-erro`} role="alert" className="text-sm text-primary-flame">
                  Selecione ao menos uma opção.
                </p>
              )}
            </fieldset>
          );
        }

        return (
          <div key={field.name} className={cn("flex flex-col gap-2", field.wide && "sm:col-span-2")}>
            <label htmlFor={id} className={labelClass}>
              {field.label}
              {mark}
            </label>
            {field.type === "select" ? (
              <select id={id} name={field.name} required={field.required} defaultValue={typeof answer === "string" ? answer : ""} className={cn(control, borders, "select-chevron appearance-none pr-11")}>
                <option value="" disabled>
                  Selecione
                </option>
                {field.options?.map((option) => (
                  <option key={option} value={option} className="text-dark-eerie">
                    {option}
                  </option>
                ))}
              </select>
            ) : (
              <input
                id={id}
                name={field.name}
                defaultValue={typeof answer === "string" ? answer : ""}
                type={field.type}
                required={field.required}
                autoComplete={field.autoComplete}
                placeholder={field.placeholder}
                inputMode={field.type === "tel" ? "tel" : undefined}
                aria-describedby={field.hint ? `${id}-dica` : undefined}
                className={cn(control, borders)}
              />
            )}
            {field.hint && (
              <p id={`${id}-dica`} className={cn("text-sm", dark ? "text-neutral-floral/70" : "text-dark-olive")}>
                {field.hint}
              </p>
            )}
          </div>
        );
      })}

      <div className="flex flex-col gap-4 sm:col-span-2">
        <Button type="submit" size="lg" className="w-full sm:w-auto sm:self-start">
          {submitLabel}
        </Button>
        <p className={cn("max-w-[60ch] text-sm", dark ? "text-neutral-floral/70" : "text-dark-olive")}>
          Ao enviar, você será direcionado ao WhatsApp da Finger com a mensagem preenchida. Seus dados não ficam
          armazenados neste site. Veja a nossa{" "}
          <a href="/politica-de-privacidade" className={cn("link-underline", dark ? "text-neutral-floral" : "text-primary-flame")}>
            política de privacidade
          </a>
          .
        </p>
      </div>
    </form>
  );
}
