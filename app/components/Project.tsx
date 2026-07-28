"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { zalando, mono } from "../fonts";

const TOKENS = {
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
      { label: "ROLE", value: "UX/UI + Front-end Developer" },
      { label: "TEAM", value: "5-Person Capstone" },
      { label: "STATUS", value: "International Research Conference on Building Sustainable Ecosystem 2025" },
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
      style={{ borderBottom: `1px solid #F5F6FC`, paddingBottom: "clamp(28px, 4vw, 40px)" }}
    >
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
    <section id="projects" className="projects-section">
      <div className="coord-label tl" aria-hidden="true">X <span className="val">00</span> · Y <span className="val">02</span></div>
      <div className="coord-label tr" aria-hidden="true">PLATE <span className="val">03</span> / PROJECTS</div>

      <div className="container" style={{ position: "relative", zIndex: 3, width: "100%", margin: "0 auto", padding: "clamp(60px, 8vw, 100px) clamp(24px, 4vw, 64px)", maxWidth: "1020px", boxSizing: "border-box" }}>
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

        <div className="flex flex-col sm:flex-row sm:justify-center gap-12 sm:gap-16">
          {PROJECTS.map((p) => (
            <ProjectItem key={p.index} project={p} />
          ))}
        </div>
      </div>

      <style>{`
        .projects-section {
          position: relative;
          min-height: 100vh;
          background: transparent;
          overflow: hidden;
          width: 100%;
        }

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
        .coord-label .val { color: rgba(245,246,252,0.75); font-weight: 500; }

        @media (max-width: 900px) {
          .coord-label { display: none; }
        }
      `}</style>
    </section>
  );
}