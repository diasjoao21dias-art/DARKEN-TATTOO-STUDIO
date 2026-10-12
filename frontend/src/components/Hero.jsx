import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useScroll } from "framer-motion";
import { ArrowDownRight } from "lucide-react";
import { AshCanvas } from "@/components/AshCanvas";
import { EASE } from "@/components/Reveal";
import { scrollToId } from "@/lib/scroll";

const LINES = [
  { t: "Marcas", c: "font-cond font-black uppercase tracking-tight" },
  { t: "que não", c: "font-display italic font-normal text-[var(--ash)] pl-[12%]" },
  { t: "se apagam.", c: "font-cond font-black uppercase tracking-tight" },
];

const Line = ({ t, c, i }) => (
  <span className="block overflow-hidden pb-[0.04em]">
    <motion.span
      className={`block ${c}`}
      initial={{ y: "110%", rotate: 4 }}
      animate={{ y: "0%", rotate: 0 }}
      transition={{ duration: 1.3, delay: 0.25 + i * 0.16, ease: EASE }}
    >
      {t}
    </motion.span>
  </span>
);

const TiltFrame = () => {
  const mx = useMotionValue(0.5), my = useMotionValue(0.5);
  const rx = useSpring(useTransform(my, [0, 1], [8, -8]), { stiffness: 120, damping: 18 });
  const ry = useSpring(useTransform(mx, [0, 1], [-10, 10]), { stiffness: 120, damping: 18 });
  const lx = useTransform(mx, (v) => `${v * 100}%`), ly = useTransform(my, (v) => `${v * 100}%`);
  const light = useTransform([lx, ly], ([x, y]) => `radial-gradient(circle at ${x} ${y}, transparent 0%, rgba(8,8,10,.25) 25%, rgba(8,8,10,.9) 62%)`);
  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width);
    my.set((e.clientY - r.top) / r.height);
  };
  return (
    <motion.div
      data-testid="hero-tilt-frame"
      onMouseMove={onMove}
      onMouseLeave={() => { mx.set(0.5); my.set(0.5); }}
      initial={{ clipPath: "inset(100% 0 0 0)" }}
      animate={{ clipPath: "inset(0% 0 0 0)" }}
      transition={{ duration: 1.6, delay: 0.5, ease: EASE }}
      style={{ perspective: 900 }}
      className="relative w-full h-full"
    >
      <motion.div style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }} className="relative w-full h-full clip-blade">
        <img src="/img/g6.jpg" alt="Tatuagem blackwork nas costas" className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 scale-110" />
        <motion.div className="absolute inset-0" style={{ background: light }} />
        <div className="absolute bottom-5 left-5 font-mono text-[11px] tracking-[0.3em] text-[var(--bone)]" style={{ transform: "translateZ(40px)" }}>
          FIG. 01 — BLACKWORK
        </div>
      </motion.div>
    </motion.div>
  );
};

export const Hero = () => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "35%"]);
  const yImg = useTransform(scrollYProgress, [0, 1], ["0%", "-18%"]);
  return (
    <section id="topo" ref={ref} data-testid="hero-section" className="relative min-h-[100svh] overflow-hidden pt-28 pb-10">
      <AshCanvas />
      <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 70% 40%, rgba(193,39,45,.10), transparent 55%)" }} />
      <div className="relative max-w-[1500px] mx-auto px-5 sm:px-10 grid lg:grid-cols-12 gap-10 lg:gap-6 items-end min-h-[calc(100svh-10rem)]">
        <motion.div style={{ y: yText }} className="lg:col-span-8 relative z-10">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1, duration: 1 }} className="font-mono text-xs tracking-[0.3em] uppercase text-[var(--ash)] mb-8 flex items-center gap-4">
            <span className="w-2 h-2 bg-[var(--blood)] animate-pulse" /> Monte Carmelo — MG · Agenda aberta
          </motion.div>
          <h1 data-testid="hero-title" className="text-[17vw] sm:text-[13vw] lg:text-[9.6vw] xl:text-[150px] leading-[0.86] text-[var(--bone)]">
            {LINES.map((l, i) => <Line key={l.t} {...l} i={i} />)}
          </h1>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 1, ease: EASE }} className="mt-10 flex flex-col sm:flex-row sm:items-end gap-8 sm:gap-14">
            <p className="max-w-sm text-sm sm:text-base font-light leading-relaxed text-[var(--ash)]">
              Tatuagem autoral feita à mão para quem carrega histórias na pele. Cada traço nasce de um desenho exclusivo — nunca repetido.
            </p>
            <button data-testid="hero-cta-btn" onClick={() => scrollToId("solicitar")} className="group inline-flex items-center gap-4 bg-[var(--bone)] text-[var(--void)] pl-6 pr-4 py-4 font-mono text-xs tracking-[0.2em] uppercase hover:bg-[var(--blood)] hover:text-[var(--bone)] transition-colors duration-300 self-start">
              Solicitar desenho
              <ArrowDownRight className="w-5 h-5 transition-transform duration-300 group-hover:rotate-[-45deg]" />
            </button>
          </motion.div>
        </motion.div>
        <motion.div style={{ y: yImg }} className="lg:col-span-4 relative h-[58vh] sm:h-[62vh] lg:h-[72vh]">
          <TiltFrame />
        </motion.div>
      </div>
      <div className="relative max-w-[1500px] mx-auto px-5 sm:px-10 mt-10 flex justify-between font-mono text-[11px] tracking-[0.25em] text-[var(--ash)] uppercase">
        <span>18°43′S · 47°29′W</span>
        <span className="hidden sm:inline">Role para descobrir ↓</span>
        <span>Est. Darken</span>
      </div>
    </section>
  );
};
