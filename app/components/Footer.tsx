"use client";
import { motion } from "framer-motion";
import { MdEmail } from "react-icons/md";
import { FaLinkedinIn, FaGithub } from "react-icons/fa";
import { zalando } from "../fonts";

const SOCIAL = [
  { Icon: MdEmail,      href: "mailto:jhoncedrick.fuentes@gmail.com", label: "Email"    },
  { Icon: FaLinkedinIn, href: "https://linkedin.com/in/jcnungay",     label: "LinkedIn" },
  { Icon: FaGithub,     href: "https://github.com/uzercedrick/",            label: "GitHub"   },
];

export default function Footer() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      style={{
        background: "#CEFF1A",
        width: "100%",
        padding: "clamp(24px, 4vw, 32px) 0",
      }}
    >
      <div className="container" style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "clamp(14px, 2.5vw, 20px)",
        minHeight: "60px",
        padding: "0 20px",
      }}>

        {/* ✅ CENTERED COPYRIGHT & CREDITS */}
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "6px",
          alignItems: "center",
          textAlign: "center",
        }}>
          <p className="fd" style={{
            color: "#14141A",
            fontFamily: zalando.style.fontFamily,
            fontSize: "clamp(12px, 1.8vw, 15px)",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            margin: 0,
            lineHeight: 1.2,
          }}>
            © {new Date().getFullYear()} JHON CEDRICK F. NUNGAY
          </p>
          <p className="fb" style={{
            color: "#14141A",
            fontSize: "clamp(11px, 1.4vw, 13px)",
            letterSpacing: "0.06em",
            margin: 0,
            lineHeight: 1.2,
          }}>
            DESIGNED IN FIGMA • BUILT WITH REACT
          </p>
        </div>

        {/* ✅ ICONS DIRECTLY BELOW, CENTERED */}
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {SOCIAL.map(({ Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "4px",
                background: "#14141A",
                color: "#CEFF1A",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                textDecoration: "none",
                transition: "all 0.2s ease",
                flexShrink: 0,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#0E0E14";
                e.currentTarget.style.color = "#F5F6FC";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "#14141A";
                e.currentTarget.style.color = "#CEFF1A";
              }}
            >
              <Icon size={14} />
            </a>
          ))}
        </div>

      </div>

      <style>{`
        /* Consistent centered layout for ALL screen sizes */
        @media (max-width: 640px) {
          footer > div {
            padding: 20px 24px !important;
          }
        }
      `}</style>
    </motion.footer>
  );
}