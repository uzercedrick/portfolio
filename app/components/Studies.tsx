"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import ThunderScrollButton from "./thunder";
import { ArrowUpRight, ArrowLeft, ArrowRight } from "lucide-react";

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
    index: "01", id: "classguard", tag: "IoT dashboard · Real-time monitoring",
    title: "ClassGuard Monitoring System",
    highlightWord: "System",
    subtitle: "A real-time IoT dashboard tracking classroom temperature, humidity, and availability — built from scratch for City of Malabon University and recognized as a Research Congress finalist.",
    subtitleHighlight: "A real-time IoT dashboard",
    summary: "Led UX/UI design, front-end, and backend setup by a 5-person capstone team — designing a live monitoring dashboard for classroom conditions and availability, and building the Node.js backend and account system behind it. Selected as a Research Congress finalist.",
    meta: [
      { label: "Role", value: "UX/UI + Front-end Developer" },
      { label: "Team", value: "5-person capstone team" },
      { label: "Recognition", value: "Research Congress Finalist" },
      { label: "Stack", value: "HTML · Tailwind CSS · Node.js" },
    ],
    narrative: [
      {
        n: "01", h: "Problem",
        p: "Teachers at City of Malabon University had no way to check a classroom's temperature, humidity, or availability without walking over — a problem no existing system solved. Our 5-person capstone team built ClassGuard from scratch to fix it.",
        highlight: [
          "no way to check a classroom's temperature, humidity, or availability without walking over",
        ],
      },
      {
        n: "02", h: "Approach",
        p: "I led UX/UI and front-end design, building color-coded status cards (ClassGuard Violet) for at-a-glance room availability, plus the Node.js backend with real-time socket updates and an account system verified through Google SMTP. Room readings came from Arduino Uno boards with DHT11 sensors, transmitted live via ESP32 microcontrollers.",
        highlight: [
          "color-coded status cards (ClassGuard Violet) for at-a-glance room availability",
        ],
      },
      {
        n: "03", h: "Result",
        p: "ClassGuard was live-demoed across 2 classrooms for our thesis defense and selected as a Research Congress finalist. The working prototype proved the concept — real-time room conditions readable at a glance — with full multi-room deployment as the clear next step.",
        highlight: [
          "selected as a Research Congress finalist",
        ],
      },
    ],
    brand: { a: "#E7DEFF", b: "#7C5CFF", c: "#2B1F4D" },
    accentName: "ClassGuard violet", live: "#",
    images: [
      { src: "/login.png", alt: "ClassGuard login and account verification screen", caption: "Login" },
      { src: "/dashboard.png", alt: "ClassGuard dashboard — room status overview", caption: "Dashboard" },
      { src: "/overview.png", alt: "ClassGuard room overview and live sensor readings", caption: "Overview" },
    ],
  },
  {
    index: "02", id: "ultrafood", tag: "FMCG client · B2B website",
    title: "Ultrafood Distributors Inc.",
    highlightWord: "Inc.",
    subtitle: "A B2B website for Ultrafood Distributors Inc. — prototyped in React and shipped in Laravel as their new, live production site.",
    subtitleHighlight: "A B2B website for Ultrafood Distributors Inc.",
    summary: "Converted the marketing team's brand guidelines into a validated Figma-to-React/Next.js prototype, then rebuilt the front-end in Laravel, PHP, and Tailwind CSS to match the client's production stack. The result: Ultrafood Distributors Inc.'s first dedicated B2B website, now live in production.",
    meta: [
      { label: "Role", value: "UX/UI + Landing Page Dev" },
      { label: "Team", value: "4-person team" },
      { label: "Timeline", value: "6 wks · 400-hr onsite OJT" },
      { label: "Stack", value: "Figma · Laravel · Tailwind CSS · PHP" },
      { label: "Status", value: "Deployed Live Website" },
    ],
    narrative: [
      {
        n: "01", h: "Problem",
        p: "Ultrafood Distributors needed its own dedicated B2B website to represent its brands, Menu Food Solutions and Nordic Foods Philippines — while a sister company's site was already up and running, Ultrafood had no web presence of its own. Leadership brought in a 4-person intern team to design and build one from scratch.",
        highlight: [
          "Ultrafood had no web presence of its own",
        ],
      },
      {
        n: "02", h: "Approach",
        p: "I owned the landing page front-end and a Google SMTP-powered contact form solo, validating the design in a React, Next.js, and Tailwind CSS prototype before rebuilding it in Laravel and PHP to match the client's production stack — all during a 400-hour onsite internship.",
        highlight: [
          "validating the design in a React, Next.js, and Tailwind CSS prototype before rebuilding it in Laravel and PHP to match the client's production stack",
        ],
      },
      {
        n: "03", h: "Result",
        p: "The site shipped and is live today at ultrafoodinc.com, giving Ultrafood its first dedicated brand presence. The internship supervisor overseeing the project gave positive feedback on the final result.",
        highlight: [
          "live today at ultrafoodinc.com",
        ],
      },
    ],
    brand: { a: "#EAF7C9", b: "#4C7A2E", c: "#1F3A16" },
    accentName: "Ultrafood green", live: "https://ultrafoodinc.com/",
    images: [
      { src: "/ultrafood.png", alt: "Ultrafood Distributors Inc. live website" },
    ],
  },
];

function renderTitle(title: string, highlight?: string) {
  if (!highlight) return title;
  const idx = title.indexOf(highlight);
  if (idx === -1) return title;
  return (
    <>
      {title.slice(0, idx)}
      <span className="text-volt">{title.slice(idx, idx + highlight.length)}</span>
      {title.slice(idx + highlight.length)}
    </>
  );
}

function renderHighlighted(text: string, highlight?: string | string[]) {
  if (!highlight) return text;
  const highlights = Array.isArray(highlight) ? highlight : [highlight];
  const parts: React.ReactNode[] = [];
  let cursor = 0;
  highlights.forEach((h, i) => {
    const idx = text.indexOf(h, cursor);
    if (idx === -1) return;
    if (idx > cursor) parts.push(text.slice(cursor, idx));
    parts.push(<span key={i} className="text-marker">{h}</span>);
    cursor = idx + h.length;
  });
  parts.push(text.slice(cursor));
  return <>{parts}</>;
}

function useReveal(): [React.RefObject<HTMLDivElement | null>, boolean] {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } }),
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

function Reveal({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [ref, visible] = useReveal();
  return <div ref={ref} className={`reveal ${visible ? "reveal-in" : ""} ${className}`}>{children}</div>;
}

function MetaChip({ label, value }: MetaItem) {
  return (
    <div>
      <div className="font-mono text-volt text-[10px] tracking-[0.18em] uppercase mb-1.5">{label}</div>
      <div className="font-display text-bone text-[15px] leading-snug">{value}</div>
    </div>
  );
}

function MockImageFill({ src, alt, brand, fill = true }: { src: string; alt: string; brand: Brand; fill?: boolean }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        className={`w-full flex flex-col items-center justify-center gap-2 px-4 text-center border-2 border-dashed rounded-lg m-2 ${fill ? "h-full" : "min-h-[180px]"}`}
        style={{ borderColor: "rgba(255,255,255,0.18)" }}
      >
        <span className="font-mono text-[10px] tracking-[0.16em] uppercase" style={{ color: brand.a, opacity: 0.6 }}>
          Add image
        </span>
        <span className="font-mono text-[10px] break-all" style={{ color: brand.a, opacity: 0.4 }}>
          public{src}
        </span>
      </div>
    );
  }

  const fillClass = "w-full h-full object-contain object-top transition-transform duration-1500 ease-out group-hover:scale-[1.02]";
  const looseClass = "w-full h-auto block transition-transform duration-1500 ease-out group-hover:scale-[1.02]";

  return (
    <img
      src={src}
      alt={alt}
      className={fill ? fillClass : looseClass}
      loading="eager"
      onError={() => setErrored(true)}
    />
  );
}

function BrowserFrame({
  brand, label, showLive, height, href, children,
}: {
  brand: Brand; label: string; showLive?: boolean; height: string; href?: string; children: React.ReactNode;
}) {
  const inner = (
    <>
      <div className="flex items-center gap-2 px-4 py-3 border-hair border-b" style={{ background: "rgba(0,0,0,0.18)" }}>
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#FF5F57" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#FEBC2E" }} />
        <span className="w-2.5 h-2.5 rounded-full" style={{ background: "#28C840" }} />
        <span className="font-mono text-[11px] ml-3 truncate" style={{ color: brand.a }}>{label}</span>
        {showLive && (
          <span className="ml-auto flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] shrink-0" style={{ color: brand.a }}>
            <span className="relative flex w-1.5 h-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60" style={{ background: brand.a }} />
              <span className="relative inline-flex rounded-full w-1.5 h-1.5" style={{ background: brand.a }} />
            </span>
            LIVE
          </span>
        )}
      </div>
      <div className="relative w-full bg-black/10" style={{ height }}>
        {children}
      </div>
    </>
  );

  const frameClass = "rounded-2xl overflow-hidden border-hair border";
  const frameStyle = { background: brand.c };

  if (href) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={`group relative block ${frameClass}`} style={frameStyle}>
        {inner}
      </a>
    );
  }
  return <div className={frameClass} style={frameStyle}>{inner}</div>;
}

function MockPanel({ project }: { project: Project }) {
  const { brand } = project;
  const hasLiveUrl = Boolean(project.live) && project.live !== "#";
  const images = project.images ?? [];

  if (images.length > 1) {
    return (
      <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-2">
        {images.map((img, i) => (
          <React.Fragment key={img.src}>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <BrowserFrame
                brand={brand}
                label={img.caption ?? `${project.id}-0${i + 1}`}
                height="auto"
              >
                <MockImageFill src={img.src} alt={img.alt} brand={brand} fill={false} />
              </BrowserFrame>
            </div>
            {i < images.length - 1 && (
              <div className="flex items-center justify-center shrink-0 h-6 sm:h-auto">
                <ArrowRight size={20} className="rotate-90 sm:rotate-0" style={{ color: brand.b }} />
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
      <div className="sm:max-w-xl md:max-w-3xl lg:max-w-4xl sm:mx-auto">
        <BrowserFrame
          brand={brand}
          label={hasLiveUrl ? project.live.replace(/^https?:\/\//, "") : `${project.id}.app`}
          showLive={hasLiveUrl}
          height="auto"
          href={hasLiveUrl ? project.live : undefined}
        >
          <MockImageFill src={img.src} alt={img.alt} brand={brand} fill={false} />
        </BrowserFrame>
      </div>
    );
  }

  return (
    <BrowserFrame
      brand={brand}
      label={hasLiveUrl ? project.live.replace(/^https?:\/\//, "") : `${project.id}.app`}
      showLive={hasLiveUrl}
      height="auto"
    >
      <div className="p-6 sm:p-10 min-h-70 flex flex-col justify-center gap-6">
        <div>
          <div className="font-mono text-[11px] tracking-[0.2em] uppercase mb-3" style={{ color: brand.a, opacity: 0.7 }}>{project.accentName}</div>
          <div className="font-display font-bold text-2xl sm:text-3xl uppercase leading-[1.05]" style={{ color: brand.a }}>{project.title}</div>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => <div key={i} className="h-16 rounded-lg" style={{ background: "rgba(255,255,255,0.08)" }} />)}
        </div>
      </div>
    </BrowserFrame>
  );
}

function CaseStudyDetail({ project, onSwitch, nextId }: { project: Project; onSwitch: (id: string) => void; nextId: string }) {
  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4 mb-12">
        <Link href="/" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-muted hover:text-volt transition-colors">
          <ArrowLeft size={14} /> Back to home
        </Link>
        <button type="button" onClick={() => onSwitch(nextId)} aria-label="Next case study" className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-muted hover:text-volt transition-colors mr-3 sm:mr-0 p-2 -my-2">
          <span className="hidden sm:inline">Next case study</span> <ArrowUpRight size={20} className="sm:hidden" /> <ArrowUpRight size={14} className="hidden sm:block" />
        </button>
      </div>
      <Reveal><div className="font-mono text-volt text-[11px] tracking-[0.22em] uppercase mb-4">Case study — {project.index} / 02</div></Reveal>
      <Reveal><h3 className="font-display font-black uppercase leading-[0.95] text-[clamp(2rem,6vw,4rem)] mb-4">{renderTitle(project.title, project.highlightWord)}</h3></Reveal>
      <Reveal><p className="text-muted font-display text-base sm:text-lg max-w-xl mb-10">{renderHighlighted(project.subtitle, project.subtitleHighlight)}</p></Reveal>
      <Reveal className="mb-10"><div className="grid grid-cols-2 sm:grid-cols-4 gap-x-6 gap-y-4">{project.meta.map((m) => <MetaChip key={m.label} {...m} />)}</div></Reveal>
      <Reveal className="mb-14"><MockPanel project={project} /></Reveal>
      <Reveal><p className="font-display text-bone/90 max-w-2xl mb-14 leading-relaxed">{project.summary}</p></Reveal>
      <div className="grid sm:grid-cols-3 gap-8 mb-14">
        {project.narrative.map((n) => (
          <Reveal key={n.n}>
            <div className="font-mono text-volt text-xs mb-3">{n.n}</div>
            <div className="font-display font-bold uppercase tracking-wide mb-2 text-sm">{n.h}</div>
            <p className="text-muted text-sm leading-relaxed">{renderHighlighted(n.p, n.highlight)}</p>
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
    <div className="bg-ink text-bone w-full flex-1 flex flex-col">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Zalando+Sans+Expanded:wght@400;500;600;700;800;900&family=Ubuntu+Sans+Mono:wght@400;500;700&display=swap');
        :root { --ink: #14141A; --volt: #CEFF1A; --bone: #F5F6FC; }
        .bg-ink { background-color: var(--ink); }
        .text-bone { color: var(--bone); }
        .text-volt { color: var(--volt); }
        .text-muted { color: rgba(245,246,252,0.55); }
        .text-bone\\/90 { color: rgba(245,246,252,0.9); }
        .border-hair { border-color: rgba(245,246,252,0.12); }
        .bg-panel { background-color: rgba(245,246,252,0.045); }
        .font-display { font-family: 'Zalando Sans Expanded', sans-serif; letter-spacing: 0.01em; }
        .font-mono { font-family: 'Ubuntu Sans Mono', monospace; }
        .text-marker { background: var(--volt); color: var(--ink); padding: 0 4px; border-radius: 2px; box-decoration-break: clone; -webkit-box-decoration-break: clone; }
        .reveal { opacity: 0; transform: translateY(14px); transition: opacity 0.6s ease, transform 0.6s ease; }
        .reveal-in { opacity: 1; transform: translateY(0); }
        @keyframes fadeSlide { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        .view-enter { animation: fadeSlide 0.35s ease both; }
        @media (prefers-reduced-motion: reduce) {
          .reveal, .view-enter { transition: none; animation: none; opacity: 1; transform: none; }
          .animate-ping { animation: none; }
        }
        ::selection { background: var(--volt); color: var(--ink); }
        a:focus-visible, button:focus-visible { outline: 2px solid var(--volt); outline-offset: 2px; }
      `}</style>
      <div className="max-w-6xl mx-auto px-6 sm:px-10 pt-28 sm:pt-36 pb-16 sm:pb-20 w-full flex-1 flex flex-col">
        <div key={openId} className="view-enter">
          <CaseStudyDetail project={openProject} onSwitch={setOpenId} nextId={nextProject.id} />
        </div>
      </div>
      <ThunderScrollButton />
    </div>
  );
}