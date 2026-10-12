import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { ImagePlus, X } from "lucide-react";

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

export const Uploader = ({ files, setFiles }) => {
  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files]);
  useEffect(() => () => previews.forEach((u) => URL.revokeObjectURL(u)), [previews]);
  const add = (e) => {
    const picked = Array.from(e.target.files || []).filter((f) => f.type.startsWith("image/"));
    e.target.value = "";
    const big = picked.find((f) => f.size > 8 * 1024 * 1024);
    if (big) return toast.error("Cada imagem deve ter no máximo 8MB.");
    const next = [...files, ...picked];
    if (next.length > 3) toast.error("Máximo de 3 imagens.");
    setFiles(next.slice(0, 3));
  };
  return (
    <div className="grid grid-cols-3 gap-3 mt-3">
      {previews.map((u, i) => (
        <div key={u} className="relative aspect-square overflow-hidden border border-[var(--line)]" data-testid={`request-file-preview-${i}`}>
          <img src={u} alt={`Referência ${i + 1}`} className="w-full h-full object-cover" />
          <button type="button" data-testid={`request-file-remove-${i}`} onClick={() => setFiles(files.filter((_, j) => j !== i))} className="absolute top-2 right-2 w-8 h-8 bg-[var(--void)]/80 flex items-center justify-center hover:bg-[var(--blood)] transition-colors" aria-label="Remover"><X className="w-4 h-4" /></button>
        </div>
      ))}
      {files.length < 3 && (
        <span className="relative aspect-square border border-dashed border-[var(--line)] hover:border-[var(--bone)] flex flex-col items-center justify-center gap-2 text-[var(--ash)] hover:text-[var(--bone)] transition-colors cursor-pointer">
          <ImagePlus className="w-6 h-6" />
          <span className="font-mono text-[11px] tracking-[0.2em] uppercase">{files.length}/3</span>
          <input data-testid="request-file-input" type="file" accept="image/*" multiple onChange={add} className="absolute inset-0 opacity-0 cursor-pointer" />
        </span>
      )}
    </div>
  );
};
