import { useEffect, useRef } from "react";

export const AshCanvas = () => {
  const ref = useRef(null);
  useEffect(() => {
    const c = ref.current;
    const ctx = c.getContext("2d");
    let w, h, raf;
    const mouse = { x: -999, y: -999 };
    const resize = () => {
      w = c.width = c.offsetWidth;
      h = c.height = c.offsetHeight;
    };
    resize();
    const count = window.innerWidth < 768 ? 45 : 110;
    const ps = Array.from({ length: count }, () => ({
      x: Math.random() * w, y: Math.random() * h, z: Math.random() * 0.9 + 0.1,
      vx: (Math.random() - 0.5) * 0.2, vy: -(Math.random() * 0.35 + 0.08), red: Math.random() < 0.08,
    }));
    const onMove = (e) => {
      const r = c.getBoundingClientRect();
      mouse.x = e.clientX - r.left;
      mouse.y = e.clientY - r.top;
    };
    const draw = () => {
      ctx.clearRect(0, 0, w, h);
      for (const p of ps) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y, d = Math.hypot(dx, dy);
        if (d < 140) { p.vx += (dx / d) * 0.04 * p.z; p.vy += (dy / d) * 0.04 * p.z; }
        p.vx *= 0.985; p.vy = p.vy * 0.985 - 0.004 * p.z;
        p.x += p.vx * p.z * 3; p.y += p.vy * p.z * 3;
        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
        if (p.x < -10) p.x = w + 10; if (p.x > w + 10) p.x = -10;
        ctx.fillStyle = p.red ? `rgba(193,39,45,${0.7 * p.z})` : `rgba(237,232,223,${0.45 * p.z})`;
        ctx.fillRect(p.x, p.y, 1.6 * p.z + 0.4, 1.6 * p.z + 0.4);
      }
      raf = requestAnimationFrame(draw);
    };
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("mousemove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);
  return <canvas ref={ref} className="absolute inset-0 w-full h-full pointer-events-none" aria-hidden="true" />;
};
