import { useNavigate, Link } from 'react-router-dom';

interface HomeProps {
  onDemo?: () => void;
}

// ── Blueprint background SVG ─────────────────────────────────────────────────
function BlueprintBg() {
  return (
    <svg
      viewBox="0 0 1440 900"
      aria-hidden="true"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Fine grid */}
        <pattern id="vz-grid-sm" width="48" height="48" patternUnits="userSpaceOnUse">
          <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#0F6E56" strokeWidth="0.4" strokeOpacity="0.09" />
        </pattern>
        {/* Major grid */}
        <pattern id="vz-grid-lg" width="240" height="240" patternUnits="userSpaceOnUse">
          <path d="M 240 0 L 0 0 0 240" fill="none" stroke="#0F6E56" strokeWidth="0.8" strokeOpacity="0.06" />
        </pattern>
      </defs>

      {/* Grids */}
      <rect width="1440" height="900" fill="url(#vz-grid-sm)" />
      <rect width="1440" height="900" fill="url(#vz-grid-lg)" />

      {/* Concentric circles — centered right, like a radar */}
      {[70, 140, 220, 310, 415, 535, 670, 820, 990].map((r, i) => (
        <circle
          key={r}
          cx="1080"
          cy="450"
          r={r}
          fill="none"
          stroke="#0F6E56"
          strokeWidth="0.7"
          strokeOpacity={Math.max(0.03, 0.1 - i * 0.009)}
        />
      ))}

      {/* Crosshair at focal point */}
      <line x1="1080" y1="390" x2="1080" y2="510" stroke="#0F6E56" strokeWidth="0.8" strokeOpacity="0.18" />
      <line x1="1020" y1="450" x2="1140" y2="450" stroke="#0F6E56" strokeWidth="0.8" strokeOpacity="0.18" />
      <circle cx="1080" cy="450" r="4" fill="none" stroke="#0F6E56" strokeWidth="1" strokeOpacity="0.35" />
      <circle cx="1080" cy="450" r="1.5" fill="#0F6E56" fillOpacity="0.5" />

      {/* Tick marks on crosshair */}
      {[-3, -2, -1, 1, 2, 3].map(n => (
        <g key={n}>
          <line x1={1080 + n * 35} y1="445" x2={1080 + n * 35} y2="455" stroke="#0F6E56" strokeWidth="0.5" strokeOpacity="0.2" />
          <line x1="1075" y1={450 + n * 35} x2="1085" y2={450 + n * 35} stroke="#0F6E56" strokeWidth="0.5" strokeOpacity="0.2" />
        </g>
      ))}

      {/* Diagonal data line — decorative */}
      <line x1="200" y1="700" x2="900" y2="200" stroke="#0F6E56" strokeWidth="0.5" strokeOpacity="0.06" strokeDasharray="6 10" />

      {/* Small annotation boxes */}
      <rect x="1120" y="310" width="52" height="16" fill="none" stroke="#0F6E56" strokeWidth="0.5" strokeOpacity="0.2" />
      <rect x="960" y="554" width="52" height="16" fill="none" stroke="#0F6E56" strokeWidth="0.5" strokeOpacity="0.15" />
    </svg>
  );
}

// ── Corner frame accent ──────────────────────────────────────────────────────
function CornerFrame({
  top, bottom, left, right, opacity = 0.5,
}: {
  top?: string; bottom?: string; left?: string; right?: string; opacity?: number;
}) {
  const style: React.CSSProperties = {
    position: 'absolute',
    width: 36,
    height: 36,
    borderColor: `rgba(15,110,86,${opacity})`,
    borderStyle: 'solid',
    borderWidth: 0,
    ...(top !== undefined && { top }),
    ...(bottom !== undefined && { bottom }),
    ...(left !== undefined && { left }),
    ...(right !== undefined && { right }),
    ...(top !== undefined && left !== undefined && { borderTopWidth: '1.5px', borderLeftWidth: '1.5px' }),
    ...(top !== undefined && right !== undefined && { borderTopWidth: '1.5px', borderRightWidth: '1.5px' }),
    ...(bottom !== undefined && left !== undefined && { borderBottomWidth: '1.5px', borderLeftWidth: '1.5px' }),
    ...(bottom !== undefined && right !== undefined && { borderBottomWidth: '1.5px', borderRightWidth: '1.5px' }),
  };
  return <div style={style} aria-hidden="true" />;
}

// ── Dot separator ────────────────────────────────────────────────────────────
function DotSeparator({ active = 5, total = 14 }: { active?: number; total?: number }) {
  return (
    <div style={{ display: 'flex', gap: 6, marginBottom: 28 }} aria-hidden="true">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 4, height: 4, borderRadius: '50%',
            background: i < active ? '#0F6E56' : 'rgba(15,110,86,0.2)',
          }}
        />
      ))}
    </div>
  );
}

// ── Mono label ───────────────────────────────────────────────────────────────
function MonoLabel({ num, code }: { num: string; code: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
      <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#0F6E56', fontSize: 11, letterSpacing: '0.2em', fontWeight: 700 }}>
        {num}
      </span>
      <div style={{ width: 40, height: 1, background: 'rgba(15,110,86,0.5)' }} />
      <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(15,110,86,0.5)', fontSize: 10, letterSpacing: '0.16em' }}>
        {code}
      </span>
    </div>
  );
}

// ── Main component ───────────────────────────────────────────────────────────
export default function Home({ onDemo }: HomeProps) {
  const navigate = useNavigate();

  const handleDemo = () => {
    if (onDemo) { onDemo(); navigate('/dashboard'); }
  };

  return (
    <div style={{ fontFamily: "'DM Sans', system-ui, sans-serif", background: '#080C0A', minHeight: '100vh' }}>

      {/* ── Top nav bar ─────────────────────────────────────────────────────── */}
      <nav
        role="navigation"
        aria-label="Main navigation"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          background: 'rgba(8,12,10,0.92)', backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(15,110,86,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 28px', height: 52,
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          aria-label="Vazhi home"
          style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}
        >
          <span aria-hidden="true" style={{ fontFamily: "'JetBrains Mono', monospace", color: '#0F6E56', fontSize: 10 }}>►</span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#F5F3EE', fontSize: 14, fontWeight: 700, letterSpacing: '0.06em' }}>
            VAZHI{' '}
            <span style={{ color: '#0F6E56' }}>வழி</span>
          </span>
        </Link>

        {/* Metadata right */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(245,243,238,0.3)', fontSize: 10, letterSpacing: '0.14em' }}>
            PHOENIX, AZ
          </span>
          <span
            aria-hidden="true"
            style={{ width: 1, height: 14, background: 'rgba(15,110,86,0.25)' }}
          />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(245,243,238,0.3)', fontSize: 10, letterSpacing: '0.14em' }}>
            EST. 2026
          </span>
          <span
            aria-hidden="true"
            style={{ width: 1, height: 14, background: 'rgba(15,110,86,0.25)' }}
          />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", color: '#0F6E56', fontSize: 10, letterSpacing: '0.14em' }}>
            V4.0
          </span>
        </div>
      </nav>

      {/* ── Hero section ────────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative', minHeight: '100vh',
          display: 'flex', alignItems: 'center',
          overflow: 'hidden', paddingTop: 52,
        }}
      >
        {/* Blueprint background */}
        <div style={{ position: 'absolute', inset: 0 }}>
          <BlueprintBg />
        </div>

        {/* Left-side dark gradient mask — reveals blueprint on right */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(105deg, #080C0A 42%, rgba(8,12,10,0.72) 68%, rgba(8,12,10,0.15) 100%)',
          }}
        />

        {/* Corner frame accents */}
        <CornerFrame top="76px" left="20px" opacity={0.55} />
        <CornerFrame top="76px" right="20px" opacity={0.25} />
        <CornerFrame bottom="20px" left="20px" opacity={0.25} />
        <CornerFrame bottom="20px" right="20px" opacity={0.2} />

        {/* ── Hero content ────────────────────────────────────────────────── */}
        <div
          style={{
            position: 'relative', zIndex: 10,
            width: '100%', maxWidth: 1200,
            margin: '0 auto', padding: '72px 32px',
          }}
        >
          {/* Section label */}
          <div className="hero-line-1">
            <MonoLabel num="001" code="COLLEGE.READINESS" />
          </div>

          {/* Headline — two lines */}
          <h1
            className="hero-line-2"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: '#F5F3EE',
              fontSize: 'clamp(38px, 6.5vw, 84px)',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
              margin: '0 0 6px 0',
            }}
          >
            YOUR PATH
          </h1>
          <div
            className="hero-line-3"
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: '#0F6E56',
              fontSize: 'clamp(38px, 6.5vw, 84px)',
              fontWeight: 700,
              lineHeight: 1.05,
              letterSpacing: '-0.025em',
              marginBottom: 36,
              display: 'flex', alignItems: 'baseline', gap: 4,
            }}
            aria-label="STARTS HERE"
          >
            STARTS HERE
            <span className="cursor-blink" aria-hidden="true" style={{ color: '#BA7517' }}>_</span>
          </div>

          {/* Dot separator */}
          <div className="hero-line-4">
            <DotSeparator active={5} total={14} />
          </div>

          {/* Subtitle */}
          <p
            className="hero-line-5"
            style={{
              color: 'rgba(245,243,238,0.62)',
              fontSize: 16,
              lineHeight: 1.75,
              maxWidth: 440,
              margin: '0 0 40px 0',
            }}
          >
            Foster youth in Arizona — discover your funding,
            <br />
            build your plan, find your way.
          </p>

          {/* CTA buttons */}
          <div
            className="hero-line-6"
            style={{ display: 'flex', flexWrap: 'wrap', gap: 12, marginBottom: 40 }}
          >
            <button
              className="btn-primary"
              onClick={() => navigate('/intake')}
              aria-label="Get my college readiness plan"
            >
              GET MY PLAN →
            </button>
            <button
              className="btn-secondary"
              onClick={handleDemo}
              aria-label="Try the demo with sample data"
            >
              [ TRY DEMO ]
            </button>
          </div>

          {/* System status line */}
          <div
            className="hero-line-6"
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10, color: 'rgba(15,110,86,0.5)',
              letterSpacing: '0.14em',
            }}
            aria-label="Privacy: no data stored, browser only"
          >
            <span
              className="status-dot"
              aria-hidden="true"
              style={{
                display: 'inline-block', width: 6, height: 6, borderRadius: '50%',
                background: '#0F6E56',
              }}
            />
            PRIVACY.ACTIVE
            <span aria-hidden="true" style={{ color: 'rgba(15,110,86,0.3)' }}>·</span>
            NO DATA STORED
            <span aria-hidden="true" style={{ color: 'rgba(15,110,86,0.3)' }}>·</span>
            BROWSER ONLY
          </div>
        </div>

        {/* Scroll hint */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', bottom: 28,
            left: '50%', transform: 'translateX(-50%)',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
            animation: 'hero-enter 0.6s ease 1.2s both',
          }}
        >
          <span style={{ fontFamily: "'JetBrains Mono', monospace", color: 'rgba(15,110,86,0.35)', fontSize: 9, letterSpacing: '0.2em' }}>
            SCROLL
          </span>
          <div style={{ width: 1, height: 32, background: 'linear-gradient(to bottom, rgba(15,110,86,0.4), transparent)' }} />
        </div>
      </section>

      {/* ── How It Works ────────────────────────────────────────────────────── */}
      <section
        id="how-it-works"
        style={{
          background: '#0A0E0C',
          borderTop: '1px solid rgba(15,110,86,0.18)',
          padding: '96px 32px',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* Section label */}
          <MonoLabel num="002" code="PROCESS.MAP" />
          <h2
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: '#F5F3EE',
              fontSize: 'clamp(26px, 4vw, 40px)',
              fontWeight: 700, letterSpacing: '-0.02em',
              margin: '0 0 56px 0',
            }}
          >
            HOW IT WORKS
          </h2>

          {/* Step cards — separated by 1px teal lines */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(268px, 1fr))',
              gap: 1,
              background: 'rgba(15,110,86,0.18)',
            }}
          >
            {[
              {
                num: '01',
                code: 'INTAKE.FORM',
                title: 'Tell Us Where You Are',
                desc: 'Answer 6 quick questions about your situation — age, education goal, documents in hand, and benefits you\'ve already applied for.',
              },
              {
                num: '02',
                code: 'FUNDING.MATCH',
                title: 'See Your Funding',
                desc: 'Get matched with the Pell Grant ($7,395), Arizona ETV ($5,000), and the Tuition Waiver — with confidence levels and exact next steps.',
              },
              {
                num: '03',
                code: 'PLAN.BUILD',
                title: 'Get Your Roadmap',
                desc: 'A sequenced action plan with exactly what to do, documents to get, deadlines to hit, and who to call — school by school.',
              },
            ].map(({ num, code, title, desc }) => (
              <div
                key={num}
                className="step-card"
                style={{ padding: '40px 32px' }}
              >
                {/* Card header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
                  <span
                    aria-hidden="true"
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      color: 'rgba(15,110,86,0.18)',
                      fontSize: 56, fontWeight: 700, lineHeight: 1,
                    }}
                  >
                    {num}
                  </span>
                  <span
                    style={{
                      fontFamily: "'JetBrains Mono', monospace",
                      color: 'rgba(15,110,86,0.4)',
                      fontSize: 9, letterSpacing: '0.16em',
                      paddingTop: 8,
                    }}
                  >
                    {code}
                  </span>
                </div>

                {/* Thin teal accent bar */}
                <div style={{ width: 28, height: 1, background: '#0F6E56', opacity: 0.6, marginBottom: 16 }} />

                <h3
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    color: '#F5F3EE', fontSize: 15,
                    fontWeight: 700, letterSpacing: '-0.01em',
                    margin: '0 0 12px 0',
                  }}
                >
                  {title}
                </h3>
                <p
                  style={{
                    color: 'rgba(245,243,238,0.42)',
                    fontSize: 14, lineHeight: 1.72, margin: 0,
                  }}
                >
                  {desc}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div style={{ marginTop: 64, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14 }}>
            <button
              className="btn-teal"
              onClick={() => navigate('/intake')}
              aria-label="Start my college readiness assessment"
            >
              START MY ASSESSMENT →
            </button>
            <span
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                color: 'rgba(15,110,86,0.38)',
                fontSize: 10, letterSpacing: '0.14em',
              }}
            >
              FREE · 2 MINUTES · NO ACCOUNT REQUIRED
            </span>
          </div>
        </div>
      </section>

      {/* ── Footer bar ──────────────────────────────────────────────────────── */}
      <footer
        style={{
          background: '#080C0A',
          borderTop: '1px solid rgba(15,110,86,0.15)',
          padding: '16px 28px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: 10,
        }}
      >
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            color: 'rgba(15,110,86,0.4)', fontSize: 10, letterSpacing: '0.12em',
          }}
        >
          VAZHI வழி — BUILT FOR FOSTER YOUTH IN ARIZONA
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              color: 'rgba(15,110,86,0.35)', fontSize: 10, letterSpacing: '0.1em',
            }}
          >
            NO DATA STORED · BROWSER ONLY · V4.0
          </span>

          {/* Animated sequential dots */}
          <div style={{ display: 'flex', gap: 4 }} aria-hidden="true">
            <span className="seq-dot-1" style={{ display: 'inline-block', width: 4, height: 4, borderRadius: '50%', background: '#0F6E56' }} />
            <span className="seq-dot-2" style={{ display: 'inline-block', width: 4, height: 4, borderRadius: '50%', background: '#0F6E56' }} />
            <span className="seq-dot-3" style={{ display: 'inline-block', width: 4, height: 4, borderRadius: '50%', background: '#0F6E56' }} />
          </div>
        </div>
      </footer>

    </div>
  );
}
