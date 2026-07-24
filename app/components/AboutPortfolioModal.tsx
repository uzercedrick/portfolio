"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";

interface AboutPortfolioModalProps {
  open: boolean;
  onClose: () => void;
}

/* ------------------------------
   OFFICIAL COLOR THEME
   🟢 LIME      = #CEFF1A  (--volt)
   ⚫ MIDNIGHT  = #14141A  (--ink)
   ⚪ ICE WHITE = #F5F6FC  (--bone)
------------------------------ */

export default function AboutPortfolioModal({ open, onClose }: AboutPortfolioModalProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const [prevOpen, setPrevOpen] = React.useState(open);
  const [mounted, setMounted] = React.useState(open);
  const [closing, setClosing] = React.useState(false);

  if (open !== prevOpen) {
    setPrevOpen(open);
    if (open) {
      setMounted(true);
      setClosing(false);
    } else {
      setClosing(true);
    }
  }

  useEffect(() => {
    if (!mounted) return;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    document.body.style.overflow = "hidden";
    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [mounted, onClose]);

  const handleExitAnimationEnd = () => {
    if (closing) {
      setMounted(false);
      setClosing(false);
    }
  };

  if (!mounted) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="about-portfolio-heading"
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm ${closing ? "backdrop-exit" : "animate-[fadeIn_.2s_ease]"}`}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl border border-[rgba(245,246,252,0.12)] bg-[#14141A] text-[#F5F6FC] ${closing ? "view-exit" : "view-enter"}`}
        onClick={(e) => e.stopPropagation()}
        onAnimationEnd={handleExitAnimationEnd}
      >
        {/* Official Color Theme + Typography (scoped to modal) */}
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Zalando+Sans+Expanded:wght@400;500;600;700;800;900&family=Ubuntu+Sans+Mono:wght@400;500;700&display=swap');

          :root {
            --volt: #CEFF1A;   /* LIME */
            --ink: #14141A;    /* MIDNIGHT */
            --bone: #F5F6FC;   /* ICE WHITE */
            --muted: rgba(245,246,252,0.7);
          }

          .font-display { font-family: 'Zalando Sans Expanded', sans-serif; letter-spacing: 0.01em; }
          .font-mono { font-family: 'Ubuntu Sans Mono', monospace; }
          .text-volt { color: var(--volt); }
          .text-bone { color: var(--bone); }
          .text-muted { color: var(--muted); }

          .reveal { opacity: 0; transform: translateY(10px); animation: fadeUp .55s ease forwards; }
          .reveal:nth-of-type(2){animation-delay:.1s}.reveal:nth-of-type(3){animation-delay:.2s}
          @keyframes fadeUp { to { opacity:1; transform:translateY(0); } }
          @keyframes fadeIn { to { opacity:1; } }
          @keyframes fadeSlide { from { opacity:0; transform:translateY(16px);} to { opacity:1; transform:none; } }
          @keyframes fadeSlideOut { from { opacity:1; transform:none; } to { opacity:0; transform:translateY(16px); } }
          @keyframes fadeOut { from { opacity:1; } to { opacity:0; } }
          .view-enter { animation: fadeSlide .35s ease both; }
          .view-exit { animation: fadeSlideOut .28s ease both; }
          .backdrop-exit { animation: fadeOut .28s ease both; }

          .close-btn { transition: background-color .2s ease, color .2s ease, transform .2s ease; }
          .close-btn:hover, .close-btn:focus-visible { background-color: var(--volt); color: var(--ink); transform: scale(1.05); }

          ::selection { background: var(--volt); color: var(--ink); }
          button:focus-visible { outline: 2px solid var(--volt); outline-offset: 2px; }

          /* ✅ Shift close button left on mobile */
          @media (max-width: 640px) {
            .modal-header { padding-left: 20px !important; padding-right: 20px !important; }
            .close-btn { margin-right: 8px; }
          }
        `}</style>

        {/* Header — adjusted padding for mobile */}
        <div className="modal-header sticky top-0 z-10 flex items-start justify-between gap-4 px-6 sm:px-10 pt-6 sm:pt-8 pb-5 bg-[var(--ink)]">
          <div>
            <div className="font-mono text-volt text-[11px] tracking-[0.22em] uppercase mb-3">
              Portfolio · v1.0
            </div>
            <h2
              id="about-portfolio-heading"
              className="font-display font-black uppercase leading-[0.95] text-[clamp(1.6rem,4.5vw,2.75rem)]"
            >
              About <span className="text-volt">This Website</span>
            </h2>
          </div>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close about modal"
            className="close-btn shrink-0 p-2 rounded-full text-muted"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-6 sm:px-10 pb-10 sm:pb-12 space-y-6">
          <p className="reveal font-display text-bone text-[15px] sm:text-base leading-relaxed">
            Designed and built by{" "}
            <span
              style={{
                background: "var(--volt)",
                color: "var(--ink)",
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: "2px",
                WebkitBoxDecorationBreak: "clone",
                boxDecorationBreak: "clone",
              }}
            >
              Jhon Cedrick F. Nungay
            </span>{" "}
            — a UX/UI designer and front-end developer —
            this site walks through real, shipped work end to end: the Ultrafood Distributors Inc. B2B website and
            the ClassGuard IoT monitoring system, each broken down from problem to approach to result.
          </p>

          <p className="reveal font-mono text-muted text-[13px] sm:text-[14px] leading-relaxed">
            Built on Next.js (App Router), React 18, and TypeScript, styled with Tailwind CSS, typeset in Zalando
            Sans Expanded and Ubuntu Sans Mono, with icons from Lucide and charts from Recharts.
          </p>

          <p className="reveal font-mono text-[11px] tracking-[0.18em] uppercase text-muted pt-2">
            Navotas City, Philippines · Built 2026 · Actively maintained
          </p>
        </div>
      </div>
    </div>
  );
}