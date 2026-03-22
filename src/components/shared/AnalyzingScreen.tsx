import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const STEPS = [
  'Analyzing your situation...',
  'Matching financial aid programs...',
  'Finding schools that fit...',
  'Building your action plan...',
  'Creating your roadmap...',
];

const DISPLAY = "'Space Grotesk', sans-serif";
const MONO = "'IBM Plex Mono', monospace";
const SANS = "'Inter', system-ui, sans-serif";

export function AnalyzingScreen() {
  const [activeStep, setActiveStep] = useState(0);
  const [dotCount, setDotCount] = useState(1);
  const [visibleSteps, setVisibleSteps] = useState<number[]>([0]);

  // Advance the active step every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(s => {
        const next = Math.min(s + 1, STEPS.length - 1);
        setVisibleSteps(prev =>
          prev.includes(next) ? prev : [...prev, next]
        );
        return next;
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Animated dots on active step label
  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount(d => (d % 3) + 1);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        background: '#FAFAF7',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
      }}
    >
      {/* Top progress bar */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0, left: 0,
          height: 3,
          background: '#0F6E56',
          borderRadius: '0 2px 2px 0',
          animation: 'topLoadingBar 20s ease-out forwards',
        }}
      />

      {/* Logo — always clickable to home */}
      <Link
        to="/"
        style={{
          position: 'absolute',
          top: 20, left: 24,
          fontFamily: DISPLAY,
          fontWeight: 700,
          fontSize: 18,
          color: '#1A2A22',
          textDecoration: 'none',
          letterSpacing: '-0.01em',
        }}
        aria-label="Path Forward home"
      >
        Path <span style={{ color: '#0F6E56' }}>Forward</span>
      </Link>

      {/* 3D Ring + center text */}
      <div style={{ perspective: '600px' }}>
        <div className="loading-ring-container" aria-hidden="true">
          <div className="loading-ring" />
          <div className="loading-ring" />
          <div className="loading-ring" />
          <div className="loading-ring" />

          {/* Center text */}
          <div
            style={{
              position: 'absolute',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 2,
              zIndex: 1,
            }}
          >
            <span
              style={{
                fontFamily: DISPLAY,
                fontWeight: 700,
                fontSize: 13,
                color: '#1A2A22',
                letterSpacing: '-0.01em',
                lineHeight: 1.2,
              }}
            >
              Path
            </span>
            <span
              style={{
                fontFamily: DISPLAY,
                fontWeight: 700,
                fontSize: 13,
                color: '#0F6E56',
                letterSpacing: '-0.01em',
                lineHeight: 1.2,
              }}
            >
              Forward
            </span>
          </div>
        </div>
      </div>

      {/* Step list */}
      <div
        role="status"
        aria-live="polite"
        aria-label="Analyzing your information"
        style={{
          marginTop: 40,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
          minWidth: 260,
        }}
      >
        {STEPS.map((label, i) => {
          const isActive = i === activeStep;
          const isDone = i < activeStep;
          const isVisible = visibleSteps.includes(i);

          if (!isVisible) return null;

          // Trim trailing "..." from label — we'll animate them ourselves
          const cleanLabel = label.replace(/\.\.\.$/, '');
          const dots = isActive ? '.'.repeat(dotCount) : '';

          return (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                animation: 'stepFadeIn 0.4s ease forwards',
                opacity: isDone ? 0.55 : 1,
              }}
            >
              {/* Icon */}
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: '50%',
                  flexShrink: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isDone
                    ? '#0F6E56'
                    : isActive
                    ? 'rgba(15,110,86,0.12)'
                    : 'transparent',
                  border: isActive
                    ? '2px solid #0F6E56'
                    : isDone
                    ? 'none'
                    : '2px solid #E2DED6',
                }}
                aria-hidden="true"
              >
                {isDone && (
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {isActive && (
                  <div
                    style={{
                      width: 6,
                      height: 6,
                      borderRadius: '50%',
                      background: '#0F6E56',
                      animation: 'status-pulse 1.2s ease-in-out infinite',
                    }}
                  />
                )}
              </div>

              {/* Label */}
              <span
                style={{
                  fontFamily: SANS,
                  fontSize: 14,
                  fontWeight: isActive ? 500 : 400,
                  color: isActive || isDone ? '#0F6E56' : '#5C6B63',
                  letterSpacing: '-0.01em',
                }}
              >
                {cleanLabel}
                {isActive && (
                  <span style={{ opacity: 0.7 }}>{dots}</span>
                )}
                {isDone && ' ✓'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Bottom label */}
      <p
        style={{
          marginTop: 48,
          fontFamily: MONO,
          fontSize: 11,
          color: '#5C6B63',
          letterSpacing: '0.05em',
        }}
      >
        USUALLY TAKES 10–20 SECONDS
      </p>
    </div>
  );
}
