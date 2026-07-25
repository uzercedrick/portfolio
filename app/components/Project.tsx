"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { zalando, mono } from "../fonts";

const TOKENS = {
  bg: "#14141A",
  accent: "rgba(245,246,252,0.75)",
  text: "#F5F6FC",
  textMuted: "rgba(245, 246, 252, 0.65)",
  line: "rgba(245, 246, 252, 0.1)",
} as const;

interface MetaItem {
  label: string;
  value: string;
}

interface Project {
  index: string;
  tag: string;
  title: string;
  description: string;
  meta: MetaItem[];
  caseStudyHref: string;
  windowLabel: string;
}

const PROJECTS: Project[] = [
  {
    index: "01",
    tag: "IoT DASHBOARD · REAL-TIME MONITORING",
    title: "CLASSGUARD MONITORING SYSTEM",
    description:
      "Web-based platform for real-time classroom monitoring — tracking live temperature and humidity via IoT sensors, interactive dashboards, safety alerts, and historical logs. Led UX/UI design and front-end development; recognized at the University Research Congress.",
    meta: [
      { label: "ROLE", value: "UX/UI + Full-Stack" },
      { label: "TEAM", value: "5-Person Capstone" },
      { label: "STATUS", value: "Research Congress Finalist" },
    ],
    caseStudyHref: "/studies?project=classguard",
    windowLabel: "classguard.app",
  },
  {
    index: "02",
    tag: "CORPORATE · B2B WEBSITE",
    title: "ULTRAFOOD DISTRIBUTORS INC",
    description:
      "End-to-end UX/UI design and front-end build — delivering a unified design system, scalable landing page, and reusable production-ready components for their internal marketing team.",
    meta: [
      { label: "ROLE", value: "UX/UI + Landing Page Dev" },
      { label: "TEAM", value: "4-Person Team" },
      { label: "STATUS", value: "Company-Wide Launch" },
    ],
    caseStudyHref: "/studies?project=ultrafood",
    windowLabel: "ultrafoodinc.com",
  },
];

function ProjectItem({ project }: { project: Project }) {
  return (
    <Link
      href={project.caseStudyHref}
      aria-label={`View case study: ${project.title}`}
      className="project-item group block w-full max-w-[520px]"
      style={{ borderBottom: `1px solid ${TOKENS.line}`, paddingBottom: "clamp(28px, 4vw, 40px)" }}
    >
      {/* Top line: index + tag + arrow */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span
            className={`${mono.className} text-[11px] tracking-[0.25em]`}
            style={{ color: TOKENS.accent }}
          >
            {project.index}
          </span>
          <span
            className={`${mono.className} text-[10px] tracking-[0.2em] uppercase`}
            style={{ color: TOKENS.textMuted }}
          >
            {project.tag}
          </span>
        </div>
        <ArrowUpRight
          size={16}
          style={{ color: TOKENS.textMuted }}
          className="shrink-0 transition-all duration-300 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-[#F5F6FC]"
        />
      </div>

      {/* Title */}
      <h3
        style={{
          fontFamily: zalando.style.fontFamily,
          fontWeight: 800,
          color: TOKENS.text,
          letterSpacing: "0.1em",
        }}
        className="uppercase text-xl sm:text-2xl leading-snug mb-3"
      >
        {project.title}
      </h3>

      {/* Description */}
      <p
        style={{
          color: TOKENS.textMuted,
          fontFamily: mono.style.fontFamily,
          lineHeight: 1.75,
        }}
        className="text-xs sm:text-sm mb-5"
      >
        {project.description}
      </p>

      {/* Metadata */}
      <div className="flex flex-wrap gap-x-8 gap-y-2">
        {project.meta.map((m) => (
          <div key={m.label} className="flex items-center gap-2">
            <span
              className={`${mono.className} text-[9px] tracking-[0.18em] uppercase`}
              style={{ color: TOKENS.accent }}
            >
              {m.label}
            </span>
            <span className={`${mono.className} text-[11px]`} style={{ color: TOKENS.text }}>
              {m.value}
            </span>
          </div>
        ))}
      </div>

      {/* Window label — subtle tech touch */}
      <div className="mt-4">
        <span
          className={`${mono.className} text-[9px] tracking-[0.2em] uppercase`}
          style={{ color: TOKENS.textMuted }}
        >
          {project.windowLabel}
        </span>
      </div>
    </Link>
  );
}

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      className="projects-section"
    >
      {/* ── Corner registration marks ── */}
      <div className="reg-mark tl" aria-hidden="true" />
      <div className="reg-mark tr" aria-hidden="true" />
      <div className="reg-mark bl" aria-hidden="true" />
      <div className="reg-mark br" aria-hidden="true" />

      {/* ── Coordinate labels ── */}
      <div className="coord-label tl" aria-hidden="true">X <span className="val">00</span> · Y <span className="val">02</span></div>
      <div className="coord-label tr" aria-hidden="true">PLATE <span className="val">03</span> / PROJECTS</div>
      <div className="coord-label bl" aria-hidden="true">GRID <span className="val">48</span> · MAJOR <span className="val">192</span></div>
      <div className="coord-label br" aria-hidden="true">SECTION <span className="val">03</span></div>

      {/* ── Left vertical rule ── */}
      <div className="edge-rule-left" aria-hidden="true">
        <div className="line" />
        <div className="label">Registration · Vertical Datum</div>
      </div>

      <div className="container" style={{ position: "relative", zIndex: 3, width: "100%", margin: "0 auto", padding: "clamp(60px, 8vw, 100px) clamp(24px, 4vw, 64px)", maxWidth: "1020px", boxSizing: "border-box" }}>
        {/* Editorial Section Header */}
        <div className="mb-12">
          <p
            className={`${mono.className} text-[12px] tracking-[0.35em] uppercase mb-2`}
            style={{ color: TOKENS.textMuted }}
          >
            SELECTED WORK
          </p>
          <h2
            style={{
              fontFamily: zalando.style.fontFamily,
              fontWeight: 800,
              color: TOKENS.text,
              fontSize: "clamp(24px, 4vw, 40px)",
              lineHeight: 1.2,
              letterSpacing: "0.15em",
            }}
          >
            PROJECTS
          </h2>
        </div>

        {/* Clean list layout — no card frames */}
        <div className="flex flex-col sm:flex-row sm:justify-center gap-12 sm:gap-16">
          {PROJECTS.map((p) => (
            <ProjectItem key={p.index} project={p} />
          ))}
        </div>
      </div>

      {/* ── Bottom spec bar ── */}
      <div className="spec-bar" aria-hidden="true">
        <div className="group">
          <div className="item"><span className="dot" /> SYSTEM <b>ACTIVE</b></div>
          <div className="rule" />
          <div className="item">FRAME <b>03</b> / <b>06</b></div>
        </div>
        <div className="group">
          <div className="item">SCROLL <b>READY</b></div>
          <div className="rule" />
          <div className="item">BUILD <b>V1.0</b> · 2026</div>
        </div>
      </div>

      <style>{`
        .projects-section {
          position: relative;
          min-height: 100vh;
          background: #14141A;
          overflow: hidden;
          width: 100%;
        }

        /* Micro-grid overlay — matches Hero & About exactly */
        .projects-section::before {
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
        .projects-section::after {
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

        /* Registration marks — identical style */
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

        /* Coordinate labels — same typography */
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

        /* Left vertical rule — identical */
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

        /* Bottom spec bar — same component */
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
    </section>
  );
}