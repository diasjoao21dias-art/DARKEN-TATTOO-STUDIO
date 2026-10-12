const WORDS = ["Blackwork", "Fine Line", "Neo Tradicional", "Realismo", "Lettering", "Projetos Autorais", "Monte Carmelo — MG"];

const Row = () => (
  <div className="flex items-center shrink-0">
    {WORDS.map((w, i) => (
      <span key={w} className="flex items-center">
        <span className={`px-8 sm:px-12 text-5xl sm:text-7xl lg:text-8xl whitespace-nowrap ${i % 2 ? "font-display italic text-[var(--ash)]" : "font-cond font-extrabold uppercase outline-text"}`}>{w}</span>
        <svg viewBox="0 0 20 20" className="w-5 h-5 text-[var(--blood)] shrink-0" aria-hidden="true"><path d="M10 0L12 8L20 10L12 12L10 20L8 12L0 10L8 8Z" fill="currentColor" /></svg>
      </span>
    ))}
  </div>
);

export const Marquee = () => (
  <section data-testid="editorial-marquee" className="relative border-y border-[var(--line)] py-8 sm:py-10 overflow-hidden">
    <div className="marquee-track flex w-max">
      <Row />
      <Row />
    </div>
  </section>
);
