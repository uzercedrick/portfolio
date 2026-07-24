"use client";

/* ─── Base shimmer block ─────────────────────────────────── */
export function SkeletonBlock({
  width = "100%",
  height = "20px",
  borderRadius = "6px",
  style,
}: {
  width?: string | number;
  height?: string | number;
  borderRadius?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className="sk-shimmer"
      style={{ width, height, borderRadius, flexShrink: 0, ...style }}
    />
  );
}

/* ─── Hero skeleton ──────────────────────────────────────── */
export function HeroSkeleton() {
  return (
    <section
      style={{
        minHeight: "100vh",
        background: "#262526",
        display: "flex",
        alignItems: "center",
        padding: "80px clamp(16px, 4vw, 64px) 60px",
        gap: 48,
      }}
    >
      {/* Left text block */}
      <div style={{ flex: "1 1 400px", display: "flex", flexDirection: "column", gap: 20 }}>
        <SkeletonBlock width="120px" height="20px" />
        <SkeletonBlock width="70%" height="48px" borderRadius="8px" />
        <SkeletonBlock width="55%" height="48px" borderRadius="8px" />
        <SkeletonBlock width="90%" height="22px" style={{ marginTop: 12 }} />
        <SkeletonBlock width="75%" height="22px" />
        <div style={{ display: "flex", gap: 16, marginTop: 16 }}>
          <SkeletonBlock width="160px" height="52px" borderRadius="6px" />
          <SkeletonBlock width="160px" height="52px" borderRadius="6px" />
        </div>
      </div>
      {/* Right image block */}
      <SkeletonBlock
        width="clamp(200px, 28vw, 360px)"
        height="clamp(267px, 37vw, 480px)"
        borderRadius="8px"
        style={{ flexShrink: 0 }}
      />
    </section>
  );
}

/* ─── Navbar skeleton ────────────────────────────────────── */
export function NavbarSkeleton() {
  return (
    <div
      style={{
        position: "fixed",
        inset: "0 0 auto 0",
        zIndex: 100,
        height: 72,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 clamp(16px, 4vw, 64px)",
        background: "transparent",
      }}
    >
      <SkeletonBlock width="80px" height="22px" borderRadius="4px" />
      <div style={{ display: "flex", gap: 48 }}>
        <SkeletonBlock width="56px" height="16px" borderRadius="4px" />
        <SkeletonBlock width="56px" height="16px" borderRadius="4px" />
        <SkeletonBlock width="72px" height="16px" borderRadius="4px" />
      </div>
    </div>
  );
}

/* ─── About skeleton ─────────────────────────────────────── */
export function AboutSkeleton() {
  return (
    <section
      style={{
        background: "#262526",
        padding: "clamp(60px, 8vw, 110px) clamp(16px, 4vw, 64px)",
      }}
    >
      <SkeletonBlock width="140px" height="20px" style={{ marginBottom: 48 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 40 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <SkeletonBlock width="80%" height="44px" borderRadius="6px" />
          <SkeletonBlock width="65%" height="44px" borderRadius="6px" />
          <SkeletonBlock width="100%" height="20px" style={{ marginTop: 12 }} />
          <SkeletonBlock width="95%" height="20px" />
          <SkeletonBlock width="85%" height="20px" />
          <div style={{ display: "flex", gap: 24, marginTop: 24 }}>
            <SkeletonBlock width="84px" height="84px" borderRadius="50%" />
            <SkeletonBlock width="84px" height="84px" borderRadius="50%" />
            <SkeletonBlock width="64px" height="84px" borderRadius="4px" />
          </div>
        </div>
        <div style={{ display: "flex", gap: 24, paddingLeft: 24 }}>
          <SkeletonBlock width="3px" height="100%" borderRadius="2px" />
          <div style={{ display: "flex", flexDirection: "column", gap: 32, flex: 1 }}>
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <SkeletonBlock width="100px" height="16px" borderRadius="3px" />
                <SkeletonBlock width="160px" height="20px" borderRadius="3px" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Skills skeleton ────────────────────────────────────── */
export function SkillsSkeleton() {
  return (
    <section
      style={{
        background: "#262526",
        padding: "clamp(64px, 8vw, 110px) clamp(16px, 4vw, 64px)",
      }}
    >
      <SkeletonBlock width="100px" height="28px" style={{ marginBottom: 52 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1.55fr 1fr", gap: 28 }}>
        {/* Left column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {[120, 200].map(h => (
            <SkeletonBlock key={h} width="100%" height={`${h}px`} borderRadius="28px" />
          ))}
        </div>
        {/* Right column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <SkeletonBlock width="100%" height="220px" borderRadius="28px" />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, paddingTop: 16 }}>
            <SkeletonBlock width="100px" height="100px" borderRadius="8px" />
            <SkeletonBlock width="140px" height="22px" borderRadius="4px" />
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Contact skeleton ───────────────────────────────────── */
export function ContactSkeleton() {
  return (
    <section
      style={{
        background: "#262526",
        padding: "clamp(48px, 6vw, 80px) clamp(16px, 4vw, 64px)",
      }}
    >
      <SkeletonBlock width="120px" height="24px" style={{ marginBottom: 48 }} />
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <SkeletonBlock width="90%" height="52px" borderRadius="6px" />
          <SkeletonBlock width="75%" height="52px" borderRadius="6px" />
          <SkeletonBlock width="85%" height="52px" borderRadius="6px" />
          <SkeletonBlock width="140px" height="44px" borderRadius="8px" style={{ marginTop: 8 }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <SkeletonBlock width="180px" height="16px" borderRadius="3px" />
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <SkeletonBlock width="48px" height="48px" borderRadius="4px" />
                <SkeletonBlock width="200px" height="24px" borderRadius="4px" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Footer skeleton ────────────────────────────────────── */
export function FooterSkeleton() {
  return (
    <div
      style={{
        background: "#14141A",
        width: "100%",
        height: "80px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "0 clamp(16px, 4vw, 64px)",
      }}
    >
      <SkeletonBlock width="280px" height="18px" borderRadius="4px" style={{ background: "rgba(38,37,38,0.15)" }} />
    </div>
  );
}
