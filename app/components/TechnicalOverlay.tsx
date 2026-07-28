"use client";
import { useEffect, useState } from "react";

const SECTIONS = [
  { id: "hero", label: "HERO", frame: "01", coord: "Y 00" },
  { id: "about", label: "ABOUT", frame: "02", coord: "Y 01" },
  { id: "projects", label: "PROJECTS", frame: "03", coord: "Y 02" },
  { id: "blog", label: "BLOG", frame: "04", coord: "Y 03" },
  { id: "contact", label: "CONTACT", frame: "05", coord: "Y 04" },
];

export default function TechnicalOverlay() {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = SECTIONS[activeIndex];

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTIONS.forEach((section, index) => {
      const el = document.getElementById(section.id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveIndex(index);
            }
          });
        },
        { threshold: 0.35, rootMargin: "-10% 0px -10% 0px" }
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  return (
    <div className="tech-overlay" aria-hidden="true">
      <div className="tech-grid-minor" />
      <div className="tech-grid-major" />

      <div className="reg-mark tl" />
      <div className="reg-mark tr" />
      <div className="reg-mark bl" />
      <div className="reg-mark br" />

      <div className="coord-label tl">
        X <span className="val">00</span> · {active.coord}
      </div>
      <div className="coord-label tr">
        PLATE <span className="val">{active.frame}</span> / {active.label}
      </div>
      <div className="coord-label bl">
        GRID <span className="val">48</span> · MAJOR <span className="val">192</span>
      </div>
      <div className="coord-label br">
        SECTION <span className="val">{active.frame}</span>
      </div>

      <div className="edge-rule-left">
        <div className="line" />
        <div className="label">Registration · Vertical Datum</div>
      </div>

      <style>{`
        .tech-overlay {
          position: fixed;
          inset: 0;
          z-index: 0;
          pointer-events: none;
        }
        .tech-grid-minor {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(245,246,252,0.14) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,246,252,0.14) 1px, transparent 1px);
          background-size: 48px 48px;
          opacity: 0.55;
          will-change: transform;
          transform: translateZ(0);
        }
        .tech-grid-major {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(245,246,252,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,246,252,0.12) 1px, transparent 1px);
          background-size: 192px 192px;
          opacity: 0.7;
          will-change: transform;
          transform: translateZ(0);
        }

        .reg-mark {
          position: fixed;
          width: 28px;
          height: 28px;
          border: 1px solid rgba(245,246,252,0.25);
          transition: border-color 0.4s ease;
        }
        .reg-mark.tl { top: 28px; left: 28px; border-right: none; border-bottom: none; }
        .reg-mark.tr { top: 28px; right: 28px; border-left: none; border-bottom: none; }
        .reg-mark.bl { bottom: 28px; left: 28px; border-right: none; border-top: none; }
        .reg-mark.br { bottom: 28px; right: 28px; border-left: none; border-top: none; }
        .reg-mark::before, .reg-mark::after {
          content: '';
          position: absolute;
          background: rgba(245,246,252,0.45);
          transition: background 0.4s ease;
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
          position: fixed;
          z-index: 1;
          font-family: ui-monospace, "SF Mono", "IBM Plex Mono", "JetBrains Mono", monospace;
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(245,246,252,0.45);
          transition: color 0.3s ease, opacity 0.3s ease;
        }
        .coord-label.tl { top: 24px; left: 72px; }
        .coord-label.tr { top: 24px; right: 72px; }
        .coord-label.bl { bottom: 24px; left: 72px; }
        .coord-label.br { bottom: 24px; right: 72px; }
        .coord-label .val {
          color: rgba(245,246,252,0.75);
          font-weight: 500;
          transition: color 0.3s ease;
        }

        .edge-rule-left {
          position: fixed;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          display: flex;
          align-items: center;
        }
        .edge-rule-left .line {
          width: 40px;
          height: 1px;
          background: rgba(245,246,252,0.25);
        }
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

        @media (max-width: 900px) {
          .reg-mark, .edge-rule-left, .coord-label { display: none; }
        }

        @media (prefers-reduced-motion: reduce) {
          .reg-mark, .reg-mark::before, .reg-mark::after, .coord-label, .coord-label .val {
            transition: none !important;
          }
        }
      `}</style>
    </div>
  );
}