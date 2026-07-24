"use client";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { zalando } from "../fonts";

const TOKENS = {
  bg: "#14141A",
  accent: "#CEFF1A",
  text: "#F5F6FC",
  textMuted: "rgba(245, 246, 252, 0.9)",
  panel: "rgba(245, 246, 252, 0.045)",
  hair: "rgba(245, 246, 252, 0.12)",
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
  descriptionHighlight?: string;
  meta: MetaItem[];
  caseStudyHref: string;
  windowLabel: string;
  headerColor: string;
}

const PROJECTS: Project[] = [
  {
    index: "01",
    tag: "IoT dashboard · Real-time monitoring",
    title: "CLASSGUARD MONITORING SYSTEM",
    description:
      "Web-based real-time classroom monitoring platform — Tracks live temperature and humidity via IoT sensors, with interactive dashboards, instant safety alerts, and historical trend logs. Led UX/UI design & front-end dev, and a University Research Congress awardee.",
    descriptionHighlight: "Web-based real-time classroom monitoring platform",
    meta: [
      { label: "Role", value: "UX/UI + Full-Stack" },
      { label: "Team", value: "5-person capstone team" },
      { label: "Recognition", value: "Research Congress Finalist" },
    ],
    caseStudyHref: "/studies?project=classguard",
    windowLabel: "classguard.app",
    headerColor: "#2B1F4D",
  },
  {
    index: "02",
    tag: "FMCG client · B2B website",
    title: "ULTRAFOOD DISTRIBUTORS INC",
    description:
      "End-to-end UX/UI design and front-end build for Ultrafood's full company website — Delivered a unified design system, scalable landing page, and a library of reusable, production-ready components for their internal marketing team.",
    descriptionHighlight: "Ultrafood's full company website",
    meta: [
      { label: "Role", value: "UX/UI + Landing Page Dev" },
      { label: "Team", value: "4-person team" },
      { label: "Status", value: "Replaced old site company-wide" },
    ],
    caseStudyHref: "/studies?project=ultrafood",
    windowLabel: "ultrafoodinc.com",
    headerColor: "#1F3A16",
  },
];

function renderHighlighted(text: string, highlight?: string) {
  if (!highlight) return text;
  const idx = text.indexOf(highlight);
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <span
        style={{
          background: TOKENS.accent,
          color: TOKENS.bg,
          fontWeight: 700,
          padding: "1px 4px",
          borderRadius: "2px",
          WebkitBoxDecorationBreak: "clone",
          boxDecorationBreak: "clone",
        }}
      >
        {text.slice(idx, idx + highlight.length)}
      </span>
      {text.slice(idx + highlight.length)}
    </>
  );
}

function ProjectCard({ project }: { project: Project }) {
  return (
    <Link
      href={project.caseStudyHref}
      aria-label={`View case study: ${project.title}`}
      className="project-card group block rounded-2xl border overflow-hidden w-full max-w-[480px] mx-auto flex flex-col min-h-[320px] sm:min-h-[420px]"
      style={{ borderColor: TOKENS.hair, background: TOKENS.panel }}
    >
      <div
        className="flex items-center gap-2 px-3 py-2 border-b"
        style={{ background: project.headerColor, borderColor: TOKENS.hair }}
      >
        <span className="w-2 h-2 rounded-full" style={{ background: "#FF5F57" }} />
        <span className="w-2 h-2 rounded-full" style={{ background: "#FEBC2E" }} />
        <span className="w-2 h-2 rounded-full" style={{ background: "#28C840" }} />
        <span className="font-mono text-[9px] ml-2" style={{ color: TOKENS.accent }}>
          {project.windowLabel}
        </span>
      </div>

      <div className="p-4 sm:p-6 flex flex-col flex-1">
        <div className="flex items-center justify-between mb-2.5">
          <span
            className="font-mono text-[10px] tracking-[0.2em] uppercase"
            style={{ color: TOKENS.accent }}
          >
            {project.index} — {project.tag}
          </span>
          <ArrowUpRight
            size={14}
            style={{ color: TOKENS.textMuted }}
            className="shrink-0 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
          />
        </div>

        <h3
          style={{
            fontFamily: zalando.style.fontFamily,
            fontWeight: 800,
            color: TOKENS.text,
          }}
          className="uppercase text-base sm:text-xl leading-tight mb-2"
        >
          {project.title}
        </h3>

        <p
          style={{
            color: TOKENS.textMuted,
            fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          }}
          className="text-xs sm:text-sm leading-relaxed mb-4"
        >
          {renderHighlighted(project.description, project.descriptionHighlight)}
        </p>

        <div className="grid grid-cols-3 gap-3 mt-auto">
          {project.meta.map((m) => (
            <div key={m.label} className="font-mono">
              <div
                className="text-[8px] tracking-[0.16em] uppercase mb-0.5"
                style={{ color: TOKENS.textMuted }}
              >
                {m.label}
              </div>
              <div className="text-[10px] leading-snug" style={{ color: TOKENS.text }}>
                {m.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Link>
  );
}

export default function ProjectsSection() {
  return (
    <section
      id="projects"
      style={{
        background: TOKENS.bg,
        padding: "clamp(40px, 6vw, 80px) 0",
        position: "relative",
      }}
    >
      <div className="container mx-auto px-5 max-w-7xl">
        <h2
          style={{
            fontFamily: zalando.style.fontFamily,
            fontWeight: 800,
            textAlign: "center",
            color: TOKENS.text,
            fontSize: "clamp(24px, 4vw, 44px)",
            lineHeight: 1.1,
            marginBottom: "clamp(32px, 5vw, 56px)",
            letterSpacing: "-0.01em",
          }}
        >
          FEEL FREE TO VIEW
          <br />
          <span style={{ color: TOKENS.accent }}>MY PROJECTS !</span>
        </h2>

        <div className="flex flex-col sm:flex-row sm:justify-center gap-7 sm:gap-10">
          {PROJECTS.map((p, idx) => (
            <div 
              key={p.index} 
              className={`w-full sm:w-auto sm:flex-1 sm:max-w-[460px] ${idx === 1 ? 'mobile-gap' : ''}`}
            >
              <ProjectCard project={p} />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .project-card {
          transition: border-color 0.2s ease, transform 0.2s ease;
        }
        .project-card:hover,
        .project-card:focus-visible {
          border-color: ${TOKENS.accent};
          transform: translateY(-2px);
        }
        @media (prefers-reduced-motion: reduce) {
          .project-card:hover,
          .project-card:focus-visible {
            transform: none;
          }
        }

        @media (max-width: 640px) {
          .project-card {
            min-height: 300px !important;
            max-width: 90% !important;
          }
          /* Balanced extra space only for mobile */
          .mobile-gap {
            margin-top: 1.5rem !important; /* ~24px — perfect middle ground */
          }
        }
      `}</style>
    </section>
  );
}