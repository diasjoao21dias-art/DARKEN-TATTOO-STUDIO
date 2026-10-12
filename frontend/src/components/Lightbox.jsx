import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ArrowUpRight } from "lucide-react";
import { WORKS } from "@/components/Gallery";
import { scrollToId } from "@/lib/api";

export const Lightbox = ({ index, setIndex }) => {
  const open = index !== null;
  const w = open ? WORKS[index] : null;
  const step = (d) => setIndex((index + d + WORKS.length) % WORKS.length);

  useEffect(() => {
    if (!open) return undefined;
    window.__lenis?.stop();
    const onKey = (e) => {
      if (e.key === "Escape") setIndex(null);
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % WORKS.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + WORKS.length) % WORKS.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.__lenis?.start();
    };
  }, [open, setIndex]);

  const similar = () => {
    sessionStorage.setItem("darken_style", w.style);
    window.dispatchEvent(new CustomEvent("darken:style", { detail: w.style }));
    setIndex(null);
    setTimeout(() => scrollToId("solicitar"), 50);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div data-testid="gallery-lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[70] bg-[#08080a]/95 backdrop-blur-md flex flex-col lg:flex-row">
          <button data-testid="lightbox-close-btn" onClick={() => setIndex(null)} className="absolute top-5 right-5 z-10 w-11 h-11 border border-[var(--line)] flex items-center justify-center hover:bg-[var(--bone)] hover:text-[var(--void)] transition-colors" aria-label="Fechar"><X className="w-5 h-5" /></button>
          <div className="relative flex-1 min-h-0 flex items-center justify-center p-5 pt-20 lg:p-16">
            <AnimatePresence initial={false}>
              <motion.img key={w.src} src={w.src} alt={w.title} initial={{ opacity: 0, scale: 1.04 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }} className="absolute max-h-[calc(100%-6rem)] lg:max-h-[calc(100%-8rem)] max-w-[calc(100%-2.5rem)] object-contain" />
            </AnimatePresence>
          </div>
          <div className="lg:w-[380px] border-t lg:border-t-0 lg:border-l border-[var(--line)] p-6 lg:p-10 flex flex-col justify-between gap-6">
            <div>
              <div className="font-mono text-[11px] tracking-[0.3em] text-[var(--ash)]">N°{String(index + 1).padStart(2, "0")} / {String(WORKS.length).padStart(2, "0")}</div>
              <h3 className="mt-4 font-display italic text-4xl lg:text-5xl">{w.title}</h3>
              <dl className="mt-6 grid grid-cols-2 gap-4 font-mono text-xs uppercase tracking-[0.2em]">
                <div><dt className="text-[var(--ash)]">Estilo</dt><dd className="mt-1 text-[var(--blood)]">{w.style}</dd></div>
                <div><dt className="text-[var(--ash)]">Local</dt><dd className="mt-1">{w.place}</dd></div>
              </dl>
            </div>
            <div className="flex flex-col gap-3">
              <button data-testid="lightbox-request-similar-btn" onClick={similar} className="group flex items-center justify-between bg-[var(--bone)] text-[var(--void)] px-5 py-4 font-mono text-xs tracking-[0.2em] uppercase hover:bg-[var(--blood)] hover:text-[var(--bone)] transition-colors">
                Quero algo nesse estilo <ArrowUpRight className="w-4 h-4 group-hover:rotate-45 transition-transform" />
              </button>
              <div className="grid grid-cols-2 gap-3">
                <button data-testid="lightbox-prev-btn" onClick={() => step(-1)} className="border border-[var(--line)] py-3 flex justify-center hover:border-[var(--bone)] transition-colors" aria-label="Anterior"><ChevronLeft className="w-5 h-5" /></button>
                <button data-testid="lightbox-next-btn" onClick={() => step(1)} className="border border-[var(--line)] py-3 flex justify-center hover:border-[var(--bone)] transition-colors" aria-label="Próximo"><ChevronRight className="w-5 h-5" /></button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
