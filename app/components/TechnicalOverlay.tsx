"use client";

export default function TechnicalOverlay() {
  return (
    <div className="tech-overlay" aria-hidden="true">
      <div className="tech-grid-minor" />
      <div className="tech-grid-major" />

      <div className="reg-mark tl" />
      <div className="reg-mark tr" />
      <div className="reg-mark bl" />
      <div className="reg-mark br" />

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
        }
        .tech-grid-major {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(245,246,252,0.12) 1px, transparent 1px),
            linear-gradient(90deg, rgba(245,246,252,0.12) 1px, transparent 1px);
          background-size: 192px 192px;
          opacity: 0.7;
        }

        .reg-mark {
          position: fixed;
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

        .edge-rule-left {
          position: fixed;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
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

        @media (max-width: 900px) {
          .reg-mark, .edge-rule-left { display: none; }
        }
      `}</style>
    </div>
  );
}