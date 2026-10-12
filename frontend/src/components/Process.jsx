import { Reveal, Eyebrow } from "@/components/Reveal";

const STEPS = [
  { n: "I", t: "Ideia & referências", d: "Você envia o briefing pelo formulário: estilo, local do corpo, tamanho e até 3 imagens de referência.", img: "/img/machine.jpg", span: "lg:col-span-7" },
  { n: "II", t: "Desenho exclusivo", d: "O artista cria um projeto autoral, ajustado à anatomia e ao fluxo do seu corpo. Ajustes são conversados antes da sessão.", span: "lg:col-span-5" },
  { n: "III", t: "A sessão", d: "Hora marcada, ambiente reservado e materiais descartáveis. Você só precisa chegar descansado e alimentado.", span: "lg:col-span-5" },
  { n: "IV", t: "Cicatrização", d: "Orientações de cuidados e acompanhamento pós-sessão para a tatuagem cicatrizar com traço firme e preto profundo.", img: "/img/g10.jpg", span: "lg:col-span-7" },
];

const Cell = ({ s, i }) => (
  <Reveal delay={0.08 * i} className={`group relative bg-[var(--void)] overflow-hidden min-h-[320px] lg:min-h-[380px] ${s.span}`} data-testid={`process-step-${i + 1}`}>
    {s.img && (
      <>
        <img src={s.img} alt={s.t} loading="lazy" className="absolute inset-0 w-full h-full object-cover photo-treat opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#08080a] via-[#08080a]/80 to-transparent" />
      </>
    )}
    <div className="relative h-full p-7 sm:p-10 flex flex-col justify-between gap-10">
      <div className="flex items-start justify-between">
        <span className="font-display italic text-6xl sm:text-7xl text-[var(--blood)] leading-none">{s.n}</span>
        <span className="font-mono text-[11px] tracking-[0.3em] text-[var(--ash)]">ETAPA 0{i + 1}</span>
      </div>
      <div className="max-w-md">
        <h3 className="font-cond font-extrabold uppercase text-3xl sm:text-4xl tracking-wide">{s.t}</h3>
        <p className="mt-4 text-sm sm:text-base text-[var(--ash)] leading-relaxed">{s.d}</p>
      </div>
    </div>
    <span className="absolute bottom-0 left-0 h-[2px] w-full bg-[var(--blood)] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-700" />
  </Reveal>
);

export const Process = () => (
  <section id="ritual" data-testid="process-section" className="relative py-28 sm:py-40">
    <div className="max-w-[1500px] mx-auto px-5 sm:px-10">
      <div className="grid lg:grid-cols-12 gap-10 items-end">
        <div className="lg:col-span-7">
          <Reveal><Eyebrow n="03">Como funciona</Eyebrow></Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-8 text-4xl sm:text-6xl lg:text-7xl leading-[0.95]">
              <span className="font-display italic text-[var(--ash)]">O </span>
              <span className="font-cond font-extrabold uppercase">Ritual</span>
            </h2>
          </Reveal>
        </div>
        <Reveal delay={0.2} className="lg:col-span-5">
          <p className="text-base sm:text-lg font-light text-[var(--ash)] leading-relaxed">Quatro etapas entre a primeira ideia e a pele cicatrizada. Sem pressa, sem atalhos.</p>
        </Reveal>
      </div>
      <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-px bg-[var(--line)] border border-[var(--line)]">
        {STEPS.map((s, i) => <Cell key={s.n} s={s} i={i} />)}
      </div>
    </div>
  </section>
);
