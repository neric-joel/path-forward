import { useEffect, useRef, useState } from 'react';

interface ScoreRingProps {
  score: number;
  label: string;
  color?: string;
  size?: number;
  strokeWidth?: number;
}

export function ScoreRing({
  score,
  label,
  color = '#0F6E56',
  size = 96,
  strokeWidth = 8,
}: ScoreRingProps) {
  const [displayed, setDisplayed] = useState(0);
  const [animated, setAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animated ? score / 100 : 0) * circumference;

  // Count-up + ring fill on first render
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAnimated(true);
          observer.disconnect();
          // Count-up animation
          let start = 0;
          const duration = 1200;
          const step = (timestamp: number) => {
            if (!start) start = timestamp;
            const progress = Math.min((timestamp - start) / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3); // ease-out-cubic
            setDisplayed(Math.round(eased * score));
            if (progress < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [score]);

  const scoreColor =
    score >= 75 ? '#3B6D11' :
    score >= 50 ? '#0F6E56' :
    score >= 30 ? '#BA7517' : '#D85A30';

  return (
    <div ref={ref} className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          {/* Track */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke="#E2DED6" strokeWidth={strokeWidth}
          />
          {/* Progress */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none" stroke={color} strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        </svg>
        {/* Score number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold leading-none" style={{ color: scoreColor }}>
            {displayed}
          </span>
          <span className="text-[10px] text-[#6B6A65] font-medium">/100</span>
        </div>
      </div>
      <p className="text-xs font-semibold text-[#1C1C1A] text-center leading-tight max-w-[80px]">{label}</p>
    </div>
  );
}
