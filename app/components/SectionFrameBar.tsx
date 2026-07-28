"use client";
import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero", label: "HERO" },
  { id: "about", label: "ABOUT" },
  { id: "projects", label: "PROJECTS" },
  { id: "blog", label: "BLOG" },
  { id: "contact", label: "CONTACT" },
];

export default function SectionFrameBar() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const els = SECTIONS
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => !!el);

    if (els.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = SECTIONS.findIndex((s) => s.id === entry.target.id);
            if (idx !== -1) setActive(idx);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    els.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const current = SECTIONS[active];

  return (
    <div className="frame-bar" aria-hidden="true">
      <div className="group">
        <div className="item"><span className="dot" /> SYSTEM <b>ACTIVE</b></div>
        <div className="rule" />
        <div className="item">FRAME <b>{String(active + 1).padStart(2, "0")}</b> / <b>05</b></div>
      </div>
      <div className="group">
        <div className="item">SECTION <b>{current.label}</b></div>
        <div className="rule" />
        <div className="item">BUILD <b>V1.0</b> · 2026</div>
      </div>

      <style>{`
        .frame-bar {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 40;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px clamp(24px, 4vw, 64px);
          border-top: 1px solid rgba(245,246,252,0.08);
          background: rgba(20,20,26,0.7);
          backdrop-filter: blur(6px);
          -webkit-backdrop-filter: blur(6px);
          font-family: ui-monospace, "SF Mono", "IBM Plex Mono", "JetBrains Mono", monospace;
          font-size: 9px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(245,246,252,0.45);
          pointer-events: none;
          transition: opacity 0.2s ease;
        }
        .frame-bar .group { display: flex; gap: 28px; align-items: center; }
        .frame-bar .item { display: flex; align-items: center; gap: 8px; }
        .frame-bar .dot { width: 5px; height: 5px; border-radius: 50%; background: #e63946; }
        .frame-bar b { color: rgba(245,246,252,0.75); font-weight: 500; }
        .frame-bar .rule { width: 24px; height: 1px; background: rgba(245,246,252,0.25); }

        @media (max-width: 900px) {
          .frame-bar {
            flex-direction: column;
            gap: 8px;
            padding: 10px 24px;
          }
          .frame-bar .group { gap: 16px; }
        }
      `}</style>
    </div>
  );
}