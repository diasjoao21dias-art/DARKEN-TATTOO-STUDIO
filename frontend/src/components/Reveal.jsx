import { motion } from "framer-motion";

export const EASE = [0.2, 0.7, 0.2, 1];

export const Reveal = ({ children, delay = 0, y = 40, className = "", ...rest }) => (
  <motion.div
    initial={{ opacity: 0, y }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 1, delay, ease: EASE }}
    className={className}
    {...rest}
  >
    {children}
  </motion.div>
);

export const Eyebrow = ({ n, children }) => (
  <div className="flex items-center gap-4 font-mono text-xs tracking-[0.3em] uppercase text-[var(--ash)]">
    <span className="text-[var(--blood)]">{n}</span>
    <span className="h-px w-10 bg-[var(--line)]" />
    <span>{children}</span>
  </div>
);
