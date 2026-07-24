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

  const formOpen = isFormOpen !== undefined ? isFormOpen : internalOpen;

  return (
    <section id="contact" ref={ref} style={{ background: "#14141A", padding: "clamp(48px, 6vw, 80px) 0" }}>
      <div className="container">

        <div className="contact-top">
          <div className="contact-heading">
            <motion.h3
              initial={{ opacity: 0, y:28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.06, ease: E }}
              className="contact-outline"
              data-text="GOT A VISION?"
              style={{ fontSize: "clamp(36px, 4.2vw, 56px)", lineHeight: 0.98, letterSpacing: "-0.015em", margin: 0 }}
            >
              GOT A VISION?
            </motion.h3>

            <motion.h3
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.1, ease: E }}
              className="contact-outline"
              data-text="I'D LOVE TO"
              style={{ fontSize: "clamp(36px, 4.2vw, 56px)", lineHeight: 0.98, letterSpacing: "-0.015em", margin: "0.1em 0 0.12em" }}
            >
              I&apos;D LOVE TO
            </motion.h3>

            <motion.h3
              initial={{ opacity: 0, y: 28 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.65, delay: 0.18, ease: E }}
              className="fd"
              style={{ color: "#F5F6FC", fontSize: "clamp(36px, 4.2vw, 56px)", lineHeight: 0.98, letterSpacing: "-0.015em", marginBottom: "28px" }}
            >
                HEAR ALL<br />ABOUT <span style={{ color: "#CEFF1A" }}>IT.</span>
            </motion.h3>

            {/* Desktop resume button — hidden on mobile */}
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.28, ease: E }}
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-resume btn-resume-desktop"
            >
              VIEW RESUME <span style={{ fontSize: "14px" }}>↓</span>
            </motion.a>

          </div>

          <div className="contact-right-col">
            <div className="contact-items">
              {CONTACT_ITEMS.map(({ eyebrow, Icon, text, href }, i) => (
                <motion.div
                  key={eyebrow}
                  initial={{ opacity: 0, x: 28 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.55, delay: 0.14 + i * 0.13, ease: E }}
                  className="contact-item-block"
                >
                  <p className="fd contact-eyebrow" style={{ color: "#CEFF1A", fontSize: "clamp(14px, 1.3vw, 18px)", letterSpacing: "-0.02em", marginBottom: "8px", textTransform: "uppercase", lineHeight: 1 }}>
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

            {/* Mobile resume button — appears under contact info, hidden on desktop */}
            <motion.a
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: 0.55, ease: E }}
              href="/resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-resume btn-resume-mobile"
            >
              VIEW RESUME <span style={{ fontSize: "14px" }}>↓</span>
            </motion.a>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 44 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.55, ease: E }}
          className="cta-bottom"
        >
          <div className="cta-text-block">
            {/* Line 1: fits one line on desktop, also one line on mobile */}
            <h2 className="fd" style={{ color:"#CEFF1A", fontSize:"clamp(24px, 2.8vw, 38px)", lineHeight:1.0, letterSpacing:"0.01em", margin:0 }}>
              LET&apos;S MAKE SOMETHING
            </h2>
            {/* Line 2: TOGETHER */}
            <h2 className="fd" style={{ color:"#CEFF1A", fontSize:"clamp(28px,3.5vw,44px)", lineHeight:1.0, letterSpacing:"0.01em", margin:"0.08em 0" }}>
              TOGETHER
            </h2>
            {/* Line 3: promise text */}
            <p className="fd" style={{ color:"#F5F6FC", fontSize:"clamp(16px,2vw,24px)", lineHeight:1.1, letterSpacing:"0.01em", margin:"8px 0 0 0" }}>
              PROMISE I DON&apos;T <span style={{ color:"#CEFF1A" }}>BITE</span>
            </p>
          </div>

          <motion.button
            onClick={openForm}
            className="btn-start"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{ textTransform:"uppercase", flexShrink:0, fontSize:13 }}
          >
            START
          </motion.button>
        </motion.div>

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
        }

        .btn-resume {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #CEFF1A;
          color: #14141A;
          font-family: "Ubuntu Sans Mono", monospace;
          font-weight: 500;
          font-size: clamp(15px, 1.3vw, 19px);
          letter-spacing: 0.02em;
          text-transform: uppercase;
          padding: 12px 20px;
          text-decoration: none;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          transition: background 0.25s ease, transform 0.2s ease;
        }
        .btn-resume:hover {
          background: #D8FF48;
          transform: translateY(-2px);
        }
        .btn-resume-desktop {
          margin-bottom: 20px;
        }
        .btn-resume-mobile {
          display: none; /* hidden on desktop */
          margin-top: 8px;
        }

        .contact-items {
          display: flex;
          flex-direction: column;
          gap: clamp(28px, 3vw, 40px);
        }

        .contact-item-block {
          width: 100%;
        }

        .cta-bottom {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          gap: clamp(16px, 3vw, 32px);
          width: 100%;
          margin-top: 16px;
          flex-wrap: wrap;
          max-width: 1100px;
          margin-left: auto;
          margin-right: auto;
        }

        .cta-text-block {
          flex: 0 1 auto;
          min-width: 280px;
        }

        .btn-start {
          width: clamp(100px, 11vw, 120px);
          height: clamp(100px, 11vw, 120px);
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
          min-width: 64px;
          min-height: 64px;
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

        /* DESKTOP: tighter max-width + auto margins = true center on screen */
        .contact-top {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: clamp(40px, 5vw, 64px);
          align-items: start;
          margin-bottom: clamp(24px, 3vw, 32px);
          max-width: 1100px;
          margin-left: auto;
          margin-right: auto;
        }

        /* MOBILE */
        @media (max-width: 900px) {
          .contact-top {
            grid-template-columns: 1fr;
            gap: 28px;
            margin-bottom: 24px;
            max-width: 100%;
          }
          .cta-bottom {
            max-width: 100%;
          }
          #contact {
            padding: 48px 0 !important;
          }
          .contact-heading {
            max-width: 100%;
            text-align: center;
          }
          .contact-outline {
            width: auto !important;
            text-align: center;
          }
          /* Hide desktop resume button under heading on mobile */
          .btn-resume-desktop {
            display: none;
          }
          /* Show mobile resume button under contact info */
          .btn-resume-mobile {
            display: flex;
            margin: 0 auto;
            width: fit-content;
          }
          .contact-right-col {
            display: flex;
            flex-direction: column;
            gap: 24px;
          }
          .contact-items {
            align-items: center;
          }
          .contact-eyebrow {
            text-align: center;
          }
          .contact-row {
            display: flex !important;
            justify-content: center;
            width: 100%;
          }
          .cta-bottom {
            flex-direction: column;
            justify-content: center;
            text-align: center;
            gap: 28px;
          }
          .cta-text-block {
            text-align: center;
          }
        }
        @media (max-width: 768px) {
          .btn-start {
            width: 80px;
            height: 80px;
            font-size: 11px;
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