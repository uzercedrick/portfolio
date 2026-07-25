"use client";
import { motion } from "framer-motion";
import { MdEmail } from "react-icons/md";
import { FaLinkedinIn, FaGithub } from "react-icons/fa";
import { zalando, mono } from "../fonts";

const DARK_GRAY = "rgba(245,246,252,0.75)";
const ICE_WHITE = "#F5F6FC";
const MUTED_GRAY = "rgba(245,246,252,0.55)";
const BG = "#14141A";

const SOCIAL = [
  { Icon: MdEmail,      href: "mailto:jhoncedrick.fuentes@gmail.com", label: "Email"    },
  { Icon: FaLinkedinIn, href: "https://linkedin.com/in/jcnungay",     label: "LinkedIn" },
  { Icon: FaGithub,     href: "https://github.com/uzercedrick/",      label: "GitHub"   },
];

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{
        background: BG,
        width: "100%",
        padding: "clamp(32px, 5vw, 48px) 0 clamp(24px, 4vw, 32px)",
        borderTop: `1px solid rgba(245,246,252,0.08)`,
      }}
    >
      <div 
        className="footer-container" 
        style={{
          maxWidth: "1080px",
          margin: "0 auto",
          padding: "0 28px",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
          gap: "24px",
          position: "relative",
        }}
      >
        {/* Left: subtle label */}
        <div 
          className={`${mono.className} footer-label`}
          style={{
            fontSize: "10px",
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            color: MUTED_GRAY,
            justifySelf: "start",
          }}
        >
          PORTFOLIO · 2026
        </div>

        {/* Center: copyright + credits */}
        <div 
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "6px",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <p 
            className={`${zalando.className} fd`} 
            style={{
              color: ICE_WHITE,
              fontSize: "clamp(12px, 1.6vw, 14px)",
              fontWeight: 700,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            © {new Date().getFullYear()} JHON CEDRICK F. NUNGAY
          </p>
          <p 
            className={`${mono.className} fb`} 
            style={{
              color: MUTED_GRAY,
              fontSize: "clamp(10px, 1.2vw, 12px)",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              margin: 0,
              lineHeight: 1.2,
            }}
          >
            DESIGNED IN FIGMA · BUILT WITH REACT
          </p>
        </div>

        {/* Right: social icons */}
        <div 
          className="footer-icons" 
          style={{
            display: "flex",
            gap: "10px",
            alignItems: "center",
            justifySelf: "end",
          }}
        >
          {SOCIAL.map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              style={{
                width: "34px",
                height: "34px",
                borderRadius: "2px",
                background: "transparent",
                border: `1px solid rgba(245,246,252,0.15)`,
                color: DARK_GRAY,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                transition: "all 0.25s ease",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = ICE_WHITE;
                e.currentTarget.style.color = ICE_WHITE;
                e.currentTarget.style.background = "rgba(245,246,252,0.05)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(245,246,252,0.15)";
                e.currentTarget.style.color = DARK_GRAY;
                e.currentTarget.style.background = "transparent";
              }}
            >
              <Icon size={14} />
            </a>
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-container {
            grid-template-columns: 1fr !important;
            text-align: center !important;
            gap: 20px !important;
          }
          .footer-label {
            justify-self: center !important;
            order: 3;
          }
          .footer-icons {
            justify-self: center !important;
            order: 2;
          }
        }
      `}</style>
    </motion.footer>
  );
}