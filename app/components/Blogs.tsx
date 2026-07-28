"use client";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState, type MouseEvent } from "react";
import { ArrowUpRight } from "lucide-react";
import { zalando, mono } from "../fonts";

const E = [0.22, 1, 0.36, 1] as [number, number, number, number];

const DARK_GRAY = "rgba(245,246,252,0.75)";
const ICE_WHITE = "#F5F6FC";
const MUTED_GRAY = "rgba(245,246,252,0.65)";
const BG = "#14141A";
const ACCENT_RED = "#E63946";

interface Post {
  index: string;
  tag: string;
  title: string;
  excerpt: string;
  content: string[];
  date: string;
  readTime: string;
  href: string;
}

const POSTS: Post[] = [
  {
    index: "01",
    tag: "ENGINEERING",
    title: "Detecting Low-End Devices in the Browser",
    excerpt:
      "Using navigator.deviceMemory and hardwareConcurrency to skip decorative blur and grid overlays on weaker hardware — without punishing everyone else.",
    content: [
      "Not every visitor has a high-refresh-rate display and a discrete GPU. When building portfolio sites with heavy decorative layers — blur, animated grids, parallax — it's tempting to ship the same experience to everyone.",
      "Instead of guessing, I use navigator.deviceMemory and navigator.hardwareConcurrency as a quick signal. On devices with 4GB RAM or fewer, and 4 logical cores or fewer, I skip the expensive visual layers entirely.",
      "The result: a fast, jank-free scroll on low-end laptops and phones, while everyone else still gets the full visual intent. No user-agent sniffing, no breakpoints, just a capability check that degrades gracefully."
    ],
    date: "2026",
    readTime: "6 MIN READ",
    href: "#",
  },
  {
    index: "02",
    tag: "PROCESS",
    title: "Prototyping in React, Shipping in Laravel",
    excerpt:
      "Why validating UX in Next.js and Tailwind first — before rebuilding in a client's production stack — protects both budget and design intent.",
    content: [
      "Clients often have a fixed production stack. In my Ultrafood project, that stack was Laravel, PHP, and Tailwind — not the React/Next.js environment I prototype fastest in.",
      "So I split the work: first, a full interactive prototype in Next.js to validate UX, brand expression, and micro-interactions with the marketing team. Once signed off, I rebuilt the approved front-end in Laravel blade templates.",
      "This two-step approach kept iteration cheap during the uncertain design phase, then gave the client exactly what they needed for production. No rework from misaligned expectations, no design intent lost in translation."
    ],
    date: "2026",
    readTime: "5 MIN READ",
    href: "#",
  },
  {
    index: "03",
    tag: "UX DECISIONS",
    title: "Why I Kept Red/Green — And Used Blue & Gold For ClassGuard",
    excerpt:
      "Red and green are the universal default for status UI. Here’s how I kept that familiar meaning while wrapping the whole system in the university’s own identity.",
    content: [
      "Red and green are the universal default for status UI — red for occupied, green for available — and I kept them exactly that way because they’re instantly understood by everyone.",
      "For ClassGuard, I didn’t replace those colors — I layered the university’s own blue and gold as the core visual theme for the interface, headers, and overall design. Status still reads instantly at a glance, but now the whole dashboard feels like it belongs on campus, not like a generic tool dropped into it.",
      "Small palette decisions like this are where personality and usability meet: keep what users already know, and make the rest feel like home. When your UI uses the institution’s own colors, people trust it faster — and it stops feeling like software."
    ],
    date: "2026",
    readTime: "4 MIN READ",
    href: "#",
  },
  {
    index: "04",
    tag: "ENGINEERING",
    title: "Building an Interactive Case Study Modal",
    excerpt:
      "Reduced-motion variants, scroll locking without layout shift, and mobile vs. desktop animation branching — the system behind the modal itself.",
    content: [
      "A case study modal looks simple on the surface. The complexity lives in the details: scroll locking without the page jumping, different animation curves on mobile vs. desktop, and respecting reduced-motion preferences.",
      "I lock scroll by fixing the body and recording the current scroll position, then restore it on close — no layout shift from the scrollbar appearing and disappearing. On mobile, the modal slides up from the bottom; on desktop, it fades in with a slight lift.",
      "Every interaction gets a reduced-motion fallback. The modal still opens and closes, but without the easing curve and translation. Accessibility isn't an afterthought — it's baked into the transition system."
    ],
    date: "2026",
    readTime: "7 MIN READ",
    href: "#",
  },
];

function PostRow({
  post,
  inView,
  index,
  isExpanded,
  isHidden,
  onToggle,
}: {
  post: Post;
  inView: boolean;
  index: number;
  isExpanded: boolean;
  isHidden: boolean;
  onToggle: () => void;
}) {
  const handleClick = (e: MouseEvent) => {
    e.preventDefault();
    onToggle();
  };

  return (
    <AnimatePresence mode="wait">
      {!isHidden && (
        <motion.div
          key={post.index}
          initial={{ opacity: 0, x: -16, height: "auto" }}
          animate={{ opacity: 1, x: 0, height: "auto" }}
          exit={{ opacity: 0, x: -16, height: 0, overflow: "hidden" }}
          transition={{ duration: 0.4, delay: isExpanded ? 0 : 0.15 + index * 0.08, ease: E }}
        >
          <a
            href={post.href}
            onClick={handleClick}
            className="group blog-row"
            style={{
              display: "grid",
              gridTemplateColumns: "56px 1fr auto",
              alignItems: "center",
              gap: "clamp(16px, 3vw, 32px)",
              padding: "clamp(16px, 2vw, 22px) clamp(4px, 1vw, 8px)",
              borderTop: `1px solid ${isExpanded ? ICE_WHITE : "rgba(245,246,252,0.12)"}`,
              textDecoration: "none",
              cursor: "pointer",
            }}
          >
            <span
              className={mono.className}
              style={{ fontSize: "12px", letterSpacing: "0.14em", color: ACCENT_RED, transition: "color 0.25s ease", fontWeight: 700 }}
            >
              {post.index}
            </span>

            <div style={{ minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "baseline", gap: "12px", flexWrap: "wrap" }}>
                <span
                  className={mono.className}
                  style={{ fontSize: "10px", letterSpacing: "0.2em", textTransform: "uppercase", color: DARK_GRAY, opacity: 0.85 }}
                >
                  {post.tag}
                </span>
              </div>
              <h3
                className={`${zalando.className} blog-row-title`}
                style={{
                  fontWeight: 800,
                  fontSize: "clamp(16px, 1.9vw, 21px)",
                  textTransform: "uppercase",
                  color: isExpanded ? DARK_GRAY : ICE_WHITE,
                  lineHeight: 1.25,
                  margin: "4px 0 0",
                  transition: "color 0.25s ease, transform 0.25s ease",
                  transform: isExpanded ? "translateX(6px)" : "translateX(0)",
                }}
              >
                {post.title}
              </h3>
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0, marginTop: 0 }}
                    animate={{ opacity: 1, height: "auto", marginTop: "16px" }}
                    exit={{ opacity: 0, height: 0, marginTop: 0 }}
                    transition={{ duration: 0.35, ease: E }}
                    style={{ overflow: "hidden" }}
                  >
                    {post.content.map((paragraph, pIndex) => (
                      <p
                        key={pIndex}
                        className={mono.className}
                        style={{
                          fontSize: "13px",
                          lineHeight: 1.8,
                          color: DARK_GRAY,
                          maxWidth: "640px",
                          margin: pIndex > 0 ? "12px 0 0" : 0,
                        }}
                      >
                        {paragraph}
                      </p>
                    ))}
                    <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "8px", marginTop: "16px", paddingTop: "12px", borderTop: "1px solid rgba(245,246,252,0.1)" }}>
                      <span className={mono.className} style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED_GRAY }}>
                        {post.date} · {post.readTime}
                      </span>
                      <span className={mono.className} style={{ fontSize: "10px", letterSpacing: "0.18em", textTransform: "uppercase", color: MUTED_GRAY }}>
                        POST {post.index} / {String(POSTS.length).padStart(2, "0")}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "clamp(10px, 2vw, 22px)" }}>
              <div style={{ textAlign: "right", display: "none" }} className="blog-row-meta">
                <span className={mono.className} style={{ fontSize: "10px", letterSpacing: "0.16em", color: DARK_GRAY, display: "block" }}>
                  {post.date}
                </span>
                <span className={mono.className} style={{ fontSize: "10px", letterSpacing: "0.16em", color: DARK_GRAY }}>
                  {post.readTime}
                </span>
              </div>
              <span
                className="blog-row-arrow"
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "50%",
                  border: `1px solid ${isExpanded ? ICE_WHITE : "rgba(245,246,252,0.2)"}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  background: isExpanded ? ICE_WHITE : "transparent",
                  color: isExpanded ? BG : ICE_WHITE,
                  transform: isExpanded ? "rotate(45deg)" : "rotate(0deg)",
                  transition: "all 0.25s ease",
                }}
              >
                <ArrowUpRight size={15} />
              </span>
            </div>
          </a>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Blog() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px 0px -60px 0px" });
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const togglePost = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section id="blog" ref={ref} className="blog-section">
      <div className="coord-label tl" aria-hidden="true">X <span className="val">00</span> · Y <span className="val">05</span></div>
      <div className="coord-label tr" aria-hidden="true">PLATE <span className="val">05</span> / BLOG</div>

      <div
        className="container"
        style={{
          position: "relative",
          zIndex: 3,
          maxWidth: "1020px",
          margin: "0 auto",
          padding: "clamp(50px, 7vw, 80px) clamp(24px, 4vw, 64px) clamp(60px, 7vw, 90px)",
          boxSizing: "border-box",
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: E }}
          style={{ marginBottom: "14px" }}
        >
          <p
            className={mono.className}
            style={{ fontSize: "11px", letterSpacing: "0.3em", textTransform: "uppercase", color: MUTED_GRAY, margin: 0 }}
          >
            BLOG
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={inView ? { opacity: 1, x: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1, ease: E }}
          style={{ marginBottom: "clamp(24px, 4vw, 40px)" }}
        >
          <h2
            className={zalando.className}
            style={{
              fontWeight: 800,
              textTransform: "uppercase",
              color: ICE_WHITE,
              lineHeight: 1.1,
              fontSize: "clamp(22px, 3vw, 34px)",
              margin: 0,
              maxWidth: "520px",
            }}
          >
            NOTES FROM THE <span style={{ color: DARK_GRAY }}>BUILD.</span>
          </h2>
        </motion.div>

        <div className="blog-list">
          {POSTS.map((post, i) => (
            <PostRow
              key={post.index}
              post={post}
              inView={inView}
              index={i}
              isExpanded={expandedIndex === i}
              isHidden={expandedIndex !== null && expandedIndex !== i}
              onToggle={() => togglePost(i)}
            />
          ))}
          <div style={{ borderTop: `1px solid ${ICE_WHITE}` }} aria-hidden="true" />
        </div>
      </div>

      <style>{`
        .blog-section {
          position: relative;
          background: transparent;
          overflow: hidden;
          width: 100%;
        }

        .coord-label {
          position: absolute;
          z-index: 2;
          pointer-events: none;
          font-family: ui-monospace, "SF Mono", "IBM Plex Mono", "JetBrains Mono", monospace;
          font-size: 9px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: rgba(245,246,252,0.45);
        }
        .coord-label.tl { top: 24px; left: 72px; }
        .coord-label.tr { top: 24px; right: 72px; }
        .coord-label .val { color: rgba(245,246,252,0.75); font-weight: 500; }

        .blog-list {
          display: flex;
          flex-direction: column;
        }
        .blog-row:hover {
          background: rgba(245,246,252,0.02);
        }
        .blog-row:hover .blog-row-title {
          color: ${DARK_GRAY};
          transform: translateX(6px);
        }
        .blog-row:hover .blog-row-arrow {
          background: ${ICE_WHITE} !important;
          border-color: ${ICE_WHITE} !important;
          color: ${BG} !important;
          transform: rotate(45deg) !important;
        }
        @media (min-width: 640px) {
          .blog-row-meta { display: block !important; }
        }

        @media (max-width: 900px) {
          .coord-label { display: none; }
        }
        @media (max-width: 560px) {
          .blog-row { grid-template-columns: 32px 1fr auto !important; }
        }
      `}</style>
    </section>
  );
}