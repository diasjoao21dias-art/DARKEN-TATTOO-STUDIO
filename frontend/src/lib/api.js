import axios from "axios";

export const API = `${process.env.REACT_APP_BACKEND_URL}/api`;

export const scrollToId = (id) => {
  const el = document.getElementById(id);
  if (!el) return;
  if (window.__lenis) window.__lenis.scrollTo(el, { offset: -20, duration: 1.6 });
  else el.scrollIntoView({ behavior: "smooth" });
};

export function errMsg(e) {
  const d = e?.response?.data?.detail;
  if (!d) return "Algo deu errado. Tente novamente.";
  if (typeof d === "string") return d;
  if (Array.isArray(d)) return d.map((x) => x?.msg).filter(Boolean).join(" ");
  return String(d);
}

export const authHeaders = () => ({ Authorization: `Bearer ${localStorage.getItem("darken_token") || ""}` });

export default axios;
