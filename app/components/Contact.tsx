"use client";
import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MdEmail } from "react-icons/md";
import { FaLinkedinIn, FaGithub } from "react-icons/fa";
import { mono } from "../fonts";
import FormPopup from "./Form";

const E = [0.22, 1, 0.36, 1] as [number, number, number, number];

const CONTACT_ITEMS = [
  { eyebrow: "MY INBOX IS ALWAYS OPEN",        Icon: MdEmail,      text: "jhoncedrick.fuentes@gmail.com", href: "mailto:jhoncedrick.fuentes@gmail.com" },
  { eyebrow: "DON'T JUDGE MY COMMIT MESSAGE",  Icon: FaGithub,     text: "github.com/uzerce",              href: "https://github.com/uzercedrick/"            },
  { eyebrow: "LET'S BE FRIENDS TOO",           Icon: FaLinkedinIn, text: "linkedin.com/in/jcnungay",       href: "https://linkedin.com/in/jcnungay"     },
];

type ContactProps = {
  isFormOpen?: boolean;
  onOpenForm?: () => void;
  onCloseForm?: () => void;
};

/**
 * Reveals the ORIGINAL outlined heading style (single continuous text run,
 * exactly like the untouched .contact-outline/::before CSS) with a smooth
 * left-to-right clip-path wipe, instead of animating individual letters.
 * Per-letter spans don't kern identically to a normal text run, which is
 * what caused the double-outline/misalignment glitch — revealing the real,
 * single text node avoids that entirely and keeps it fully readable.
 */
function TypedOutlineLine({
  text,
  className,
  style,
  inView,
  delay = 0,
  duration = 0.7,
}: {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  inView: boolean;
  delay?: number;
  duration?: number;
}) {
  return (
    <motion.h3
      className={className}
      data-text={text}
      style={style}
      initial={{ clipPath: "inset(0 100% 0 -10px)" }}
      animate={
        inView
          ? { clipPath: "inset(0 -10px 0 -10px)" }
          : { clipPath: "inset(0 100% 0 -10px)" }
      }
      transition={{ duration, ease: E, delay }}
    >
      {text}
    </motion.h3>
  );
}

/**
 * Renders a line of text as individually-animated <span> characters.
 * `segments` lets you mix colors and insert line breaks while keeping
 * a single continuous stagger sequence across the whole line. Used for
 * plain filled text (no outline/stroke), where per-letter kerning drift
 * isn't visually noticeable.
 */
type TypedSegment = { text: string; color?: string } | { break: true };

function TypedLine({
  segments,
  className,
  style,
  inView,
  charDelay = 0.045,
  startDelay = 0,
}: {
  segments: TypedSegment[];
  className?: string;
  style?: React.CSSProperties;
  inView: boolean;
  charDelay?: number;
  startDelay?: number;
}) {
  let counter = 0;
  return (
    <motion.h3 className={className} style={style}>
      {segments.map((seg, si) => {
        if ("break" in seg) return <br key={`br-${si}`} />;
        return seg.text.split("").map((char, ci) => {
          const idx = counter++;
          return (
            <motion.span
              key={`${si}-${ci}`}
              initial={{ opacity: 0, y: 8, filter: "blur(2px)" }}
              animate={
                inView
                  ? { opacity: 1, y: 0, filter: "blur(0px)" }
                  : { opacity: 0, y: 8, filter: "blur(2px)" }
              }
              transition={{
                duration: 0.4,
                ease: E,
                delay: startDelay + idx * charDelay,
              }}
              style={{
                display: "inline-block",
                whiteSpace: char === " " ? "pre" : "normal",
                color: seg.color,
              }}
            >
              {char}
            </motion.span>
          );
        });
      })}
    </motion.h3>
  );
}

export default function Contact({ isFormOpen, onOpenForm, onCloseForm }: ContactProps) {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px" });
  const [internalOpen, setInternalOpen] = useState(false);

  const openForm = () => {
    if (onOpenForm) onOpenForm();
    else setInternalOpen(true);
  };

  const closeForm = () => {
    if (onCloseForm) onCloseForm();
    else setInternalOpen(false);
  };

  // Forces an actual file download instead of opening the PDF in a new tab
  const downloadResume = async () => {
    try {
      const response = await fetch("/resume.pdf");
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "Jhon-Cedrick-Nungay-Resume.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Resume download failed:", err);
    }
  };

  const formOpen = isFormOpen !== undefined ? isFormOpen : internalOpen;

  return (
    <section id="contact" ref={ref} style={{ background: "#14141A", padding: "clamp(48px, 6vw, 80px) 0" }}>
      {/*
        Project section renders at max-w-7xl (1280px) with px-5 (20px) side padding.
        This is set wider (1440px) than that, with matching 20px side padding, and
        centered the same way (margin/mx auto) so both sections align visually.
      */}
      <div
        style={{
          width: "100%",
          maxWidth: "1440px",
          margin: "0 auto",
          padding: "0 20px",
          boxSizing: "border-box",
        }}
      >

        {/*
          Shared 2-column grid: row 1 = heading + contact info, row 2 = closing CTA + Start.
          Because both rows sit in the SAME grid (same two columns), column 1 always shares
          one left edge across both rows, and column 2 shares another — so the closing CTA
          text lines up with the heading/download button, and Start sits right next to it.
        */}
        <div className="contact-grid">

          <div className="contact-heading">
            <TypedOutlineLine
              inView={inView}
              className="contact-outline"
              style={{
                fontSize: "clamp(36px, 4.2vw, 56px)",
                lineHeight: 0.98,
                letterSpacing: "-0.015em",
                margin: 0,
                width: "max-content",
                maxWidth: "100%",
              }}
              delay={0.15}
              duration={0.7}
              text="GOT A VISION?"
            />

            <TypedOutlineLine
              inView={inView}
              className="contact-outline"
              style={{
                fontSize: "clamp(36px, 4.2vw, 56px)",
                lineHeight: 0.98,
                letterSpacing: "-0.015em",
                margin: "0.1em 0 0.12em",
                width: "max-content",
                maxWidth: "100%",
              }}
              delay={0.15 + 0.7 + 0.15}
              duration={0.7}
              text="I'D LOVE TO"
            />

            <TypedLine
              inView={inView}
              className="fd"
              style={{
                color: "#F5F6FC",
                fontSize: "clamp(36px, 4.2vw, 56px)",
                lineHeight: 0.98,
                letterSpacing: "-0.015em",
                marginBottom: "28px",
              }}
              startDelay={0.15 + 0.7 + 0.15 + 0.7 + 0.15}
              segments={[
                { text: "HEAR ALL", color: "#F5F6FC" },
                { break: true },
                { text: "ABOUT ", color: "#F5F6FC" },
                { text: "IT.", color: "#CEFF1A" },
              ]}
            />

            <motion.button
              type="button"
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.28, ease: E }}
              onClick={downloadResume}
              className={mono.className}
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                background: "transparent",
                color: "#F5F6FC",
                border: "2px solid #F5F6FC",
                fontWeight: 700,
                fontSize: "clamp(14px, 1.6vw, 16px)",
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                padding: "18px 40px",
                borderRadius: "6px",
                cursor: "pointer",
                transition: "all .2s ease",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = "#F5F6FC";
                el.style.color = "#14141A";
                el.style.borderColor = "#F5F6FC";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.background = "transparent";
                el.style.color = "#F5F6FC";
                el.style.borderColor = "#F5F6FC";
              }}
            >
              DOWNLOAD RESUME <span style={{ fontSize: "14px" }}>↓</span>
            </motion.button>
          </div>

          <div className="contact-info-col">
            {CONTACT_ITEMS.map(({ eyebrow, Icon, text, href }, i) => (
              <motion.div
                key={eyebrow}
                initial={{ opacity: 0, x: 28 }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.55, delay: 0.14 + i * 0.13, ease: E }}
              >
                <p className="fd" style={{ color: "#CEFF1A", fontSize: "clamp(14px, 1.3vw, 18px)", letterSpacing: "-0.02em", marginBottom: "8px", textTransform: "uppercase", lineHeight: 1 }}>
                  {eyebrow}
                </p>
                <a
                  href={href}
                  target={href.startsWith("http") ? "_blank" : undefined}
                  rel="noopener noreferrer"
                  style={{ display: "inline-flex", alignItems: "center", gap: "12px", textDecoration: "none" }}
                  className="contact-row"
                >
                  <span className="c-icon"><Icon size={20} /></span>
                  <span className={`${mono.className} contact-text`} style={{ color: "#F5F6FC", fontSize: "clamp(14px, 1.5vw, 18px)", letterSpacing: "0.01em", lineHeight: 1.2, whiteSpace: "nowrap" }}>
                    {text}
                  </span>
                </a>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 44 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.55, ease: E }}
            className="contact-cta-text"
          >
            <h2 className="fd" style={{ color:"#CEFF1A", fontSize:"clamp(28px,3.5vw,44px)", lineHeight:1.0, letterSpacing:"0.01em", margin:0 }}>
              LET&apos;S MAKE
            </h2>
            <h2 className="fd" style={{ color:"#CEFF1A", fontSize:"clamp(28px,3.5vw,44px)", lineHeight:1.0, letterSpacing:"0.01em", margin:0 }}>
              SOMETHING TOGETHER
            </h2>
            <p className="fd" style={{ color:"#F5F6FC", fontSize:"clamp(16px,2vw,24px)", lineHeight:1.1, letterSpacing:"0.01em", margin:"8px 0 0 0" }}>
              PROMISE I DON&apos;T <span style={{ color:"#CEFF1A" }}>BITE</span>
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 44 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.6, ease: E }}
            className="contact-start-wrap"
          >
            <motion.button
              onClick={openForm}
              className="btn-start"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{ textTransform:"uppercase", flexShrink:0, fontSize:11 }}
            >
              START
            </motion.button>
          </motion.div>

        </div>

      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Ubuntu+Sans+Mono:wght@400;500;600;700&display=swap');

        .fd {
          font-family: var(--font-zalando-expanded), "Arial Black", Impact, system-ui, sans-serif;
          font-weight: 900;
          text-transform: uppercase;
        }

        .contact-outline {
          position: relative;
          display: block;
          width: max-content;
          max-width: 100%;
          color: #14141A;
          -webkit-text-fill-color: #14141A;
          font-family: var(--font-zalando-expanded), "Arial Black", Impact, system-ui, sans-serif;
          font-weight: 900;
          text-transform: uppercase;
          text-rendering: geometricPrecision;
          z-index: 0;
        }
        .contact-outline::before {
          content: attr(data-text);
          position: absolute;
          inset: 0;
          z-index: -1;
          color: transparent;
          -webkit-text-stroke: clamp(3px, 0.3vw, 5px) #CEFF1A;
          text-stroke: clamp(3px, 0.3vw, 5px) #CEFF1A;
          pointer-events: none;
        }

        .contact-heading {
          max-width: 720px;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 20px;
        }

        .contact-info-col {
          display: flex;
          flex-direction: column;
          gap: clamp(28px, 3vw, 40px);
        }

        .contact-cta-text {
          display: flex;
          flex-direction: column;
        }

        .contact-start-wrap {
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }

        .btn-start {
          width: clamp(90px, 9vw, 108px);
          height: clamp(90px, 9vw, 108px);
          border-radius: 50%;
          background: #CEFF1A;
          color: #14141A;
          font-family: var(--font-zalando-expanded), "Arial Black", Impact, system-ui, sans-serif;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          border: none;
          cursor: pointer;
          transition: all 0.25s ease;
          flex-shrink: 0;
          box-shadow: 0 0 15px rgba(206, 255, 26, 0.2);
          min-width: 70px;
          min-height: 70px;
        }
        .btn-start:hover {
          background: #D8FF48;
          box-shadow: 0 0 25px rgba(206, 255, 26, 0.4);
        }
        .c-icon {
          width: clamp(28px, 2.5vw, 36px);
          height: clamp(28px, 2.5vw, 36px);
          border-radius: 4px;
          background: #F5F6FC;
          color: #14141A;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: background 0.2s ease, color 0.2s ease;
        }
        a:hover .c-icon {
          background: #CEFF1A;
          color: #14141A;
        }
        .contact-text {
          transition: color 0.2s ease;
        }
        .contact-row:hover .contact-text {
          color: #CEFF1A;
        }

        .contact-grid {
          display: grid;
          grid-template-columns: max-content max-content;
          justify-content: center;
          column-gap: clamp(16px, 2.5vw, 28px);
          row-gap: clamp(32px, 4vw, 48px);
        }

        @media (max-width: 900px) {
          .contact-grid {
            grid-template-columns: 1fr;
            justify-items: center;
            row-gap: 32px;
          }
          .contact-heading {
            align-items: center;
            text-align: center;
            max-width: 100%;
          }
          .contact-cta-text {
            align-items: center;
            text-align: center;
          }
          .contact-start-wrap {
            justify-content: center;
          }
          #contact {
            padding: 48px 0 !important;
          }
        }
        @media (max-width: 768px) {
          .btn-start {
            width: 80px;
            height: 80px;
            font-size: 10px;
          }
        }
        @media (max-width: 480px) {
          .btn-start {
            width: 72px;
            height: 72px;
            font-size: 10px;
          }
          .contact-row {
            gap: 10px !important;
          }
        }
      `}</style>

      <FormPopup isOpen={formOpen} onClose={closeForm} />
    </section>
  );
}