"use client";

const BG = "#14141A";
const LINE = "rgba(245,246,252,0.08)";
const LINE_STRONG = "rgba(245,246,252,0.14)";

function SkeletonStyles() {
  return (
    <style>{`
      @keyframes sk-pulse {
        0%, 100% { opacity: 0.55; }
        50% { opacity: 1; }
      }
      .sk-block {
        background: ${LINE_STRONG};
        border-radius: 2px;
        animation: sk-pulse 1.6s ease-in-out infinite;
      }
      .sk-section {
        position: relative;
        min-height: 100vh;
        background: transparent;
        display: flex;
        align-items: center;
        width: 100%;
        box-sizing: border-box;
        padding: 80px clamp(24px, 4vw, 64px);
      }
      .sk-nav {
        position: sticky;
        top: 0;
        z-index: 30;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 20px clamp(24px, 4vw, 64px);
        background: ${BG};
        border-bottom: 1px solid ${LINE};
      }
      .sk-nav .links { display: flex; gap: 20px; }
      .sk-footer {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 24px clamp(24px, 4vw, 64px);
        border-top: 1px solid ${LINE};
        background: ${BG};
      }
      @media (max-width: 900px) {
        .sk-hero-wrap { flex-direction: column !important; align-items: center !important; }
        .sk-nav .links { display: none; }
        .sk-about-grid { grid-template-columns: 1fr !important; }
        .sk-contact-grid { grid-template-columns: 1fr !important; }
      }
    `}</style>
  );
}

export function NavbarSkeleton() {
  return (
    <>
      <SkeletonStyles />
      <div className="sk-nav">
        <div className="sk-block" style={{ width: 120, height: 16 }} />
        <div className="links">
          <div className="sk-block" style={{ width: 60, height: 12 }} />
          <div className="sk-block" style={{ width: 60, height: 12 }} />
          <div className="sk-block" style={{ width: 60, height: 12 }} />
          <div className="sk-block" style={{ width: 90, height: 34, borderRadius: 2 }} />
        </div>
      </div>
    </>
  );
}

export function HeroSkeleton() {
  return (
    <section className="sk-section" style={{ minHeight: "100vh" }}>
      <div style={{ width: "100%", maxWidth: "100%" }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 48 }}>
          <div className="sk-block" style={{ width: 60, height: 12 }} />
        </div>

        <div
          className="sk-hero-wrap"
          style={{ display: "flex", gap: "clamp(28px, 3.5vw, 56px)", alignItems: "center", width: "100%" }}
        >
          <div
            className="sk-block"
            style={{
              flex: "0 0 auto",
              width: "clamp(280px, 32vw, 420px)",
              aspectRatio: "1365 / 1767",
              borderRadius: 2,
            }}
          />

          <div style={{ flex: "1 1 380px", minWidth: 320, display: "flex", flexDirection: "column", gap: 18 }}>
            <div className="sk-block" style={{ width: "80%", height: 40 }} />
            <div className="sk-block" style={{ width: "50%", height: 40 }} />
            <div className="sk-block" style={{ width: "100%", maxWidth: 520, height: 14, marginTop: 8 }} />
            <div className="sk-block" style={{ width: "95%", maxWidth: 500, height: 14 }} />
            <div className="sk-block" style={{ width: "70%", maxWidth: 380, height: 14 }} />
            <div style={{ display: "flex", gap: 14, marginTop: 14 }}>
              <div className="sk-block" style={{ width: 170, height: 46 }} />
              <div className="sk-block" style={{ width: 150, height: 46 }} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function AboutSkeleton() {
  return (
    <section className="sk-section" style={{ minHeight: "auto", padding: "clamp(60px, 8vw, 100px) clamp(24px, 4vw, 64px)" }}>
      <div style={{ width: "100%", maxWidth: 1020, margin: "0 auto" }}>
        <div className="sk-block" style={{ width: 100, height: 12, marginBottom: 12 }} />
        <div className="sk-block" style={{ width: 200, height: 30, marginBottom: 56 }} />

        <div
          className="sk-about-grid"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            columnGap: "clamp(28px, 3.5vw, 52px)",
            rowGap: "clamp(44px, 5.5vw, 64px)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div className="sk-block" style={{ width: "60%", height: 24 }} />
            <div className="sk-block" style={{ width: "100%", height: 14 }} />
            <div className="sk-block" style={{ width: "90%", height: 14 }} />
            <div className="sk-block" style={{ width: "80%", height: 14 }} />
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 16, justifySelf: "end", width: "100%", maxWidth: 360 }}>
            <div className="sk-block" style={{ width: "40%", height: 16 }} />
            <div className="sk-block" style={{ width: "70%", height: 12 }} />
            <div className="sk-block" style={{ width: "40%", height: 16 }} />
            <div className="sk-block" style={{ width: "70%", height: 12 }} />
          </div>

          <div style={{ gridColumn: "1 / -1", display: "flex", gap: 16, width: "100%" }}>
            <div className="sk-block" style={{ width: 4, alignSelf: "stretch" }} />
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12, flex: 1 }}>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div className="sk-block" style={{ width: "70%", height: 14 }} />
                  <div className="sk-block" style={{ width: "90%", height: 12 }} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function SkillsSkeleton() {
  return (
    <section className="sk-section" style={{ minHeight: "auto", padding: "0 clamp(24px, 4vw, 64px) clamp(60px, 8vw, 100px)" }}>
      <div style={{ width: "100%", maxWidth: 1020, margin: "0 auto", display: "flex", justifyContent: "center", gap: "5vw" }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 14, flex: "0 0 auto" }}>
            <div className="sk-block" style={{ width: 90, height: 90, borderRadius: "50%" }} />
            <div className="sk-block" style={{ width: 110, height: 20 }} />
            <div className="sk-block" style={{ width: 220, height: 12 }} />
            <div className="sk-block" style={{ width: 180, height: 12 }} />
          </div>
        ))}
      </div>
    </section>
  );
}

export function ContactSkeleton() {
  return (
    <section className="sk-section" style={{ minHeight: "100vh" }}>
      <div style={{ width: "100%", maxWidth: 1080, margin: "0 auto" }}>
        <div className="sk-block" style={{ width: 90, height: 12, marginBottom: 56 }} />

        <div
          className="sk-contact-grid"
          style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", columnGap: "clamp(50px, 7vw, 90px)", alignItems: "start" }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="sk-block" style={{ width: "70%", height: 44 }} />
            <div className="sk-block" style={{ width: "55%", height: 44 }} />
            <div className="sk-block" style={{ width: "60%", height: 44, marginBottom: 24 }} />
            <div className="sk-block" style={{ width: 200, height: 46 }} />
            <div style={{ display: "flex", gap: 24, marginTop: 40, flexWrap: "wrap" }}>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <div className="sk-block" style={{ width: 180, height: 26 }} />
                <div className="sk-block" style={{ width: 220, height: 26 }} />
                <div className="sk-block" style={{ width: 260, height: 12 }} />
              </div>
              <div className="sk-block" style={{ width: 90, height: 20, alignSelf: "flex-end" }} />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div className="sk-block" style={{ width: 130, height: 12, marginBottom: 4 }} />
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 0" }}>
                <div className="sk-block" style={{ width: 18, height: 18, borderRadius: "50%" }} />
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div className="sk-block" style={{ width: 60, height: 10 }} />
                  <div className="sk-block" style={{ width: 180, height: 14 }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function FooterSkeleton() {
  return (
    <div className="sk-footer">
      <div className="sk-block" style={{ width: 140, height: 14 }} />
      <div className="sk-block" style={{ width: 90, height: 14 }} />
    </div>
  );
}