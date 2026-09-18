/**
 * Planta baixa ilustrativa do passo "Briefing". Substitui, de forma gráfica, as fotos de
 * atendimento que ainda não existem no acervo. Cada traço tem data-draw para a animação de
 * desenho (DrawSVG) — sem JS, a planta aparece completa.
 */
export function FloorPlan({ className }: { className?: string }) {
  const label = "fill-dark-olive font-heading text-[9px] font-semibold tracking-[0.12em] uppercase";
  return (
    <svg
      viewBox="0 0 400 300"
      role="img"
      aria-label="Planta baixa ilustrativa de um apartamento com cozinha, estar e suíte, com cotas de medida"
      className={className}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* paredes */}
      <g stroke="#252422" strokeWidth="3">
        <path data-draw d="M20 20H380V280H20Z" />
        <path data-draw d="M240 20V150M240 196V280" />
        <path data-draw d="M240 170H330M366 170H380" />
      </g>
      {/* marcenaria */}
      <g stroke="#252422" strokeWidth="1.25">
        <path data-draw d="M28 28H196V62H62V132H28Z" />
        <path data-draw d="M96 96H176V132H96Z" />
        <path data-draw d="M52 214H168V254H52ZM52 226H168" />
        <path data-draw d="M196 206H226V262H196Z" />
        <path data-draw d="M270 36H362V128H270ZM270 58H362M282 40H308V54H282ZM324 40H350V54H324Z" />
        <path data-draw d="M248 254H372V272H248ZM279 254V272M310 254V272M341 254V272" />
        <path data-draw d="M248 178H318V196H248Z" />
      </g>
      {/* portas e tapete */}
      <g stroke="#403D39" strokeOpacity=".6" strokeWidth="1" strokeDasharray="3 3">
        <path data-draw d="M240 196A46 46 0 0 0 194 150" />
        <path data-draw d="M330 170A36 36 0 0 1 366 206" />
        <path data-draw d="M40 200H186V268H40Z" />
      </g>
      {/* cotas */}
      <g stroke="#C44E2A" strokeWidth="1.25">
        <path data-draw d="M20 294H380M20 289V299M380 289V299" />
        <path data-draw d="M392 20V280M387 20H397M387 280H397" />
      </g>
      <g className={label}>
        <text x="112" y="84">Cozinha</text>
        <text x="86" y="190">Estar</text>
        <text x="296" y="150">Suíte</text>
      </g>
    </svg>
  );
}
