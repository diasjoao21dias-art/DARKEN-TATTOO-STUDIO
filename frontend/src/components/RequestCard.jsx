import { useEffect, useState } from "react";
import axios, { API, authHeaders } from "@/lib/api";

export const STATUS = { pendente: "Pendente", em_analise: "Em análise", aprovado: "Aprovado", concluido: "Concluído", recusado: "Recusado" };

const Thumb = ({ path, i, rid }) => {
  const [url, setUrl] = useState(null);
  useEffect(() => {
    let u;
    axios.get(`${API}/admin/files/${path}`, { headers: authHeaders(), responseType: "blob" })
      .then((res) => { u = URL.createObjectURL(res.data); setUrl(u); })
      .catch(() => setUrl(""));
    return () => { if (u) URL.revokeObjectURL(u); };
  }, [path]);
  return (
    <a href={url || undefined} target="_blank" rel="noreferrer" data-testid={`admin-ref-image-${rid}-${i}`} className="block w-24 h-24 border border-[var(--line)] bg-[var(--ink-2)] overflow-hidden">
      {url && <img src={url} alt={`Referência ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform" />}
    </a>
  );
};

export const RequestCard = ({ r, onStatus }) => (
  <article data-testid={`admin-request-${r.id}`} className="border border-[var(--line)] bg-[var(--ink)] p-6 sm:p-8 grid lg:grid-cols-12 gap-6">
    <div className="lg:col-span-4">
      <div className="font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--ash)]">{new Date(r.created_at).toLocaleString("pt-BR")}</div>
      <h3 className="mt-2 font-display italic text-3xl">{r.name}</h3>
      <div className="mt-3 text-sm text-[var(--ash)] break-all">{r.email}</div>
      <div className="text-sm text-[var(--ash)]">{r.whatsapp}</div>
      <select data-testid={`admin-status-select-${r.id}`} value={r.status} onChange={(e) => onStatus(r.id, e.target.value)} className="field mt-4 font-mono text-xs uppercase tracking-[0.15em]">
        {Object.entries(STATUS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
      </select>
    </div>
    <div className="lg:col-span-8">
      <div className="flex flex-wrap gap-2 font-mono text-[11px] tracking-[0.15em] uppercase">
        {[r.style, r.size, r.placement, r.budget].map((t) => <span key={t} className="border border-[var(--line)] px-3 py-1.5">{t}</span>)}
      </div>
      <p className="mt-4 text-[var(--bone)]/90 leading-relaxed whitespace-pre-line">{r.description}</p>
      {r.images?.length > 0 && <div className="mt-5 flex gap-3 flex-wrap">{r.images.map((im, i) => <Thumb key={im.path} path={im.path} i={i} rid={r.id} />)}</div>}
    </div>
  </article>
);
