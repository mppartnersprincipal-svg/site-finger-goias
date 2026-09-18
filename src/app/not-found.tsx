import { Button } from "@/components/ui/Button";
import { Container, Eyebrow } from "@/components/ui/primitives";

export default function NotFound() {
  return (
    <Container className="flex min-h-[60svh] flex-col items-start justify-center gap-6 py-section">
      <Eyebrow className="text-dark-olive">Erro 404</Eyebrow>
      <h1 className="max-w-[18ch] text-[clamp(2.5rem,5vw,4.25rem)]">Este ambiente ainda não foi projetado</h1>
      <p className="max-w-[52ch] text-lg text-dark-olive">
        A página que você procura não existe ou mudou de endereço. Que tal voltar ao início ou conhecer os nossos
        ambientes?
      </p>
      <div className="flex flex-wrap gap-3">
        <Button href="/" size="lg">
          Voltar ao início
        </Button>
        <Button href="/ambientes" variant="secondary" size="lg">
          Ver ambientes
        </Button>
      </div>
    </Container>
  );
}
