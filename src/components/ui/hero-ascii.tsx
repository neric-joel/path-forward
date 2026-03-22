import type { CSSProperties } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BackgroundPaths } from './background-paths';

interface HeroAsciiProps {
  onDemo?: () => void;
}

const MONO = "'IBM Plex Mono', monospace";
const DISPLAY = "'Space Grotesk', sans-serif";
const SANS = "'Inter', system-ui, sans-serif";

// ── Corner frame accent ───────────────────────────────────────────────────────
function CornerFrame({
  top, bottom, left, right, size = 12, opacity = 0.3,
}: {
  top?: string; bottom?: string; left?: string; right?: string;
  size?: number; opacity?: number;
}) {
  const style: CSSProperties = {
    position: 'absolute',
    width: size,
    height: size,
    borderColor: `rgba(15,110,86,${opacity})`,
    borderStyle: 'solid',
    borderWidth: 0,
    ...(top    !== undefined && { top }),
    ...(bottom !== undefined && { bottom }),
    ...(left   !== undefined && { left }),
    ...(right  !== undefined && { right }),
    ...(top    !== undefined && left  !== undefined && { borderTopWidth: '2px', borderLeftWidth: '2px' }),
    ...(top    !== undefined && right !== undefined && { borderTopWidth: '2px', borderRightWidth: '2px' }),
    ...(bottom !== undefined && left  !== undefined && { borderBottomWidth: '2px', borderLeftWidth: '2px' }),
    ...(bottom !== undefined && right !== undefined && { borderBottomWidth: '2px', borderRightWidth: '2px' }),
  };
  return <div style={style} aria-hidden="true" />;
}

// ── Dot row separator ─────────────────────────────────────────────────────────
function DotRow({ active = 5, total = 40 }: { active?: number; total?: number }) {
  return (
    <div className="hidden lg:flex" style={{ gap: 4, marginBottom: 24 }} aria-hidden="true">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 2, height: 2, borderRadius: '50%',
            background: i < active ? 'rgba(15,110,86,0.6)' : 'rgba(15,110,86,0.18)',
          }}
        />
      ))}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function HeroAscii({ onDemo }: HeroAsciiProps) {
  const navigate = useNavigate();

  const handleDemo = () => {
    if (onDemo) { onDemo(); navigate('/dashboard'); }
  };

  return (
    <div style={{ fontFamily: SANS, background: '#FAFAF7', minHeight: '100vh' }}>

      {/* ── Fixed Nav ──────────────────────────────────────────────────────── */}
      <nav
        role="navigation"
        aria-label="Main navigation"
        style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
          background: 'rgba(250,250,247,0.85)', backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderBottom: '1px solid #E2DED6',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 28px', height: 56,
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          aria-label="Vazhi home"
          style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}
        >
          <span
            style={{
              fontFamily: DISPLAY,
              color: '#1A2A22',
              fontSize: 18,
              fontWeight: 700,
              letterSpacing: '-0.01em',
            }}
          >
            VAZHI{' '}
            <span style={{ color: '#0F6E56' }}>வழி</span>
          </span>
        </Link>

        {/* Nav links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <a
            href="#how-it-works"
            style={{
              fontFamily: MONO,
              color: '#5C6B63', fontSize: 11,
              letterSpacing: '0.08em', textDecoration: 'none',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = '#0F6E56')}
            onMouseLeave={e => (e.currentTarget.style.color = '#5C6B63')}
          >
            HOW IT WORKS
          </a>
          <button
            onClick={() => navigate('/intake')}
            style={{
              fontFamily: MONO,
              color: '#0F6E56', fontSize: 11,
              letterSpacing: '0.08em', background: 'transparent',
              border: '1.5px solid rgba(15,110,86,0.45)',
              borderRadius: 6,
              padding: '7px 16px', cursor: 'pointer',
              transition: 'border-color 0.2s, background 0.2s',
              minHeight: 36,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.borderColor = '#0F6E56';
              e.currentTarget.style.background = 'rgba(15,110,86,0.06)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.borderColor = 'rgba(15,110,86,0.45)';
              e.currentTarget.style.background = 'transparent';
            }}
            aria-label="Get started"
          >
            GET STARTED
          </button>
        </div>
      </nav>

      {/* ── Hero section ─────────────────────────────────────────────────────── */}
      <section
        style={{
          position: 'relative', minHeight: '100vh',
          display: 'flex', alignItems: 'center',
          overflow: 'hidden', paddingTop: 56,
        }}
      >
        {/* Animated background paths */}
        <div style={{ position: 'absolute', inset: 0, zIndex: 0 }} aria-hidden="true">
          <BackgroundPaths />
        </div>

        {/* Warm fade — left reads clean, right shows paths */}
        <div
          aria-hidden="true"
          style={{
            position: 'absolute', inset: 0, zIndex: 1,
            background: 'linear-gradient(108deg, rgba(250,250,247,0.92) 30%, rgba(250,250,247,0.55) 60%, rgba(250,250,247,0.08) 100%)',
          }}
        />

        {/* Corner frame accents */}
        <CornerFrame top="68px" left="16px" opacity={0.3} />
        <CornerFrame top="68px" right="16px" opacity={0.18} />
        <CornerFrame bottom="16px" left="16px" opacity={0.18} />
        <CornerFrame bottom="16px" right="16px" opacity={0.14} />

        {/* Hero content */}
        <div
          style={{
            position: 'relative', zIndex: 10,
            width: '100%', maxWidth: 1200,
            margin: '0 auto', padding: '80px 28px 80px 40px',
          }}
        >
          {/* 001 label */}
          <div
            className="hero-line-1"
            style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 24 }}
          >
            <div style={{ width: 24, height: 1, background: 'rgba(15,110,86,0.35)' }} aria-hidden="true" />
            <span style={{ fontFamily: MONO, color: '#0F6E56', fontSize: 10, letterSpacing: '0.22em', fontWeight: 400 }}>
              001
            </span>
            <div style={{ width: 48, height: 1, background: 'rgba(15,110,86,0.25)' }} aria-hidden="true" />
            <span style={{ fontFamily: MONO, color: 'rgba(15,110,86,0.5)', fontSize: 9, letterSpacing: '0.18em' }}>
              COLLEGE.READINESS
            </span>
          </div>

          {/* Headline */}
          <div style={{ position: 'relative' }}>
            <h1
              className="hero-line-2"
              style={{
                fontFamily: DISPLAY,
                color: '#1A2A22',
                fontSize: 'clamp(40px, 6.5vw, 88px)',
                fontWeight: 800,
                lineHeight: 1.0,
                letterSpacing: '-0.02em',
                margin: '0 0 2px 0',
              }}
            >
              YOUR PATH
            </h1>
            <div
              className="hero-line-3"
              aria-label="STARTS HERE"
              style={{
                fontFamily: DISPLAY,
                color: '#0F6E56',
                fontSize: 'clamp(40px, 6.5vw, 88px)',
                fontWeight: 800,
                lineHeight: 1.0,
                letterSpacing: '-0.02em',
                marginBottom: 32,
                display: 'flex', alignItems: 'baseline', gap: 6,
              }}
            >
              STARTS HERE
              <span className="cursor-blink" aria-hidden="true" style={{ color: '#0F6E56' }}>_</span>
            </div>
          </div>

          {/* Dot row separator */}
          <div className="hero-line-4">
            <DotRow active={5} total={40} />
          </div>

          {/* Subtitle */}
          <p
            className="hero-line-5"
            style={{
              fontFamily: SANS,
              color: '#5C6B63',
              fontSize: 'clamp(15px, 1.6vw, 18px)',
              fontWeight: 400,
              lineHeight: 1.7,
              maxWidth: 440,
              margin: '0 0 44px 0',
            }}
          >
            Foster youth in Arizona — discover your funding,
            build your plan, find your way.
          </p>

          {/* CTA buttons */}
          <div
            className="hero-line-6"
            style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 40 }}
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
              TRY DEMO
            </button>
          </div>

          {/* Privacy status line */}
          <div
            className="hero-line-6"
            style={{
              display: 'flex', alignItems: 'center', gap: 10,
              fontFamily: MONO,
              fontSize: 10, color: 'rgba(15,110,86,0.6)',
              letterSpacing: '0.12em',
            }}
            aria-label="Privacy: no data stored, browser only"
          >
            <span
              className="status-dot"
              aria-hidden="true"
              style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: '#0F6E56' }}
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
          <span style={{ fontFamily: MONO, color: '#5C6B63', fontSize: 9, letterSpacing: '0.2em' }}>
            SCROLL
          </span>
          <div style={{ width: 1, height: 28, background: 'linear-gradient(to bottom, rgba(15,110,86,0.4), transparent)' }} />
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────────── */}
      <section
        id="how-it-works"
        style={{
          background: '#F0EDE6',
          borderTop: '1px solid #E2DED6',
          padding: '96px 28px',
        }}
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>

          {/* Section label */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
            <span style={{ fontFamily: MONO, color: '#0F6E56', fontSize: 11, letterSpacing: '0.2em' }}>002</span>
            <div style={{ width: 36, height: 1, background: 'rgba(15,110,86,0.35)' }} aria-hidden="true" />
            <span style={{ fontFamily: MONO, color: 'rgba(15,110,86,0.45)', fontSize: 10, letterSpacing: '0.16em' }}>PROCESS.MAP</span>
          </div>

          <h2
            style={{
              fontFamily: DISPLAY,
              color: '#1A2A22',
              fontSize: 'clamp(28px, 4vw, 44px)',
              fontWeight: 800,
              letterSpacing: '-0.02em',
              margin: '0 0 56px 0',
            }}
          >
            How It Works
          </h2>

          {/* Step cards — white on cream */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 20,
            }}
          >
            {[
              {
                num: '01', code: 'INTAKE.FORM',
                title: 'Tell Us Where You Are',
                desc: "Answer 6 quick questions about your situation — age, education goal, documents in hand, and benefits you've already applied for.",
              },
              {
                num: '02', code: 'FUNDING.MATCH',
                title: 'See Your Funding',
                desc: 'Get matched with the Pell Grant ($7,395), Arizona ETV ($5,000), and the Tuition Waiver — with confidence levels and exact next steps.',
              },
              {
                num: '03', code: 'PLAN.BUILD',
                title: 'Get Your Roadmap',
                desc: 'A sequenced action plan with exactly what to do, documents to get, deadlines to hit, and who to call — school by school.',
              },
            ].map(({ num, code, title, desc }) => (
              <div key={num} className="step-card" style={{ padding: '40px 32px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                  <span
                    aria-hidden="true"
                    style={{ fontFamily: DISPLAY, color: '#0F6E56', fontSize: 56, fontWeight: 800, lineHeight: 1, opacity: 0.22 }}
                  >
                    {num}
                  </span>
                  <span style={{ fontFamily: MONO, color: 'rgba(15,110,86,0.4)', fontSize: 9, letterSpacing: '0.16em', paddingTop: 10 }}>
                    {code}
                  </span>
                </div>
                <div style={{ width: 28, height: 2, background: '#0F6E56', opacity: 0.45, marginBottom: 16, borderRadius: 2 }} aria-hidden="true" />
                <h3 style={{ fontFamily: SANS, color: '#1A2A22', fontSize: 16, fontWeight: 600, margin: '0 0 10px 0', lineHeight: 1.3 }}>
                  {title}
                </h3>
                <p style={{ fontFamily: SANS, color: '#5C6B63', fontSize: 14, lineHeight: 1.72, margin: 0 }}>
                  {desc}
                </p>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div style={{ marginTop: 60, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 14 }}>
            <button
              className="btn-teal"
              onClick={() => navigate('/intake')}
              aria-label="Start my college readiness assessment"
            >
              START MY ASSESSMENT →
            </button>
            <span style={{ fontFamily: MONO, color: 'rgba(15,110,86,0.45)', fontSize: 10, letterSpacing: '0.12em' }}>
              FREE · 2 MINUTES · NO ACCOUNT REQUIRED
            </span>
          </div>
        </div>
      </section>

      {/* ── Footer bar ───────────────────────────────────────────────────────── */}
      <footer
        style={{
          background: '#1A2A22',
          borderTop: '1px solid rgba(15,110,86,0.2)',
          padding: '18px 28px',
          display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', flexWrap: 'wrap', gap: 10,
        }}
      >
        {/* Left: privacy indicator */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span
            className="status-dot"
            aria-hidden="true"
            style={{ display: 'inline-block', width: 5, height: 5, borderRadius: '50%', background: '#0F6E56' }}
          />
          <span style={{ fontFamily: MONO, color: 'rgba(240,237,230,0.55)', fontSize: 10, letterSpacing: '0.1em' }}>
            PRIVACY.ACTIVE
            <span aria-hidden="true" style={{ margin: '0 8px', color: 'rgba(240,237,230,0.25)' }}>·</span>
            NO DATA STORED
            <span aria-hidden="true" style={{ margin: '0 8px', color: 'rgba(240,237,230,0.25)' }}>·</span>
            BROWSER ONLY
          </span>
        </div>

        {/* Right */}
        <span style={{ fontFamily: MONO, color: 'rgba(240,237,230,0.35)', fontSize: 10, letterSpacing: '0.08em' }}>
          BUILT FOR FOSTER YOUTH IN ARIZONA
        </span>
      </footer>

    </div>
  );
}
