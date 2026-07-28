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

    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);

    return () => {
      bodyEl.style.overflow = originalOverflow;
      bodyEl.style.position = originalPosition;
      bodyEl.style.top = originalTop;
      bodyEl.style.width = originalWidth;
      bodyEl.style.paddingRight = originalPaddingRight;

      htmlEl.style.scrollBehavior = "auto";
      window.scrollTo(0, scrollY);
      requestAnimationFrame(() => {
        htmlEl.style.scrollBehavior = originalScrollBehavior;
      });

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
      <div
        className={`absolute inset-0 ${closing ? "backdrop-exit" : "animate-[fadeIn_.18s_ease]"}`}
        style={{ background: "rgba(0,0,0,0.65)" }}
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 hidden sm:block pointer-events-none"
        style={{ backdropFilter: "blur(6px)", WebkitBackdropFilter: "blur(6px)" }}
        aria-hidden="true"
      />

      <div
        className={`relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-xl border ${closing ? "view-exit" : "view-enter"}`}
        style={{
          background: BG,
          borderColor: "rgba(245,246,252,0.08)",
          color: ICE_WHITE,
          willChange: "transform, opacity",
          transform: "translateZ(0)",
          backfaceVisibility: "hidden",
        }}
        onClick={(e) => e.stopPropagation()}
        onAnimationEnd={handleExitAnimationEnd}
      >
        <style>{`
          @keyframes fadeUp { to { opacity:1; transform:translateY(0); } }
          @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
          @keyframes fadeSlide { from { opacity:0; transform:translateY(100%);} to { opacity:1; transform:translateY(0); } }
          @keyframes fadeSlideDesktop { from { opacity:0; transform:translateY(12px);} to { opacity:1; transform:translateY(0); } }
          @keyframes fadeSlideOut { from { opacity:1; transform:translateY(0); } to { opacity:0; transform:translateY(100%); } }
          @keyframes fadeSlideOutDesktop { from { opacity:1; transform:translateY(0); } to { opacity:0; transform:translateY(8px); } }
          @keyframes fadeOut { from { opacity:1; } to { opacity:0; } }
          .view-enter { animation: fadeSlide .22s cubic-bezier(0.2,0.8,0.2,1) both; }
          .view-exit { animation: fadeSlideOut .18s cubic-bezier(0.2,0.8,0.2,1) both; }
          .backdrop-exit { animation: fadeOut .18s ease both; }
          @media (min-width: 640px) {
            .view-enter { animation: fadeSlideDesktop .28s cubic-bezier(0.22,1,0.36,1) both; }
            .view-exit { animation: fadeSlideOutDesktop .22s cubic-bezier(0.22,1,0.36,1) both; }
          }
          .reveal { opacity: 0; transform: translateY(10px); animation: fadeUp .45s ease forwards; transform: translateZ(0); }
          .reveal:nth-of-type(2){animation-delay:.08s}.reveal:nth-of-type(3){animation-delay:.16s}

          .modal-inner::before {
            content: '';
            position: absolute;
            inset: 0;
            z-index: 0;
            pointer-events: none;
            background-image:
              linear-gradient(rgba(245,246,252,0.14) 1px, transparent 1px),
              linear-gradient(90deg, rgba(245,246,252,0.14) 1px, transparent 1px);
            background-size: 48px 48px;
            opacity: 0.55;
          }
          .modal-inner::after {
            content: '';
            position: absolute;
            inset: 0;
            z-index: 0;
            pointer-events: none;
            background-image:
              linear-gradient(rgba(245,246,252,0.12) 1px, transparent 1px),
              linear-gradient(90deg, rgba(245,246,252,0.12) 1px, transparent 1px);
            background-size: 192px 192px;
            opacity: 0.7;
          }

          .reg-mark {
            position: absolute;
            z-index: 1;
            pointer-events: none;
            width: 20px;
            height: 20px;
            border: 1px solid rgba(245,246,252,0.25);
          }
          .reg-mark.tl { top: 12px; left: 12px; border-right: none; border-bottom: none; }
          .reg-mark.tr { top: 12px; right: 12px; border-left: none; border-bottom: none; }
          .reg-mark::before, .reg-mark::after {
            content: '';
            position: absolute;
            background: rgba(245,246,252,0.45);
          }
          .reg-mark::before { width: 1px; height: 6px; }
          .reg-mark::after  { width: 6px; height: 1px; }
          .reg-mark.tl::before { top: -1px; left: 50%; transform: translateX(-50%); }
          .reg-mark.tl::after  { top: 50%; left: -1px; transform: translateY(-50%); }
          .reg-mark.tr::before { top: -1px; right: 50%; transform: translateX(50%); }
          .reg-mark.tr::after  { top: 50%; right: -1px; transform: translateY(-50%); }

          .coord-label {
            position: absolute;
            z-index: 1;
            pointer-events: none;
            font-family: ui-monospace, "SF Mono", "IBM Plex Mono", "JetBrains Mono", monospace;
            font-size: 9px;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            color: rgba(245,246,252,0.45);
          }
          .coord-label.tl { top: 10px; left: 40px; }
          .coord-label.tr { top: 10px; right: 40px; }
          .coord-label .val { color: rgba(245,246,252,0.75); font-weight: 500; }

          .close-btn { transition: all 0.2s ease; }
          .close-btn:hover, .close-btn:focus-visible { 
            background: ${ICE_WHITE} !important; 
            color: ${BG} !important;
            border-color: ${ICE_WHITE} !important;
          }

          ::selection { background: ${DARK_GRAY}; color: ${BG}; }
          button:focus-visible { outline: 2px solid ${DARK_GRAY}; outline-offset: 2px; }

          .modal-content { position: relative; z-index: 2; }

          @media (prefers-reduced-motion: reduce) {
            .view-enter, .view-exit, .backdrop-exit, .reveal {
              animation-duration: 0.01ms !important;
            }
          }
        `}</style>

        <div className="modal-inner w-full h-full">
          <div className="reg-mark tl" aria-hidden="true" />
          <div className="reg-mark tr" aria-hidden="true" />

          <div className="coord-label tl" aria-hidden="true">X <span className="val">00</span> · Y <span className="val">01</span></div>
          <div className="coord-label tr" aria-hidden="true">SHEET <span className="val">02</span> / ABOUT</div>

          <div className="modal-content sticky top-0 z-10 flex items-start justify-between gap-4 px-6 sm:px-10 pt-6 sm:pt-8 pb-5" style={{ background: BG }}>
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
              className="close-btn shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
              style={{ color: MUTED_GRAY, border: "1px solid rgba(245,246,252,0.08)", background: "rgba(245,246,252,0.04)" }}
            >
              <X size={16} />
            </button>
          </div>

          <div className="modal-content px-6 sm:px-10 pb-10 sm:pb-12 space-y-6">
            <p className={`reveal ${zalando.className} text-[15px] sm:text-base leading-relaxed`} style={{ color: ICE_WHITE }}>
              Designed and built by{" "}
              <span style={{ color: ICE_WHITE }}>JHON CEDRICK F. NUNGAY</span> — a UX/UI designer and front-end developer —
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
    </div>
  );
}