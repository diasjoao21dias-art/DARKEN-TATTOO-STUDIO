import { Instagram, MapPin, MessageCircle } from "lucide-react";
import { LogoMark } from "@/components/Logo";
import { Reveal } from "@/components/Reveal";
import { STUDIO, whatsappUrl, instagramUrl } from "@/config";

export const Footer = () => (
  <footer data-testid="site-footer" className="relative pt-24 pb-10 overflow-hidden border-t border-[var(--line)]">
    <div className="max-w-[1500px] mx-auto px-5 sm:px-10">
      <div className="grid md:grid-cols-3 gap-10 font-mono text-xs tracking-[0.2em] uppercase text-[var(--ash)]">
        <div className="flex items-start gap-3"><MapPin className="w-4 h-4 text-[var(--blood)] shrink-0" /><span>{STUDIO.address}<br />{STUDIO.city}</span></div>
        <a data-testid="footer-instagram-link" href={instagramUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[var(--bone)] transition-colors"><Instagram className="w-4 h-4 text-[var(--blood)]" />@{STUDIO.instagram}</a>
        <a data-testid="footer-whatsapp-link" href={whatsappUrl(`Olá, ${STUDIO.name}! Gostaria de falar sobre uma tatuagem.`)} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-[var(--bone)] transition-colors"><MessageCircle className="w-4 h-4 text-[var(--blood)]" />WhatsApp</a>
      </div>
      <Reveal className="mt-20 flex items-end gap-4 sm:gap-8">
        <LogoMark className="w-[14vw] h-[14vw] max-w-[180px] max-h-[180px] text-[var(--bone)] shrink-0" />
        <div className="font-cond font-black uppercase leading-[0.8] text-[19vw] lg:text-[16vw] tracking-tight text-[var(--bone)]">Darken</div>
      </Reveal>
      <div className="mt-10 flex flex-col sm:flex-row justify-between gap-4 font-mono text-[11px] tracking-[0.25em] uppercase text-[var(--ash)]">
        <span>© {new Date().getFullYear()} {STUDIO.name}</span>
        <span>{STUDIO.city}</span>
      </div>
    </div>
  </footer>
);
