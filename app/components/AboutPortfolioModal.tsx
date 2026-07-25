"use client";

import React, { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { zalando, mono } from "../fonts";

const DARK_GRAY = "rgba(245,246,252,0.75)";
const ICE_WHITE = "#F5F6FC";
const MUTED_GRAY = "rgba(245,246,252,0.55)";
const BG = "#14141A";

interface AboutPortfolioModalProps {
  open: boolean;
  onClose: () => void;
}

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
        className={`absolute inset-0 backdrop-blur-sm ${closing ? "backdrop-exit" : "animate-[fadeIn_.2s_ease]"}`}
        style={{ background: "rgba(0,0,0,0.65)" }}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        className={`relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-xl border ${closing ? "view-exit" : "view-enter"}`}
        style={{
          background: BG,
          borderColor: "rgba(245,246,252,0.08)",
          color: ICE_WHITE,
        }}
        onClick={(e) => e.stopPropagation()}
        onAnimationEnd={handleExitAnimationEnd}
      >
        <style>{`
          @keyframes fadeUp { to { opacity:1; transform:translateY(0); } }
          @keyframes fadeIn { to { opacity:1; } }
          @keyframes fadeSlide { from { opacity:0; transform:translateY(16px);} to { opacity:1; transform:none; } }
          @keyframes fadeSlideOut { from { opacity:1; transform:none; } to { opacity:0; transform:translateY(16px); } }
          @keyframes fadeOut { from { opacity:1; } to { opacity:0; } }
          .view-enter { animation: fadeSlide .35s cubic-bezier(0.22,1,0.36,1) both; }
          .view-exit { animation: fadeSlideOut .28s cubic-bezier(0.22,1,0.36,1) both; }
          .backdrop-exit { animation: fadeOut .28s ease both; }
          .reveal { opacity: 0; transform: translateY(10px); animation: fadeUp .55s ease forwards; }
          .reveal:nth-of-type(2){animation-delay:.1s}.reveal:nth-of-type(3){animation-delay:.2s}

          .close-btn { transition: all 0.2s ease; }
          .close-btn:hover, .close-btn:focus-visible { 
            background: rgba(245,246,252,0.08); 
            color: ${ICE_WHITE};
          }

          ::selection { background: ${DARK_GRAY}; color: ${BG}; }
          button:focus-visible { outline: 2px solid ${DARK_GRAY}; outline-offset: 2px; }
        `}</style>

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 px-6 sm:px-10 pt-6 sm:pt-8 pb-5" style={{ background: BG }}>
          <div>
            <div className={`${mono.className} text-[11px] tracking-[0.22em] uppercase mb-3`} style={{ color: DARK_GRAY }}>
              PORTFOLIO · V1.0
            </div>
            <h2
              id="about-portfolio-heading"
              className={`${zalando.className} font-black uppercase leading-[0.95] text-[clamp(1.6rem,4.5vw,2.75rem)]`}
            >
              ABOUT <span style={{ color: DARK_GRAY }}>THIS WEBSITE</span>
            </h2>
          </div>
          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Close about modal"
            className="close-btn shrink-0 p-2 rounded-lg"
            style={{ color: MUTED_GRAY, border: "1px solid rgba(245,246,252,0.08)" }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 sm:px-10 pb-10 sm:pb-12 space-y-6">
          <p className={`reveal ${zalando.className} text-[15px] sm:text-base leading-relaxed`} style={{ color: ICE_WHITE }}>
            Designed and built by{" "}
            <span
              style={{
                color: ICE_WHITE,
                fontWeight: 700,
                boxShadow: `inset 0 -1px 0 0 ${DARK_GRAY}`,
                paddingBottom: "1px",
              }}
            >
              JHON CEDRICK F. NUNGAY
            </span>{" "}
            — a UX/UI designer and front-end developer —
            this site walks through real, shipped work end to end: the Ultrafood Distributors Inc. B2B website and
            the ClassGuard IoT monitoring system, each broken down from problem to approach to result.
          </p>

          <p className={`reveal ${mono.className} text-[13px] sm:text-[14px] leading-relaxed`} style={{ color: MUTED_GRAY }}>
            Built on Next.js (App Router), React 18, and TypeScript, styled with Tailwind CSS, typeset in Zalando
            Sans Expanded and Ubuntu Sans Mono, with icons from Lucide and charts from Recharts.
          </p>

          <p className={`reveal ${mono.className} text-[11px] tracking-[0.18em] uppercase pt-2`} style={{ color: MUTED_GRAY }}>
            NAVOTAS CITY, PHILIPPINES · BUILT 2026 · ACTIVELY MAINTAINED
          </p>
        </div>
      </div>
    </div>
  );
}