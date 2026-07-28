"use client";
import { motion, AnimatePresence } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import ThunderScrollButton from "./thunder";
import { ArrowUpRight, ArrowLeft, ArrowRight, X } from "lucide-react";
import { zalando, mono } from "../fonts";

const E = [0.22, 1, 0.36, 1] as [number, number, number, number];
const E_MOBILE = [0.2, 0.8, 0.2, 1] as [number, number, number, number];

const DARK_GRAY = "rgba(245,246,252,0.75)";
const ICE_WHITE = "#F5F6FC";
const MUTED_GRAY = "rgba(245,246,252,0.65)";
const BG = "#14141A";
const HIGHLIGHT_BG = "#CEFF1A";
const HIGHLIGHT_TEXT = "#14141A";
const ACCENT_RED = "#E63946";

const CONGRESS_NAME = "International Research Conference on Building Sustainable Ecosystem 2025";

interface MetaItem { label: string; value: string; }
interface NarrativeItem {
  n: string; h: string; p: string;
  highlight?: string[];
  keywords: string[];
}
interface MockImage { src: string; alt: string; caption?: string; }
interface Brand { a: string; b: string; c: string; }
interface Project {
  index: string; id: string; tag: string; title: string; subtitle: string;
  summary: string; meta: MetaItem[]; narrative: NarrativeItem[];
  brand: Brand; accentName: string; live: string; images?: MockImage[];
  highlightWord?: string; subtitleHighlight?: string;
}

interface NavigatorExtended {
  deviceMemory?: number;
  hardwareConcurrency?: number;
  userAgent: string;
}

const nav = typeof navigator !== "undefined" ? (navigator as unknown as NavigatorExtended) : null;
const IS_MOBILE = typeof window !== "undefined" && (
  window.innerWidth < 768 ||
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(nav?.userAgent ?? "")
);
const IS_LOW_END = IS_MOBILE && (
  (nav?.deviceMemory !== undefined && nav.deviceMemory <= 4) ||
  (nav?.hardwareConcurrency !== undefined && nav.hardwareConcurrency <= 4)
);

const CASES: Project[] = [
  {
    index: "01", id: "classguard", tag: "IoT Dashboard · Real-Time Monitoring",
    title: "ClassGuard Monitoring System",
    highlightWord: "System",
    subtitle: "A real-time IoT dashboard tracking classroom temperature, humidity, and availability — built from scratch for City of Malabon University and recognized as a finalist at the " + CONGRESS_NAME + ".",
    subtitleHighlight: "A real-time IoT dashboard",
    summary: "Led UX/UI design, front-end, and backend setup by a 5-person capstone team — designing a live monitoring dashboard for classroom conditions and availability, and building the Node.js backend and account system behind it. Selected as a finalist at the " + CONGRESS_NAME + ".",
    meta: [
      { label: "ROLE", value: "UX/UI + Front-end Developer" },
      { label: "TEAM", value: "5-Person Capstone Team" },
      { label: "RECOGNITION", value: CONGRESS_NAME + " · Finalist" },
      { label: "STACK", value: "HTML · CSS · JAVASCRIPT · Node.js" },
    ],
    narrative: [
      {
        n: "01", h: "PROBLEM",
        p: "Faculty run on back-to-back schedules with no way to check if a room was free without walking over — and more often than not, that walk ended in a closed door and 5 to 10 minutes lost hunting for another space. I identified this as a fixable problem and led a 5-person team to build ClassGuard from scratch: a real-time classroom monitoring system that puts live room status in faculty's hands before they leave their office, with temperature and humidity sensing added as a bonus feature once the core system was working.",
        highlight: ["5 to 10 minutes lost hunting for another space"],
        keywords: ["Back-to-back schedules", "No room visibility", "Walking over", "Closed doors", "Lost class time"],
      },
      {
        n: "02", h: "APPROACH",
        p: "As the only designer and front-end developer on the team, I owned the wireframes, visual system, and full front-end build. The key decision was color: instead of the usual red/green traffic-light pattern, I used the university's own blue and gold, so status reads at a glance and still feels like it belongs on campus. I also owned the account creation and email verification flow end-to-end, restricting access to verified faculty and staff. My teammates built the Node.js backend, the socket layer pushing real-time updates, and the Arduino Uno/DHT11 sensors feeding data through ESP32. As team lead, my job was keeping the UI honest about what the hardware and backend could actually deliver in real time.",
        highlight: ["university's own blue and gold, so status reads at a glance"],
        keywords: ["Wireframes", "Visual system", "Blue & gold palette", "Email verification", "Real-time sockets", "Arduino + ESP32"],
      },
      {
        n: "03", h: "RESULT",
        p: "ClassGuard was a fully working system, not a simulation — we ran it live across two real classrooms for our thesis defense, proving the pipeline worked end-to-end under real conditions. It was selected as a finalist at the " + CONGRESS_NAME + ", our university's research showcase, and more importantly, it worked: faculty could check a room's status in seconds instead of losing 5 to 10 minutes walking over. Full multi-room rollout is the next step toward campus-wide deployment.",
        highlight: ["selected as a finalist at the " + CONGRESS_NAME],
        keywords: ["Live in 2 classrooms", "Thesis defense", CONGRESS_NAME + " Finalist", "Seconds vs. minutes", "Multi-room rollout next"],
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
      { label: "TIMELINE", value: "10-WEEK ONSITE INTERNSHIP" },
      { label: "STACK", value: "React · Next.js · Laravel · Tailwind CSS · PHP" },
      { label: "STATUS", value: "Deployed Live at ultrafoodinc.com" },
    ],
    narrative: [
      {
        n: "01", h: "PROBLEM",
        p: "Ultrafood Distributors runs two B2B brands — Menu Food Solutions and Nordic Foods Philippines — but neither had a website, while their sister company already did. That left Ultrafood invisible online, with no page for a prospective distributor, retailer, or HORECA buyer to land on and learn what either brand offered before reaching out. Leadership brought in a 4-person intern team, myself included, to design and build a dedicated site for both brands from scratch.",
        highlight: ["left Ultrafood invisible online"],
        keywords: ["Two B2B brands", "No website", "Sister company had one", "Invisible online", "No landing page for buyers"],
      },
     {
        n: "02", h: "APPROACH",
       p: "I owned full UX/UI. The core challenge: Menu leans playful and flavor-forward, while Nordic reads cleaner and more premium. I designed a clear split that gives each brand personality and directs visitors in one click. Before production, I built a React/Next.js/Tailwind prototype to validate UX with the client's marketing team fast. I built the landing page and contact form; teammates handled the rest of the site and backend. Over a 10-week onsite internship, I rebuilt the approved prototype in Laravel and PHP for their production stack.",
       highlight: ["Menu leans playful and flavor-forward, while Nordic reads cleaner and more premium"],
       keywords: ["Dual-brand UX", "Playful vs. premium", "React prototype", "Client validation", "Laravel rebuild", "10-week onsite"],
},
      {
        n: "03", h: "RESULT",
        p: "The site shipped and is live at ultrafoodinc.com — Ultrafood's first dedicated brand presence. The marketing supervisor praised the UX/UI directly, and leadership signed off with no major revision cycles. Next step: extend the same brand-section pattern as Ultrafood onboards more brands.",
        highlight: ["live at ultrafoodinc.com"],
        keywords: ["Shipped & live", "First brand presence", "UX praised by client", "No major revisions", "Extendable pattern"],
      },
    ],
    brand: { a: ICE_WHITE, b: DARK_GRAY, c: "#1F3A16" },
    accentName: "Ultrafood Green", live: "https://ultrafoodinc.com/",
    images: [{ src: "/ultrafood.png", alt: "Ultrafood Distributors Inc. live website" }],
  },
];

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
          lineHeight: "1.6",
          fontWeight: "normal",
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
        <span className={`${mono.className} text-[11px] tracking-[0.18em] uppercase`} style={{ color: DARK_GRAY, opacity: 0.6 }}>Image Unavailable</span>
        <span className={`${mono.className} text-[10px] break-all`} style={{ color: MUTED_GRAY }}>{src}</span>
      </div>
    );
  }
  if (fill) {
    return (
      <div className="relative w-full h-full">
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain object-center transition-transform duration-700 ease-out"
          loading="eager"
          onError={() => setErrored(true)}
        />
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      width={1200}
      height={800}
      className="w-full h-auto block transition-transform duration-700 ease-out"
      loading="eager"
      onError={() => setErrored(true)}
    />
  );
}

function BrowserFrame({ label, showLive, height, href, children }: {
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
      <div className="relative w-full" style={{ height }}>{children}</div>
    </>
  );
  const frameClass = "rounded-xl overflow-hidden border";
  const frameStyle = { borderColor: MUTED_GRAY, background: "rgba(245,246,252,0.02)" };
  if (href) {
    return <a href={href} target="_blank" rel="noopener noreferrer" className="group relative block" style={frameStyle}>{inner}</a>;
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
              <BrowserFrame label={img.caption ?? `${project.id}-0${i + 1}`} height="auto">
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
    <BrowserFrame label={hasLiveUrl ? project.live.replace(/^https?:\/\//, "") : `${project.id}.app`} showLive={hasLiveUrl} height="320px">
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

function useScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return;

    const htmlEl = document.documentElement;
    const bodyEl = document.body;
    const scrollY = window.scrollY;
    const scrollbarWidth = window.innerWidth - htmlEl.clientWidth;

    const originalOverflow = bodyEl.style.overflow;
    const originalPaddingRight = bodyEl.style.paddingRight;
    const originalScrollBehavior = htmlEl.style.scrollBehavior;
    const originalPosition = bodyEl.style.position;
    const originalTop = bodyEl.style.top;
    const originalWidth = bodyEl.style.width;

    bodyEl.style.overflow = "hidden";
    bodyEl.style.position = "fixed";
    bodyEl.style.top = `-${scrollY}px`;
    bodyEl.style.width = "100%";
    if (scrollbarWidth > 0) {
      bodyEl.style.paddingRight = `${scrollbarWidth}px`;
    }
    bodyEl.classList.add("modal-open");

    return () => {
      bodyEl.style.overflow = originalOverflow;
      bodyEl.style.position = originalPosition;
      bodyEl.style.top = originalTop;
      bodyEl.style.width = originalWidth;
      bodyEl.style.paddingRight = originalPaddingRight;
      bodyEl.classList.remove("modal-open");

      htmlEl.style.scrollBehavior = "auto";
      window.scrollTo(0, scrollY);
      requestAnimationFrame(() => {
        htmlEl.style.scrollBehavior = originalScrollBehavior;
      });
    };
  }, [locked]);
}

function NarrativeModal({
  item, onClose, projectTitle, projectIndex,
}: {
  item: NarrativeItem;
  onClose: () => void;
  projectTitle: string;
  projectIndex: string;
}) {
  useScrollLock(true);
  const closeBtnRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    closeBtnRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const animDuration = IS_LOW_END ? 0.18 : IS_MOBILE ? 0.22 : 0.4;
  const animEase = IS_MOBILE ? E_MOBILE : E;

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const panelVariants = IS_MOBILE ? {
    hidden: { opacity: 0, y: "100%" },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: animDuration, ease: animEase }
    },
    exit: { 
      opacity: 0, 
      y: "100%",
      transition: { duration: animDuration * 0.85, ease: animEase }
    },
  } : {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: animDuration, ease: animEase }
    },
    exit: { 
      opacity: 0, 
      y: 12,
      transition: { duration: animDuration * 0.85, ease: animEase }
    },
  };

  const showDecor = !IS_LOW_END;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key="backdrop"
        className="fixed inset-0 z-100 flex items-end sm:items-center justify-center p-0 sm:p-6"
        style={IS_MOBILE ? {} : { backdropFilter: "blur(8px)", WebkitBackdropFilter: "blur(8px)" }}
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: animDuration * 0.75, ease: animEase }}
        onClick={onClose}
      >
        <motion.div
          key="panel"
          className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl"
          style={{
            background: "#1A1A20",
            border: "1px solid rgba(245,246,252,0.14)",
            boxShadow: IS_MOBILE 
              ? "0 -8px 30px rgba(0,0,0,0.5)" 
              : "0 30px 80px rgba(0,0,0,0.55), 0 0 0 1px rgba(245,246,252,0.04) inset",
            willChange: "transform, opacity",
          }}
          variants={panelVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-heading"
        >
          {showDecor && (
            <>
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(245,246,252,0.08) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(245,246,252,0.08) 1px, transparent 1px)
                  `,
                  backgroundSize: "32px 32px",
                  opacity: 0.6,
                }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundImage: `
                    linear-gradient(rgba(245,246,252,0.06) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(245,246,252,0.06) 1px, transparent 1px)
                  `,
                  backgroundSize: "128px 128px",
                  opacity: 0.8,
                }}
              />
              <div className="absolute top-4 left-4 w-5 h-5 pointer-events-none" style={{ borderTop: "1px solid rgba(245,246,252,0.35)", borderLeft: "1px solid rgba(245,246,252,0.35)" }} />
              <div className="absolute top-4 right-4 w-5 h-5 pointer-events-none" style={{ borderTop: "1px solid rgba(245,246,252,0.35)", borderRight: "1px solid rgba(245,246,252,0.35)" }} />
              <div className="absolute bottom-4 left-4 w-5 h-5 pointer-events-none sm:block hidden" style={{ borderBottom: "1px solid rgba(245,246,252,0.35)", borderLeft: "1px solid rgba(245,246,252,0.35)" }} />
              <div className="absolute bottom-4 right-4 w-5 h-5 pointer-events-none sm:block hidden" style={{ borderBottom: "1px solid rgba(245,246,252,0.35)", borderRight: "1px solid rgba(245,246,252,0.35)" }} />
              <div className={`${mono.className} absolute top-3 left-12 text-[8px] tracking-[0.22em] uppercase pointer-events-none`} style={{ color: "rgba(245,246,252,0.35)" }}>
                X <span style={{ color: ACCENT_RED }}>00</span> · Y <span style={{ color: ACCENT_RED }}>01</span>
              </div>
              <div className={`${mono.className} absolute top-3 right-12 text-[8px] tracking-[0.22em] uppercase pointer-events-none`} style={{ color: "rgba(245,246,252,0.35)" }}>
                PLATE <span style={{ color: ACCENT_RED }}>{projectIndex}</span> · NARRATIVE <span style={{ color: ACCENT_RED }}>{item.n}</span>
              </div>
            </>
          )}

          <div className="relative z-10">
            <div className="sticky top-0 z-10 flex items-start justify-between gap-4 px-6 sm:px-12 pt-6 sm:pt-8 pb-5" style={{ background: "#1A1A20" }}>
              <div>
                <div className={`${mono.className} text-[10px] tracking-[0.22em] uppercase mb-3`} style={{ color: DARK_GRAY }}>
                  {projectTitle}
                </div>
                <div className="flex items-baseline gap-4">
                  <span className={`${mono.className} text-[11px] tracking-[0.2em] font-bold`} style={{ color: ACCENT_RED }}>{item.n}</span>
                  <h2
                    id="modal-heading"
                    className={`${zalando.className} font-black uppercase leading-none text-[clamp(1.5rem,5vw,2.5rem)]`}
                    style={{ color: ICE_WHITE }}
                  >
                    {item.h}
                  </h2>
                </div>
              </div>
              <button
                ref={closeBtnRef}
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 z-20"
                style={{ color: MUTED_GRAY, background: "rgba(245,246,252,0.04)", border: "1px solid rgba(245,246,252,0.08)" }}
                onMouseEnter={(e) => { 
                  e.currentTarget.style.color = BG; 
                  e.currentTarget.style.background = ICE_WHITE; 
                  e.currentTarget.style.borderColor = ICE_WHITE; 
                }}
                onMouseLeave={(e) => { 
                  e.currentTarget.style.color = MUTED_GRAY; 
                  e.currentTarget.style.background = "rgba(245,246,252,0.04)"; 
                  e.currentTarget.style.borderColor = "rgba(245,246,252,0.08)"; 
                }}
              >
                <X size={16} />
              </button>
            </div>

            <div className="w-full h-px mx-6 sm:mx-12" style={{ width: "calc(100% - 3rem)", background: "rgba(245,246,252,0.1)" }} />

            <div className="px-6 sm:px-12 pt-6 pb-6 sm:pb-8">
              <p
                className={`${mono.className} text-[15px] leading-[1.85]`}
                style={{ color: DARK_GRAY }}
              >
                {renderHighlighted(item.p, item.highlight)}
              </p>

              <div className="mt-8 pt-6" style={{ borderTop: "1px solid rgba(245,246,252,0.08)" }}>
                <div className={`${mono.className} text-[9px] tracking-[0.22em] uppercase mb-2`} style={{ color: MUTED_GRAY, opacity: 0.7 }}>
                  KEY TAKEAWAYS
                </div>
                <p className={`${mono.className} text-[13px] leading-[1.7]`} style={{ color: MUTED_GRAY }}>
                  {item.keywords.join(" · ")}
                </p>
              </div>
            </div>

            <div
              className="flex justify-between items-center px-6 sm:px-12 py-3"
              style={{
                borderTop: "1px solid rgba(245,246,252,0.08)",
                background: "rgba(245,246,252,0.015)",
              }}
            >
              <div className="flex items-center gap-5">
                <span className={`${mono.className} text-[8px] tracking-[0.2em] uppercase flex items-center gap-2`} style={{ color: "rgba(245,246,252,0.4)" }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: ACCENT_RED }} />
                  PANEL <b style={{ color: "rgba(245,246,252,0.6)", fontWeight: 500 }}>ACTIVE</b>
                </span>
                {!IS_MOBILE && (
                  <>
                    <span className="hidden sm:inline w-6 h-px" style={{ background: "rgba(245,246,252,0.2)" }} />
                    <span className={`${mono.className} text-[8px] tracking-[0.2em] uppercase hidden sm:inline`} style={{ color: "rgba(245,246,252,0.4)" }}>
                      GRID <b style={{ color: ACCENT_RED, fontWeight: 500 }}>32</b> · MAJOR <b style={{ color: ACCENT_RED, fontWeight: 500 }}>128</b>
                    </span>
                  </>
                )}
              </div>
              <span className={`${mono.className} text-[8px] tracking-[0.2em] uppercase`} style={{ color: "rgba(245,246,252,0.4)" }}>
                ESC · CLOSE
              </span>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function NarrativeCard({
  item, onOpen, projectTitle,
}: {
  item: NarrativeItem;
  onOpen: () => void;
  projectTitle: string;
}) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group w-full text-left rounded-xl p-6 transition-all duration-300 ease-out hover:-translate-y-1"
      style={{
        background: "rgba(245,246,252,0.02)",
        border: "1px solid rgba(245,246,252,0.1)",
        cursor: "pointer",
        willChange: "transform",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(245,246,252,0.05)";
        e.currentTarget.style.borderColor = "rgba(206,255,26,0.35)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(245,246,252,0.02)";
        e.currentTarget.style.borderColor = "rgba(245,246,252,0.1)";
      }}
      aria-haspopup="dialog"
      aria-label={`Open ${item.h} details for ${projectTitle}`}
    >
      <div className="mb-4">
        <div className={`${mono.className} text-[11px] tracking-[0.2em] uppercase mb-2`} style={{ color: DARK_GRAY }}>{item.n}</div>
        <div className={`${zalando.className} font-bold uppercase text-sm mb-1 flex items-center gap-2`} style={{ color: ICE_WHITE }}>
          {item.h}
          <ArrowUpRight
            size={14}
            style={{
              color: HIGHLIGHT_BG,
              opacity: 0,
              transform: "translate(-4px, 4px)",
              transition: "all 0.25s ease-out",
            }}
            className="group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0"
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {item.keywords.map((kw) => (
          <span
            key={kw}
            className={`${mono.className} text-[11px] px-2.5 py-1 rounded-md transition-colors duration-200`}
            style={{
              background: "rgba(245,246,252,0.05)",
              color: DARK_GRAY,
              border: "1px solid rgba(245,246,252,0.08)",
            }}
          >
            {kw}
          </span>
        ))}
      </div>

      <div className={`${mono.className} text-[10px] tracking-[0.18em] uppercase mt-4 flex items-center gap-1.5`} style={{ color: HIGHLIGHT_BG, opacity: 0.7 }}>
        Click to open
        <span className="inline-block transition-transform duration-200 group-hover:translate-x-0.5">→</span>
      </div>
    </button>
  );
}

function CaseStudyDetail({
  project, onSwitch, nextId,
}: {
  project: Project;
  onSwitch: (id: string) => void;
  nextId: string;
}) {
  const router = useRouter();
  const [activeNarrative, setActiveNarrative] = useState<NarrativeItem | null>(null);

  const goToProjectSection = () => {
    if (typeof window === "undefined") return;
    if (window.location.pathname === "/") {
      document.getElementById("project")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
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
          onMouseEnter={(e) => (e.currentTarget.style.color = ICE_WHITE)}
          onMouseLeave={(e) => (e.currentTarget.style.color = MUTED_GRAY)}
        >
          <ArrowLeft size={14} /> BACK TO PROJECT
        </button>
        <button
          type="button"
          onClick={() => onSwitch(nextId)}
          aria-label="Next case study"
          className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] transition-colors"
          style={{ color: MUTED_GRAY }}
          onMouseEnter={(e) => (e.currentTarget.style.color = ICE_WHITE)}
          onMouseLeave={(e) => (e.currentTarget.style.color = MUTED_GRAY)}
        >
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

      <div className="grid sm:grid-cols-3 gap-6">
        {project.narrative.map((n) => (
          <Reveal key={n.n}>
            <NarrativeCard
              item={n}
              projectTitle={project.title}
              onOpen={() => setActiveNarrative(n)}
            />
          </Reveal>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeNarrative && (
          <NarrativeModal
            item={activeNarrative}
            projectTitle={project.title}
            projectIndex={project.index}
            onClose={() => setActiveNarrative(null)}
          />
        )}
      </AnimatePresence>
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
        @media (max-width: 639px) {
          body.modal-open .study-section {
            background: #0e0e13 !important;
          }
          body.modal-open .study-section::before,
          body.modal-open .study-section::after {
            opacity: 0.35 !important;
          }
        }
        .reg-mark {
          position: absolute; z-index: 2; pointer-events: none;
          width: 28px; height: 28px; border: 1px solid rgba(245,246,252,0.25);
        }
        .reg-mark.tl { top: 28px; left: 28px; border-right: none; border-bottom: none; }
        .reg-mark.tr { top: 28px; right: 28px; border-left: none; border-bottom: none; }
        .reg-mark.bl { bottom: 28px; left: 28px; border-right: none; border-top: none; }
        .reg-mark.br { bottom: 28px; right: 28px; border-left: none; border-top: none; }
        .reg-mark::before, .reg-mark::after { content: ''; position: absolute; background: rgba(245,246,252,0.45); }
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
          position: absolute; z-index: 2; pointer-events: none;
          font-family: ui-monospace, "SF Mono", "IBM Plex Mono", "JetBrains Mono", monospace;
          font-size: 9px; letter-spacing: 0.22em; text-transform: uppercase; color: rgba(245,246,252,0.45);
        }
        .coord-label.tl { top: 24px; left: 72px; }
        .coord-label.tr { top: 24px; right: 72px; }
        .coord-label.bl { bottom: 24px; left: 72px; }
        .coord-label.br { bottom: 24px; right: 72px; }
        .coord-label .val { color: rgba(245,246,252,0.75); font-weight: 500; }
        .edge-rule-left {
          position: absolute; left: 0; top: 50%; transform: translateY(-50%);
          z-index: 2; pointer-events: none; display: flex; align-items: center;
        }
        .edge-rule-left .line { width: 40px; height: 1px; background: rgba(245,246,252,0.25); }
        .edge-rule-left .label {
          font-family: ui-monospace, "SF Mono", "IBM Plex Mono", "JetBrains Mono", monospace;
          font-size: 8px; letter-spacing: 0.28em; text-transform: uppercase;
          color: rgba(245,246,252,0.45); padding-left: 10px;
          writing-mode: vertical-rl; transform: rotate(180deg);
        }
        .spec-bar {
          position: absolute; bottom: 0; left: 0; right: 0; z-index: 2;
          display: flex; justify-content: space-between; align-items: center;
          padding: 14px clamp(24px, 4vw, 64px);
          border-top: 1px solid rgba(245,246,252,0.08);
          font-family: ui-monospace, "SF Mono", "IBM Plex Mono", "JetBrains Mono", monospace;
          font-size: 9px; letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(245,246,252,0.45); pointer-events: none;
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
          .spec-bar { flex-direction: column; gap: 10px; padding: 12px 24px; }
          .spec-bar .group { gap: 16px; }
        }
      `}</style>

      <div className="reg-mark tl" aria-hidden="true" />
      <div className="reg-mark tr" aria-hidden="true" />
      <div className="reg-mark bl" aria-hidden="true" />
      <div className="reg-mark br" aria-hidden="true" />

      <div className="coord-label tl" aria-hidden="true">X <span className="val">00</span> · Y <span className="val">03</span></div>
      <div className="coord-label tr" aria-hidden="true">PLATE <span className="val">04</span> / CASE STUDY</div>
      <div className="coord-label bl" aria-hidden="true">GRID <span className="val">48</span> · MAJOR <span className="val">192</span></div>
      <div className="coord-label br" aria-hidden="true">SECTION <span className="val">04</span></div>

      <div className="edge-rule-left" aria-hidden="true">
        <div className="line" />
        <div className="label">Registration · Vertical Datum</div>
      </div>

      <div className="relative z-30 max-w-6xl mx-auto px-6 sm:px-10 pt-28 sm:pt-36 pb-16 sm:pb-20">
        <div key={openId} className="view-enter">
          <CaseStudyDetail project={openProject} onSwitch={setOpenId} nextId={nextProject.id} />
        </div>
      </div>

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