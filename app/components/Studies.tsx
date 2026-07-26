"use client";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import ThunderScrollButton from "./thunder";
import { ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";
import { zalando, mono } from "../fonts";

const E = [0.22, 1, 0.36, 1] as [number, number, number, number];
const up = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: E } },
};

const DARK_GRAY = "rgba(245,246,252,0.75)";
const ICE_WHITE = "#F5F6FC";
const MUTED_GRAY = "rgba(245,246,252,0.65)";
const BG = "#14141A";
const HIGHLIGHT_BG = "#CEFF1A"; // Marker background
const HIGHLIGHT_TEXT = "#14141A"; // Dark text for contrast

interface MetaItem { label: string; value: string; }
interface NarrativeItem { n: string; h: string; p: string; highlight?: string[]; }
interface MockImage { src: string; alt: string; caption?: string; }
interface Brand { a: string; b: string; c: string; }
interface Project {
  index: string; id: string; tag: string; title: string; subtitle: string;
  summary: string; meta: MetaItem[]; narrative: NarrativeItem[];
  brand: Brand; accentName: string; live: string; images?: MockImage[];
  highlightWord?: string; subtitleHighlight?: string;
}

const CASES: Project[] = [
  {
    index: "01", id: "classguard", tag: "IoT Dashboard · Real-Time Monitoring",
    title: "ClassGuard Monitoring System",
    highlightWord: "System",
    subtitle: "A real-time IoT dashboard tracking classroom temperature, humidity, and availability — built from scratch for City of Malabon University and recognized as a Research Congress finalist.",
    subtitleHighlight: "A real-time IoT dashboard",
    summary: "Led UX/UI design, front-end, and backend setup by a 5-person capstone team — designing a live monitoring dashboard for classroom conditions and availability, and building the Node.js backend and account system behind it. Selected as a Research Congress finalist.",
    meta: [
      { label: "ROLE", value: "UX/UI + Front-end Developer" },
      { label: "TEAM", value: "5-Person Capstone Team" },
      { label: "RECOGNITION", value: "Research Congress Finalist" },
      { label: "STACK", value: "HTML · CSS · JAVASCRIPT · Node.js" },
    ],
    narrative: [
      {
        n: "01", h: "PROBLEM",
        p: "Teachers at City of Malabon University had no way to check a classroom's temperature, humidity, or availability without walking over — a problem no existing system solved. Our 5-person capstone team built ClassGuard from scratch to fix it.",
        highlight: [
          "no way to check a classroom's temperature, humidity, or availability without walking over",
        ],
      },
      {
        n: "02", h: "APPROACH",
        p: "I led UX/UI and front-end design, building color-coded status cards (ClassGuard Blue and Gold) for at-a-glance room availability, plus the Node.js backend with real-time socket updates and an account system verified through Google SMTP. Room readings came from Arduino Uno boards with DHT11 sensors, transmitted live via ESP32 microcontrollers.",
        highlight: [
          "color-coded status cards (ClassGuard Blue and Gold) for at-a-glance room availability",
        ],
      },
      {
        n: "03", h: "RESULT",
        p: "ClassGuard was live-demoed across 2 classrooms for our thesis defense and selected as a Research Congress finalist. The working prototype proved the concept — real-time room conditions readable at a glance — with full multi-room deployment as the clear next step.",
        highlight: [
          "selected as a Research Congress finalist",
        ],
      },
    ],
    brand: { a: ICE_WHITE, b: DARK_GRAY, c: "#2B1F4D" },
    accentName: "ClassGuard Blue & Gold", live: "#",
    images: [
      { src: "/login.png", alt: "ClassGuard login and account verification screen", caption: "Login" },
      { src: "/dashboard.png", alt: "ClassGuard dashboard — room status overview", caption: "Dashboard" },
      { src: "/overview.png", alt: "ClassGuard room overview and live sensor readings", caption: "Overview" },
    ],
  },
  {
    index: "02", id: "ultrafood", tag: "FMCG Client · B2B Website",
    title: "Ultrafood Distributors Inc.",
    highlightWord: "Inc.",
    subtitle: "A B2B website for Ultrafood Distributors Inc. — prototyped in React and shipped in Laravel as their new, live production site.",
    subtitleHighlight: "A B2B website for Ultrafood Distributors Inc.",
    summary: "Converted the marketing team's brand guidelines into a validated Figma-to-React/Next.js prototype, then rebuilt the front-end in Laravel, PHP, and Tailwind CSS to match the client's production stack. The result: Ultrafood Distributors Inc.'s first dedicated B2B website, now live in production.",
    meta: [
      { label: "ROLE", value: "UX/UI + Landing Page Dev" },
      { label: "TEAM", value: "4-Person Team" },
      { label: "TIMELINE", value: "6 WKS · 400-HR ONSITE OJT" },
      { label: "STACK", value: "Figma · Laravel · Tailwind CSS · PHP" },
      { label: "STATUS", value: "Deployed Live Website" },
    ],
    narrative: [
      {
        n: "01", h: "PROBLEM",
        p: "Ultrafood Distributors needed its own dedicated B2B website to represent its brands, Menu Food Solutions and Nordic Foods Philippines — while a sister company's site was already up and running, Ultrafood had no web presence of its own. Leadership brought in a 4-person intern team to design and build one from scratch.",
        highlight: [
          "Ultrafood had no web presence of its own",
        ],
      },
      {
        n: "02", h: "APPROACH",
        p: "I owned the landing page front-end and a Google SMTP-powered contact form solo, validating the design in a React, Next.js, and Tailwind CSS prototype before rebuilding it in Laravel and PHP to match the client's production stack — all during a 400-hour onsite internship.",
        highlight: [
          "validating the design in a React, Next.js, and Tailwind CSS prototype before rebuilding it in Laravel and PHP to match the client's production stack",
        ],
      },
      {
        n: "03", h: "RESULT",
        p: "The site shipped and is live today at ultrafoodinc.com, giving Ultrafood its first dedicated brand presence. The internship supervisor overseeing the project gave positive feedback on the final result.",
        highlight: [
          "live today at ultrafoodinc.com",
        ],
      },
    ],
    brand: { a: ICE_WHITE, b: DARK_GRAY, c: "#1F3A16" },
    accentName: "Ultrafood Green", live: "https://ultrafoodinc.com/",
    images: [
      { src: "/ultrafood.png", alt: "Ultrafood Distributors Inc. live website" },
    ],
  },
];

// Restore original style for title highlights
function renderTitle(title: string, highlight?: string) {
  if (!highlight) return title;
  const idx = title.indexOf(highlight);
  if (idx === -1) return title;
  return (
    <>
      {title.slice(0, idx)}
      <span style={{ color: DARK_GRAY }}>{title.slice(idx, idx + highlight.length)}</span>
      {title.slice(idx + highlight.length)}
    </>
  );
}

// Marker-style highlight ONLY for PROBLEM/APPROACH/RESULT: background, no bold
function renderHighlighted(text: string, highlight?: string | string[]) {
  if (!highlight) return text;
  const highlights = Array.isArray(highlight) ? highlight : [highlight];
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  highlights.forEach((h, i) => {
    const idx = text.indexOf(h, cursor);
    if (idx === -1) return;
    if (idx > cursor) parts.push(text.slice(cursor, idx));
    parts.push(
      <span 
        key={i} 
        style={{ 
          backgroundColor: HIGHLIGHT_BG,
          color: HIGHLIGHT_TEXT,
          padding: "0.1em 0.3em",
          borderRadius: "0.15em",
          lineHeight: "1.4",
          fontWeight: "normal"
        }}
      >
        {h}
      </span>
    );
    cursor = idx + h.length;
  });
  parts.push(text.slice(cursor));
  return <>{parts}</>;
}

// Restore original bold/white for subtitle highlights
function renderSubtitleHighlight(text: string, highlight?: string) {
  if (!highlight) return text;
  const idx = text.indexOf(highlight);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span style={{ color: ICE_WHITE, fontWeight: 600 }}>{highlight}</span>
      {text.slice(idx + highlight.length)}
    </>
  );
}

function useReveal(): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } }),
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [ref, visible] = useReveal();
  return <motion.div ref={ref} className={`reveal ${className}`} initial={{ opacity: 0, y: 24 }} animate={visible ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, ease: E }}>{children}</motion.div>;
}

function MetaChip({ label, value }: MetaItem) {
  return (
    <div>
      <div className={`${mono.className} text-[10px] tracking-[0.2em] uppercase mb-1.5`} style={{ color: DARK_GRAY }}>{label}</div>
      <div className={`${zalando.className} text-[14px] font-medium`} style={{ color: ICE_WHITE }}>{value}</div>
    </div>
  );
}

function MockImageFill({ src, alt, fill = true }: { src: string; alt: string; fill?: boolean }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div className="w-full flex flex-col items-center justify-center gap-2 p-8 text-center border border-dashed rounded-lg" style={{ borderColor: MUTED_GRAY }}>
        <span className={`${mono.className} text-[11px] tracking-[0.18em] uppercase`} style={{ color: DARK_GRAY, opacity: 0.6 }}>
          Image Unavailable
        </span>
        <span className={`${mono.className} text-[10px] break-all`} style={{ color: MUTED_GRAY }}>
          {src}
        </span>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={fill ? "w-full h-full object-contain object-center transition-transform duration-700 ease-out" : "w-full h-auto block transition-transform duration-700 ease-out"}
      loading="eager"
      onError={() => setErrored(true)}
    />
  );
}

function BrowserFrame({
  label, showLive, height, href, children,
}: {
  label: string; showLive?: boolean; height: string; href?: string; children: React.ReactNode;
}) {
  const inner = (
    <>
      <div className="flex items-center gap-2 px-4 py-3 border-b" style={{ borderColor: MUTED_GRAY, background: "rgba(245,246,252,0.02)" }}>
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#FF5F57" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#FEBC2E" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#28C840" }} />
        <span className={`${mono.className} text-[11px] ml-3 truncate`} style={{ color: DARK_GRAY }}>{label}</span>
        {showLive && (
          <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em]" style={{ color: DARK_GRAY }}>
            <span className="relative flex w-1.5 h-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-50" style={{ background: ICE_WHITE }} />
              <span className="relative inline-flex rounded-full w-1.5 h-1.5" style={{ background: ICE_WHITE }} />
            </span>
            LIVE
          </span>
        )}
      </div>
      <div className="relative w-full" style={{ height }}>
        {children}
      </div>
    </>
  );

  const frameClass = "rounded-xl overflow-hidden border";
  const frameStyle = { borderColor: MUTED_GRAY, background: "rgba(245,246,252,0.02)" };

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="group relative block" style={frameStyle}>
        {inner}
      </a>
    );
  }
  return <div className={frameClass} style={frameStyle}>{inner}</div>;
}

function MockPanel({ project }: { project: Project }) {
  const hasLiveUrl = Boolean(project.live) && project.live !== "#";
  const images = project.images ?? [];

  if (images.length > 1) {
    return (
      <div className="flex flex-col sm:flex-row items-stretch gap-4">
        {images.map((img, i) => (
          <React.Fragment key={img.src}>
            <div className="flex-1 min-w-0">
              <BrowserFrame
                label={img.caption ?? `${project.id}-0${i + 1}`}
                height="auto"
              >
                <MockImageFill src={img.src} alt={img.alt} fill={false} />
              </BrowserFrame>
            </div>
            {i < images.length - 1 && (
              <div className="flex items-center justify-center shrink-0 h-6 sm:h-auto">
                <ArrowRight size={18} style={{ color: MUTED_GRAY }} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  }

  if (images.length === 1) {
    const img = images[0];
    return (
      <div className="max-w-4xl mx-auto">
        <BrowserFrame
          label={hasLiveUrl ? project.live.replace(/^https?:\/\//, "") : `${project.id}.app`}
          showLive={hasLiveUrl}
          height="auto"
          href={hasLiveUrl ? project.live : undefined}
        >
          <MockImageFill src={img.src} alt={img.alt} fill={false} />
        </BrowserFrame>
      </div>
    );
  }

  return (
    <BrowserFrame
      label={hasLiveUrl ? project.live.replace(/^https?:\/\//, "") : `${project.id}.app`}
      showLive={hasLiveUrl}
      height="320px"
    >
      <div className="p-8 flex flex-col justify-center gap-6">
        <div>
          <div className={`${mono.className} text-[11px] tracking-[0.2em] uppercase mb-3`} style={{ color: DARK_GRAY, opacity: 0.7 }}>{project.accentName}</div>
          <div className={`${zalando.className} font-bold text-2xl uppercase`} style={{ color: ICE_WHITE }}>{project.title}</div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => <div key={i} className="h-16 rounded-lg" style={{ background: MUTED_GRAY }} />)}
        </div>
      </div>
    </BrowserFrame>
  );
}

function CaseStudyDetail({ project, onSwitch, nextId }: { project: Project; onSwitch: (id: string) => void; nextId: string }) {
  const router = useRouter();

  const goToProjectSection = () => {
    if (typeof window === "undefined") return;

    if (window.location.pathname === "/") {
      // Already on the landing page — just scroll straight to the section
      document.getElementById("project")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      // On a different route — navigate home, then scroll once the page mounts
      router.push("/#project");
      setTimeout(() => {
        document.getElementById("project")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 400);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-12">
        <button 
          onClick={goToProjectSection}
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] transition-colors" 
          style={{ color: MUTED_GRAY }} 
          onMouseEnter={e => e.currentTarget.style.color = ICE_WHITE} 
          onMouseLeave={e => e.currentTarget.style.color = MUTED_GRAY}
        >
          <ArrowLeft size={14} /> BACK TO PROJECT
        </button>
        <button type="button" onClick={() => onSwitch(nextId)} aria-label="Next case study" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] transition-colors" style={{ color: MUTED_GRAY }} onMouseEnter={e => e.currentTarget.style.color = ICE_WHITE} onMouseLeave={e => e.currentTarget.style.color = MUTED_GRAY}>
          <span className="hidden sm:inline">NEXT CASE STUDY</span>
          <ArrowUpRight size={18} className="sm:hidden" />
          <ArrowUpRight size={14} className="hidden sm:block" />
        </button>
      </div>

      <Reveal><p className={`${mono.className} text-[11px] tracking-[0.22em] uppercase mb-4`} style={{ color: DARK_GRAY }}>CASE STUDY — {project.index} / 02</p></Reveal>
      <Reveal><h3 className={`${zalando.className} font-black uppercase leading-[0.95] text-[clamp(2.2rem,6vw,4.2rem)] mb-4`} style={{ color: ICE_WHITE }}>{renderTitle(project.title, project.highlightWord)}</h3></Reveal>
      <Reveal><p className={`${mono.className} text-base sm:text-lg max-w-2xl mb-10 leading-relaxed`} style={{ color: MUTED_GRAY }}>{renderSubtitleHighlight(project.subtitle, project.subtitleHighlight)}</p></Reveal>
      <Reveal className="mb-12"><div className="grid grid-cols-2 sm:grid-cols-4 gap-x-8 gap-y-4">{project.meta.map((m) => <MetaChip key={m.label} {...m} />)}</div></Reveal>
      <Reveal className="mb-16"><MockPanel project={project} /></Reveal>
      <Reveal><p className={`${mono.className} max-w-2xl mb-16 leading-relaxed`} style={{ color: MUTED_GRAY }}>{project.summary}</p></Reveal>

      <div className="grid sm:grid-cols-3 gap-10">
        {project.narrative.map((n) => (
          <Reveal key={n.n}>
            <div className={`${mono.className} text-[11px] tracking-[0.2em] uppercase mb-3`} style={{ color: DARK_GRAY }}>{n.n}</div>
            <div className={`${zalando.className} font-bold uppercase mb-2 text-sm`} style={{ color: ICE_WHITE }}>{n.h}</div>
            <p className={`${mono.className} text-sm leading-relaxed`} style={{ color: MUTED_GRAY }}>{renderHighlighted(n.p, n.highlight)}</p>
          </Reveal>
        ))}
      </div>
    </div>
  );
}

export default function CaseStudyLanding() {
  const searchParams = useSearchParams();
  const [openId, setOpenId] = useState<string>(() => {
    const requested = searchParams.get("project");
    return requested && CASES.some((c) => c.id === requested) ? requested : CASES[0].id;
  });
  const openProject = CASES.find((c) => c.id === openId) ?? CASES[0];
  const nextProject = CASES.find((c) => c.id !== openId) ?? CASES[0];

  return (
    <div className="study-section" style={{ background: BG, color: ICE_WHITE, width: "100%", minHeight: "100vh", position: "relative", overflow: "hidden" }}>
      <style>{`
        .study-section::before {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(245,246,252,0.14) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,246,252,0.14) 1px, transparent 1px);
          background-size: 48px 48px;
          opacity: 0.55;
        }
        .study-section::after {
          content: '';
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(245,246,252,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,246,252,0.12) 1px, transparent 1px);
          background-size: 192px 192px;
          opacity: 0.7;
        }

        .reg-mark {
          position: absolute;
          z-index: 2;
          pointer-events: none;
          width: 28px;
          height: 28px;
          border: 1px solid rgba(245,246,252,0.25);
        }
        .reg-mark.tl { top: 28px; left: 28px; border-right: none; border-bottom: none; }
        .reg-mark.tr { top: 28px; right: 28px; border-left: none; border-bottom: none; }
        .reg-mark.bl { bottom: 28px; left: 28px; border-right: none; border-top: none; }
        .reg-mark.br { bottom: 28px; right: 28px; border-left: none; border-top: none; }
        .reg-mark::before, .reg-mark::after {
          content: '';
          position: absolute;
          background: rgba(245,246,252,0.45);
        }
        .reg-mark::before { width: 1px; height: 8px; }
        .reg-mark::after  { width: 8px; height: 1px; }
        .reg-mark.tl::before { top: -1px; left: 50%; transform: translateX(-50%); }
        .reg-mark.tl::after  { top: 50%; left: -1px; transform: translateY(-50%); }
        .reg-mark.tr::before { top: -1px; right: 50%; transform: translateX(50%); }
        .reg-mark.tr::after  { top: 50%; right: -1px; transform: translateY(-50%); }
        .reg-mark.bl::before { bottom: -1px; left: 50%; transform: translateX(-50%); }
        .reg-mark.bl::after  { bottom: 50%; left: -1px; transform: translateY(-50%); }
        .reg-mark.br::before { bottom: -1px; right: 50%; transform: translateX(50%); }
        .reg-mark.br::after  { bottom: 50%; right: -1px; transform: translateY(-50%); }

        .coord-label {
          position: absolute;
          z-index: 2;
          pointer-events: none;
          font-family: ui-monospace, "SF Mono", "IBM Plex Mono", "JetBrains Mono", monospace;
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(245,246,252,0.45);
        }
        .coord-label.tl { top: 24px; left: 72px; }
        .coord-label.tr { top: 24px; right: 72px; }
        .coord-label.bl { bottom: 24px; left: 72px; }
        .coord-label.br { bottom: 24px; right: 72px; }
        .coord-label .val { color: rgba(245,246,252,0.75); font-weight: 500; }

        .edge-rule-left {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          z-index: 2;
          pointer-events: none;
          display: flex;
          align-items: center;
        }
        .edge-rule-left .line { width: 40px; height: 1px; background: rgba(245,246,252,0.25); }
        .edge-rule-left .label {
          font-family: ui-monospace, "SF Mono", "IBM Plex Mono", "JetBrains Mono", monospace;
          font-size: 8px;
          letter-spacing: 0.28em;
          text-transform: uppercase;
          color: rgba(245,246,252,0.45);
          padding-left: 10px;
          writing-mode: vertical-rl;
          transform: rotate(180deg);
        }

        .spec-bar {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 2;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px clamp(24px, 4vw, 64px);
          border-top: 1px solid rgba(245,246,252,0.08);
          font-family: ui-monospace, "SF Mono", "IBM Plex Mono", "JetBrains Mono", monospace;
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(245,246,252,0.45);
          pointer-events: none;
        }
        .spec-bar .group { display: flex; gap: 28px; align-items: center; }
        .spec-bar .item { display: flex; align-items: center; gap: 8px; }
        .spec-bar .dot { width: 5px; height: 5px; border-radius: 50%; background: #e63946; }
        .spec-bar b { color: rgba(245,246,252,0.75); font-weight: 500; }
        .spec-bar .rule { width: 24px; height: 1px; background: rgba(245,246,252,0.25); }

        .reveal { opacity: 0; transform: translateY(12px); transition: opacity 0.6s cubic-bezier(0.22,1,0.36,1), transform 0.6s cubic-bezier(0.22,1,0.36,1); }
        @media (prefers-reduced-motion: reduce) {
          .reveal { transition: none; opacity: 1; transform: none; }
          .animate-ping { animation: none; }
        }
        ::selection { background: ${DARK_GRAY}; color: ${BG}; }
        a:focus-visible, button:focus-visible { outline: 2px solid ${DARK_GRAY}; outline-offset: 2px; }

        @media (max-width: 900px) {
          .reg-mark, .coord-label, .edge-rule-left { display: none; }
          .spec-bar {
            flex-direction: column;
            gap: 10px;
            padding: 12px 24px;
          }
          .spec-bar .group { gap: 16px; }
        }
      `}</style>

      {/* Corner registration marks */}
      <div className="reg-mark tl" aria-hidden="true" />
      <div className="reg-mark tr" aria-hidden="true" />
      <div className="reg-mark bl" aria-hidden="true" />
      <div className="reg-mark br" aria-hidden="true" />

      {/* Coordinate labels */}
      <div className="coord-label tl" aria-hidden="true">X <span className="val">00</span> · Y <span className="val">03</span></div>
      <div className="coord-label tr" aria-hidden="true">PLATE <span className="val">04</span> / CASE STUDY</div>
      <div className="coord-label bl" aria-hidden="true">GRID <span className="val">48</span> · MAJOR <span className="val">192</span></div>
      <div className="coord-label br" aria-hidden="true">SECTION <span className="val">04</span></div>

      {/* Left vertical rule */}
      <div className="edge-rule-left" aria-hidden="true">
        <div className="line" />
        <div className="label">Registration · Vertical Datum</div>
      </div>

      <div className="relative z-30 max-w-6xl mx-auto px-6 sm:px-10 pt-28 sm:pt-36 pb-16 sm:pb-20">
        <div key={openId} className="view-enter">
          <CaseStudyDetail project={openProject} onSwitch={setOpenId} nextId={nextProject.id} />
        </div>
      </div>

      {/* Bottom spec bar */}
      <div className="spec-bar" aria-hidden="true">
        <div className="group">
          <div className="item"><span className="dot" /> SYSTEM <b>ACTIVE</b></div>
          <div className="rule" />
          <div className="item">FRAME <b>{openProject.index}</b> / <b>02</b></div>
        </div>
        <div className="group">
          <div className="item">SCROLL <b>READY</b></div>
          <div className="rule" />
          <div className="item">BUILD <b>V1.0</b> · 2026</div>
        </div>
      </div>

      <ThunderScrollButton />
    </div>
  );
}