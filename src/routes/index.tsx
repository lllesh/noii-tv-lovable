import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import tvCss from "../tv.css?url";

const CH = [
  { key: "painel", num: "01", name: "Painel", src: null, theme: "" },
  { key: "ombrine", num: "02", name: "Ombrine", src: "https://ombrine.framer.website/", theme: "theme-ombrine" },
  { key: "mesa", num: "03", name: "Mesa", src: "https://sales.lle.sh/mesa/", theme: "theme-mesa" },
  { key: "marca", num: "04", name: "Marca", src: "https://sales.lle.sh/marca.html?embed=1", theme: "theme-marca" },
  { key: "agenda", num: "05", name: "Agenda", src: "https://agenda.umbig.ooo/", theme: "theme-agenda" },
] as const;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ll e.s h · n o ii — Canais" },
      { name: "description", content: "Televisão de canais e frentes de trabalho ll e.s h e n o ii." },
      { property: "og:title", content: "ll e.s h · n o ii — Canais" },
      { property: "og:description", content: "Televisão de canais e frentes de trabalho ll e.s h e n o ii." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=Qwigley&display=swap",
      },
      { rel: "stylesheet", href: tvCss },
    ],
  }),
  component: Tv,
});

const ITEM_H_DESKTOP = 44;
const ITEM_H_MOBILE = 48;

function Drum({ open, current, onPick }: { open: boolean; current: number; onPick: (i: number) => void }) {
  const listRef = useRef<HTMLDivElement>(null);
  const itemsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const settleRef = useRef<number | undefined>(undefined);
  const [focus, setFocus] = useState(current);

  const itemH = () => (window.matchMedia("(max-width:620px)").matches ? ITEM_H_MOBILE : ITEM_H_DESKTOP);

  const paint = () => {
    const el = listRef.current;
    if (!el) return;
    const pos = el.scrollTop / itemH();
    itemsRef.current.forEach((it, i) => {
      if (!it) return;
      const d = i - pos;
      const ad = Math.min(Math.abs(d), 3);
      it.style.transform = `rotateX(${-d * 22}deg) translateZ(${-ad * 6}px)`;
      it.style.opacity = String(Math.max(0.15, 1 - ad * 0.32));
    });
    setFocus(Math.round(pos));
  };

  useEffect(() => {
    if (!open || !listRef.current) return;
    listRef.current.scrollTop = current * itemH();
    paint();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onScroll = () => {
    paint();
    window.clearTimeout(settleRef.current);
    settleRef.current = window.setTimeout(() => {
      const el = listRef.current;
      if (!el) return;
      const i = Math.max(0, Math.min(CH.length - 1, Math.round(el.scrollTop / itemH())));
      if (i !== current) onPick(i);
    }, 160);
  };

  const goTo = (i: number) => listRef.current?.scrollTo({ top: i * itemH(), behavior: "smooth" });

  return (
    <div
      className={`drum${open ? " open" : ""}`}
      role="listbox"
      aria-label="Canais"
      onClick={(e) => e.stopPropagation()}
      onKeyDown={(e) => {
        if (e.key === "ArrowDown") { e.preventDefault(); goTo(Math.min(CH.length - 1, focus + 1)); }
        if (e.key === "ArrowUp") { e.preventDefault(); goTo(Math.max(0, focus - 1)); }
      }}
    >
      <div className="drum-window">
        <div className="drum-list" ref={listRef} onScroll={onScroll}>
          {CH.map((c, i) => (
            <button
              key={c.key}
              ref={(n) => { itemsRef.current[i] = n; }}
              type="button"
              role="option"
              aria-selected={i === current}
              className={`drum-item${i === focus ? " on" : ""}`}
              onClick={() => goTo(i)}
            >
              <span className="num">{c.num}</span> {c.name}
            </button>
          ))}
        </div>
        <div className="drum-shade" />
        <div className="drum-lens" />
      </div>
    </div>
  );
}

const Icon = ({ d }: { d: React.ReactNode }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);

const RAIL = [
  { label: "Início", d: <path d="M3.5 10.8 12 3.6l8.5 7.2V20a1 1 0 0 1-1 1h-5v-6h-5v6h-5a1 1 0 0 1-1-1z" /> },
  { label: "Painéis", d: <><rect x="4" y="4" width="6.4" height="6.4" rx="1.6" /><rect x="13.6" y="4" width="6.4" height="6.4" rx="1.6" /><rect x="4" y="13.6" width="6.4" height="6.4" rx="1.6" /><rect x="13.6" y="13.6" width="6.4" height="6.4" rx="1.6" /></> },
  { label: "Relatórios", d: <><rect x="5" y="3.5" width="14" height="17" rx="2" /><path d="M8.5 8.5h7M8.5 12h7M8.5 15.5h4.5" /></> },
  { label: "Mensagens", d: <><path d="M4 5.5h16v12H9l-5 4z" /><path d="M8 9.5h8M8 13h5" /></> },
  { label: "Desempenho", d: <><path d="m4 15 5-5 4 3.6L20 6" /><path d="M15.5 6H20v4.5" /></> },
  { label: "Clientes", d: <><circle cx="12" cy="8" r="3.6" /><path d="M4.5 20.5v-1.2A6.3 6.3 0 0 1 10.8 13h2.4a6.3 6.3 0 0 1 6.3 6.3v1.2" /></> },
];

function Tv() {
  const [cur, setCur] = useState(1);
  const [open, setOpen] = useState(false);
  const [osd, setOsd] = useState(true);
  const ch = CH[cur] ?? CH[1];

  useEffect(() => {
    try { setOsd(localStorage.getItem("osd") !== "0"); } catch { /* */ }
    const close = (e: MouseEvent) => {
      if (e.target instanceof Element && e.target.closest(".topbar-center")) return;
      setOpen(false);
    };
    const key = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      const n = Number(e.key);
      if (n >= 1 && n <= CH.length && !(e.target instanceof HTMLInputElement)) setCur(n - 1);
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", key);
    return () => { document.removeEventListener("click", close); document.removeEventListener("keydown", key); };
  }, []);

  const toggleOsd = () => setOsd((v) => { try { localStorage.setItem("osd", v ? "0" : "1"); } catch { /* */ } return !v; });

  return (
    <div className="tv-root">
      <div className={`app ${ch.theme}`}>
        <aside className="rail">
          <div className="logo" aria-hidden="true" />
          <nav className="rail-nav" aria-label="Navegação principal">
            {RAIL.map((r, i) => (
              <button key={r.label} className={`rail-btn${i === 0 ? " is-active" : ""}`} type="button" aria-label={r.label}>
                <Icon d={r.d} />
              </button>
            ))}
            <span className="rail-sep" aria-hidden="true" />
            <button className="rail-btn" type="button" aria-label="Ajustes">
              <Icon d={<><circle cx="12" cy="12" r="3.1" /><path d="M12 3v2.5M12 18.5V21M3 12h2.5M18.5 12H21M5.6 5.6l1.8 1.8M16.6 16.6l1.8 1.8M5.6 18.4l1.8-1.8M16.6 7.4l1.8-1.8" /></>} />
            </button>
          </nav>
        </aside>

        <div className="main">
          <header className="topbar">
            <label className="search">
              <Icon d={<><circle cx="11" cy="11" r="6.4" /><path d="m16 16 4.2 4.2" /></>} />
              <input type="search" placeholder="Search here..." aria-label="Buscar" />
            </label>
            <div className="topbar-center">
              <button
                className="script"
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={(e) => { e.stopPropagation(); setOpen((o) => !o); }}
              >
                {ch.name}
              </button>
              <Drum open={open} current={cur} onPick={setCur} />
            </div>
            <button className="profile" type="button" aria-label="Conta de Uroos Fatima">
              <span className="profile-txt">
                <span className="profile-name">Uroos Fatima</span>
                <span className="profile-mail">uroos.design@gmail.com</span>
              </span>
              <span className="avatar"><img src="/assets/avatar.png" alt="" /></span>
              <Icon d={<path d="m7 10 5 5 5-5" />} />
            </button>
          </header>

          <div className="layers">
            {CH.map((c, i) => (
              <section key={c.key} className={`layer${i === cur ? " is-on" : ""}`}>
                {c.src ? (
                  <iframe className="layer-frame" src={c.src} title={c.name} loading="eager" />
                ) : (
                  <div className="painel-clean">
                    <div className="brand" aria-label="ll e.s h — n o ii">
                      <span className="brand-main">ll e.s h</span>
                      <span className="brand-sep" />
                      <span className="brand-sub">n o ii</span>
                    </div>
                  </div>
                )}
              </section>
            ))}
            <span className="ch-tag">canal {ch.num} · {ch.name.toLowerCase()}</span>
            <button className="osd-toggle" type="button" aria-pressed={osd} aria-label="Mostrar ou esconder a barra de canais" onClick={toggleOsd}>
              <Icon d={<><rect x="3" y="5" width="18" height="13" rx="2.5" /><path d="M8 21h8M12 18v3" /></>} />
            </button>
            <div className={`ch-bar${osd ? "" : " is-hidden"}`} role="group" aria-label="Trocar de canal">
              {CH.map((c, i) => (
                <button key={c.key} type="button" className={i === cur ? "on" : ""} onClick={() => setCur(i)}>
                  <span className="num">{c.num}</span> {c.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
