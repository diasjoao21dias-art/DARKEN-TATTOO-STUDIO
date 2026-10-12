import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Logo } from "@/components/Logo";
import { scrollToId } from "@/lib/scroll";

const LINKS = [
  ["artista", "O Artista"],
  ["galeria", "Galeria"],
  ["ritual", "O Ritual"],
  ["solicitar", "Solicitar"],
];

export const Nav = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const go = (id) => {
    setOpen(false);
    scrollToId(id);
  };
  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 1.2, ease: [0.2, 0.7, 0.2, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-[background-color,border-color] duration-500 border-b ${scrolled ? "bg-[#08080a]/75 backdrop-blur-xl border-[var(--line)]" : "border-transparent"}`}
    >
      <div className="max-w-[1500px] mx-auto px-5 sm:px-10 h-20 flex items-center justify-between">
        <button data-testid="nav-logo" onClick={() => go("topo")} aria-label="Topo"><Logo /></button>
        <nav className="hidden md:flex items-center gap-10">
          {LINKS.map(([id, label], i) => (
            <button key={id} data-testid={`nav-link-${id}`} onClick={() => go(id)} className="group relative font-mono text-xs tracking-[0.25em] uppercase text-[var(--ash)] hover:text-[var(--bone)] transition-colors">
              <span className="text-[var(--blood)] mr-2">0{i + 1}</span>{label}
              <span className="absolute -bottom-1 left-0 h-px w-full bg-[var(--blood)] scale-x-0 origin-left group-hover:scale-x-100 transition-transform duration-500" />
            </button>
          ))}
        </nav>
        <button data-testid="nav-cta-btn" onClick={() => go("solicitar")} className="hidden md:inline-flex items-center gap-3 border border-[var(--bone)] px-5 py-3 font-mono text-xs tracking-[0.2em] uppercase hover:bg-[var(--bone)] hover:text-[var(--void)] transition-colors duration-300">
          Orçamento <span className="w-1.5 h-1.5 bg-[var(--blood)]" />
        </button>
        <button data-testid="nav-mobile-toggle" className="md:hidden p-2" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="md:hidden overflow-hidden bg-[var(--void)] border-t border-[var(--line)]">
            <div className="px-5 py-8 flex flex-col gap-6">
              {LINKS.map(([id, label], i) => (
                <button key={id} data-testid={`mobile-nav-link-${id}`} onClick={() => go(id)} className="text-left font-display text-4xl">
                  <span className="font-mono text-xs text-[var(--blood)] mr-3 align-middle">0{i + 1}</span>{label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
