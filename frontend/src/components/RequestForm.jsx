import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowRight, Loader2, Check } from "lucide-react";
import axios, { API, errMsg, scrollToId } from "@/lib/api";
import { Reveal, Eyebrow } from "@/components/Reveal";
import { Chips, Field, Uploader } from "@/components/FormParts";

const STYLES = ["Blackwork", "Fine Line", "Neo Tradicional", "Realismo", "Lettering", "Outro"];
const SIZES = ["Pequeno · até 7cm", "Médio · 8–15cm", "Grande · 16–25cm", "Fechamento"];
const PLACES = ["Antebraço", "Braço", "Mão", "Ombro", "Costas", "Peito", "Costela", "Perna", "Panturrilha", "Pé", "Pescoço", "Outro"];
const BUDGETS = ["Até R$ 500", "R$ 500 – 1.000", "R$ 1.000 – 2.500", "Acima de R$ 2.500", "Prefiro conversar"];
const EMPTY = { name: "", email: "", whatsapp: "", style: "", placement: "", size: "", budget: "", description: "" };

export const RequestForm = () => {
  const [f, setF] = useState(EMPTY);
  const [files, setFiles] = useState([]);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v?.target ? v.target.value : v }));

  useEffect(() => {
    const saved = sessionStorage.getItem("darken_style");
    if (saved) setF((s) => ({ ...s, style: saved }));
    const onStyle = (e) => setF((s) => ({ ...s, style: e.detail }));
    window.addEventListener("darken:style", onStyle);
    return () => window.removeEventListener("darken:style", onStyle);
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    if (!f.style || !f.size || !f.placement || !f.budget) return toast.error("Escolha estilo, tamanho, local e orçamento.");
    if (f.description.trim().length < 10) return toast.error("Conte um pouco mais sobre a sua ideia.");
    const fd = new FormData();
    Object.entries(f).forEach(([k, v]) => fd.append(k, v));
    files.forEach((x) => fd.append("files", x));
    setBusy(true);
    try {
      await axios.post(`${API}/requests`, fd);
      setDone(true);
      setF(EMPTY);
      setFiles([]);
      sessionStorage.removeItem("darken_style");
      setTimeout(() => scrollToId("solicitar"), 60);
      toast.success("Solicitação enviada! Em breve entraremos em contato.");
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section id="solicitar" data-testid="request-section" className="relative py-28 sm:py-40 bg-[var(--ink)] border-t border-[var(--line)]">
      <div className="max-w-[1500px] mx-auto px-5 sm:px-10 grid lg:grid-cols-12 gap-14">
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32">
            <Reveal><Eyebrow n="04">Solicitação de desenho</Eyebrow></Reveal>
            <Reveal delay={0.1}>
              <h2 className="mt-8 text-4xl sm:text-6xl leading-[0.95]">
                <span className="font-cond font-extrabold uppercase block">Sua ideia,</span>
                <span className="font-display italic text-[var(--ash)] block">nosso traço.</span>
              </h2>
            </Reveal>
            <Reveal delay={0.2}>
              <p className="mt-8 text-base font-light text-[var(--ash)] leading-relaxed max-w-sm">Preencha o briefing com o máximo de detalhes. O artista analisa cada pedido pessoalmente e responde pelo WhatsApp ou e-mail com orçamento e datas.</p>
            </Reveal>
          </div>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          {done ? (
            <motion.div data-testid="request-success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="border border-[var(--line)] p-10 sm:p-14">
              <div className="w-14 h-14 bg-[var(--blood)] flex items-center justify-center"><Check className="w-7 h-7" /></div>
              <h3 className="mt-8 font-display italic text-4xl sm:text-5xl">Pedido recebido.</h3>
              <p className="mt-4 text-[var(--ash)] max-w-md">Seu briefing já está com o artista. Fique de olho no WhatsApp e no e-mail nos próximos dias.</p>
              <button data-testid="request-new-btn" onClick={() => setDone(false)} className="mt-10 font-mono text-xs tracking-[0.2em] uppercase border-b border-[var(--bone)] pb-1 hover:text-[var(--blood)] hover:border-[var(--blood)] transition-colors">Enviar outra ideia</button>
            </motion.div>
          ) : (
            <form data-testid="design-request-form" onSubmit={submit} className="flex flex-col gap-12">
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8">
                <Field label="Nome completo" n="01" className="sm:col-span-2"><input data-testid="request-name-input" required minLength={2} className="field" value={f.name} onChange={set("name")} placeholder="Como devemos te chamar?" /></Field>
                <Field label="E-mail" n="02"><input data-testid="request-email-input" required type="email" className="field" value={f.email} onChange={set("email")} placeholder="voce@email.com" /></Field>
                <Field label="WhatsApp" n="03"><input data-testid="request-whatsapp-input" required minLength={8} className="field" value={f.whatsapp} onChange={set("whatsapp")} placeholder="(34) 9 0000-0000" /></Field>
              </div>
              <Field label="Estilo desejado" n="04"><Chips id="style" options={STYLES} value={f.style} onChange={set("style")} /></Field>
              <Field label="Tamanho aproximado" n="05"><Chips id="size" options={SIZES} value={f.size} onChange={set("size")} /></Field>
              <div className="grid sm:grid-cols-2 gap-x-8 gap-y-8">
                <Field label="Local do corpo" n="06">
                  <select data-testid="request-placement-select" className="field" value={f.placement} onChange={set("placement")}>
                    <option value="">Selecione</option>
                    {PLACES.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </Field>
                <Field label="Orçamento" n="07">
                  <select data-testid="request-budget-select" className="field" value={f.budget} onChange={set("budget")}>
                    <option value="">Selecione</option>
                    {BUDGETS.map((p) => <option key={p}>{p}</option>)}
                  </select>
                </Field>
              </div>
              <Field label="Descreva sua ideia" n="08"><textarea data-testid="request-description-input" required rows={5} className="field resize-none" value={f.description} onChange={set("description")} placeholder="Elementos, significado, se cobre outra tatuagem, cores..." /></Field>
              <Field label="Referências (até 3 imagens)" n="09"><Uploader files={files} setFiles={setFiles} /></Field>
              <button data-testid="request-submit-btn" disabled={busy} className="group self-start inline-flex items-center gap-5 bg-[var(--bone)] text-[var(--void)] pl-7 pr-5 py-5 font-mono text-xs tracking-[0.25em] uppercase hover:bg-[var(--blood)] hover:text-[var(--bone)] transition-colors duration-300 disabled:opacity-60">
                {busy ? "Enviando..." : "Enviar solicitação"}
                {busy ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
