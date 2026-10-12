import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Reveal, Eyebrow } from "@/components/Reveal";

const PILLARS = [
  ["Autoral", "Nenhum desenho sai da gaveta. Cada projeto é criado do zero a partir da sua história."],
  ["Biossegurança", "Material descartável, ambiente esterilizado e cuidado em cada etapa da sessão."],
  ["Sem pressa", "Sessões com hora marcada e atenção total. Tatuagem é ritual, não linha de produção."],
];

export const About = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-12%", "12%"]);
  return (
    <section id="artista" ref={ref} data-testid="about-section" className="relative py-28 sm:py-40">
      <div className="max-w-[1500px] mx-auto px-5 sm:px-10 grid lg:grid-cols-12 gap-14 lg:gap-10">
        <div className="lg:col-span-5 relative">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden clip-notch group">
              <motion.img style={{ y }} src="/img/artist.jpg" alt="Retrato do tatuador" className="absolute inset-0 w-full h-[124%] -top-[12%] object-cover photo-treat" />
              <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 45% 30%, transparent 25%, rgba(8,8,10,.85) 80%)" }} />
              <span className="absolute top-5 right-5 font-mono text-[11px] tracking-[0.3em] text-[var(--bone)]">FIG. 02</span>
            </div>
          </Reveal>
          <div className="hidden lg:block absolute -right-6 bottom-10 font-mono text-[11px] tracking-[0.35em] text-[var(--ash)] [writing-mode:vertical-rl]">RETRATO — O ARTISTA</div>
        </div>
        <div className="lg:col-span-6 lg:col-start-7 flex flex-col justify-center">
          <Reveal><Eyebrow n="01">O Artista</Eyebrow></Reveal>
          <Reveal delay={0.1}>
            <h2 className="mt-8 text-4xl sm:text-6xl lg:text-7xl leading-[0.95]">
              <span className="font-cond font-extrabold uppercase block">Tinta, agulha</span>
              <span className="font-display italic text-[var(--ash)] block">& paciência.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-10 text-base sm:text-lg font-light leading-relaxed text-[var(--ash)] max-w-xl">
              <span className="text-[var(--bone)]">[Nome do artista]</span> fundou o Darken Tattoo Studio em Monte Carmelo para fazer tatuagem do jeito que acredita:
              com desenho próprio, contraste forte e respeito pela pele de quem senta na cadeira. Do blackwork denso ao fine line delicado,
              o traço é sempre pensado para envelhecer bem.
            </p>
          </Reveal>
          <div className="mt-14 grid sm:grid-cols-3 border-t border-[var(--line)]">
            {PILLARS.map(([t, d], i) => (
              <Reveal key={t} delay={0.1 * i} className={`py-8 sm:pr-6 ${i ? "sm:pl-6 sm:border-l border-t sm:border-t-0 border-[var(--line)]" : ""}`}>
                <div className="font-mono text-xs text-[var(--blood)] tracking-[0.25em]">0{i + 1}</div>
                <div className="mt-3 font-cond font-bold text-2xl uppercase tracking-wide">{t}</div>
                <p className="mt-3 text-sm text-[var(--ash)] leading-relaxed">{d}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
