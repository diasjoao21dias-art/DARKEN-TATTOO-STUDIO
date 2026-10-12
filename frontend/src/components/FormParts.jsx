export const Field = ({ label, n, className = "", children }) => (
  <label className={`block ${className}`}>
    <span className="flex items-center gap-3 font-mono text-[11px] tracking-[0.25em] uppercase text-[var(--ash)] mb-2">
      <span className="text-[var(--blood)]">{n}</span>{label}
    </span>
    {children}
  </label>
);

export const Chips = ({ id, options, value, onChange }) => (
  <div className="flex flex-wrap gap-2 mt-3">
    {options.map((o) => (
      <button
        type="button"
        key={o}
        data-testid={`request-${id}-chip-${o.toLowerCase().split(" ")[0].normalize("NFD").replace(/[^a-z]/g, "")}`}
        onClick={() => onChange(o)}
        className={`px-4 py-2.5 text-sm border transition-colors duration-300 ${value === o ? "bg-[var(--blood)] border-[var(--blood)] text-[var(--bone)]" : "border-[var(--line)] text-[var(--ash)] hover:border-[var(--bone)] hover:text-[var(--bone)]"}`}
      >
        {o}
      </button>
    ))}
  </div>
);
