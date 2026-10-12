import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { ArrowRight, Check, Mail, MessageCircle, ImagePlus } from "lucide-react";
import { scrollToId } from "@/lib/scroll";
import { STUDIO, whatsappUrl, mailtoUrl } from "@/config";
import { Reveal, Eyebrow } from "@/components/Reveal";
import { Chips, Field } from "@/components/FormParts";

const STYLES = ["Blackwork", "Fine Line", "Neo Tradicional", "Realismo", "Lettering", "Outro"];
const SIZES = ["Pequeno · até 7cm", "Médio · 8–15cm", "Grande · 16–25cm", "Fechamento"];
const PLACES = ["Antebraço", "Braço", "Mão", "Ombro", "Costas", "Peito", "Costela", "Perna", "Panturrilha", "Pé", "Pescoço", "Outro"];
const BUDGETS = ["Até R$ 500", "R$ 500 – 1.000", "R$ 1.000 – 2.500", "Acima de R$ 2.500", "Prefiro conversar"];
const EMPTY = { name: "", email: "", whatsapp: "", style: "", placement: "", size: "", budget: "", description: "" };

const buildMessage = (f) =>
  [
    `Olá, ${STUDIO.name}! Quero solicitar um desenho.`,
    "",
    `Nome: ${f.name}`,
    `E-mail: ${f.email}`,
    `WhatsApp: ${f.whatsapp}`,
    `Estilo: ${f.style}`,
    `Tamanho: ${f.size}`,
    `Local: ${f.placement}`,
    `Orçamento: ${f.budget}`,
    "",
    `Ideia: ${f.description.trim()}`,
    "",
    "Vou enviar minhas referências (até 3 imagens) aqui na conversa.",
  ].join("\n");

export const RequestForm = () => {
  const [f, setF] = useState(EMPTY);
  const [done, setDone] = useState(null); // "whatsapp" | "email" | null
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v?.target ? v.target.value : v }));

  useEffect(() => {
    const saved = sessionStorage.getItem("darken_style");
    if (saved) setF((s) => ({ ...s, style: saved }));
    const onStyle = (e) => setF((s) => ({ ...s, style: e.detail }));
    window.addEventListener("darken:style", onStyle);
    return () => window.removeEventListener("darken:style", onStyle);
  }, []);

  const validate = () => {
    if (!f.name.trim() || !f.email.trim() || !f.whatsapp.trim()) return toast.error("Preencha nome, e-mail e WhatsApp.") && false;
    if (!f.style || !f.size || !f.placement || !f.budget) return toast.error("Escolha estilo, tamanho, local e orçamento.") && false;
    if (f.description.trim().length < 10) return toast.error("Conte um pouco mais sobre a sua ideia.") && false;
    return true;
  };

  const finish = (via) => {
    setDone(via);
    setF(EMPTY);
    sessionStorage.removeItem("darken_style");
    setTimeout(() => scrollToId("solicitar"), 60);
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    window.open(whatsappUrl(buildMessage(f)), "_blank", "noopener,noreferrer");
    toast.success("Abrindo o WhatsApp com seu briefing...");
    finish("whatsapp");
  };

  const byEmail = () => {
    if (!validate()) return;
    window.location.href = mailtoUrl(`Solicitação de desenho — ${f.name}`, buildMessage(f));
    finish("email");
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
              <p className="mt-8 text-base font-light text-[var(--ash)] leading-relaxed max-w-sm">Preencha o briefing com o máximo de detalhes. Ao enviar, seu pedido abre direto no WhatsApp do estúdio — é só anexar suas referências na conversa.</p>
            </Reveal>
          </div>
        </div>
        <div className="lg:col-span-7 lg:col-start-6">
          {done ? (
            <motion.div data-testid="request-success" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="border border-[var(--line)] p-10 sm:p-14">
              <div className="w-14 h-14 bg-[var(--blood)] flex items-center justify-center"><Check className="w-7 h-7" /></div>
              <h3 className="mt-8 font-display italic text-4xl sm:text-5xl">Briefing pronto.</h3>
              <p className="mt-4 text-[var(--ash)] max-w-md">
                {done === "whatsapp"
                  ? "Seu pedido foi aberto no WhatsApp. Confirme o envio por lá e anexe até 3 imagens de referência."
                  : "Seu e-mail foi aberto no seu aplicativo. Anexe até 3 imagens de referência antes de enviar."}
              </p>
              <button data-testid="request-new-btn" onClick={() => setDone(null)} className="mt-10 font-mono text-xs tracking-[0.2em] uppercase border-b border-[var(--bone)] pb-1 hover:text-[var(--blood)] hover:border-[var(--blood)] transition-colors">Enviar outra ideia</button>
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
              <div data-testid="request-references-note" className="flex items-start gap-4 border border-dashed border-[var(--line)] p-5 text-[var(--ash)]">
                <ImagePlus className="w-5 h-5 text-[var(--blood)] shrink-0 mt-0.5" />
                <p className="text-sm leading-relaxed"><span className="text-[var(--bone)]">Referências:</span> separe até 3 imagens. Depois de enviar o briefing, anexe-as direto na conversa do WhatsApp (ou no e-mail).</p>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center gap-6">
                <button data-testid="request-submit-btn" type="submit" className="group self-start inline-flex items-center gap-5 bg-[var(--bone)] text-[var(--void)] pl-7 pr-5 py-5 font-mono text-xs tracking-[0.25em] uppercase hover:bg-[var(--blood)] hover:text-[var(--bone)] transition-colors duration-300">
                  <MessageCircle className="w-5 h-5" />
                  Enviar pelo WhatsApp
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button data-testid="request-email-btn" type="button" onClick={byEmail} className="self-start inline-flex items-center gap-3 font-mono text-xs tracking-[0.2em] uppercase text-[var(--ash)] border-b border-[var(--line)] pb-1 hover:text-[var(--bone)] hover:border-[var(--bone)] transition-colors">
                  <Mail className="w-4 h-4" /> ou enviar por e-mail
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};
