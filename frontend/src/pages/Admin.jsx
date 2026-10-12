import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { LogOut, Loader2 } from "lucide-react";
import axios, { API, errMsg, authHeaders } from "@/lib/api";
import { Logo } from "@/components/Logo";
import { RequestCard, STATUS } from "@/components/RequestCard";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await axios.post(`${API}/auth/login`, { email, password });
      localStorage.setItem("darken_token", data.token);
      onLogin();
    } catch (err) {
      toast.error(errMsg(err));
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <form data-testid="admin-login-form" onSubmit={submit} className="w-full max-w-md border border-[var(--line)] bg-[var(--ink)] p-8 sm:p-12">
        <Logo />
        <h1 className="mt-10 font-display italic text-4xl">Área do artista</h1>
        <p className="mt-2 text-sm text-[var(--ash)]">Acesso restrito às solicitações de desenho.</p>
        <input data-testid="admin-login-email-input" type="email" required className="field mt-8" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input data-testid="admin-login-password-input" type="password" required className="field mt-4" placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button data-testid="admin-login-submit-btn" disabled={busy} className="mt-10 w-full bg-[var(--bone)] text-[var(--void)] py-4 font-mono text-xs tracking-[0.25em] uppercase hover:bg-[var(--blood)] hover:text-[var(--bone)] transition-colors disabled:opacity-60">
          {busy ? "Entrando..." : "Entrar"}
        </button>
        <a href="/" data-testid="admin-back-home-link" className="block mt-6 text-center font-mono text-[11px] tracking-[0.2em] uppercase text-[var(--ash)] hover:text-[var(--bone)]">← Voltar ao site</a>
      </form>
    </div>
  );
};

const Dashboard = ({ onLogout }) => {
  const [items, setItems] = useState(null);
  const [filter, setFilter] = useState("");
  const load = useCallback(async () => {
    try {
      const { data } = await axios.get(`${API}/admin/requests`, { headers: authHeaders(), params: filter ? { status: filter } : {} });
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err?.response?.status === 401) onLogout();
      else toast.error(errMsg(err));
      setItems([]);
    }
  }, [filter, onLogout]);
  useEffect(() => { load(); }, [load]);

  const update = async (id, status) => {
    try {
      const { data } = await axios.patch(`${API}/admin/requests/${id}`, { status }, { headers: authHeaders() });
      setItems((s) => s.map((x) => (x.id === id ? data : x)));
      toast.success("Status atualizado");
    } catch (err) {
      toast.error(errMsg(err));
    }
  };

  return (
    <div className="min-h-screen" data-testid="admin-dashboard">
      <header className="border-b border-[var(--line)]">
        <div className="max-w-[1300px] mx-auto px-5 sm:px-10 h-20 flex items-center justify-between">
          <a href="/" data-testid="admin-logo-link"><Logo /></a>
          <button data-testid="admin-logout-btn" onClick={onLogout} className="flex items-center gap-2 font-mono text-xs tracking-[0.2em] uppercase text-[var(--ash)] hover:text-[var(--bone)]"><LogOut className="w-4 h-4" />Sair</button>
        </div>
      </header>
      <div className="max-w-[1300px] mx-auto px-5 sm:px-10 py-12">
        <h1 className="font-cond font-extrabold uppercase text-4xl sm:text-5xl">Solicitações <span className="font-display italic normal-case text-[var(--ash)]">de desenho</span></h1>
        <div className="mt-8 flex flex-wrap gap-2">
          {[["", "Todas"], ...Object.entries(STATUS)].map(([k, v]) => (
            <button key={k || "all"} data-testid={`admin-filter-${k || "all"}`} onClick={() => setFilter(k)} className={`px-4 py-2.5 font-mono text-[11px] tracking-[0.2em] uppercase border transition-colors ${filter === k ? "bg-[var(--bone)] text-[var(--void)] border-[var(--bone)]" : "border-[var(--line)] text-[var(--ash)] hover:text-[var(--bone)]"}`}>{v}</button>
          ))}
        </div>
        <div className="mt-10 flex flex-col gap-4">
          {items === null && <Loader2 className="w-6 h-6 animate-spin text-[var(--ash)]" />}
          {items?.length === 0 && <p data-testid="admin-empty-state" className="text-[var(--ash)] border border-[var(--line)] p-10 text-center">Nenhuma solicitação por aqui ainda.</p>}
          {items?.map((r) => <RequestCard key={r.id} r={r} onStatus={update} />)}
        </div>
      </div>
    </div>
  );
};

export default function Admin() {
  const [authed, setAuthed] = useState(null);
  useEffect(() => {
    if (!localStorage.getItem("darken_token")) { setAuthed(false); return; }
    axios.get(`${API}/auth/me`, { headers: authHeaders() }).then(() => setAuthed(true)).catch(() => setAuthed(false));
  }, []);
  const logout = useCallback(() => { localStorage.removeItem("darken_token"); setAuthed(false); }, []);
  if (authed === null) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="w-6 h-6 animate-spin" /></div>;
  return authed ? <Dashboard onLogout={logout} /> : <Login onLogin={() => setAuthed(true)} />;
}
