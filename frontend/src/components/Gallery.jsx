import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { Reveal, Eyebrow, EASE } from "@/components/Reveal";
import { Lightbox } from "@/components/Lightbox";

export const WORKS = [
  { src: "/img/g6.jpg", title: "Ornamento Dorsal", style: "Blackwork", place: "Costas", span: "lg:col-span-5 lg:row-span-2" },
  { src: "/img/g7.jpg", title: "Gueixa", style: "Neo Tradicional", place: "Mão", span: "lg:col-span-4" },
  { src: "/img/g2.jpg", title: "Mariposa", style: "Blackwork", place: "Antebraço", span: "lg:col-span-3" },
  { src: "/img/g4.jpg", title: "Love Letter", style: "Fine Line", place: "Braço", span: "lg:col-span-3" },
  { src: "/img/g5.jpg", title: "Sinfonia", style: "Fine Line", place: "Bíceps", span: "lg:col-span-4" },
  { src: "/img/hero.jpg", title: "Manga Noturna", style: "Realismo", place: "Antebraço", span: "lg:col-span-3" },
  { src: "/img/g1.jpg", title: "Botânica Geométrica", style: "Blackwork", place: "Antebraço", span: "lg:col-span-3" },
  { src: "/img/g3.jpg", title: "Fechamento", style: "Blackwork", place: "Costela", span: "lg:col-span-3" },
  { src: "/img/g8.jpg", title: "Ritual", style: "Realismo", place: "Antebraço", span: "lg:col-span-3" },
];

const FILTERS = ["Todos", "Blackwork", "Fine Line", "Neo Tradicional", "Realismo"];
const slug = (s) => s.toLowerCase().replace(/\s+/g, "-");

const Card = ({ w, i, onOpen }) => (
  <motion.button
    layout
    data-testid={`gallery-item-${i}`}
    onClick={onOpen}
    initial={{ opacity: 0, scale: 0.96 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.96 }}
    transition={{ duration: 0.6, ease: EASE }}
    className={`group relative overflow-hidden bg-[var(--ink)] text-left aspect-[4/5] lg:aspect-auto min-h-[300px] ${w.span}`}
  >
    <img src={w.src} alt={w.title} loading="lazy" className="absolute inset-0 w-full h-full object-cover photo-treat" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#08080a] via-transparent to-transparent opacity-90" />
    <div className="absolute top-4 left-4 font-mono text-[11px] tracking-[0.25em] text-[var(--bone)]">N°{String(i + 1).padStart(2, "0")}</div>
    <div className="absolute top-4 right-4 w-9 h-9 border border-[var(--bone)]/40 flex items-center justify-center opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-[opacity,transform] duration-500">
      <Plus className="w-4 h-4" />
    </div>
    <div className="absolute bottom-0 inset-x-0 p-5 sm:p-6">
      <div className="font-mono text-[11px] tracking-[0.25em] uppercase text-[var(--blood)]">{w.style}</div>
      <div className="mt-2 font-display italic text-3xl text-[var(--bone)] translate-y-1 group-hover:translate-y-0 transition-transform duration-500">{w.title}</div>
    </div>
  </motion.button>
);

export const Gallery = () => {
  const [filter, setFilter] = useState("Todos");
  const [open, setOpen] = useState(null);
  const items = WORKS.map((w, i) => ({ ...w, i })).filter((w) => filter === "Todos" || w.style === filter);
  return (
    <section id="galeria" data-testid="gallery-section" className="relative py-28 sm:py-36 bg-[var(--ink)]">
      <div className="max-w-[1500px] mx-auto px-5 sm:px-10">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-10">
          <div>
            <Reveal><Eyebrow n="02">Galeria</Eyebrow></Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-8 text-4xl sm:text-6xl lg:text-7xl leading-[0.95]">
                <span className="font-cond font-extrabold uppercase">Arquivo </span>
                <span className="font-display italic text-[var(--ash)]">de pele</span>
              </h2>
            </Reveal>
          </div>
          <Reveal delay={0.2} className="flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                data-testid={`gallery-filter-${slug(f)}`}
                onClick={() => setFilter(f)}
                className={`px-4 py-2.5 font-mono text-[11px] tracking-[0.2em] uppercase border transition-colors duration-300 ${filter === f ? "bg-[var(--bone)] text-[var(--void)] border-[var(--bone)]" : "border-[var(--line)] text-[var(--ash)] hover:border-[var(--bone)] hover:text-[var(--bone)]"}`}
              >
                {f}
              </button>
            ))}
          </Reveal>
        </div>
        <motion.div layout className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 lg:auto-rows-[340px] gap-3 sm:gap-4">
          <AnimatePresence>
            {items.map((w) => <Card key={w.src} w={filter === "Todos" ? w : { ...w, span: "lg:col-span-4" }} i={w.i} onOpen={() => setOpen(w.i)} />)}
          </AnimatePresence>
        </motion.div>
      </div>
      <Lightbox index={open} setIndex={setOpen} />
    </section>
  );
};
